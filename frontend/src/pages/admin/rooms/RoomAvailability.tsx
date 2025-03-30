import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Room, RoomAvailability } from '../../../models/types';

export default function RoomAvailabilityManager() {
  const { hotelId, roomId } = useParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [availabilityData, setAvailabilityData] = useState<RoomAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Fonction pour générer le calendrier du mois sélectionné
  const generateCalendarDays = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push(dateStr);
    }
    
    return days;
  };

  // Charger les données de la chambre et les disponibilités
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock de la chambre
        const mockRoom: Room = {
          id: Number(roomId),
          hotelId: Number(hotelId),
          roomTypeId: 1,
          roomNumber: '101',
          floor: 1,
          hasAirConditioning: true,
          hasTv: true,
          hasMinibar: false,
          isSmokingAllowed: false,
          createdAt: new Date().toISOString(),
          roomType: {
            id: 1,
            name: 'Standard',
            description: 'Chambre standard',
            basePrice: 100,
            capacity: 2,
            createdAt: new Date().toISOString()
          }
        };
        
        setRoom(mockRoom);
        
        // Générer des disponibilités mockées pour le mois sélectionné
        const days = generateCalendarDays();
        const mockAvailability: RoomAvailability[] = days.map(date => ({
          id: Math.floor(Math.random() * 1000),
          roomId: Number(roomId),
          date,
          isAvailable: Math.random() > 0.3, // 70% de chance d'être disponible
          price: mockRoom.roomType?.basePrice || 100,
        }));
        
        setAvailabilityData(mockAvailability);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [hotelId, roomId, selectedMonth]);

  // Gérer le changement de disponibilité
  const handleAvailabilityChange = (date: string) => {
    setAvailabilityData(prevData => 
      prevData.map(item => 
        item.date === date
          ? { ...item, isAvailable: !item.isAvailable }
          : item
      )
    );
  };

  // Gérer le changement de prix
  const handlePriceChange = (date: string, price: number) => {
    setAvailabilityData(prevData => 
      prevData.map(item => 
        item.date === date
          ? { ...item, price }
          : item
      )
    );
  };

  // Sauvegarder les changements
  const handleSave = async () => {
    console.log('Saving availability data:', availabilityData);
    // Ici on simule un succès
    alert('Disponibilités mises à jour avec succès');
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  if (!room) {
    return <div className="text-center py-8">Chambre non trouvée</div>;
  }

  const calendarDays = generateCalendarDays();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Gérer la disponibilité</h1>
      <p className="mb-6">
        Chambre {room.roomNumber} - {room.roomType?.name} ({room.roomType?.basePrice}€ base)
      </p>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="month">
          Sélectionner un mois
        </label>
        <input
          type="month"
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      
      <div className="bg-white shadow-md rounded overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-100 text-center font-semibold">
          <div className="py-2">Lun</div>
          <div className="py-2">Mar</div>
          <div className="py-2">Mer</div>
          <div className="py-2">Jeu</div>
          <div className="py-2">Ven</div>
          <div className="py-2">Sam</div>
          <div className="py-2">Dim</div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 p-2">
          {calendarDays.map((dateStr, index) => {
            const date = new Date(dateStr);
            const dayOfWeek = date.getDay(); // 0 = dimanche, 1 = lundi, ...
            const dayOfMonth = date.getDate();
            
            // Ajouter des cellules vides pour aligner le premier jour du mois
            if (index === 0) {
              const firstDayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
              const emptyDays = Array(firstDayOffset).fill(null);
              
              return [
                ...emptyDays.map((_, i) => (
                  <div key={`empty-${i}`} className="p-2"></div>
                )),
                <DayCell
                  key={dateStr}
                  date={dateStr}
                  day={dayOfMonth}
                  availability={availabilityData.find(a => a.date === dateStr)}
                  onAvailabilityChange={handleAvailabilityChange}
                  onPriceChange={handlePriceChange}
                />
              ];
            }
            
            return (
              <DayCell
                key={dateStr}
                date={dateStr}
                day={dayOfMonth}
                availability={availabilityData.find(a => a.date === dateStr)}
                onAvailabilityChange={handleAvailabilityChange}
                onPriceChange={handlePriceChange}
              />
            );
          })}
        </div>
      </div>
      
      <div className="mt-6">
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Enregistrer les changements
        </button>
      </div>
    </div>
  );
}

// Composant pour une cellule de jour dans le calendrier
function DayCell({ 
  date, 
  day, 
  availability, 
  onAvailabilityChange, 
  onPriceChange 
}: { 
  date: string; 
  day: number; 
  availability?: RoomAvailability;
  onAvailabilityChange: (date: string) => void;
  onPriceChange: (date: string, price: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [price, setPrice] = useState(availability?.price || 0);
  
  const handlePriceSubmit = () => {
    onPriceChange(date, price);
    setIsEditing(false);
  };
  
  // Si aucune donnée de disponibilité n'est trouvée
  if (!availability) {
    return (
      <div className="p-2 bg-gray-100 min-h-16 flex flex-col items-center justify-center">
        <span className="font-bold">{day}</span>
        <span className="text-xs">Chargement...</span>
      </div>
    );
  }
  
  return (
    <div 
      className={`p-2 border ${availability.isAvailable ? 'bg-green-50' : 'bg-red-50'} min-h-16 flex flex-col`}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold">{day}</span>
        <button
          onClick={() => onAvailabilityChange(date)}
          className={`text-xs px-2 py-1 rounded ${
            availability.isAvailable 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          {availability.isAvailable ? 'Dispo' : 'Indispo'}
        </button>
      </div>
      
      {isEditing ? (
        <div className="mt-1">
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            onBlur={handlePriceSubmit}
            className="w-full px-1 py-0.5 text-xs"
            autoFocus
          />
        </div>
      ) : (
        <div 
          onClick={() => availability.isAvailable && setIsEditing(true)}
          className={`text-center mt-1 text-sm ${availability.isAvailable ? 'cursor-pointer hover:bg-gray-100' : 'text-gray-400'}`}
        >
          {availability.price}€
        </div>
      )}
    </div>
  );
}