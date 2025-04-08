import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Hotel } from "../../../models/types";
import { hotelService } from "../../../services/api";
import { AlertCircle, Loader } from "lucide-react";

export default function CreateEditHotel() {
  const navigate = useNavigate();
  const { id } = useParams(); // Récupérer l'ID de l'URL si présent
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [hotel, setHotel] = useState<Partial<Hotel>>({
    name: "",
    description: "",
    address: "",
    city: "",
    country: "",
    starRating: 3,
    hasWifi: false,
    hasPool: false,
    hasRestaurant: false,
    hasParking: false,
    hasGym: false,
  });

  // Charger les données de l'hôtel existant si on est en mode édition
  useEffect(() => {
    const fetchHotel = async () => {
      if (!isEditMode || !id) return;

      try {
        setLoading(true);
        const hotelData = await hotelService.getHotelById(Number(id));
        setHotel(hotelData);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement de l'hôtel:", err);
        setError("Impossible de charger les détails de l'hôtel");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    if (name === "starRating") {
      setHotel({
        ...hotel,
        [name]: value ? parseInt(value, 10) : undefined,
      });
    } else {
      setHotel({
        ...hotel,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setError(null);

    try {
      if (isEditMode && id) {
        // Mise à jour d'un hôtel existant via l'API
        await hotelService.updateHotel(Number(id), hotel as Hotel);
      } else {
        // Création d'un nouvel hôtel via l'API
        await hotelService.createHotel(hotel as Hotel);
      }

      // Naviguer vers la liste des hôtels après le succès
      navigate("/admin/hotels");
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de l'hôtel:", err);
      setError(
        isEditMode
          ? "Impossible de mettre à jour l'hôtel. Veuillez réessayer."
          : "Impossible de créer l'hôtel. Veuillez réessayer."
      );
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Modifier l'hôtel" : "Créer un nouvel hôtel"}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center mb-4">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Nom de l'hôtel *
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            name="name"
            type="text"
            value={hotel.name || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description *
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            name="description"
            value={hotel.description || ""}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="address"
          >
            Adresse *
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address"
            name="address"
            type="text"
            value={hotel.address || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="city"
            >
              Ville *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="city"
              name="city"
              type="text"
              value={hotel.city || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="country"
            >
              Pays *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="country"
              name="country"
              type="text"
              value={hotel.country || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="starRating"
          >
            Étoiles *
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="starRating"
            name="starRating"
            value={hotel.starRating?.toString() || ""}
            onChange={handleChange}
            required
          >
            <option value="1">1 étoile</option>
            <option value="2">2 étoiles</option>
            <option value="3">3 étoiles</option>
            <option value="4">4 étoiles</option>
            <option value="5">5 étoiles</option>
          </select>
        </div>

        <div className="mb-6">
          <span className="block text-gray-700 text-sm font-bold mb-2">
            Équipements
          </span>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="hasWifi"
                  checked={hotel.hasWifi || false}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">WiFi</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="hasPool"
                  checked={hotel.hasPool || false}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Piscine</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="hasRestaurant"
                  checked={hotel.hasRestaurant || false}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Restaurant</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="hasParking"
                  checked={hotel.hasParking || false}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Parking</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="hasGym"
                  checked={hotel.hasGym || false}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Gym</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section pour les images (si vous souhaitez l'ajouter) */}
        {isEditMode && hotel.id && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="block text-gray-700 text-sm font-bold">
                Images
              </span>
              <button
                type="button"
                className="text-blue-500 hover:text-blue-700 text-sm"
                onClick={() => navigate(`/admin/hotels/${hotel.id}/images`)}
              >
                Gérer les images
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            className={`${
              saveLoading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-700"
            } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center`}
            type="submit"
            disabled={saveLoading}
          >
            {saveLoading && (
              <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
            )}
            {isEditMode ? "Mettre à jour" : "Créer l'hôtel"}
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => navigate("/admin/hotels")}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
