import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#FFE8C5] flex flex-col justify-center items-center">
      <div className="max-w-4xl bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to Six Ten Travels</h1>
        <p className="text-lg text-gray-600">
          Your Journey Begins Here!
        </p>
        <div className="flex justify-center">
          <Link
            to="/travel-entry"
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
          >
            Add New Travel Entry
          </Link>
        </div>
        <div className="flex justify-center">
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