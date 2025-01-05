import React, { useState, useMemo, useEffect } from 'react';
import { Alert } from './Alert';
import "./LoginForm.css";
import { addTravelEntry } from '../utils/api.js';

const travelAgencies = [
  "", "AB TRAVELS", "APJ ANAND", "ARUN RAJA", "CBS", "DAKSHINA MOORTHI", "DENEB", 
  "ECO", "ENTREX","ETC", "ETS", "HTZ SHANKAR", "JESSY CABS", "KTC", "KVT", "LPM",
  "MANISHA", "NAZEER", "NEW TRAVELS", "ORCHID", "ORIX ARUL", "PANDIYA", 
  "PRAKASH TAJ", "RADHIKA", "RAGU", "RAJOO CABS", "RAYAPPAN", "RIDE INN", 
  "SAM TRAVELS", "SEENU", "SERENE","SIX TEN TRAVELS", "SOORYA", "SREE-SAI KISHOR", "SRINIVASAN",
  "SUKRA", "SUJITH", "VINEETH RAJ","VENKATESH TRAVELS", "VISHNU TRAVELS", "VKB", "VOIT",
  "WLT JAKKU", "OTHER"
];

const formatInvoiceNumber = (number) => {
  return `STINV2025${String(number).padStart(4, '0')}`;
};


const TravelEntryForm = () => {
  const [formData, setFormData] = useState({
    guestName: '',
    startingKm: '0',
    closingKm: '0',
    startingTime: '00:00',
    closingTime: '00:00',
    guestNumber: '',
    tollFee: '0',
    parkingFee: '0',
    vehicleName: '',
    vehicleNumber: '',
    driverName: '',
    reporting: '',
    date: new Date().toISOString().slice(0, 10),
    agency: '',
    totalKm: '0',
    totalHours: '0.00',
    amount: '0',
    invoiceNumber: '',
  });

  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
  const fetchCurrentInvoiceNumber = async () => {
    try {
      const response = await fetch('https://care-sixten.onrender.com/api/travels/invoice/current');
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoice number');
      }
      
      const data = await response.json();
      if (data.currentNumber === undefined) {
        throw new Error('Invalid response from server');
      }

      setFormData(prev => ({
        ...prev,
        invoiceNumber: formatInvoiceNumber(data.currentNumber),
      }));
    } catch (error) {
      console.error('Error fetching invoice number:', error);
      alert('Unable to fetch the current invoice number. Please try again.');
    }
  };

  fetchCurrentInvoiceNumber();
}, []);
  
  const { totalKm, totalHours } = useMemo(() => {
    const kmDiff = Math.max(0, Number(formData.closingKm) - Number(formData.startingKm));
    const [startHours, startMinutes] = formData.startingTime.split(':').map(Number);
    const [endHours, endMinutes] = formData.closingTime.split(':').map(Number);

    let diffMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    if (diffMinutes < 0) diffMinutes += 24 * 60;

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return {
      totalKm: kmDiff,
      totalHours: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
    };
  }, [formData.startingKm, formData.closingKm, formData.startingTime, formData.closingTime]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, totalKm, totalHours }));
  }, [totalKm, totalHours]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Show confirmation dialog before submission
    const confirmed = window.confirm("Are you sure you want to submit the form?");
    if (!confirmed) {
      return; 
    }
  
    // Comprehensive validation with specific checks
    const requiredFields = [
      'guestName', 'startingKm', 'closingKm', 'startingTime', 
      'closingTime', 'guestNumber', 'vehicleName', 'vehicleNumber', 
      'reporting', 'agency', 'date'
    ];
  
    // Detailed validation with meaningful feedback
    const missingFields = requiredFields.filter(field => {
      const value = formData[field];
      return !value || 
             (typeof value === 'string' && value.trim() === '') ||
             (field === 'agency' && value === '');
    });
  
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }
  
    try {
      // Fetch the next invoice number when submitting
      const invoiceResponse = await fetch('https://care-sixten.onrender.com/api/travels/invoice/next', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!invoiceResponse.ok) {
        throw new Error('Failed to get next invoice number');
      }
  
      const { formatedInvoice } = await invoiceResponse.json();
  
      // Ensure all fields have a value, even if it's '0' or an empty string
      const entryData = {
        guestName: formData.guestName,
        startingKm: formData.startingKm || '0',
        closingKm: formData.closingKm || '0',
        startingTime: formData.startingTime || '00:00',
        closingTime: formData.closingTime || '00:00',
        guestNumber: formData.guestNumber,
        vehicleName: formData.vehicleName,
        vehicleNumber: formData.vehicleNumber,
        reporting: formData.reporting,
        agency: formData.agency,
        date: formData.date,
        driverName: formData.driverName || '',
        tollFee: formData.tollFee || '0',
        parkingFee: formData.parkingFee || '0',
        amount: formData.amount || '0',
        invoiceNumber: formData.invoiceNumber, 
        totalKm: Math.max(0, Number(formData.closingKm) - Number(formData.startingKm)).toString(),
        totalHours: formData.totalHours || '00:00'
      };
  
      // Log the exact data being sent for debugging
      console.log("Sending entry data:", JSON.stringify(entryData, null, 2));
  
      // Submit the form data to the backend
      const response = await addTravelEntry(entryData);
      console.log("Entry successfully added:", response);
  
      // Reset form, keeping the new invoice number
      setFormData({
        ...formData,
        guestName: '',
        startingKm: '0',
        closingKm: '0',
        startingTime: '00:00',
        closingTime: '00:00',
        guestNumber: '',
        tollFee: '0',
        parkingFee: '0',
        vehicleName: '',
        vehicleNumber: '',
        driverName: '',
        reporting: '',
        totalKm: '0',
        totalHours: '00:00',
        amount: '0',
        invoiceNumber: formatedInvoice,
      });
  
    } catch (error) {
      console.error("Detailed Error submitting form:", error);
      alert(`Error submitting form: ${error.message}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mt-4 flex justify-center items-center">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 space-y-4">
        {showAlert && <Alert message="Please fill in all required fields." />}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex-1 flex flex-col space-y-2">
              <label htmlFor="invoice-number" className="font-bold text-gray-600">Invoice Number:</label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                className="border rounded py-2 px-3 focus:outline-none focus:ring focus:border-blue-500 w-full"
              />
            </div>
            <div className="flex-1 flex flex-col space-y-2">
              <label className="font-bold text-gray-600">Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
            <div className="flex-1 flex flex-col space-y-2">
              <label className="font-bold text-gray-600">Travels:</label>
              <select
                name="agency"
                value={formData.agency}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all dropdown"
              >
                {travelAgencies.map((agency, index) => (
                  <option key={index} value={agency}>
                    {agency}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
          <div className="form-group flex flex-col space-y-2">
            <label className="font-bold text-gray-600">Vehicle Number:</label>
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <div className="form-group flex flex-col space-y-2" >
            <label className="font-bold text-gray-600">Vehicle Name:</label>
            <input
              type="text"
              name="vehicleName"
              value={formData.vehicleName}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="font-bold text-gray-600">Driver Name:</label>
            <input
              type="text"
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="font-bold text-gray-600">Guest Name:</label>
            <input
              type="text"
              name="guestName"
              value={formData.guestName}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="font-bold text-gray-600">Guest Number:</label>
            <input
              type="text"
              name="guestNumber"
              value={formData.guestNumber}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="font-bold text-gray-600">Reporting:</label>
            <input
              type="text"
              name="reporting"
              value={formData.reporting}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="font-bold text-gray-600">Starting Time:</label>
            <input
              type="time"
              name="startingTime"
              value={formData.startingTime}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="font-bold text-gray-600">Closing Time:</label>
            <input
              type="time"
              name="closingTime"
              value={formData.closingTime}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="font-bold text-gray-600">Total Hours:</label>
            <input
              type="text"
              name="totalHours"
              value={formData.totalHours}
              readOnly
              className="p-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="font-bold text-gray-600">Starting KM:</label>
            <input
              type="number"
              name="startingKm"
              value={formData.startingKm || ''}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="font-bold text-gray-600">Closing KM:</label>
            <input
              type="number"
              name="closingKm"
              value={formData.closingKm || ''}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="font-bold text-gray-600">Total KM:</label>
            <input
              type="text"
              name="totalKm"
              value={formData.totalKm}
              readOnly
              className="p-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="font-bold text-gray-600">Toll Fee:</label>
            <input
              type="number"
              name="tollFee"
              value={formData.tollFee}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="font-bold text-gray-600">Parking Fee:</label>
            <input
              type="number"
              name="parkingFee"
              value={formData.parkingFee}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="font-bold text-gray-600">Total Amount:</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
        </div> 
        
          <div className="ml-8 flex justify-center items-center gap-4 print:hidden">
            <button
              type="submit"
              className="mt-5 px-6 py-3 bg-blue-600 text-white rounded ml-2 sm:ml-4 hover:bg-blue-700 transition-colors duration-300"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="mt-5 px-6 py-3 bg-green-600 text-white rounded ml-2 sm:ml-4 hover:bg-green-700 transition-colors duration-300"
            >
              Print
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TravelEntryForm;