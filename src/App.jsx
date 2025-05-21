import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Venues from './pages/Venues';
import VenueDetails from './pages/VenueDetails';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import ManagerDashboard from './pages/ManagerDashboard';
import ManageVenues from './pages/ManageVenues';
import ManageBookings from './pages/ManageBookings';
import RequireAuth from './auth/RequireAuth';
import BookingDetails from './pages/BookingDetails';
import BookingConfirmation from './pages/BookingConfirmation';
import CreateVenue from './components/VenueManager/CreateVenue';
import EditVenue from './components/VenueManager/EditVenue';


const App = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="venues" element={<Venues />} />
      <Route path="venues/:id" element={
        <RequireAuth>
          <VenueDetails />
        </RequireAuth>
      } />
      <Route path="profile" element={
        <RequireAuth>
          <Profile />
        </RequireAuth>
      } />
      <Route path="profile/create-venue" element={
        <RequireAuth>
          <CreateVenue />
        </RequireAuth>
      } />
      <Route path="profile/edit-venue/:id" element={
        <RequireAuth>
          <EditVenue />
        </RequireAuth>
      } />
      <Route path="bookings" element={
        <RequireAuth>
          <Bookings />
        </RequireAuth>
      } />
      <Route path="bookings/:id" element={
        <RequireAuth>
          <BookingDetails />
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
    <Route path="/booking-confirmation" element={<BookingConfirmation />} />
  </Routes>
);

export default App;