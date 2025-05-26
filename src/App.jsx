import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Venues from './pages/Venues';
import VenueDetails from './pages/VenueDetails';
import Profile from './pages/Profile';
import BookingDetails from './pages/BookingDetails';
import BookingConfirmation from './pages/BookingConfirmation';
import RequireAuth from './auth/RequireAuth';
import CreateVenue from './components/VenueManager/CreateVenue';
import EditVenue from './components/VenueManager/EditVenue';
import VenueManagerRoute from './components/common/VenueManagerRoute';

const App = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="venues" element={<Venues />} />
      <Route path="venues/:id" element={<VenueDetails />} />
      <Route path="profile" element={
        <RequireAuth>
          <Profile />
        </RequireAuth>
      } />
      <Route path="profile/create-venue" element={
        <RequireAuth>
          <VenueManagerRoute>
            <CreateVenue />
          </VenueManagerRoute>
        </RequireAuth>
      } />
      <Route path="profile/edit-venue/:id" element={
        <RequireAuth>
          <VenueManagerRoute>
            <EditVenue />
          </VenueManagerRoute>
        </RequireAuth>
      } />
      <Route path="bookings/:id" element={
        <RequireAuth>
          <BookingDetails />
        </RequireAuth>
      } />
    </Route>
    <Route path="/booking-confirmation/:id" element={<BookingConfirmation />} />
  </Routes>
);

export default App;