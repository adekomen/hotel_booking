import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hotel } from "../../../models/types";

export default function CreateHotel() {
  const navigate = useNavigate();
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setHotel({
      ...hotel,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Quand l'API sera prête, on remplacera par un appel réel
    console.log("Creating hotel:", hotel);
    // Mock success
    navigate("/admin/hotels");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Créer un nouvel hôtel</h1>

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
            value={hotel.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            name="description"
            value={hotel.description || ""}
            onChange={handleChange}
            rows={4}
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

        <div className="grid grid-cols-2 gap-4">
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
            Étoiles
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="starRating"
            name="starRating"
            value={hotel.starRating || ""}
            onChange={handleChange}
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

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Créer l'hôtel
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
