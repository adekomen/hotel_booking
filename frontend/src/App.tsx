import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CreateEditRoom from "./pages/admin/rooms/CreateEditRoom";
import RoomAvailabilityManager from "./pages/admin/rooms/RoomAvailability";
import RoomTypeList from "./pages/admin/roomTypes/RoomTypeList";
import CreateEditRoomType from "./pages/admin/roomTypes/CreateEditRoomType";
import RoomTypeDetails from "./pages/admin/roomTypes/RoomTypeDetails";
import HotelList from "./pages/admin/hotels/HotelList";
import CreateEditHotel from "./pages/admin/hotels/CreateEditHotel";
import HotelDetails from "./pages/admin/hotels/HotelDetails";
import HotelImageManager from "./pages/admin/hotels/HotelImageManager";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import RoomList from "./pages/admin/rooms/RoomList";
import DetailRoom from "./pages/admin/rooms/DetailRoom";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        {/* <Route path="/login" element={<LoginPage />} /> */}

        {/* Admin Routes with Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Dashboard */}
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

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="/admin/*"
          element={<Navigate to="/admin/dashboard" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
