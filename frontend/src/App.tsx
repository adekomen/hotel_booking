// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateEditRoom from "./pages/admin/rooms/CreateEditRoom";
import CreateHotel from "./pages/admin/hotels/CreateHotel";
import RoomAvailabilityManager from "./pages/admin/rooms/RoomAvailability";

function App() {

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Vous pourriez avoir un Header/Navbar ici */}
        <main>
          <Routes>
            <Route path="/hotels" element={<CreateHotel />} />
            <Route path="/rooms" element={<CreateEditRoom />} />
            <Route
              path="/rooms/availability"
              element={<RoomAvailabilityManager />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
