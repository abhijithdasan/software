// src/components/TravelEntriesList.jsx
import React from "react";

const TravelEntriesList = ({ entries, onEdit, onDelete }) => {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Travel Entries</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border text-left">Guest Name</th>
              <th className="p-2 border text-left">Total Kilometers</th>
              <th className="p-2 border text-left">Invoice Number</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-2">{entry.guestName}</td>
                <td className="p-2">{entry.totalKm}</td>
                <td className="p-2">{entry.invoiceNumber}</td>
                <td className="p-2 text-center">
                  <button onClick={() => onEdit(entry)} className="text-blue-600 hover:text-blue-800 mr-2">
                    Edit
                  </button>
                  <button onClick={() => onDelete(entry)} className="text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TravelEntriesList;
