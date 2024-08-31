import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Shop from './Pages/Shop';
import Navbar from './Components/Navbar';
import Signin from './Components/Signin';
import Signup from './Components/Signup';
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/Signin" element={<Signin />} />
            <Route path="/Signup" element={<Signup />} />
          
          <Route path="*" element={<h2>404 Page Not Found</h2>} /> {/* Fallback route */}
        </Routes>
      </main>
    </Router>
  );
};

export default App;
