import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Home = ({ handleLogout }) => {
  console.log("Rendering Home component"); // For debugging
  return (
    <div className="w-screen min-h-screen flex justify-center items-center bg-gray-50">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-4xl font-bold text-gray-800 text-center">Welcome to Six Ten Travels</h1>
        <p className="text-lg text-gray-600 text-center">Your Journey Begins Here!</p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/travel-entry"
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
          >
            Add New Travel Entry
          </Link>
          <Link
            to="/travel-entries"
            className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-300"
          >
            View Travel Entries
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
