import React, { useState } from "react";
import './LoginForm.css';

const LoginForm = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Basic validation
    if (!username || !password) {
      setError("Both fields are required.");
      return;
    }

    // Debugging output
    console.log('Entered Username:', username);
    console.log('Entered Password:', password);
    console.log('Expected Username:', import.meta.env.VITE_USERNAME);
    console.log('Expected Password:', import.meta.env.VITE_PASSWORD);

    // Check credentials against environment variables
    if (username !== import.meta.env.VITE_USERNAME || password !== import.meta.env.VITE_PASSWORD) {
      setError("Invalid username or password.");
      return;
    }

    setError(""); // Clear any previous error

    // Call the onSubmit function passed as a prop
    onSubmit(true); // Update login status to true

    // Clear the form fields after submission
    setUsername("");
    setPassword("");
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
