import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Hotel {
  id: string;
  name: string;
  location: string;
  distance: string;
  features: string[];
  rating: number;
  type: string;
  image: string;
  price: string;
}

const HotelsPage: React.FC = () => {
  // État pour la recherche
  const [city, setCity] = useState('Pune');
  const [checkInDate, setCheckInDate] = useState<Date | null>(new Date());
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(new Date(Date.now() + 86400000));
  const [guests, setGuests] = useState(1);

  // État pour les filtres
  const [ratingFilter, setRatingFilter] = useState<number[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);

  // Données des hôtels
  const hotels: Hotel[] = [
    {
      id: '1',
      name: 'Hyatt Pune',
      location: 'Kalyani Nagar, Pune',
      distance: '3.3 kms from city center',
      features: [
        'Free cancellation',
        'No prepayment needed – pay at the property'
      ],
      rating: 5,
      type: 'Hotel',
      image: 'https://source.unsplash.com/random/400x300/?hyatt',
      price: '₹18,900'
    },
    {
      id: '2',
      name: 'Courtyard by Marriott Pune Hinjewadi',
      location: '500 meters from the Rajiv Gandhi Infotech Park',
      distance: '500 meters from center',
      features: [
        'Free cancellation',
        'No prepayment needed – pay at the property',
        'Free wifi',
        'Free lunch'
      ],
      rating: 4,
      type: 'Hotel',
      image: 'https://source.unsplash.com/random/400x300/?marriott',
      price: '₹25,300'
    }
  ];

  // Filtrage des hôtels
  const filteredHotels = hotels.filter(hotel => {
    const ratingMatch = ratingFilter.length === 0 || ratingFilter.includes(hotel.rating);
    const typeMatch = typeFilter.length === 0 || typeFilter.includes(hotel.type);
    return ratingMatch && typeMatch;
  });

  // Gestion des filtres
  const toggleRatingFilter = (rating: number) => {
    if (ratingFilter.includes(rating)) {
      setRatingFilter(ratingFilter.filter(r => r !== rating));
    } else {
      setRatingFilter([...ratingFilter, rating]);
    }
  };

  const toggleTypeFilter = (type: string) => {
    if (typeFilter.includes(type)) {
      setTypeFilter(typeFilter.filter(t => t !== type));
    } else {
      setTypeFilter([...typeFilter, type]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Barre de recherche */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Ville */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Villes</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
            </select>
          </div>

          {/* Check-in */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
            <DatePicker
              selected={checkInDate}
              onChange={(date) => setCheckInDate(date)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Check-out */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
            <DatePicker
              selected={checkOutDate}
              onChange={(date) => setCheckOutDate(date)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Nombre de voyageurs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No d'invités</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
          </div>

          {/* Bouton de recherche */}
          <div className="flex items-end">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg">
              SEARCH
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filtres */}
        <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">FILTERS</h3>
            <button className="text-blue-600 text-sm">Clear</button>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold mb-2">Sort by</h4>
            <select className="w-full p-2 border border-gray-300 rounded">
              <option>Recommandés</option>
              <option>Prix (bas vers haut)</option>
              <option>Prix (haut to bas)</option>
              <option>Evaluation</option>
            </select>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold mb-2">Star ratings</h4>
            {[5, 4, 3].map(rating => (
              <div key={rating} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`rating-${rating}`}
                  checked={ratingFilter.includes(rating)}
                  onChange={() => toggleRatingFilter(rating)}
                  className="mr-2"
                />
                <label htmlFor={`rating-${rating}`}>{rating} Star</label>
              </div>
            ))}
          </div>

          <div>
            <h4 className="font-semibold mb-2">Property type</h4>
            {['Hotel', 'Apartment', 'Villa'].map(type => (
              <div key={type} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`type-${type}`}
                  checked={typeFilter.includes(type)}
                  onChange={() => toggleTypeFilter(type)}
                  className="mr-2"
                />
                <label htmlFor={`type-${type}`}>{type}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Liste des hôtels */}
        <div className="w-full md:w-3/4 space-y-6">
          {filteredHotels.map(hotel => (
            <Link 
              to={`/hotels/${hotel.id}`} 
              key={hotel.id}
              className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                  <img 
                    src={hotel.image} 
                    alt={hotel.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <h3 className="text-xl font-bold">{hotel.name}</h3>
                  <p className="text-gray-600 mt-1">{hotel.location} | {hotel.distance}</p>
                  
                  <div className="mt-3 space-y-1">
                    {hotel.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <span className="text-green-500 mr-2">✔</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-yellow-400">{"★".repeat(hotel.rating)}</span>
                      <span className="text-gray-500 ml-2">{hotel.rating}/5</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{hotel.price}</p>
                      <p className="text-sm text-gray-600">per night</p>
                      <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                        Book now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;