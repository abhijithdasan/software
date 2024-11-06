import React, { useState, useMemo, useEffect } from 'react';
import { Alert} from './Alert';
import { X } from 'lucide-react';
import "./LoginForm.css"

const travelAgencies = [
 "AB TRAVELS",
"APJ ANAND",
 "ARUN RAJA",
 "CBS",
 "DAKSHINA MOORTHI",
 "DENEB",
 "ECO",
 "ENTREX",
 "ETS",
 "HTZ SHANKAR",
 "JESSY CABS",
 "KTC",
 "KVT",
 "LPM",
 "MANISHA",
 "NAZEER",
 "NEW TRAVELS",
 "ORCHID",
 "ORIX ARUL",
 "PANDIYA",
 "PRAKASH TAJ",
 "RADHIKA",
 "RAGU",
 "RAJOO CABS",
 "RAYAPPAN",
 "RIDE INN",
 "SAM TRAVELS",
 "SEENU",
 "SERENE",
 "SOORYA",
 "SREE-SAI KISHOR",
 "SRINIVASAN",
 "SUKRA",
 "SUJITH",
 "VINEETH RAJ",
 "VISHNU TRAVELS",
 "VKB",
 "VOIT",
 "WLT JAKKU",
 "OTHER"
];

const generateInvoiceNumber = (count) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  return `INV-${year}${month}${day}0${count + 1}`;
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
    invoiceNumber: generateInvoiceNumber(0),
  });

  const [showAlert, setShowAlert] = useState(false);
  const [invoiceCount, setInvoiceCount] = useState(0);

  const { totalKm, totalHours } = useMemo(() => {
    const totalKm =
      formData.closingKm && formData.startingKm
        ? Math.max(0, Number(formData.closingKm) - Number(formData.startingKm))
        : '';
  
    const startTime = formData.startingTime ? new Date(`1970-01-01T${formData.startingTime}`) : null;
    const closeTime = formData.closingTime ? new Date(`1970-01-01T${formData.closingTime}`) : null;
  
    let totalHours = '';
    if (startTime && closeTime) {
      const diffInMs = closeTime - startTime;
      const totalMinutes = Math.floor(diffInMs / (1000 * 60));
      totalHours = (totalMinutes / 60).toFixed(2);
    }
  
    return { totalKm, totalHours };
  
  }, [formData.startingKm, formData.closingKm, formData.startingTime, formData.closingTime]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, totalKm, totalHours }));
  }, [totalKm, totalHours]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'startingKm' || name === 'closingKm' || name === 'tollFee' || name === 'parkingFee'
      ? value.toString()
      : value, }));

    if (
      formData.guestName &&
    formData.startingKm !== '0' &&
    formData.closingKm !== '0' &&
    formData.startingTime &&
    formData.closingTime &&
    formData.guestNumber &&
    formData.vehicleName &&
    formData.vehicleNumber
    ) {
      const newInvoiceNumber = generateInvoiceNumber(invoiceCount);
      setFormData(prev => ({ ...prev, invoiceNumber: newInvoiceNumber }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here

    // Update invoice count
    const newCount = invoiceCount + 1;
    setInvoiceCount(newCount);

    // Show success alert
    setShowAlert(true);

    // Reset form
    setFormData({
      guestName: '',
      startingKm: '',
      closingKm: '',
      startingTime: '',
      closingTime: '',
      guestNumber: '',
      tollFee: '',
      parkingFee: '',
      vehicleName: '',
      vehicleNumber: '',
      driverName: '',
      reporting: '',
      date: new Date().toISOString().slice(0, 10),
      agency: '',
      totalKm: '',
      totalHours: '',
      invoiceNumber: generateInvoiceNumber(newCount),
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mt-4 flex justify-center items-center">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 space-y-4">
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-5">
          <Alert type="success" onClose={() => setShowAlert(false)}>
           Tripsheet saved successfully!  .
         </Alert>
        </div>
      )}

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

        <div className="grid grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="font-bold text-gray-600">Starting KM:</label>
            <input
              type="number"
              name="startingKm"
              value={formData.startingKm}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="font-bold text-gray-600">Closing KM:</label>
            <input
              type="number"
              name="closingKm"
              value={formData.closingKm}
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
            <label className="font-bold text-gray-600">Reporting</label>
            <input
              type="text"
              name="reporting"
              value={formData.reporting}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
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
        </div>

        <div className="flex justify-center items-center gap-4 print:hidden">
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-600 text-white rounded ml-2 sm:ml-4 hover:bg-blue-700 transition-colors duration-300"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-6 py-3 bg-green-600 text-white rounded ml-2 sm:ml-4 hover:bg-green-700 transition-colors duration-300"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravelEntryForm;