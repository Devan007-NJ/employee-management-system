import { useState ,} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/authapi';
import { useAppDispatch } from '../../app/hooks';
import { setCredentials } from './authSlice';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginUser({ username, password });
      dispatch(
        setCredentials({
          user: data.user,
          access: data.access,
          refresh: data.refresh,
        })
      );
      navigate('/employees');
    } catch (err) {
      setError('Invalid username or password');
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
        <h1 className="text-2xl font-bold text-mauve mb-6">Sign In</h1>

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

        <div className="mb-6">
          <label className="block text-subtext1 mb-1 text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-surface0 text-text border border-surface1 rounded-md px-3 py-2 focus:outline-none focus:border-mauve"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-mauve text-white font-semibold rounded-md py-2 hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <p className="text-subtext0 text-sm mt-4 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-mauve hover:underline">
                Register
            </Link>
        </p>
      </form>
    </div>
  );
}