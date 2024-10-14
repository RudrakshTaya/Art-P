import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './Pages/Home';
import Navbar from './Components/Navbar';
import Signin from './Components/Signin';
import Signup from './Components/Signup';
import Confirmation from './Components/Confirmation';
import Cart from './Components/Cart'; 
import './App.css';
import PrivateRoute from './Components/PrivateRoute'; 
import MenuPage from './Pages/menu';
import Type1ProductsPage from './Pages/Type1page';
import Type2ProductsPage from './Pages/Type2page ';
import Type3ProductsPage from './Pages/Type3page';
import ProductDetail from './Components/productDetailPage';
import AdminPanel from './Pages/AdminPanel';

const App = () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes (only logged-in users) */}
         
          <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />
          
          {/* Type-specific product routes (public) */}
          <Route path="/products/type/Type-1" element={<Type1ProductsPage />} />
          <Route path="/products/type/Type-2" element={<Type2ProductsPage />} />
          <Route path="/products/type/Type-3" element={<Type3ProductsPage />} />
          
          {/* Product Detail (public) */}
          <Route path="/products/:productId" element={<ProductDetail />} />
          
          {/* Admin Panel route (only accessible to admins) */}
          <Route
            path="/admin"
            element={<PrivateRoute element={<AdminPanel />} allowedRoles={['admin']} />}
          />
          
          {/* Confirmation (public route) */}
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
