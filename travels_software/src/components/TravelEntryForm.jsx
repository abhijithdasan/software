import React, { useState, useEffect } from "react";

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
    parkingFee: "", // New field for parking fee
    vehicleName: "", // New field for vehicle name
    vehicleNumber: "", // New field for vehicle number
    driverName: "", // New field for driver name
    purpose: "local", // New field for purpose
    date: new Date().toISOString().slice(0, 10),
    agency: "Entrex",
    totalKm: "",
    totalHours: "",
  });

  useEffect(() => {
    const totalKm =
      formData.closingKm && formData.startingKm
        ? Number(formData.closingKm) - Number(formData.startingKm)
        : "";
    const startHour = formData.startingTime
      ? new Date(`1970-01-01T${formData.startingTime}`).getHours()
      : 0;
    const startMinute = formData.startingTime
      ? new Date(`1970-01-01T${formData.startingTime}`).getMinutes()
      : 0;
    const closeHour = formData.closingTime
      ? new Date(`1970-01-01T${formData.closingTime}`).getHours()
      : 0;
    const closeMinute = formData.closingTime
      ? new Date(`1970-01-01T${formData.closingTime}`).getMinutes()
      : 0;

    const totalMinutes =
      closeHour * 60 + closeMinute - (startHour * 60 + startMinute);
    const totalHours =
      totalMinutes > 0
        ? `${Math.floor(totalMinutes / 60)}:${totalMinutes % 60}`
        : "";

    setFormData((prev) => ({
      ...prev,
      totalKm: totalKm >= 0 ? totalKm : "",
      totalHours: totalHours || "",
    }));
  }, [
    formData.startingKm,
    formData.closingKm,
    formData.startingTime,
    formData.closingTime,
  ]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      invoiceNumber: generateInvoiceNumber(),
    });

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
      agency: "Entrex",
      totalKm: "",
      totalHours: "",
    });
  };

  const generateInvoiceNumber = () => {
    return `INV-${Math.floor(Math.random() * 1000000)}`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="travel-entry-form"
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      {/* Row 1: Invoice Number, Date, Travel Agency */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="invoiceNumber">Invoice Number:</label>
          <input
            type="text"
            name="invoiceNumber"
            value={`STIV-${Math.floor(Math.random() * 1000000)}`}
            disabled
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

      {/* Row 4: Starting Km, Closing Km, Total Km */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startingKm">Starting Km:</label>
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
          <label htmlFor="closingKm">Closing Km:</label>
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
          <label htmlFor="totalKm">Total Km:</label>
          <input
            type="number"
            name="totalKm"
            value={formData.totalKm}
            onChange={handleChange}
            disabled={!formData.totalKm}
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
      </div>

      {/* Row 5: Starting Time, Closing Time, Total Hours */}
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
            onChange={handleChange}
            disabled={!formData.totalHours}
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
      </div>

      {/* Row 6: Toll Fee, Parking Fee */}
      <div className="form-row">
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
            <option value="Pickup-Drop">Pickup-Drop</option>
          </select>
        </div>
      </div>

      {/* Row 7: Purpose */}
      <div className="form-row btn">
       <button className="submit-btn" type="submit">
        Submit
      </button>

      <button className="print-btn" type="print">
        Print
      </button> 
      </div>
      
      
    </form>
  );
};

export default TravelEntryForm;
