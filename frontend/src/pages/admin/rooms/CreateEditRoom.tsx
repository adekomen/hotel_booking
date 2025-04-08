import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Room, RoomType, Hotel } from "../../../models/types";
import ImageGallery from "../../../components/ImageGallery";
import { Info, Bed, Users, DollarSign, Building } from "lucide-react";
import {
  roomService,
  roomTypeService,
  hotelService,
} from "../../../services/api";

export default function CreateEditRoom() {
  const { hotelId, roomId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!roomId;

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [room, setRoom] = useState<Partial<Room>>({
    hotelId: hotelId ? Number(hotelId) : 0,
    roomTypeId: 0,
    roomNumber: "",
    floor: 1,
    hasAirConditioning: false,
    hasTv: false,
    hasMinibar: false,
    isSmokingAllowed: false,
  });

  // Effet pour charger les types de chambre et les hôtels depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Charger les types de chambre
        const typesData = await roomTypeService.getAllRoomTypes();
        setRoomTypes(typesData);

        // Charger la liste des hôtels
        const hotelsData = await hotelService.getAllHotels();
        setHotels(hotelsData);

        if (isEditing && roomId) {
          // Récupérer les détails de la chambre en édition
          const roomData = await roomService.getRoomById(Number(roomId));
          setRoom(roomData);
        } else {
          // En mode création, définir des valeurs par défaut
          if (typesData.length > 0) {
            // Définir le premier type comme défaut pour la création
            setRoom((prev) => ({ ...prev, roomTypeId: typesData[0].id }));
          }

          // Si hotelId est présent dans l'URL mais pas dans la liste des hôtels, réinitialiser
          if (hotelId && !hotelsData.some((h) => h.id === Number(hotelId))) {
            setRoom((prev) => ({ ...prev, hotelId: 0 }));
          } else if (hotelId) {
            setRoom((prev) => ({ ...prev, hotelId: Number(hotelId) }));
          } else if (hotelsData.length > 0) {
            // Si pas d'hotelId dans l'URL et des hôtels existent, sélectionner le premier
            setRoom((prev) => ({ ...prev, hotelId: hotelsData[0].id }));
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Erreur lors du chargement des données. Veuillez réessayer.");
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

    try {
      // Validation des données essentielles
      if (!room.roomNumber || !room.roomTypeId || !room.hotelId) {
        setError("Veuillez remplir tous les champs obligatoires");
        return;
      }

      // S'assurer que hotelId est un nombre valide
      const currentHotelId = Number(room.hotelId);
      if (isNaN(currentHotelId) || currentHotelId <= 0) {
        setError("Veuillez sélectionner un hôtel valide");
        return;
      }

      // Préparation des données avec les conversions de type appropriées
      const roomData = {
        ...room,
        hotelId: currentHotelId,
        roomTypeId: Number(room.roomTypeId),
        floor: Number(room.floor || 1),
      };

      if (isEditing && roomId) {
        // Mettre à jour la chambre existante via l'API
        await roomService.updateRoom(Number(roomId), roomData);
      } else {
        // Créer une nouvelle chambre via l'API
        await roomService.createRoom(roomData);
      }

      // Rediriger vers la liste des chambres de l'hôtel
      navigate(`/admin/hotels/${currentHotelId}/rooms`);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setError(
        "Une erreur est survenue lors de la sauvegarde. Veuillez réessayer."
      );
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  // Trouver le type de chambre sélectionné pour afficher ses détails
  const selectedRoomType = roomTypes.find(
    (type) => type.id === Number(room.roomTypeId)
  );

  // Trouver l'hôtel sélectionné
  const selectedHotel = hotels.find(
    (hotel) => hotel.id === Number(room.hotelId)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? "Modifier la chambre" : "Ajouter une chambre"}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {/* Sélection de l'hôtel */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="hotelId"
              >
                Hôtel *
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="hotelId"
                name="hotelId"
                value={room.hotelId || ""}
                onChange={handleChange}
                required
                disabled={isEditing} // Désactiver en mode édition pour éviter de changer l'hôtel
              >
                <option value="">Sélectionner un hôtel</option>
                {hotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </option>
                ))}
              </select>
            </div>

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
                Équipements de la chambre
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
          </div>

          <div className="space-y-4">
            {/* Affichage des informations de l'hôtel sélectionné */}
            {selectedHotel && (
              <div className="bg-blue-50 rounded-lg shadow-sm p-4 border border-blue-200 mb-4">
                <div className="flex items-center mb-3">
                  <Building size={18} className="mr-2 text-blue-600" />
                  <h3 className="font-bold text-blue-800">
                    {selectedHotel.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {selectedHotel.address}
                </p>
                {selectedHotel.description && (
                  <p className="text-sm text-gray-600">
                    {selectedHotel.description.substring(0, 150)}
                    {selectedHotel.description.length > 150 ? "..." : ""}
                  </p>
                )}
                <div className="mt-2">
                  <Link
                    to={`/admin/hotels/${selectedHotel.id}`}
                    className="text-blue-500 hover:text-blue-700 text-sm underline"
                    target="_blank"
                  >
                    Voir détails de l'hôtel
                  </Link>
                </div>
              </div>
            )}

            {/* Détails du type de chambre sélectionné */}
            {selectedRoomType ? (
              <div className="bg-gray-50 rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800 flex items-center">
                    <Info size={16} className="mr-1" />
                    Type: {selectedRoomType.name}
                  </h3>
                  <Link
                    to="/admin/room-types"
                    className="text-blue-500 hover:text-blue-700 text-sm underline"
                    target="_blank"
                  >
                    Gérer les types
                  </Link>
                </div>

                {/* Galerie d'images */}
                <div className="mb-4">
                  <ImageGallery
                    images={selectedRoomType.images || []}
                    alt={selectedRoomType.name}
                  />
                </div>

                {/* Informations principales */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-700">
                    <Bed size={16} className="mr-2" />
                    <span className="font-medium">{selectedRoomType.name}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Users size={16} className="mr-2" />
                    <span>Capacité: {selectedRoomType.capacity} personnes</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <DollarSign size={16} className="mr-2" />
                    <span>
                      Prix de base: {selectedRoomType.basePrice.toFixed(2)}€
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">
                    Description:
                  </h4>
                  <p className="text-sm text-gray-600">
                    {selectedRoomType.description}
                  </p>
                </div>

                {/* Commodités du type de chambre */}
                {selectedRoomType.amenities &&
                  selectedRoomType.amenities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">
                        Commodités incluses:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedRoomType.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <div className="bg-gray-50 rounded p-4 h-full flex items-center justify-center">
                <p className="text-gray-500">
                  Sélectionnez un type de chambre pour voir les détails
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {isEditing ? "Mettre à jour" : "Ajouter"}
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => {
              // Redirection adaptative: si on a un hôtel sélectionné, naviguer vers cet hôtel
              // sinon, naviguer vers la liste des hôtels
              if (room.hotelId) {
                navigate(`/admin/hotels/${room.hotelId}/rooms`);
              } else {
                navigate("/admin/hotels");
              }
            }}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
