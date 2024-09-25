import React from "react";
import TravelEntryForm from "./components/TravelEntryForm";
import './components/TravelEntryForm.css';
const App = () => {
  // Handle form submission
  const handleFormSubmit = (data) => {
    console.log("Form Submitted:", data);

    // Here you can send the form data to the backend
    // For example, make an API call to store data in MongoDB or Google Sheets
    // fetch('/api/submit', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
  };

  return (
    <div className="App">
    <div className="container">
      <h1 className="tittle"> SIXTEN TRAVELS </h1>
      <p className="motto">#Our Customer is our First Child</p>
    </div>
      <TravelEntryForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default App;
