import { useState } from 'react';

export default function Register({ onSuccess, onSwitch }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [venueManager, setVenueManager] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email domain
    if (!email.endsWith('@stud.noroff.no')) {
      setError('Email must be a valid stud.noroff.no address');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const registerRes = await fetch('https://v2.api.noroff.dev/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_NOROFF_API_KEY,
        },
        body: JSON.stringify({ name, email, password, venueManager }),
      });
      const registerData = await registerRes.json();
      if (!registerRes.ok) throw new Error(registerData.errors?.[0]?.message || 'Registration failed');
      
      const loginRes = await fetch('https://v2.api.noroff.dev/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_NOROFF_API_KEY,
        },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error(loginData.errors?.[0]?.message || 'Auto-login after registration failed');
      
      const profileRes = await fetch('https://v2.api.noroff.dev/holidaze/profiles/' + loginData.data.name, {
        headers: {
          'Authorization': `Bearer ${loginData.data.accessToken}`,
          'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY
        }
      });
      const profileData = await profileRes.json();
      if (!profileRes.ok) throw new Error(profileData.errors?.[0]?.message || 'Failed to fetch profile');

      const userData = {
        ...loginData.data,
        venueManager: profileData.data.venueManager
      };

      localStorage.setItem('user', JSON.stringify(userData));
      if (onSuccess) onSuccess(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        className="border px-3 py-2 rounded"
      />
      <div className="flex flex-col gap-1">
        <input
          type="email"
          placeholder="ola.nordmann@stud.noroff.no"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          pattern="^[\w\-.]+@stud\.noroff\.no$"
          title="Email must be a valid stud.noroff.no address"
          className="border px-3 py-2 rounded"
        />
        <small className="text-gray-500">Email must end with @stud.noroff.no</small>
      </div>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="border px-3 py-2 rounded"
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={venueManager}
          onChange={e => setVenueManager(e.target.checked)}
        />
        Register as Venue Manager
      </label>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" className="bg-[#0C5560] text-white rounded px-4 py-2" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      <div className="text-sm">
        Already have an account?{' '}
        <button type="button" className="underline" onClick={onSwitch}>
          Login
        </button>
      </div>
    </form>
  );
} 