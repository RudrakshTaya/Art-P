import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import './accInfo.css'
function AccountInfo() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    dateOfBirth: "",
    photo: null,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:5002/api/account/account-info", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(response.data);
        setFormData({
          username: response.data.username,
          dateOfBirth: response.data.dateOfBirth ? new Date(response.data.dateOfBirth).toISOString().split("T")[0] : "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch account info.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleUpdate = async () => {
    const updateRequests = [];
    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (formData.username !== userInfo.username) {
        updateRequests.push(
          axios.put("http://localhost:5002/api/account/update-username", { username: formData.username }, { headers }),
        );
      }

      if (formData.dateOfBirth && formData.dateOfBirth !== userInfo.dateOfBirth) {
        updateRequests.push(
          axios.put(
            "http://localhost:5002/api/account/update-dob",
            { dateOfBirth: new Date(formData.dateOfBirth).toISOString() },
            { headers },
          ),
        );
      }

      if (formData.photo) {
        const photoData = new FormData();
        photoData.append("profilePhoto", formData.photo);

        updateRequests.push(axios.put("http://localhost:5002/api/account/update-photo", photoData, { headers }));
      }

      await Promise.all(updateRequests);

      setEditMode(false);

      const response = await axios.get("http://localhost:5002/api/account/account-info", {
        headers,
      });
      setUserInfo(response.data);

      // Replace alert with toast notification
      const notification = document.createElement("div");
      notification.className = "toast-notification success";
      notification.innerText = "Account updated successfully!";
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add("hide");
        setTimeout(() => document.body.removeChild(notification), 500);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update account.");
      
      // Error notification
      const notification = document.createElement("div");
      notification.className = "toast-notification error";
      notification.innerText = err.response?.data?.message || "Failed to update account.";
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add("hide");
        setTimeout(() => document.body.removeChild(notification), 500);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="account-loader">
        <div className="loader"></div>
        <p>Loading your account information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="account-error">
        <div className="error-icon">!</div>
        <p>{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="account-container">
      <div className="account-card">
        <div className="account-header">
          <h2>My Account</h2>
          <p>Manage your personal information and preferences</p>
        </div>
        
        <div className="profile-section">
          <div className="profile-photo-container">
            <img 
              src={userInfo.photo || "https://via.placeholder.com/150"} 
              alt="Profile" 
              className="profile-photo" 
            />
            {editMode && (
              <label className="photo-edit-btn">
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                <span className="camera-icon">📷</span>
              </label>
            )}
          </div>
          
          <div className="account-greeting">
            <h3>Hello, {userInfo.fullName || userInfo.username}</h3>
            <p className="member-since">Member since {format(new Date(userInfo.createdAt || new Date()), "MMMM yyyy")}</p>
          </div>
        </div>

        <div className="account-tabs">
          <button className="tab-button active">Profile</button>
          <button className="tab-button">Orders</button>
          <button className="tab-button">Wishlist</button>
          <button className="tab-button">Addresses</button>
          <button className="tab-button">Payment Methods</button>
        </div>

        <div className="tab-content">
          {!editMode ? (
            <div className="account-info-grid">
              <div className="info-item">
                <div className="info-label">
                  <span className="info-icon">👤</span>
                  <span>Full Name</span>
                </div>
                <div className="info-value">{userInfo.fullName}</div>
              </div>

              <div className="info-item">
                <div className="info-label">
                  <span className="info-icon">🔖</span>
                  <span>Username</span>
                </div>
                <div className="info-value">{userInfo.username}</div>
              </div>

              <div className="info-item">
                <div className="info-label">
                  <span className="info-icon">✉️</span>
                  <span>Email</span>
                </div>
                <div className="info-value">{userInfo.email}</div>
              </div>

              <div className="info-item">
                <div className="info-label">
                  <span className="info-icon">📱</span>
                  <span>Phone</span>
                </div>
                <div className="info-value">{userInfo.phoneNumber || "Not provided"}</div>
              </div>

              <div className="info-item">
                <div className="info-label">
                  <span className="info-icon">🎂</span>
                  <span>Date of Birth</span>
                </div>
                <div className="info-value">
                  {userInfo.dateOfBirth ? format(new Date(userInfo.dateOfBirth), "MMMM d, yyyy") : "Not provided"}
                </div>
              </div>

              <div className="info-item">
                <div className="info-label">
                  <span className="info-icon">👑</span>
                  <span>Account Type</span>
                </div>
                <div className="info-value">{userInfo.role || "Customer"}</div>
              </div>
            </div>
          ) : (
            <div className="edit-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              
              <p className="form-note">
                Only username and date of birth can be updated. To change email or phone number, please contact customer support.
              </p>
            </div>
          )}
        </div>

        <div className="account-actions">
          {!editMode ? (
            <button className="edit-button" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button className="save-button" onClick={handleUpdate}>
                Save Changes
              </button>
              <button className="cancel-button" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="account-footer">
          <div className="recent-activity">
            <h4>Recent Activity</h4>
            <div className="activity-item">
              <div className="activity-icon order">📦</div>
              <div className="activity-details">
                <p>Order #12345 was delivered</p>
                <span className="activity-time">2 days ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon review">⭐</div>
              <div className="activity-details">
                <p>You reviewed Wireless Headphones</p>
                <span className="activity-time">1 week ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="account-sidebar">
        <div className="sidebar-section">
          <h3>Your Stats</h3>
          <div className="stat-item">
            <div className="stat-label">Orders</div>
            <div className="stat-value">12</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Reviews</div>
            <div className="stat-value">5</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Reward Points</div>
            <div className="stat-value">250</div>
          </div>
        </div>
        
        <div className="sidebar-section">
          <h3>Need Help?</h3>
          <ul className="help-links">
            <li><a href="#">Customer Support</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Return Policy</a></li>
            <li><a href="#">Privacy Settings</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AccountInfo;