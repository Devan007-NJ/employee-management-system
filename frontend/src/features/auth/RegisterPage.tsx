import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../api/authapi';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'employee'>('employee');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser({ username, email, password, role });
      navigate('/login');
    } catch {
      setError('Registration failed. Try a different username/email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-mantle border border-surface0 rounded-xl p-8 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-mauve mb-6">Create Account</h1>

        {error && (
          <p className="text-red bg-surface0 rounded-md p-2 mb-4 text-sm">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-subtext1 mb-1 text-sm">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full bg-surface0 text-text border border-surface1 rounded-md px-3 py-2 focus:outline-none focus:border-mauve"
          />
        </div>

        <div className="mb-4">
          <label className="block text-subtext1 mb-1 text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-surface0 text-text border border-surface1 rounded-md px-3 py-2 focus:outline-none focus:border-mauve"
          />
        </div>

        <div className="mb-4">
          <label className="block text-subtext1 mb-1 text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-surface0 text-text border border-surface1 rounded-md px-3 py-2 focus:outline-none focus:border-mauve"
          />
        </div>

        <div className="mb-6">
          <label className="block text-subtext1 mb-1 text-sm">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'admin' | 'employee')}
            className="w-full bg-surface0 text-text border border-surface1 rounded-md px-3 py-2 focus:outline-none focus:border-mauve"
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-mauve text-white font-semibold rounded-md py-2 hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="text-subtext0 text-sm mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-mauve hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}