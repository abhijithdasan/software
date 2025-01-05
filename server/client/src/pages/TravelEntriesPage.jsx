import React, { useState, useEffect } from 'react';
import { fetchTravelEntries } from '../utils/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TravelEntriesPage = () => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agencyFilter, setAgencyFilter] = useState('');
  const [dateRangeType, setDateRangeType] = useState('month');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDateRangeValid, setIsDateRangeValid] = useState(true);
  const [sortConfig, setSortConfig] = useState({ 
    key: 'datetime', 
    direction: 'asc'
  });

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Handle invalid dates
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Convert date and time strings to Date object
  const parseDateTime = (dateStr, timeStr) => {
    if (!dateStr) return new Date(0);
    
    try {
      const date = new Date(dateStr);
      if (timeStr) {
        const [hours, minutes] = timeStr.split(':').map(num => parseInt(num) || 0);
        date.setHours(hours, minutes);
      }
      return date;
    } catch (err) {
      return new Date(0);
    }
  };

  // Set default date range based on selected type
const setDefaultDateRange = (type) => {
  const now = new Date();
  let start, end;

  switch (type) {
    case 'day':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      break;
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      break;
    case 'year':
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      break;
    default:
      start = null;
      end = null;
  }

  setStartDate(start);
  setEndDate(end);
};

  // Sort entries function
  const sortEntries = (entriesArray) => {
    if (!Array.isArray(entriesArray)) return [];
    
    return [...entriesArray].sort((a, b) => {
      if (!a || !b) return 0;

      const dateA = parseDateTime(a.date, a.startingTime);
      const dateB = parseDateTime(b.date, b.startingTime);
      
      return sortConfig.direction === 'asc' 
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });
  };

  // Handle date range type change
  const handleDateRangeTypeChange = (type) => {
    setDateRangeType(type);
    setDefaultDateRange(type);
  };

  // Initial setup
  useEffect(() => {
    // Set default to current month on first load
    setDefaultDateRange('month');
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    
    const loadEntries = async () => {
      try {
        setIsLoading(true);
        const response = await fetchTravelEntries(agencyFilter, startDate, endDate, { signal: controller.signal });
        const sortedEntries = sortEntries(response);
        setEntries(sortedEntries);
        setError(null);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Failed to load travel entries');
      } finally {
        setIsLoading(false);
      }
    };

    if (startDate && endDate && endDate < startDate) {
      setIsDateRangeValid(false);
    } else {
      setIsDateRangeValid(true);
      loadEntries();
    }

    return () => controller.abort();
  }, [agencyFilter, startDate, endDate, sortConfig]);

  const handleFilterChange = (e) => {
    setAgencyFilter(e.target.value.trim());
  };

  const handleSort = () => {
    setSortConfig(prevConfig => ({
      key: 'datetime',
      direction: prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleExcelDownload = () => {
    // Convert entries to CSV format
    const headers = [
      'SI No', 'Invoice No', 'Date', 'Travels', 'Vehicle No', 'Driver Name',
      'Guest Name', 'Guest No', 'Reporting', 'Starting Time', 'Closing Time',
      'Total Time', 'Starting KM', 'Closing KM', 'Total KM', 'Parking Fee',
      'Toll Fee', 'Amount'
    ];

    const csvData = entries.map((entry, index) => [
      index + 1,
      entry.invoiceNumber,
      formatDate(entry.date),
      entry.agency,
      entry.vehicleNumber,
      entry.driverName,
      entry.guestName,
      entry.guestNumber,
      entry.reporting,
      entry.startingTime,
      entry.closingTime,
      `${entry.totalHours}Hrs`,
      entry.startingKm,
      entry.closingKm,
      `${entry.totalKm}KM`,
      `₹${Number(entry.parkingFee).toFixed(2)}`,
      `₹${Number(entry.tollFee).toFixed(2)}`,
      `₹${Number(entry.amount).toFixed(2)}`
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'travel_entries.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePdfDownload = () => {
    window.print();
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

  const totalAmount = entries.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);
  const totalParkingFee = entries.reduce((sum, entry) => sum + (Number(entry.parkingFee) || 0), 0);
  const totalTollFee = entries.reduce((sum, entry) => sum + (Number(entry.tollFee) || 0), 0);

  return (
    <div className="w-full flex flex-col items-center bg-gray-50 p-8">
      <h1 className="text-xl font-bold text-gray-800 text-center mb-6">TripSheet Entries</h1>
      
      <div className="sticky top-0 bg-white z-10 p-4 shadow-md w-full max-w-6xl rounded-lg mb-4">
        {/* Date Range Type Selector */}
        <div className="flex justify-center mb-4">
          <div className="flex space-x-4">
            {['day', 'month', 'year'].map((type) => (
              <button
                key={type}
                onClick={() => handleDateRangeTypeChange(type)}
                className={`px-4 py-2 rounded-md ${
                  dateRangeType === type 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              setDateRangeType('custom');
            }}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="dd/MM/yyyy"
            placeholderText="Start Date"
            className="p-2 border rounded flex-1 min-w-[200px]"
            disabled={['day', 'month', 'year'].includes(dateRangeType)}
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => {
              setEndDate(date);
              setDateRangeType('custom');
            }}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="dd/MM/yyyy"
            placeholderText="End Date"
            className="p-2 border rounded flex-1 min-w-[200px]"
            disabled={['day', 'month', 'year'].includes(dateRangeType)}
          />
          <input
            type="text"
            placeholder="Filter by Agency Name"
            value={agencyFilter}
            onChange={handleFilterChange}
            className="p-2 border rounded flex-1 min-w-[200px]"
          />
        </div>
        
        {!isDateRangeValid && (
          <div className="text-red-600 mt-4">
            The end date must be greater than the start date.
          </div>
        )}

        {entries.length > 0 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-2 rounded">
              <span className="font-semibold">Total Amount:</span> ₹{totalAmount.toFixed(2)}
            </div>
            <div className="bg-blue-50 p-2 rounded">
              <span className="font-semibold">Total Parking Fee:</span> ₹{totalParkingFee.toFixed(2)}
            </div>
            <div className="bg-blue-50 p-2 rounded">
              <span className="font-semibold">Total Toll Fee:</span> ₹{totalTollFee.toFixed(2)}
            </div>
          </div>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="text-xl text-gray-600 mt-8">No travel entries found</div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead >
              <tr className="border-t bg-gray-200">
                <th className="px-1 py-2 border w-1">SI No</th>
                <th className="px-1 py-2 border w-1">Invoice No</th>
                <th 
                  className="px-1 py-2 border w-4 cursor-pointer hover:bg-gray-300"
                  onClick={handleSort}
                >
                  Date {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </th>
                <th className="px-1 py-2 border w-2 text-center">Travels</th>
                <th className="px-1 py-2 border w-2 text-center">Vehicle No</th>
                <th className="px-1 py-2 border w-2 text-center">Driver Name</th>
                <th className="px-1 py-2 border w-2 text-center">Guest Name</th>
                <th className="px-1 py-2 border w-4 text-center">Guest No</th>
                <th className="px-2 py-2 border w-2 text-center">Reporting</th>
                <th className="px-1 py-2 border w-2 text-center">Starting Time</th>
                <th className="px-1 py-2 border w-2 text-center">Closing Time</th>
                <th className="px-1 py-2 border w-4 text-center">Total Time</th>
                <th className="px-1 py-2 border w-4 text-center">Starting KM</th>
                <th className="px-1 py-2 border w-4 text-center">Closing KM</th>
                <th className="px-1 py-2 border w-4 text-center">Total KM</th>
                <th className="px-1 py-2 border w-4 text-center">Parking Fee</th>
                <th className="px-1 py-2 border w-4 text-center">Toll Fee</th>
                <th className="px-1 py-2 border w-4 text-center">Amount</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry._id} className="border-t hover:bg-gray-50">
                  <td className="px-1 py-2 border">{index + 1}</td>
                  <td className="px-1 py-2 border">{entry.invoiceNumber}</td>
                  <td className="px-1 py-2 border">
                    {formatDate(entry.date)}
                    <br />
                    <span className="text-sm text-gray-600"></span>
                  </td>
                  <td className="px-1 py-2 border">{entry.agency}</td>
                  <td className="px-1 py-2 border">{entry.vehicleNumber}</td>
                  <td className="px-1 py-2 border">{entry.driverName}</td>
                  <td className="px-1 py-2 border">{entry.guestName}</td>
                  <td className="px-1 py-2 border">{entry.guestNumber}</td>
                  <td className="px-2 py-2 border">{entry.reporting}</td>
                  <td className="px-1 py-2 border">{entry.startingTime}</td>
                  <td className="px-1 py-2 border">{entry.closingTime}</td>
                  <td className="px-1 py-2 border">{entry.totalHours}Hrs</td>
                  <td className="px-1 py-2 border">{entry.startingKm}</td>
                  <td className="px-1 py-2 border">{entry.closingKm}</td>
                  <td className="px-1 py-2 border">{entry.totalKm}KM</td>
                  <td className="px-1 py-2 border">₹{Number(entry.parkingFee).toFixed(2)}</td>
                  <td className="px-1 py-2 border">₹{Number(entry.tollFee).toFixed(2)}</td>
                  <td className="px-1 py-2 border">₹{Number(entry.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end gap-4 mt-6 mb-8">
            <button
              onClick={handleExcelDownload}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download Excel
            </button>
            <button
              onClick={handlePdfDownload}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelEntriesPage;