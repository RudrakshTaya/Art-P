import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './Components/footer';
import Navbar from './Components/Navbar';
import PrivateRoute from './Components/PrivateRoute'; 

// Pages & Components
import Home from './Pages/Home';
import MenuPage from './Pages/menu';
import Signin from './Components/Signin';
import Signup from './Components/Signup';
import Confirmation from './Components/Confirmation';
import Cart from './Components/Cart'; 
import ResetPassword from './MAINcomponents/reset-pass';
import ForgotPassword from './MAINcomponents/forgot-pass';
import VerifyEmail from './MAINcomponents/verifyEmail';
import AccountInfo from './accManagement/accInfo';
import OrderHistory from './accManagement/orderHistory';
import WishlistPage from './accManagement/wishlist';
import Checkout from './MAINcomponents/checkout';

// Product Pages
import CategoryProductsPage from './Pages/ProductCategoryPage';

import ProductDetail from './Components/productDetailPage';

import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/products/:productId" element={<ProductDetail />} />

          {/* Account Management (Requires Authentication) */}
          <Route path="/account-info" element={<PrivateRoute element={<AccountInfo />} />} />
          <Route path="/order-history" element={<PrivateRoute element={<OrderHistory />} />} />
          <Route path="/wishlist" element={<PrivateRoute element={<WishlistPage />} />} />
          <Route path="/checkout" element={<PrivateRoute element={<Checkout />} />} />
          <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />

          {/* Dynamic Category Page */}
          <Route path="/products/type/:category" element={<CategoryProductsPage />} />


          
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
