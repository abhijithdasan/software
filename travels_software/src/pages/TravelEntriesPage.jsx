import React, { useState, useEffect } from 'react';
import { fetchTravelEntries } from '../utils/api';

const TravelEntriesPage = () => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTravelEntries();
        setEntries(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load travel entries');
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">No travel entries found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Travel Entries</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <div key={entry._id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{entry.destination}</h2>
            <p className="text-gray-600 mb-2">Date: {new Date(entry.date).toLocaleDateString()}</p>
            <p className="text-gray-600 mb-2">Duration: {entry.duration} days</p>
            <p className="text-gray-700">{entry.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelEntriesPage;