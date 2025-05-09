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
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://v2.api.noroff.dev/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_NOROFF_API_KEY,
        },
        body: JSON.stringify({ name, email, password, venueManager }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.errors?.[0]?.message || 'Registration failed');
      localStorage.setItem('user', JSON.stringify(data.data));
      if (onSuccess) onSuccess(data.data);
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
      <input
        type="email"
        placeholder="olanordmann@stud.noroff.no"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="border px-3 py-2 rounded"
      />
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
        <button type="button" className="underline text-blue-600" onClick={onSwitch}>
          Login
        </button>
      </div>
    </form>
  );
} 