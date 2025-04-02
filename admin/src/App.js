import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './Pages/SideBar'; // Import Sidebar
import AdminSignup from './Pages/AdminSignup';
import AdminSignin from './Pages/AdminSignin';
import HomePage from './Pages/HomePage';
import ProductManagementPage from './Pages/ProductManagementPage';
import OrderManagementPage from './Pages/OrderManagementPage';
import EarningsOverviewPage from './Pages/EarningsOverviewPage';
import './App.css'; // Import global styles

const AppLayout = () => {
  const location = useLocation();
  
  // Hide Sidebar for sign-in and sign-up pages
  const hideSidebar = location.pathname === '/signin' || location.pathname === '/signup';

  return (
    <div className="app-container">
      {!hideSidebar && <Sidebar />} {/* Show Sidebar only when not on auth pages */}
      
      <div className="content">
        <Routes>
          <Route path="/signup" element={<AdminSignup />} />
          <Route path="/signin" element={<AdminSignin />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductManagementPage />} />
          <Route path="/orders" element={<OrderManagementPage />} />
          <Route path="/earnings" element={<EarningsOverviewPage />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
