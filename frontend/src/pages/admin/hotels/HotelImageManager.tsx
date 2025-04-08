import { useState, useEffect, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Hotel, HotelImage } from "../../../models/types";
import { hotelService, hotelImageService } from "../../../services/api";
import {
  Upload,
  Star,
  StarOff,
  Trash2,
  Image as ImageIcon,
  ArrowLeft,
  X,
  Check,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

export default function HotelImageManager() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<HotelImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Charger les données de l'hôtel et ses images depuis l'API
    const loadHotelData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const hotelData = await hotelService.getHotelById(Number(id));
        setHotel(hotelData);

        // Si les images ne sont pas incluses dans la réponse de l'hôtel,
        // nous devons les récupérer séparément
        if (!hotelData.images) {
          const imagesData = await hotelImageService.getHotelImages(Number(id));
          setImages(imagesData);
        } else {
          setImages(hotelData.images);
        }

        setErrorMessage("");
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setErrorMessage("Erreur lors du chargement des données de l'hôtel");
      } finally {
        setLoading(false);
      }
    };

    loadHotelData();
  }, [id, navigate]);

  // Ajouter une nouvelle image
  const handleAddImage = async (e: FormEvent) => {
    e.preventDefault();

    if (!newImageUrl.trim() || !id) {
      setErrorMessage("Veuillez entrer une URL d'image valide");
      return;
    }

    try {
      const imageData = {
        hotelId: Number(id),
        imageUrl: newImageUrl,
        isPrimary: images.length === 0,
      };

      await hotelImageService.addHotelImage(imageData);

      // Mettre à jour la liste des images
      const updatedImages = await hotelImageService.getHotelImages(Number(id));
      setImages(updatedImages);

      setNewImageUrl("");
      setSuccessMessage("Image ajoutée avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'image:", error);
      setErrorMessage("Erreur lors de l'ajout de l'image");
    }
  };

  // Supprimer une image
  const handleDeleteImage = async (imageId: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
      return;
    }

    try {
      // Vérifier si c'est l'image primaire
      const imageToDelete = images.find((img) => img.id === imageId);

      await hotelImageService.deleteHotelImage(imageId);

      // Récupérer la liste mise à jour des images
      const updatedImages = await hotelImageService.getHotelImages(Number(id));

      // Si on a supprimé l'image primaire et qu'il reste des images,
      // définir une autre comme primaire
      if (
        imageToDelete &&
        imageToDelete.isPrimary &&
        updatedImages.length > 0
      ) {
        await hotelImageService.setPrimaryImage(
          updatedImages[0].id,
          Number(id)
        );
        // Récupérer à nouveau les images avec le nouvel état de isPrimary
        const refreshedImages = await hotelImageService.getHotelImages(
          Number(id)
        );
        setImages(refreshedImages);
      } else {
        setImages(updatedImages);
      }

      setSuccessMessage("Image supprimée avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image:", error);
      setErrorMessage("Erreur lors de la suppression de l'image");
    }
  };

  // Définir une image comme principale
  const handleSetPrimary = async (imageId: number) => {
    try {
      await hotelImageService.setPrimaryImage(imageId, Number(id));

      // Récupérer la liste mise à jour des images pour refléter la nouvelle image primaire
      const updatedImages = await hotelImageService.getHotelImages(Number(id));
      setImages(updatedImages);

      setSuccessMessage("Image principale définie");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error(
        "Erreur lors de la définition de l'image principale:",
        error
      );
      setErrorMessage("Erreur lors de la mise à jour de l'image principale");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
          <AlertCircle className="mr-2 h-5 w-5" />
          <span>Erreur: Hôtel non trouvé.</span>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate("/admin/hotels")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retourner à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate(`/admin/hotels/view/${hotel.id}`)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retour à l'hôtel
          </button>
        </div>
        <h1 className="text-2xl font-bold">
          Gestion des images - {hotel.name}
        </h1>
      </div>

      {/* Messages de succès/erreur */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center justify-between">
          <span className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {errorMessage}
          </span>
          <button onClick={() => setErrorMessage("")} className="text-red-700">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center justify-between">
          <span className="flex items-center">
            <Check className="h-5 w-5 mr-2" />
            {successMessage}
          </span>
          <button
            onClick={() => setSuccessMessage("")}
            className="text-green-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Formulaire d'ajout d'image */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Ajouter une nouvelle image
        </h2>
        <form
          onSubmit={handleAddImage}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex-grow">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="URL de l'image (https://...)"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <Upload className="mr-2 h-5 w-5" />
            Ajouter l'image
          </button>
        </form>
      </div>

      {/* Galerie d'images */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Images de l'hôtel ({images.length})
        </h2>

        {images.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">
              Aucune image disponible pour cet hôtel
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Ajoutez des images en utilisant le formulaire ci-dessus
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className={`rounded-lg border overflow-hidden ${
                  image.isPrimary
                    ? "border-yellow-400 ring-2 ring-yellow-400"
                    : "border-gray-200"
                }`}
              >
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={image.imageUrl}
                    alt={`Image de ${hotel.name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/placeholder-image.jpg";
                    }}
                  />
                  {image.isPrimary && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-800 px-2 py-1 rounded-md text-xs font-medium">
                      Image principale
                    </div>
                  )}
                </div>
                <div className="p-3 bg-white">
                  <div className="flex items-center justify-between">
                    <a
                      href={image.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center text-sm"
                    >
                      Voir l'image
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                    <div className="text-xs text-gray-500">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between">
                    {!image.isPrimary ? (
                      <button
                        onClick={() => handleSetPrimary(image.id)}
                        className="flex items-center text-sm text-yellow-600 hover:text-yellow-800"
                      >
                        <Star className="mr-1 h-4 w-4" />
                        Définir comme principale
                      </button>
                    ) : (
                      <span className="flex items-center text-sm text-gray-400">
                        <StarOff className="mr-1 h-4 w-4" />
                        Image principale
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="flex items-center text-sm text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
