import { useState } from 'react';

export default function Login({ onSuccess, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      // Login request
      const res = await fetch('https://v2.api.noroff.dev/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_NOROFF_API_KEY,
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.errors?.[0]?.message || 'Login failed');

      // Fetch user profile data
      const profileRes = await fetch('https://v2.api.noroff.dev/holidaze/profiles/' + data.data.name, {
        headers: {
          'Authorization': `Bearer ${data.data.accessToken}`,
          'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY
        }
      });
      const profileData = await profileRes.json();
      if (!profileRes.ok) throw new Error(profileData.errors?.[0]?.message || 'Failed to fetch profile');

      // Combine login data with profile data
      const userData = {
        ...data.data,
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
      <h2 className="text-xl font-bold">Login</h2>
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
      </div>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="border px-3 py-2 rounded"
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" className="bg-[#0C5560] text-white rounded px-4 py-2" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <div className="text-sm">
        Don't have an account?{' '}
        <button type="button" className="underline" onClick={onSwitch}>
          Register
        </button>
      </div>
    </form>
  );
} 