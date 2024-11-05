import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import TravelEntryForm from "./components/TravelEntryForm";
import LoginForm from "./components/LoginForm";
import Home from "./pages/Home";
import TravelEntriesPage from "./pages/TravelEntriesPage";
import Navbar from "./components/Navbar";
import "./index.css";
import PropTypes from 'prop-types'; // Add this for props validation

// Protected Route Wrapper Component
const ProtectedRoute = ({ children }) => {
  const [isLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

// Add PropTypes validation
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

const App = () => {
  console.log('App rendering');
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  // Handle login status
  const handleLogin = (status) => {
    setIsLoggedIn(status);
    localStorage.setItem("isLoggedIn", status);
  };

  // If you're not using handleLogout, you can remove it
  // or pass it to Navbar component if needed
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
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
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/travel-entry"
          element={
            <ProtectedRoute>
              <TravelEntryForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/travel-entries"
          element={
            <ProtectedRoute>
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