import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaChartLine, 
  FaCog, 
  FaSignOutAlt,
  FaBars,
  FaAngleRight
} from 'react-icons/fa';
import './SideBar.css';

const EcommerceSidebar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile !== isMobile) {
        setIsCollapsed(mobile);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      navigate('/signin');
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (isMobile) {
      setShowOverlay(!isCollapsed);
    }
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsCollapsed(true);
      setShowOverlay(false);
    }
  };

  return (
    <>
      {showOverlay && (
        <div className="ecommerce-sidebar-overlay" onClick={closeSidebar}></div>
      )}
      
      <div className={`ecommerce-sidebar ${isCollapsed ? 'ecommerce-sidebar--collapsed' : ''}`}>
        <div className="ecommerce-sidebar__header">
          <div className="ecommerce-sidebar__brand">
            {!isCollapsed && <h2 className="ecommerce-sidebar__title">ShopAdmin</h2>}
            
          </div>
          <button 
            className="ecommerce-sidebar__toggle" 
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <FaBars /> : <FaAngleRight />}
          </button>
        </div>

        <div className="ecommerce-sidebar__content">
          <nav className="ecommerce-sidebar__nav">
            <ul className="ecommerce-sidebar__menu">
              <li className="ecommerce-sidebar__item">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `ecommerce-sidebar__link ${isActive ? "ecommerce-sidebar__link--active" : ""}`
                  }
                  onClick={isMobile ? closeSidebar : undefined}
                >
                  <FaHome className="ecommerce-sidebar__icon" />
                  <span className="ecommerce-sidebar__label">Dashboard</span>
                </NavLink>
              </li>
              <li className="ecommerce-sidebar__item">
                <NavLink 
                  to="/products" 
                  className={({ isActive }) => 
                    `ecommerce-sidebar__link ${isActive ? "ecommerce-sidebar__link--active" : ""}`
                  }
                  onClick={isMobile ? closeSidebar : undefined}
                >
                  <FaBox className="ecommerce-sidebar__icon" />
                  <span className="ecommerce-sidebar__label">Products</span>
                </NavLink>
              </li>
              <li className="ecommerce-sidebar__item">
                <NavLink 
                  to="/orders" 
                  className={({ isActive }) => 
                    `ecommerce-sidebar__link ${isActive ? "ecommerce-sidebar__link--active" : ""}`
                  }
                  onClick={isMobile ? closeSidebar : undefined}
                >
                  <FaShoppingCart className="ecommerce-sidebar__icon" />
                  <span className="ecommerce-sidebar__label">Orders</span>
                </NavLink>
              </li>
              <li className="ecommerce-sidebar__item">
                <NavLink 
                  to="/customers" 
                  className={({ isActive }) => 
                    `ecommerce-sidebar__link ${isActive ? "ecommerce-sidebar__link--active" : ""}`
                  }
                  onClick={isMobile ? closeSidebar : undefined}
                >
                  <FaUsers className="ecommerce-sidebar__icon" />
                  <span className="ecommerce-sidebar__label">Customers</span>
                </NavLink>
              </li>
              <li className="ecommerce-sidebar__item">
                <NavLink 
                  to="/earnings" 
                  className={({ isActive }) => 
                    `ecommerce-sidebar__link ${isActive ? "ecommerce-sidebar__link--active" : ""}`
                  }
                  onClick={isMobile ? closeSidebar : undefined}
                >
                  <FaChartLine className="ecommerce-sidebar__icon" />
                  <span className="ecommerce-sidebar__label">Earnings</span>
                </NavLink>
              </li>
              <li className="ecommerce-sidebar__item">
                <NavLink 
                  to="/settings" 
                  className={({ isActive }) => 
                    `ecommerce-sidebar__link ${isActive ? "ecommerce-sidebar__link--active" : ""}`
                  }
                  onClick={isMobile ? closeSidebar : undefined}
                >
                  <FaCog className="ecommerce-sidebar__icon" />
                  <span className="ecommerce-sidebar__label">Settings</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        <div className="ecommerce-sidebar__footer">
          <button 
            className="ecommerce-sidebar__logout" 
            onClick={handleLogout}
          >
            <FaSignOutAlt className="ecommerce-sidebar__icon" />
            <span className="ecommerce-sidebar__label">Logout</span>
          </button>
        </div>
      </div>
      
      {isMobile && isCollapsed && (
        <button 
          className="ecommerce-sidebar__mobile-toggle" 
          onClick={toggleSidebar}
          aria-label="Open Sidebar"
        >
          <FaBars />
        </button>
      )}
    </>
  );
};

export default EcommerceSidebar;