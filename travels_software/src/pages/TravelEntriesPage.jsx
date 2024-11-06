import React, { useState, useEffect } from 'react';
import { fetchTravelEntries } from '../utils/api';

const TravelEntriesPage = () => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agencyFilter, setAgencyFilter] = useState('');

  useEffect(() => {
    const loadEntries = async () => {
      try {
        setIsLoading(true);
        const response = await fetchTravelEntries(agencyFilter);
        setEntries(response);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load travel entries');
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, [agencyFilter]);

  const handleFilterChange = (e) => {
    setAgencyFilter(e.target.value);
  };

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
    <div className="w-full flex flex-col items-center bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">TripSheet Entries</h1>
      <input
        type="text"
        placeholder="Filter by Agency Name"
        value={agencyFilter}
        onChange={handleFilterChange}
        className="w-full max-w-lg p-2 mb-4 border rounded"
      />
      <div className="overflow-auto w-full">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">SI No</th>
              <th className="px-4 py-2 border">Invoice No</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Travels</th>
              <th className="px-4 py-2 border">Vehicle No</th>
              <th className="px-4 py-2 border">Driver Name</th>
              <th className="px-4 py-2 border">Guest Name</th>
              <th className="px-4 py-2 border">Guest No</th>
              <th className="px-4 py-2 border">Reporting</th>
              <th className="px-4 py-2 border">Starting Time</th>
              <th className="px-4 py-2 border">Closing Time</th>
              <th className="px-4 py-2 border">Total Time</th>
              <th className="px-4 py-2 border">Starting KM</th>
              <th className="px-4 py-2 border">Closing KM</th>
              <th className="px-4 py-2 border">Total KM</th>
              <th className="px-4 py-2 border">Parking Fee</th>
              <th className="px-4 py-2 border">Toll Fee</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry._id} className="border-t">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{entry.invoiceNumber}</td>
                <td className="px-4 py-2 border">{new Date(entry.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 border">{entry.agency}</td>
                <td className="px-4 py-2 border">{entry.vehicleNumber}</td>
                <td className="px-4 py-2 border">{entry.driverName}</td>
                <td className="px-4 py-2 border">{entry.guestName}</td>
                <td className="px-4 py-2 border">{entry.guestNumber}</td>
                <td className="px-4 py-2 border">{entry.reporting}</td>
                <td className="px-4 py-2 border">{entry.startingTime}</td>
                <td className="px-4 py-2 border">{entry.closingTime}</td>
                <td className="px-4 py-2 border">{entry.totalHours}Hrs</td>
                <td className="px-4 py-2 border">{entry.startingKm}</td>
                <td className="px-4 py-2 border">{entry.closingKm}</td>
                <td className="px-4 py-2 border">{entry.totalKm}KM</td>
                <td className="px-4 py-2 border">{entry.parkingFee}</td>
                <td className="px-4 py-2 border">{entry.tollFee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TravelEntriesPage;
