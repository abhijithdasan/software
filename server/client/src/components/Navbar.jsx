import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const Navbar = ({ handleLogout: onLogout }) => {  // Rename prop to avoid conflict
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogoutClick = () => {  // Renamed local function
    // Clear authentication data
    localStorage.removeItem('isLoggedIn');  // Changed to match App.jsx
    localStorage.removeItem('token');
    
    // Call the parent's logout handler
    if (onLogout) {
      onLogout();
    }
    
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800">
                6|10   Travels
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            
            <Link
              to="/travel-entry"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/travel-entry')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              New Entry
            </Link>
            
            <Link
              to="/travel-entries"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/travel-entries')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              View Entries
            </Link>

            <button
              onClick={handleLogoutClick}  // Updated to use new function name
              className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Add PropTypes validation
Navbar.propTypes = {
  handleLogout: PropTypes.func.isRequired
};

export default Navbar;