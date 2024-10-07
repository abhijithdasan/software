import React, { useState, useEffect, useMemo } from "react";

const travelAgencies = [
  "Entrex",
  "KTC",
  "Jessy Cabs",
  "Ab Travels",
  "Arun Raja",
  "CBS",
  "ETS",
  "Rayappan",
  "Serene",
  "Soorya",
  "Sujith",
  "WLT Jakku",
  "Other",
];

const TravelEntryForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    guestName: "",
    startingKm: "",
    closingKm: "",
    startingTime: "",
    closingTime: "",
    guestNumber: "",
    tollFee: "",
    parkingFee: "",
    vehicleName: "",
    vehicleNumber: "",
    driverName: "",
    purpose: "local",
    date: new Date().toISOString().slice(0, 10),
    agency: "",
    totalKm: "",
    totalHours: "",
    invoiceNumber: "",
  });

  const [invoiceCount, setInvoiceCount] = useState(0);

  useEffect(() => {
    const now = new Date();
    const currentDate = now.toISOString().slice(0, 10);
    const savedDate = localStorage.getItem('invoiceDate');
    const savedCount = localStorage.getItem('invoiceCount');

    if (savedDate === currentDate) {
      setInvoiceCount(Number(savedCount));
    } else {
      setInvoiceCount(0);
      localStorage.setItem('invoiceDate', currentDate);
      localStorage.setItem('invoiceCount', '0');
    }

    // Generate initial invoice number
    const initialInvoiceNumber = generateInvoiceNumber(0);
    setFormData(prev => ({ ...prev, invoiceNumber: initialInvoiceNumber }));
  }, []);

  const generateInvoiceNumber = (count) => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const invoiceCount = String(count + 1).padStart(3, '0');
    return `STINV-${year}${month}${day}${invoiceCount}`;
  };

  const { totalKm, totalHours } = useMemo(() => {
    const totalKm =
      formData.closingKm && formData.startingKm
        ? Math.max(0, Number(formData.closingKm) - Number(formData.startingKm))
        : "";
    
    const startTime = formData.startingTime ? new Date(`1970-01-01T${formData.startingTime}`) : null;
    const closeTime = formData.closingTime ? new Date(`1970-01-01T${formData.closingTime}`) : null;
    
    let totalHours = "";
    if (startTime && closeTime) {
      let diff = closeTime - startTime;
      if (diff < 0) diff += 24 * 60 * 60 * 1000;
      const hours = Math.floor(diff / (60 * 60 * 1000));
      const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
      totalHours = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    return { totalKm, totalHours };
  }, [formData.startingKm, formData.closingKm, formData.startingTime, formData.closingTime]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, totalKm, totalHours }));
  }, [totalKm, totalHours]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Update invoice number if necessary fields are filled
    if (
      formData.guestName &&
      formData.startingKm &&
      formData.closingKm &&
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
    onSubmit(formData);

    // Update invoice count
    const newCount = invoiceCount + 1;
    setInvoiceCount(newCount);
    localStorage.setItem('invoiceCount', String(newCount));

    // Reset form
    setFormData({
      guestName: "",
      startingKm: "",
      closingKm: "",
      startingTime: "",
      closingTime: "",
      guestNumber: "",
      tollFee: "",
      parkingFee: "",
      vehicleName: "",
      vehicleNumber: "",
      driverName: "",
      purpose: "local",
      date: new Date().toISOString().slice(0, 10),
      agency: "",
      totalKm: "",
      totalHours: "",
      invoiceNumber: generateInvoiceNumber(newCount), // Set new invoice number for next entry
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <form onSubmit={handleSubmit} className="travel-entry-form" style={{  }}>
      {/* Row 1: Invoice Number, Date, Travel Agency */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="invoiceNumber">Invoice Number:</label>
          <input
            type="text"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="agency">Travels:</label>
          <select
            name="agency"
            value={formData.agency}
            onChange={handleChange}
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          >
            {travelAgencies.map((agency, index) => (
              <option key={index} value={agency}>
                {agency}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Vehicle Name, Vehicle Number, Driver Name */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="vehicleName">Vehicle Name</label>
          <input
            type="text"
            name="vehicleName"
            value={formData.vehicleName}
            onChange={handleChange}
            className="input-field"
            required
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="vehicleNumber">Vehicle Number</label>
          <input
            type="text"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            className="input-field"
            required
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="driverName">Driver Name</label>
          <input
            type="text"
            name="driverName"
            value={formData.driverName}
            onChange={handleChange}
            className="input-field"
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
      </div>

      {/* Row 3: Guest Name, Guest Number */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="guestName">Guest Name:</label>
          <input
            type="text"
            name="guestName"
            value={formData.guestName}
            onChange={handleChange}
            required
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="guestNumber">Guest Number:</label>
          <input
            type="text"
            name="guestNumber"
            value={formData.guestNumber}
            onChange={handleChange}
            required
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
      </div>

      {/* Row 4: Starting, Closing KM and Total Hours */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startingKm">Starting KM:</label>
          <input
            type="number"
            name="startingKm"
            value={formData.startingKm}
            onChange={handleChange}
            required
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="closingKm">Closing KM:</label>
          <input
            type="number"
            name="closingKm"
            value={formData.closingKm}
            onChange={handleChange}
            required
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="totalKm">Total KM:</label>
          <input
            type="text"
            name="totalKm"
            value={formData.totalKm}
            readOnly
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
      </div>

      {/* Row 5: Starting, Closing Time and Total Hours */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startingTime">Starting Time:</label>
          <input
            type="time"
            name="startingTime"
            value={formData.startingTime}
            onChange={handleChange}
            required
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="closingTime">Closing Time:</label>
          <input
            type="time"
            name="closingTime"
            value={formData.closingTime}
            onChange={handleChange}
            required
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="totalHours">Total Hours:</label>
          <input
            type="text"
            name="totalHours"
            value={formData.totalHours}
            readOnly
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
      </div>

      {/* Row 6: Purpose, Toll Fee, and Parking Fee */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="purpose">Purpose:</label>
          <select
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          >
            <option value="local">Local</option>
            <option value="outstation">Outstation</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="tollFee">Toll Fee:</label>
          <input
            type="number"
            name="tollFee"
            value={formData.tollFee}
            onChange={handleChange}
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="parkingFee">Parking Fee:</label>
          <input
            type="number"
            name="parkingFee"
            value={formData.parkingFee}
            onChange={handleChange}
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
      </div>
      <div className="form-actions btn" style={{ display: "flex", gap: "1rem" }}>
        <button className="submit-btn no-print" type="submit" >
          Submit
        </button>
        <button className="print-btn no-print" type="button" onClick={handlePrint}>
          Print
        </button>
      </div>
    </form>
  );
};

export default TravelEntryForm;
