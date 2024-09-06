import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Shop from './Pages/Shop';
import Navbar from './Components/Navbar';
import Signin from './Components/Signin';
import Signup from './Components/Signup';
import Confirmation from './Components/Confirmation';
import ProjectDetailPage from './Pages/projectDeatil'; // Ensure this import matches your file name
import Cart from './Components/Cart'; // New import for the cart page
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
          <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />
         {/*  <Route path="/cart" element={<Cart />} /> Cart route */}
          <Route path="/confirmation" element={<Confirmation/>} /> {/* Cart route */}
          

          
        </Routes>
      </main>
    </Router>
  );
};

export default App;
