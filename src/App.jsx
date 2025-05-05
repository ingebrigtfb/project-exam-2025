import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Venues from "./pages/Venues";
import VenueDetails from "./pages/VenueDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Bookings from "./pages/Bookings";
import ManagerDashboard from "./pages/ManagerDashboard";
import ManageVenues from "./pages/ManageVenues";
import ManageBookings from "./pages/ManageBookings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/venues/:id" element={<VenueDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/manager/venues" element={<ManageVenues />} />
        <Route path="/manager/bookings" element={<ManageBookings />} />
      </Routes>
    </Router>
  );
}

export default App;