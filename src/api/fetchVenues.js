export async function fetchVenues(page = 1, limit = 20) {
  try {
    const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch venues');
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching venues:', error);
    return [];
  }
}

export async function fetchVenueById(id) {
  try {
    const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch venue by ID');
    }
    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error('Error fetching venue by ID:', error);
    return null;
  }
}
