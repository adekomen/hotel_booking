import axios, { AxiosInstance } from "axios";
import {
  Hotel,
  HotelImage,
  RoomType,
  Room,
  RoomAvailability,
} from "../models/types"; // ajuste le chemin si nécessaire

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ⚙️ Configuration Axios
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 🔐 Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🏨 Service Hôtel
export const hotelService = {
  getAllHotels: async (): Promise<Hotel[]> => {
    const response = await api.get("/hotels");
    return response.data;
  },

  getHotelById: async (id: number): Promise<Hotel> => {
    const response = await api.get(`/hotels/${id}`);
    return response.data;
  },

  createHotel: async (hotelData: Partial<Hotel>): Promise<Hotel> => {
    const response = await api.post("/hotels", hotelData);
    return response.data;
  },

  updateHotel: async (
    id: number,
    hotelData: Partial<Hotel>
  ): Promise<Hotel> => {
    const response = await api.put(`/hotels/${id}`, hotelData);
    return response.data;
  },

  deleteHotel: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/hotels/${id}`);
    return response.data;
  },
};

// 🖼️ Service Images d’Hôtel
export const hotelImageService = {
  getHotelImages: async (hotelId: number): Promise<HotelImage[]> => {
    const response = await api.get(`/hotel-images/${hotelId}`);
    return response.data;
  },

  addHotelImage: async (
    imageData: Partial<HotelImage>
  ): Promise<HotelImage> => {
    const response = await api.post("/hotel-images", imageData);
    return response.data;
  },

  deleteHotelImage: async (imageId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/hotel-images/${imageId}`);
    return response.data;
  },

  setPrimaryImage: async (
    imageId: number,
    hotelId: number
  ): Promise<{ message: string }> => {
    const response = await api.put(`/hotel-images/${imageId}/set-primary`, {
      hotel_id: hotelId,
    });
    return response.data;
  },
};

export const roomTypeService = {
  getAllRoomTypes: async (): Promise<RoomType[]> => {
    const response = await api.get("/room-types");
    return response.data;
  },

  getRoomTypeById: async (id: number): Promise<RoomType> => {
    const response = await api.get(`/room-types/${id}`);
    return response.data;
  },

  createRoomType: async (
    roomTypeData: Omit<RoomType, "id">
  ): Promise<RoomType> => {
    const response = await api.post("/room-types", roomTypeData);
    return response.data;
  },

  updateRoomType: async (
    id: number,
    roomTypeData: Partial<RoomType>
  ): Promise<RoomType> => {
    const response = await api.put(`/room-types/${id}`, roomTypeData);
    return response.data;
  },

  deleteRoomType: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/room-types/${id}`);
    return response.data;
  },
};

export const roomService = {
  // Récupérer toutes les chambres
  getAllRooms: async (): Promise<Room[]> => {
    const response = await api.get("/rooms");
    return response.data;
  },

  // Récupérer les chambres d'un hôtel spécifique
  getRoomsByHotelId: async (hotelId: number): Promise<Room[]> => {
    const response = await api.get(`/hotels/${hotelId}/rooms`);
    return response.data;
  },

  // Récupérer une chambre par son ID
  getRoomById: async (id: number): Promise<Room> => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },

  // Créer une nouvelle chambre
  createRoom: async (roomData: Partial<Room>): Promise<Room> => {
    const response = await api.post("/rooms", roomData);
    return response.data;
  },

  // Mettre à jour une chambre existante
  updateRoom: async (id: number, roomData: Partial<Room>): Promise<Room> => {
    const response = await api.put(`/rooms/${id}`, roomData);
    return response.data;
  },

  // Supprimer une chambre
  deleteRoom: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  },

  // Gérer la disponibilité des chambres
  getRoomAvailability: async (
    roomId: number,
    month: string
  ): Promise<RoomAvailability[]> => {
    const response = await api.get(`/rooms/${roomId}/availability/${month}`);
    return response.data;
  },

  updateRoomAvailability: async (
    roomId: number,
    date: string,
    isAvailable: boolean,
    price?: number
  ): Promise<RoomAvailability> => {
    const response = await api.put(`/rooms/${roomId}/availability`, {
      date,
      isAvailable,
      price,
    });
    return response.data;
  },
};

export { api };
