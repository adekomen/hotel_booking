import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import MainLayout from "./layouts/MainLayout";

// Pages publiques
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import AboutUs from "./components/routes/about-us/AboutUs";
import CityMenu from "./components/city-menu/CityMenu";
import HotelFilter from "./components/routes/hotel-filter/HotelFilter";

// Pages admin
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import CreateEditRoom from "./pages/admin/rooms/CreateEditRoom";
import RoomAvailabilityManager from "./pages/admin/rooms/RoomAvailability";
import RoomTypeList from "./pages/admin/roomTypes/RoomTypeList";
import CreateEditRoomType from "./pages/admin/roomTypes/CreateEditRoomType";
import RoomTypeDetails from "./pages/admin/roomTypes/RoomTypeDetails";
import HotelList from "./pages/admin/hotels/HotelList";
import CreateEditHotel from "./pages/admin/hotels/CreateEditHotel";
import HotelDetails from "./pages/admin/hotels/HotelDetails";
import HotelImageManager from "./pages/admin/hotels/HotelImageManager";
import RoomList from "./pages/admin/rooms/RoomList";
import DetailRoom from "./pages/admin/rooms/DetailRoom";
import AuthLayout from "./layouts/AuthLayout";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Routes publiques avec MainLayout */}
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/city-menu" element={<CityMenu />} />
            <Route path="/hotel-filter" element={<HotelFilter />} />
            <Route path="/about-us" element={<AboutUs />} />
          </Route>

          {/* Routes d'authentification avec AuthLayout */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Routes admin protégées avec son propre layout */}
          <Route element={<PrivateRoute requiredRole="admin" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />

              {/* Hotel Management */}
              <Route path="hotels">
                <Route index element={<HotelList />} />
                <Route path="create" element={<CreateEditHotel />} />
                <Route path="edit/:id" element={<CreateEditHotel />} />
                <Route path="view/:id" element={<HotelDetails />} />
                <Route path=":id/images" element={<HotelImageManager />} />
                <Route
                  path=":roomId/availability"
                  element={<RoomAvailabilityManager />}
                />
                <Route path=":hotelId/rooms" element={<RoomList />} />
              </Route>

              {/* Room Types Management */}
              <Route path="room-types">
                <Route index element={<RoomTypeList />} />
                <Route path="create" element={<CreateEditRoomType />} />
                <Route path="edit/:id" element={<CreateEditRoomType />} />
                <Route path="view/:id" element={<RoomTypeDetails />} />
              </Route>

              {/* Room Management */}
              <Route path="rooms">
                <Route index element={<RoomList />} />
                <Route path="create" element={<CreateEditRoom />} />
                <Route path=":id/edit" element={<CreateEditRoom />} />
                <Route path=":roomId/view" element={<DetailRoom />} />
                <Route
                  path=":id/availability"
                  element={<RoomAvailabilityManager />}
                />
              </Route>
            </Route>
          </Route>

          {/* Redirections */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
