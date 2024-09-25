import React, { useState } from "react";
import TravelEntryForm from "./components/TravelEntryForm";
import LoginForm from "./components/LoginForm"; // Ensure this import is correct
import './components/TravelEntryForm.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Handle form submission
  const handleFormSubmit = (data) => {
    console.log("Form Submitted:", data);
    // You can add your API call here
  };

  // Handle login status
  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };

  return (
    <div className="App">
      <div className="container">
        <h1 className="tittle">SIXTEN TRAVELS</h1>
        <p className="motto">#Our Customer is our First Child</p>
      </div>
      {isLoggedIn ? (
        <TravelEntryForm onSubmit={handleFormSubmit} />
      ) : (
        <LoginForm onSubmit={handleLogin} />
      )}
    </div>
  );
};

export default App;
