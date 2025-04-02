import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaBox, 
  FaShoppingCart, 
  FaChartLine, 
  FaUsers, 
  FaExclamationTriangle,
  FaSearch,
  FaEye,
  FaBell,
  FaClipboardList,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import './HomePage.css';

const AdminDashboard = () => {
  // State management with default values
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('week');
  const [notifications, setNotifications] = useState([]);
  const [statComparison, setStatComparison] = useState({
    productsChange: 0,
    ordersChange: 0,
    revenueChange: 0,
    customersChange: 0
  });
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    lowStockProducts: 0
  });
  
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');
  
  // Helper functions for safe data access
  const safeGet = (obj, path, defaultValue = null) => {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (!result || typeof result !== 'object') return defaultValue;
      result = result[key];
      if (result === undefined) return defaultValue;
    }
    
    return result !== undefined ? result : defaultValue;
  };

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return '$0.00';
    return `$${value.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  const formatOrderId = (id) => {
    if (!id) return '#000000';
    return `#${id.slice(-6).toUpperCase()}`;
  };

  // Mock data generators
  const generateSalesData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    return months.map(month => ({
      name: month,
      sales: Math.floor(Math.random() * 7000) + 1000
    }));
  };

  const generateRevenueData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      name: day,
      revenue: Math.floor(Math.random() * 2000) + 800
    }));
  };

  const generateCategoryData = () => {
    const categories = ['Electronics', 'Clothing', 'Home', 'Sports', 'Other'];
    return categories.map(category => ({
      name: category,
      value: Math.floor(Math.random() * 30) + 5
    }));
  };

  // Dynamic data
  const [salesData, setSalesData] = useState(generateSalesData());
  const [revenueData, setRevenueData] = useState(generateRevenueData());
  const [categoryData, setCategoryData] = useState(generateCategoryData());
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  // Mock notifications
  const generateNotifications = () => {
    const types = ['order', 'stock', 'return', 'review'];
    const messages = [
      'New order received',
      'Product is low on stock',
      'Return request received',
      'New review from customer'
    ];
    const times = ['10 minutes ago', '2 hours ago', '1 day ago', '2 days ago'];
    
    return Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      type: types[i % types.length],
      message: `${messages[i % messages.length]} #${Math.floor(Math.random() * 10000)}`,
      time: times[i % times.length]
    }));
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/signin');
    } else {
      setNotifications(generateNotifications());
      fetchRecentProducts();
      fetchRecentOrders();
      fetchDashboardStats();
      
      // Refresh data periodically
      const interval = setInterval(() => {
        setSalesData(generateSalesData());
        setRevenueData(generateRevenueData());
        setCategoryData(generateCategoryData());
      }, 300000); // 5 minutes
      
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, navigate, timeRange]);

  const fetchRecentProducts = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }
      
      const response = await axios.get('http://localhost:5002/api/ad/admin/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const productsData = safeGet(response, 'data', []);
      setProducts(Array.isArray(productsData) ? productsData.slice(0, 5) : []);
      
      // Update stats based on products
      setStats(prev => ({
        ...prev,
        totalProducts: productsData.length || 0,
        lowStockProducts: productsData.filter(p => safeGet(p, 'stock', 0) < 10).length || 0
      }));
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to fetch recent products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }
      
      const response = await axios.get('http://localhost:5002/api/ad/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const ordersData = safeGet(response, 'data', []);
      setOrders(Array.isArray(ordersData) ? ordersData.slice(0, 5) : []);
      
      // Calculate order stats
      const totalRevenue = ordersData.reduce((sum, order) => sum + (safeGet(order, 'total', 0)), 0);
      const pendingOrders = ordersData.filter(order => safeGet(order, 'status', '') === 'pending').length;
      
      setStats(prev => ({
        ...prev,
        totalOrders: ordersData.length || 0,
        totalRevenue,
        pendingOrders
      }));
      
      // Calculate percentage changes (mock for now)
      setStatComparison({
        productsChange: (Math.random() * 15 - 5), // -5% to +10%
        ordersChange: (Math.random() * 20 - 5),   // -5% to +15%
        revenueChange: (Math.random() * 15 + 2),  // +2% to +17%
        customersChange: (Math.random() * 10 - 2) // -2% to +8%
      });
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to fetch recent orders. Please try again.');
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }
      
      const response = await axios.get('http://localhost:5002/api/ad/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
        params: { timeRange }
      });
      
      const statsData = safeGet(response, 'data', {});
      
      setStats(prev => ({
        ...prev,
        totalProducts: safeGet(statsData, 'totalProducts', prev.totalProducts),
        totalOrders: safeGet(statsData, 'totalOrders', prev.totalOrders),
        totalRevenue: safeGet(statsData, 'totalRevenue', prev.totalRevenue),
        pendingOrders: safeGet(statsData, 'pendingOrders', prev.pendingOrders),
        totalCustomers: safeGet(statsData, 'totalCustomers', prev.totalCustomers),
        lowStockProducts: safeGet(statsData, 'lowStockProducts', prev.lowStockProducts),
       
      }));
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      // Fallback to calculated stats from products and orders
    }
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  if (!isLoggedIn) {
    return (
      <div className="adm-login-redirect">
        <div className="adm-login-card">
          <h2>Please log in to access the admin dashboard.</h2>
          <p>You need to be authenticated to view and manage your store.</p>
          <button onClick={() => navigate('/signin')} className="adm-btn-primary">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-dashboard">
      <div className="adm-header">
        <div className="adm-greeting">
          <h1>Welcome to Your E-commerce Dashboard</h1>
          <p>Here's what's happening with your store today</p>
        </div>
        <div className="adm-header-actions">
          <div className="adm-search-bar">
            <FaSearch className="adm-search-icon" />
            <input 
              type="text" 
              placeholder="Search products, orders, customers..." 
              className="adm-search-input" 
            />
          </div>
          <div className="adm-notification-bell">
            <FaBell />
            {notifications.length > 0 && (
              <span className="adm-notification-badge">{notifications.length}</span>
            )}
            <div className="adm-notification-dropdown">
              <h3>Recent Notifications</h3>
              <div className="adm-notification-list">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div key={notification.id} className="adm-notification-item">
                      <p>{safeGet(notification, 'message', 'New notification')}</p>
                      <span>{safeGet(notification, 'time', 'Just now')}</span>
                    </div>
                  ))
                ) : (
                  <p className="adm-no-notifications">No new notifications</p>
                )}
              </div>
              <button className="adm-view-all-btn">View All Notifications</button>
            </div>
          </div>
        </div>
      </div>

      <div className="adm-time-filter">
        <span>Filter data by: </span>
        <button 
          className={`adm-time-btn ${timeRange === 'today' ? 'active' : ''}`}
          onClick={() => handleTimeRangeChange('today')}
        >
          Today
        </button>
        <button 
          className={`adm-time-btn ${timeRange === 'week' ? 'active' : ''}`}
          onClick={() => handleTimeRangeChange('week')}
        >
          This Week
        </button>
        <button 
          className={`adm-time-btn ${timeRange === 'month' ? 'active' : ''}`}
          onClick={() => handleTimeRangeChange('month')}
        >
          This Month
        </button>
        <button 
          className={`adm-time-btn ${timeRange === 'year' ? 'active' : ''}`}
          onClick={() => handleTimeRangeChange('year')}
        >
          This Year
        </button>
      </div>

      {/* Stats Cards */}
      <div className="adm-stats-container">
        <div className="adm-stat-card">
          <div className="adm-stat-icon adm-products">
            <FaBox />
          </div>
          <div className="adm-stat-details">
            <h3>Total Products</h3>
            <p className="adm-stat-number">{stats.totalProducts}</p>
            <div className={`adm-stat-change ${statComparison.productsChange >= 0 ? 'positive' : 'negative'}`}>
              {statComparison.productsChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              <span>{Math.abs(statComparison.productsChange).toFixed(1)}% from last period</span>
            </div>
          </div>
        </div>
        
        <div className="adm-stat-card">
          <div className="adm-stat-icon adm-orders">
            <FaShoppingCart />
          </div>
          <div className="adm-stat-details">
            <h3>Total Orders</h3>
            <p className="adm-stat-number">{stats.totalOrders}</p>
            <div className={`adm-stat-change ${statComparison.ordersChange >= 0 ? 'positive' : 'negative'}`}>
              {statComparison.ordersChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              <span>{Math.abs(statComparison.ordersChange).toFixed(1)}% from last period</span>
            </div>
          </div>
        </div>
        
        <div className="adm-stat-card">
          <div className="adm-stat-icon adm-revenue">
            <FaChartLine />
          </div>
          <div className="adm-stat-details">
            <h3>Total Revenue</h3>
            <p className="adm-stat-number">{formatCurrency(stats.totalRevenue)}</p>
            <div className={`adm-stat-change ${statComparison.revenueChange >= 0 ? 'positive' : 'negative'}`}>
              {statComparison.revenueChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              <span>{Math.abs(statComparison.revenueChange).toFixed(1)}% from last period</span>
            </div>
          </div>
        </div>
        
        <div className="adm-stat-card">
          <div className="adm-stat-icon adm-customers">
            <FaUsers />
          </div>
          <div className="adm-stat-details">
            <h3>Total Customers</h3>
            <p className="adm-stat-number">{stats.totalCustomers}</p>
            <div className={`adm-stat-change ${statComparison.customersChange >= 0 ? 'positive' : 'negative'}`}>
              {statComparison.customersChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              <span>{Math.abs(statComparison.customersChange).toFixed(1)}% from last period</span>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="adm-loading">
          <div className="adm-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : error ? (
        <div className="adm-error">
          <FaExclamationTriangle className="adm-error-icon" />
          <p className="adm-error-message">{error}</p>
          <button 
            onClick={() => {
              fetchRecentProducts();
              fetchRecentOrders();
              fetchDashboardStats();
            }} 
            className="adm-btn-primary"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Analytics Section */}
          <div className="adm-analytics-section">
            <div className="adm-chart-card">
              <div className="adm-card-header">
                <h2>Sales Overview</h2>
                <div className="adm-card-actions">
                  <FaCalendarAlt className="adm-card-icon" />
                  <span>Last 7 months</span>
                </div>
              </div>
              <div className="adm-chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="adm-chart-card">
              <div className="adm-card-header">
                <h2>Weekly Revenue</h2>
                <div className="adm-card-actions">
                  <FaCalendarAlt className="adm-card-icon" />
                  <span>Current week</span>
                </div>
              </div>
              <div className="adm-chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#10B981" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="adm-secondary-stats">
            <div className="adm-chart-card adm-category-chart">
              <div className="adm-card-header">
                <h2>Sales by Category</h2>
              </div>
              <div className="adm-chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="adm-alert-card">
              <div className="adm-card-header">
                <h2>Alerts</h2>
              </div>
              <div className="adm-alert-list">
                <div className="adm-alert-item">
                  <FaExclamationTriangle className="adm-alert-icon" />
                  <div className="adm-alert-content">
                    <h4>Low Stock Items</h4>
                    <p>{stats.lowStockProducts} product{stats.lowStockProducts !== 1 ? 's' : ''} running low on inventory</p>
                    <button className="adm-alert-action" onClick={() => navigate('/inventory')}>View Inventory</button>
                  </div>
                </div>
                <div className="adm-alert-item">
                  <FaClipboardList className="adm-alert-icon" />
                  <div className="adm-alert-content">
                    <h4>Pending Orders</h4>
                    <p>{stats.pendingOrders} order{stats.pendingOrders !== 1 ? 's' : ''} waiting to be processed</p>
                    <button className="adm-alert-action" onClick={() => navigate('/orders')}>Process Orders</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="adm-dashboard-sections">
            <section className="adm-recent-products adm-dashboard-card">
              <div className="adm-card-header">
                <h2>Recent Products</h2>
                <button className="adm-btn-outline" onClick={() => navigate('/products')}>
                  <FaEye className="adm-btn-icon" /> 
                  View All
                </button>
              </div>
              {products.length > 0 ? (
                <div className="adm-product-list">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => {
                        const productId = safeGet(product, '_id', '');
                        const productName = safeGet(product, 'name', 'Unnamed Product');
                        const productPrice = safeGet(product, 'price', 0);
                        const productStock = safeGet(product, 'stock', 0);
                        const productImage = safeGet(product, 'image', '');
                        
                        return (
                          <tr key={productId}>
                            <td className="adm-product-name">
                              <div className="adm-product-info">
                                <div className="adm-product-image">
                                  {productImage ? (
                                    <img src={productImage} alt={productName} />
                                  ) : (
                                    <div className="adm-product-placeholder"></div>
                                  )}
                                </div>
                                <span>{productName}</span>
                              </div>
                            </td>
                            <td>{formatCurrency(productPrice)}</td>
                            <td>{productStock}</td>
                            <td>
                              <span className={`adm-status-badge ${productStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                {productStock > 0 ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </td>
                            <td className="adm-actions">
                              <button 
                                className="adm-action-btn" 
                                onClick={() => navigate(`/products/edit/${productId}`)}
                                disabled={!productId}
                              >
                                Edit
                              </button>
                              <button 
                                className="adm-action-btn adm-view-btn" 
                                onClick={() => navigate(`/products/${productId}`)}
                                disabled={!productId}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="adm-no-data">
                  <p>No products found. <a href="/products/new">Add your first product</a></p>
                </div>
              )}
            </section>

            <section className="adm-recent-orders adm-dashboard-card">
              <div className="adm-card-header">
                <h2>Recent Orders</h2>
                <button className="adm-btn-outline" onClick={() => navigate('/orders')}>
                  <FaEye className="adm-btn-icon" /> 
                  View All
                </button>
              </div>
              {orders.length > 0 ? (
                <div className="adm-order-list">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => {
                        const orderId = safeGet(order, '_id', '');
                        const customerName = safeGet(order, 'customer.name', 'Anonymous');
                        const orderDate = safeGet(order, 'createdAt', '');
                        const orderTotal = safeGet(order, 'total', 0);
                        const orderStatus = safeGet(order, 'status', 'pending');
                        
                        return (
                          <tr key={orderId}>
                            <td>{formatOrderId(orderId)}</td>
                            <td>{customerName}</td>
                            <td>{formatDate(orderDate)}</td>
                            <td className="adm-order-total">{formatCurrency(orderTotal)}</td>
                            <td>
                              <span className={`adm-status-badge ${orderStatus}`}>
                                {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
                              </span>
                            </td>
                            <td className="adm-actions">
                              <button 
                                className="adm-action-btn" 
                                onClick={() => navigate(`/orders/edit/${orderId}`)}
                                disabled={!orderId}
                              >
                                Process
                              </button>
                              <button 
                                className="adm-action-btn adm-view-btn" 
                                onClick={() => navigate(`/orders/${orderId}`)}
                                disabled={!orderId}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="adm-no-data">
                  <p>No orders found yet.</p>
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;