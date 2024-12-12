import React, { useState, useMemo, useEffect } from 'react';
import { Alert } from './Alert';
import "./LoginForm.css";
import { addTravelEntry } from '../utils/api.js';

const travelAgencies = [
  "", "AB TRAVELS", "APJ ANAND", "ARUN RAJA", "CBS", "DAKSHINA MOORTHI", "DENEB", 
  "ECO", "ENTREX","ETC", "ETS", "HTZ SHANKAR", "JESSY CABS", "KTC", "KVT", "LPM",
  "MANISHA", "NAZEER", "NEW TRAVELS", "ORCHID", "ORIX ARUL", "PANDIYA", 
  "PRAKASH TAJ", "RADHIKA", "RAGU", "RAJOO CABS", "RAYAPPAN", "RIDE INN", 
  "SAM TRAVELS", "SEENU", "SERENE", "SOORYA", "SREE-SAI KISHOR", "SRINIVASAN",
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
      const response = await fetch('http://localhost:3000/api/travels/invoice/current');
      
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
      return; // Stop the form submission if the user cancels
    }

    console.log("Form submitted:", formData);
  
    // Validation: check for required fields
    if (
      !formData.guestName ||
      formData.startingKm === '' ||
      formData.closingKm === '' ||
      !formData.startingTime ||
      !formData.closingTime ||
      !formData.guestNumber ||
      !formData.vehicleName ||
      !formData.vehicleNumber ||
      !formData.reporting
    ) {
      setShowAlert(true);
      return;
    }
  
    
    // Calculate total hours and total kilometers before submission
    const totalKm = Math.max(0, Number(formData.closingKm) - Number(formData.startingKm));
    const [startHours, startMinutes] = formData.startingTime.split(':').map(Number);
    const [endHours, endMinutes] = formData.closingTime.split(':').map(Number);
  
    let diffMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    if (diffMinutes < 0) diffMinutes += 24 * 60;
  
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    const totalHours = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  
    // Prepare the data for submission
    try {
      // First, get a new invoice number
      const invoiceResponse = await fetch('/api/invoice/next', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!invoiceResponse.ok) {
        throw new Error('Failed to get next invoice number');
      }

      const { nextNumber } = await invoiceResponse.json();
      const newInvoiceNumber = formatInvoiceNumber(nextNumber);

      const entryData = {
        ...formData,
        invoiceNumber: newInvoiceNumber,
        date: formData.date,
        totalKm: totalKm.toString(),
        totalHours
      };

      const response = await addTravelEntry(entryData);
      console.log("Entry successfully added:", response);

      // Reset form
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
        date: new Date().toISOString().slice(0, 10),
        agency: '',
        totalKm: '0',
        totalHours: '00:00',
        invoiceNumber: newInvoiceNumber,
      });
  
      setShowAlert(false); // Hide any previous alerts
    } catch (error) {
      console.error("Error submitting form:", error.message);
      // Optionally, show an error alert to the user here
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
          <div className="form-group flex flex-col space-y-2">
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
