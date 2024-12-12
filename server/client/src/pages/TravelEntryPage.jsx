import React from 'react';
import TravelEntryForm from '../components/TravelEntryForm';

const TravelEntryPage = () => {
  return (
    <div className="min-h-screen bg-[#FFE8C5] flex justify-center items-start pt-16">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Add New Travel Entry</h1>
        <TravelEntryForm />
      </div>
    </div>
  );
};

export default TravelEntryPage;