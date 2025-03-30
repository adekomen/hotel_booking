import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Room, RoomType } from "../../../models/types";

// Ce composant sert à la fois pour la création et l'édition
export default function CreateEditRoom() {
  const { hotelId, roomId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!roomId;

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<Partial<Room>>({
    hotelId: Number(hotelId),
    roomTypeId: 0,
    roomNumber: "",
    floor: 1,
    hasAirConditioning: false,
    hasTv: false,
    hasMinibar: false,
    isSmokingAllowed: false,
  });

  // Effet pour charger les types de chambre et, en cas d'édition, les détails de la chambre
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock des types de chambre
        const mockRoomTypes: RoomType[] = [
          {
            id: 1,
            name: "Standard",
            description: "Chambre standard",
            basePrice: 100,
            capacity: 2,
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            name: "Deluxe",
            description: "Chambre deluxe",
            basePrice: 150,
            capacity: 2,
            createdAt: new Date().toISOString(),
          },
          {
            id: 3,
            name: "Suite",
            description: "Suite luxueuse",
            basePrice: 250,
            capacity: 4,
            createdAt: new Date().toISOString(),
          },
        ];

        setRoomTypes(mockRoomTypes);

        if (isEditing) {
          // Mock d'une chambre pour l'édition
          const mockRoom: Room = {
            id: Number(roomId),
            hotelId: Number(hotelId),
            roomTypeId: 1,
            roomNumber: "101",
            floor: 1,
            hasAirConditioning: true,
            hasTv: true,
            hasMinibar: false,
            isSmokingAllowed: false,
            createdAt: new Date().toISOString(),
          };

          setRoom(mockRoom);
        } else if (mockRoomTypes.length > 0) {
          // Définir le premier type comme défaut pour la création
          setRoom((prev) => ({ ...prev, roomTypeId: mockRoomTypes[0].id }));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [hotelId, roomId, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    // Gérer les nombres correctement
    if (type === "number") {
      setRoom({
        ...room,
        [name]: value === "" ? "" : Number(value),
      });
    } else {
      setRoom({
        ...room,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler une sauvegarde
    console.log("Saving room:", room);
    // Rediriger vers la liste des chambres de l'hôtel
    navigate(`/admin/hotels/${hotelId}/rooms`);
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? "Modifier la chambre" : "Ajouter une chambre"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="roomNumber"
          >
            Numéro de chambre *
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="roomNumber"
            name="roomNumber"
            type="text"
            value={room.roomNumber || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="roomTypeId"
          >
            Type de chambre *
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="roomTypeId"
            name="roomTypeId"
            value={room.roomTypeId || ""}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner un type</option>
            {roomTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name} ({type.capacity} personnes) - {type.basePrice}€
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="floor"
          >
            Étage
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="floor"
            name="floor"
            type="number"
            min="0"
            value={room.floor === undefined ? "" : room.floor}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <span className="block text-gray-700 text-sm font-bold mb-2">
            Équipements
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="hasAirConditioning"
                  checked={room.hasAirConditioning || false}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Climatisation</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="hasTv"
                  checked={room.hasTv || false}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Télévision</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="hasMinibar"
                  checked={room.hasMinibar || false}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Minibar</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isSmokingAllowed"
                  checked={room.isSmokingAllowed || false}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Fumeur autorisé</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {isEditing ? "Mettre à jour" : "Ajouter"}
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => navigate(`/admin/hotels/${hotelId}/rooms`)}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
