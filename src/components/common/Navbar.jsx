import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold tracking-wide text-indigo-400">
        Art Center Booking
      </Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-sm text-slate-300">{user.name} ({user.role})</span>
            <button 
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-xs px-3 py-1.5 rounded transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link 
            to="/login" 
            className="bg-indigo-600 hover:bg-indigo-700 text-sm px-4 py-2 rounded transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
