import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Alert } from './Alert';
import { login } from '../utils/api';
import PropTypes from 'prop-types';

const LoginForm = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    console.log('API_URL:', import.meta.env.VITE_API_URL);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await login({
        username,
        password
      });
      
      if (response.success) {

        // Store auth token or user data in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        setIsLoading(false);
        onSubmit(true);
        navigate(from, { replace: true });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setIsLoading(false);
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-xs">
      {error && (
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md mt-4">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-600 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white p-2 rounded-lg transition duration-200 
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};
LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default LoginForm;