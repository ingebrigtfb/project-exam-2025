import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Venues from './pages/Venues';
import VenueDetails from './pages/VenueDetails';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import ManagerDashboard from './pages/ManagerDashboard';
import ManageVenues from './pages/ManageVenues';
import ManageBookings from './pages/ManageBookings';
import RequireAuth from './auth/RequireAuth';

const App = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="venues" element={<Venues />} />
      <Route path="venues/:id" element={<VenueDetails />} />
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="profile" element={
        <RequireAuth>
          <Profile />
        </RequireAuth>
      } />
      <Route path="bookings" element={
        <RequireAuth>
          <Bookings />
        </RequireAuth>
      } />
      <Route path="manager" element={
        <RequireAuth>
          <ManagerDashboard />
        </RequireAuth>
      } />
      <Route path="manager/venues" element={
        <RequireAuth>
          <ManageVenues />
        </RequireAuth>
      } />
      <Route path="manager/bookings" element={
        <RequireAuth>
          <ManageBookings />
        </RequireAuth>
      } />
    </Route>
  </Routes>
);

export default App;