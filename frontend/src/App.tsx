// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateEditRoom from "./pages/admin/rooms/CreateEditRoom";
import RoomAvailabilityManager from "./pages/admin/rooms/RoomAvailability";
import GlobalNavbar from "./components/global-navbar/GlobalNavbar";
import GlobalSearch from "./components/global-search-box/GlobalSearch";
import CityMenu from "./components/city-menu/CityMenu";
import HotelCard from "./components/hotel-card/HotelCard";
import NearbyHotels from "./components/nearby-hotels/NearbyHotels";
import Login from "./components/routes/login/Login";
import HotelFilter from "./components/routes/hotel-filter/HotelFilter";

import Register from "./components/routes/register/Register";
import GlobalFooter from "./components/global-footer/GlobalFooter";
import AboutUs from "./components/routes/about-us/AboutUs";


function App() {

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Vous pourriez avoir un Header/Navbar ici */}
        <GlobalNavbar />

        <main>
          <Routes>
          <Route 
            path="/"
            element={
              <>
                < GlobalSearch/>
                < HotelCard/>
                < NearbyHotels/>
              </>
            }
          />
          <Route path="/city-menu" element={<CityMenu />} />
          <Route path="/hotel-filter" element={<HotelFilter />} />
          <Route path="/rooms" element={<CreateEditRoom />} />
          <Route
            path="/rooms/availability"
            element={<RoomAvailabilityManager />}
          />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />  
          </Routes>
        </main>
        <GlobalFooter />
      </div>
    </Router>
  );
}

export default App;
