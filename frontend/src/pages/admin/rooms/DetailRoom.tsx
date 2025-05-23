import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Room, RoomType, Hotel } from "../../../models/types";
import {
  Bed,
  ArrowLeft,
  Edit,
  Trash,
  Calendar,
  Users,
  Wifi,
  Tv,
  Snowflake,
  GlassWater,
  Ban,
  DollarSign,
  Cigarette,
} from "lucide-react";
import AvailabilityCalendar from "./AvailabilityCalendar";
import {
  roomService,
  roomTypeService,
  hotelService,
} from "../../../services/api";

export default function DetailRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [roomType, setRoomType] = useState<RoomType | null>(null);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [stats, setStats] = useState({ occupancyRate: 0, monthlyRevenue: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!roomId) {
          throw new Error("ID de chambre non spécifié");
        }

        // Récupérer les détails de la chambre
        const roomData = await roomService.getRoomById(Number(roomId));
        setRoom(roomData);

        // Récupérer les détails de l'hôtel
        const hotelData = await hotelService.getHotelById(roomData.hotelId);
        setHotel(hotelData);

        // Récupérer les détails du type de chambre
        const roomTypeData = await roomTypeService.getRoomTypeById(
          roomData.roomTypeId
        );
        setRoomType(roomTypeData);

        // Ici on pourrait ajouter l'appel API pour obtenir les statistiques
        // Par exemple: const statsData = await roomService.getRoomStats(Number(roomId));
        // Pour l'instant, utilisons des données factices
        setStats({
          occupancyRate: 75,
          monthlyRevenue: 2450,
        });

        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        setError("Erreur lors du chargement des données de la chambre.");
        setLoading(false);
      }
    };

    fetchData();
  }, [roomId]);

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette chambre ?")) {
      if (!room) return;

      try {
        // Supprimer la chambre via l'API
        await roomService.deleteRoom(room.id);

        // Rediriger vers la liste des chambres de l'hôtel
        navigate(`/admin/hotels/${room.hotelId}/rooms`);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        setError("Une erreur est survenue lors de la suppression.");
      }
    }
  };

  const nextImage = () => {
    if (!roomType?.images) return;
    setCurrentImageIndex((prev) =>
      prev === roomType.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!roomType?.images) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? roomType.images.length - 1 : prev - 1
    );
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Link
          to="/admin/rooms"
          className="text-blue-500 hover:underline mt-2 block"
        >
          Retour à la liste des chambres
        </Link>
      </div>
    );
  }

  if (!room || !roomType) {
    return (
      <div className="text-center py-8">
        <p>Chambre non trouvée</p>
        <Link to="/admin/rooms" className="text-blue-500 hover:underline">
          Retour à la liste des chambres
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2" size={18} />
          Retour
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Section gauche - Images et informations principales */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Carrousel d'images */}
            <div className="relative">
              {roomType.images && roomType.images.length > 0 ? (
                <>
                  <img
                    src={roomType.images[currentImageIndex]}
                    alt={`Chambre ${room.roomNumber}`}
                    className="w-full h-64 md:h-96 object-cover"
                  />
                  {roomType.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                      >
                        &lt;
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                      >
                        &gt;
                      </button>
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
                        {roomType.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full ${
                              index === currentImageIndex
                                ? "bg-white"
                                : "bg-white bg-opacity-50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Aucune image disponible</span>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold">
                  Chambre {room.roomNumber} - {roomType.name}
                </h1>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/admin/rooms/${room.id}/edit`)}
                    className="text-blue-600 hover:text-blue-900 p-1"
                    title="Modifier"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-900 p-1"
                    title="Supprimer"
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </div>

              {hotel && (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {hotel.name}
                  </h2>
                  <p className="text-gray-600">{hotel.address}</p>
                  <p className="text-gray-600">
                    {hotel.city}, {hotel.country}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Bed className="text-gray-500 mr-2" size={18} />
                  <span>Type: {roomType.name}</span>
                </div>
                <div className="flex items-center">
                  <Users className="text-gray-500 mr-2" size={18} />
                  <span>Capacité: {roomType.capacity} personnes</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="text-gray-500 mr-2" size={18} />
                  <span>Prix: {roomType.basePrice}€/nuit</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="text-gray-500 mr-2" size={18} />
                  <span>Étage: {room.floor}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">
                  {roomType.description || "Aucune description disponible."}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Équipements</h3>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                    {room.hasAirConditioning ? (
                      <>
                        <Snowflake className="text-blue-500 mr-1" size={16} />
                        <span>Climatisation</span>
                      </>
                    ) : (
                      <>
                        <Ban className="text-red-500 mr-1" size={16} />
                        <span>Climatisation</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                    {room.hasTv ? (
                      <>
                        <Tv className="text-blue-500 mr-1" size={16} />
                        <span>Télévision</span>
                      </>
                    ) : (
                      <>
                        <Ban className="text-red-500 mr-1" size={16} />
                        <span>Télévision</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                    {room.hasMinibar ? (
                      <>
                        <GlassWater className="text-blue-500 mr-1" size={16} />
                        <span>Minibar</span>
                      </>
                    ) : (
                      <>
                        <Ban className="text-red-500 mr-1" size={16} />
                        <span>Minibar</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                    {room.isSmokingAllowed ? (
                      <>
                        <Cigarette className="text-blue-500 mr-1" size={16} />
                        <span>Fumeur</span>
                      </>
                    ) : (
                      <>
                        <Ban className="text-red-500 mr-1" size={16} />
                        <span>Non-fumeur</span>
                      </>
                    )}
                  </div>
                  {roomType.amenities?.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                    >
                      <Wifi className="text-blue-500 mr-1" size={16} />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section droite - Calendrier de disponibilité */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Calendar className="mr-2" size={20} />
              Disponibilité et tarifs
            </h2>

            <AvailabilityCalendar roomId={Number(roomId)} />

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Statistiques</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">Taux d'occupation</p>
                  <p className="text-xl font-bold">{stats.occupancyRate}%</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800">Revenu mensuel</p>
                  <p className="text-xl font-bold">{stats.monthlyRevenue}€</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
