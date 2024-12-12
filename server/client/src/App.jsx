import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import TravelEntryForm from "./components/TravelEntryForm";
import LoginForm from "./components/LoginForm";
import Home from "./pages/Home";
import TravelEntriesPage from "./pages/TravelEntriesPage";
import Navbar from "./components/Navbar";
import "./index.css";
import PropTypes from 'prop-types';

// Protected Route Wrapper Component
const ProtectedRoute = ({ children, isLoggedIn, handleLogout }) => {
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      <Navbar handleLogout={handleLogout} />
      {children}
    </>
  );
};

// Add PropTypes validation
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  // Handle login status
  const handleLogin = (status) => {
    setIsLoggedIn(status);
    localStorage.setItem("isLoggedIn", status.toString());
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route 
          path="/login" 
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-blue-600 mb-2">SIX TEN TRAVELS</h1>
                  <p className="text-gray-600 text-lg">#Our Customer is our First Child</p>
                </div>
                <LoginForm onSubmit={handleLogin} />
              </div>
            )
          } 
        />

        <Route
          path="/"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} handleLogout={handleLogout}>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/travel-entry"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} handleLogout={handleLogout}>
              <TravelEntryForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/travel-entries"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} handleLogout={handleLogout}>
              <TravelEntriesPage />
            </ProtectedRoute>
          }
        />

        {/* Catch all unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;