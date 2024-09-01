import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Shop from './Pages/Shop';
import Navbar from './Components/Navbar';
import Signin from './Components/Signin';
import Signup from './Components/Signup';
import ProjectDetailPage from './Pages/projectDeatil'; // Ensure this import matches your file name

import './App.css';
import PrivateRoute from './Components/PrivateRoute'; // Import PrivateRoute

const App = () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/shop" element={<PrivateRoute element={<Shop />} />} />
          <Route path="/shop/:Product_Id" element={<PrivateRoute element={<ProjectDetailPage />} />} />
          
        </Routes>
      </main>
    </Router>
  );
};

export default App;
