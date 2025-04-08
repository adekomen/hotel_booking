import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Hotel } from "../../../models/types";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function HotelDetailsPage() {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await fetch(`/api/hotels/${hotelId}`);
        const data = await response.json();
        setHotel(data);
      } catch (error) {
        console.error("Erreur lors du chargement de l'hôtel :", error);
      }
    };

    fetchHotel();
  }, [hotelId]);

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setShowImageGallery(true);
  };

  const closeGallery = () => {
    setShowImageGallery(false);
  };

  const nextImage = () => {
    if (!hotel?.images || hotel.images.length === 0) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === (hotel?.images?.length ?? 0) - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    if (!hotel?.images || hotel.images.length === 0) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === (hotel?.images?.length ?? 0) - 1 ? 0 : prevIndex - 1
    );
  };

  if (!hotel) {
    return <div className="p-4">Chargement de l'hôtel...</div>;
  }

  return (
    <div className="p-4">
      <a
        href="/"
        className="flex items-center text-blue-600 hover:underline mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Retour à la liste
      </a>

      <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
      <p className="text-gray-600 mb-4">{hotel.description}</p>

      {/* Galerie d’images */}
      {hotel.images && hotel.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {hotel.images.slice(0, 4).map((img, index) => (
            <img
              key={img.id}
              src={img.imageUrl}
              alt={`Image ${index + 1}`}
              className="rounded cursor-pointer hover:opacity-80 transition"
              onClick={() => openGallery(index)}
            />
          ))}
        </div>
      )}

      {/* Voir toutes les photos */}
      {hotel.images && hotel.images.length > 1 && (
        <button
          className="mt-4 text-blue-600 hover:underline"
          onClick={() => openGallery(0)}
        >
          Voir toutes les photos
        </button>
      )}

      {/* Modal galerie */}
      {showImageGallery && hotel.images && hotel.images.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <button
            className="absolute top-4 right-4 text-white"
            onClick={closeGallery}
          >
            <X className="w-8 h-8" />
          </button>

          <button className="absolute left-4 text-white" onClick={prevImage}>
            <ChevronLeft className="w-10 h-10" />
          </button>

          <img
            src={hotel.images[currentImageIndex]?.imageUrl ?? ""}
            alt="Gallery"
            className="max-w-[90%] max-h-[80%] rounded shadow-lg"
          />

          <button className="absolute right-4 text-white" onClick={nextImage}>
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}
    </div>
  );
}
