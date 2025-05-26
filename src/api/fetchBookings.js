export const createBooking = async (bookingData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user?.accessToken) throw new Error('No authentication token found');

  const response = await fetch('https://v2.api.noroff.dev/holidaze/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.accessToken}`,
      'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY
    },
    body: JSON.stringify(bookingData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Failed to create booking: ${response.status}`);
  }

  const data = await response.json();
  
  // Fetch the venue data for the booking
  const venueResponse = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${bookingData.venueId}`);
  const venueData = await venueResponse.json();
  
  // Combine the booking and venue data
  return {
    ...data.data,
    venue: venueData.data
  };
};

export async function getBookings() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.accessToken) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${user.name}/bookings?_venue=true`, {
      headers: {
        'Authorization': `Bearer ${user.accessToken}`,
        'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      if (response.status === 401) {
        throw new Error('Authentication failed. Please try logging in again.');
      }
      throw new Error(errorData?.message || `Failed to fetch bookings: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
}

export const getBooking = async (id) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user?.accessToken) throw new Error('No authentication token found');

  const response = await fetch(`https://v2.api.noroff.dev/holidaze/bookings/${id}?_venue=true&_customer=true&_owner=true`, {
    headers: {
      'Authorization': `Bearer ${user.accessToken}`,
      'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Failed to fetch booking: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
};

export async function deleteBooking(id) {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.accessToken) {
      throw new Error('No authentication token found');
    }
    const response = await fetch(`https://v2.api.noroff.dev/holidaze/bookings/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.accessToken}`,
        'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY
      }
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      if (response.status === 401) {
        throw new Error('Authentication failed. Please try logging in again.');
      }
      throw new Error(errorData?.message || `Failed to delete booking: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
} 