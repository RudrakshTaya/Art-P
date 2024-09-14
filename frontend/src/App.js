import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './Pages/Home';

import Shop from './Pages/Shop';
import Navbar from './Components/Navbar';
import Signin from './Components/Signin';
import Signup from './Components/Signup';
import Confirmation from './Components/Confirmation';
import ProjectDetailPage from './Pages/projectDeatil'; 
import Cart from './Components/Cart'; 
import './App.css';
import PrivateRoute from './Components/PrivateRoute'; 
import MenuPage from './Pages/menu';
import Type1ProductsPage from './Pages/Type1page';
import Type2ProductsPage from './Pages/Type2page ';
import Type3ProductsPage from './Pages/Type3page';
import ProductDetail from './Components/productDetailPage';
const App = () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuPage/>} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/shop" element={<PrivateRoute element={<Shop />} />} />
         <Route path="/products/type/Type-1" element={<Type1ProductsPage />} />
         <Route path="/products/type/Type-2" element={<Type2ProductsPage />} />
         <Route path="/products/type/Type-3" element={<Type3ProductsPage />} />
          <Route path="/shop/:Product_Id" element={<PrivateRoute element={<ProjectDetailPage />} />} />
          <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />
          <Route path="/products/:productId" element={<ProductDetail />} />

          <Route path="/confirmation" element={<Confirmation/>} /> {/* Cart route */}
          

          
        </Routes>
      </main>
    </Router>
  );
};

export default App;
