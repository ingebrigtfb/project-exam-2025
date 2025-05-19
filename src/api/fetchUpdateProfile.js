export async function updateProfile(name, data) {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.accessToken) {
      throw new Error('No authentication token found');
    }

    // Ensure we're only sending the fields that the API expects
    const updateData = {
      bio: data.bio || null,
      avatar: data.avatar || null,
      banner: data.banner || null,
      venueManager: data.venueManager
    };

    // Remove null values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === null) {
        delete updateData[key];
      }
    });

    // Check if at least one property is provided
    if (Object.keys(updateData).length === 0) {
      throw new Error('At least one property must be provided for update');
    }

    const response = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${name}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.accessToken}`,
        'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      if (response.status === 401) {
        throw new Error('Authentication failed. Please try logging in again.');
      }
      if (response.status === 400) {
        throw new Error('Invalid image URLs. Please ensure they are fully formed and publicly accessible.');
      }
      throw new Error(errorData?.message || `Failed to update profile: ${response.status}`);
    }

    const result = await response.json();
    return result.data; // Return the data property from the response
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
} 