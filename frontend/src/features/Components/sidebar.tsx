import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../auth/authSlice';

export default function Navbar() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-mantle border-b border-surface0 px-8 py-4 flex items-center justify-between">
      <h1 className="text-lg font-bold text-mauve">Employee Management</h1>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-subtext1 text-sm">
            {user.username} <span className="text-subtext0">({user.role})</span>
          </span>
        )}
        <button
          onClick={handleLogout}
          className="bg-surface0 text-text rounded-md px-4 py-1.5 text-sm hover:bg-surface1 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}