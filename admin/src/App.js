// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminSignup from './Pages/AdminSignup'; // Adjust the import based on your folder structure
import AdminSignin from './Pages/AdminSignin'; // Adjust the import based on your folder structure
import AdminPanel from './Pages/AdminPanel'; // Your existing Admin Panel component
import './App.css'; // Import any global styles

const App = () => {
  return (
    <Router>
      <div className="app">
        <h1>Admin Dashboard</h1>
        <Routes>
          <Route path="/signup" element={<AdminSignup />} />
          <Route path="/signin" element={<AdminSignin />} />
          <Route path="/panel" element={<AdminPanel />} />
          {/* Redirect to sign-in if no route matches */}
          <Route path="/" element={<AdminSignin />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
