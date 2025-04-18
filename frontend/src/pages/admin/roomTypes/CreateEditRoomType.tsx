import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import ImageGallery from "../../../components/ImageGallery";
import { RoomType } from "../../../models/types";
import { useNavigate, useParams } from "react-router-dom";
import { roomTypeService } from "../../../services/api";

interface CreateEditRoomTypeProps {
  roomType?: RoomType;
  onSave?: (roomType: Omit<RoomType, "id"> & { id?: number }) => void;
  onCancel?: () => void;
}

const CreateEditRoomType: React.FC<CreateEditRoomTypeProps> = ({
  roomType: propRoomType,
  onSave,
  onCancel,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [roomType, setRoomType] = useState<RoomType | undefined>(propRoomType);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const isEditMode = Boolean(id) || Boolean(roomType);

  useEffect(() => {
    if (propRoomType) {
      initializeForm(propRoomType);
    } else if (id) {
      fetchRoomType(parseInt(id));
    }
  }, [id, propRoomType]);

  const fetchRoomType = async (roomTypeId: number) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const data = await roomTypeService.getRoomTypeById(roomTypeId);
      initializeForm(data);
    } catch (err) {
      console.error("Erreur lors du chargement du type de chambre", err);
      setApiError("Impossible de charger les détails du type de chambre");
    } finally {
      setIsLoading(false);
    }
  };

  const initializeForm = (data: RoomType) => {
    setRoomType(data);
    setName(data.name || "");
    setDescription(data.description || "");
    setBasePrice(data.basePrice?.toString() || "");
    setCapacity(data.capacity?.toString() || "");
    setImages(data.images || []);
    setAmenities(data.amenities || []);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Le nom est requis";
    if (!description.trim())
      newErrors.description = "La description est requise";

    if (!basePrice) {
      newErrors.basePrice = "Le prix est requis";
    } else if (isNaN(parseFloat(basePrice)) || parseFloat(basePrice) < 0) {
      newErrors.basePrice = "Le prix doit être un nombre positif";
    }

    if (!capacity) {
      newErrors.capacity = "La capacité est requise";
    } else if (isNaN(parseInt(capacity)) || parseInt(capacity) < 1) {
      newErrors.capacity = "La capacité doit être un nombre entier positif";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setApiError(null);

    const updatedRoomType = {
      id: roomType?.id,
      name,
      description,
      basePrice: parseFloat(basePrice),
      capacity: parseInt(capacity),
      images,
      amenities,
      createdAt: roomType?.createdAt || new Date().toISOString(),
    };

    try {
      if (onSave) {
        onSave(updatedRoomType);
      } else {
        // Sauvegarder via l'API
        if (isEditMode && updatedRoomType.id) {
          await roomTypeService.updateRoomType(
            updatedRoomType.id,
            updatedRoomType
          );
        } else {
          await roomTypeService.createRoomType(updatedRoomType);
        }
        navigate("/admin/room-types");
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement", error);
      setApiError("Erreur lors de l'enregistrement du type de chambre");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/admin/room-types");
    }
  };

  const addImage = () => {
    if (imageUrl && imageUrl.trim() !== "") {
      setImages([...images, imageUrl.trim()]);
      setImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addAmenity = () => {
    if (newAmenity && !amenities.includes(newAmenity)) {
      setAmenities([...amenities, newAmenity]);
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setAmenities(amenities.filter((a) => a !== amenity));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {isEditMode
              ? "Modifier le type de chambre"
              : "Ajouter un type de chambre"}
          </h1>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Prix de base (€) *
                </label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  step="0.01"
                  min="0"
                  className={`w-full border ${
                    errors.basePrice ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.basePrice && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.basePrice}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Capacité (personnes) *
                </label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  min="1"
                  className={`w-full border ${
                    errors.capacity ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.capacity && (
                  <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full border ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Images
                </label>
                <div className="mb-2">
                  <div className="flex">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="URL de l'image"
                      className="w-full border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addImage}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg flex items-center"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {/* Aperçu des images */}
                {images.length > 0 && (
                  <div className="mb-4">
                    <ImageGallery images={images} alt={name || "Aperçu"} />
                  </div>
                )}

                {/* Liste des images avec option de suppression */}
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white p-2 rounded border"
                    >
                      <div className="truncate flex-1 text-sm">{img}</div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {images.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-2">
                      Aucune image
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Commodités
                </label>
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Ajouter une commodité"
                    className="w-full border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addAmenity();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addAmenity}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg flex items-center"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Liste des commodités */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full flex items-center"
                    >
                      <span>{amenity}</span>
                      <button
                        type="button"
                        onClick={() => removeAmenity(amenity)}
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </span>
                  ))}
                  {amenities.length === 0 && (
                    <p className="text-gray-500 text-sm">Aucune commodité</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={isSaving}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isEditMode
                    ? "Mise à jour en cours..."
                    : "Création en cours..."}
                </span>
              ) : isEditMode ? (
                "Mettre à jour"
              ) : (
                "Créer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditRoomType;
