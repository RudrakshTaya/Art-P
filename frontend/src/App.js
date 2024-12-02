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

import ProfilePage from './Components/profilePage';

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
          <Route path="/products/type/Original Handmade Art and Decor" element={<Type1ProductsPage />} />
          <Route path="/products/type/Personalized Clothing and Accessories" element={<Type2ProductsPage />} />
          <Route path="/products/type/DIY Kits and Craft Materials" element={<Type3ProductsPage />} />
          <Route path="/products/type/Customized Home and Gift Items" element={<Type1ProductsPage />} />
          <Route path="/products/type/Sustainable and Upcycled Crafts" element={<Type2ProductsPage />} />
          <Route path="/products/type/Limited Edition Collaborative Products" element={<Type3ProductsPage />} />
          
          
          {/* Product Detail (public) */}
          <Route path="/products/:productId" element={<ProductDetail />} />
          
         
          
          {/* Confirmation (public route) */}
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/profile" element={<ProfilePage/>} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
