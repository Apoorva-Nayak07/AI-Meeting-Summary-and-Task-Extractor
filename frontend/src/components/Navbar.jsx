import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Brain, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/upload', label: 'Upload' },
    { path: '/history', label: 'History' },
    { path: '/analytics', label: 'Analytics' }
  ];

  return (
    <nav className="glass border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold gradient-text">AI Meeting</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg transition ${
                  location.pathname === link.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-4 py-2 glass-hover rounded-lg transition"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">{user?.name}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
