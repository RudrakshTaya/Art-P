import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './profilePage.css';
import { useAuth } from './useAuth';

const ProfilePage = () => {
    const { userId, token } = useAuth(); // Access userId and token from AuthContext
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        profilePic: ''
    });
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user profile details
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`/api/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Send the JWT token for authentication
                    }
                });
                setUserData(response.data); // Assuming response.data contains user profile info
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch profile data", error);
                setIsLoading(false);
            }
        };

        if (userId) fetchUserProfile(); // Fetch data if userId is available
    }, [userId, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`/api/users/${userId}`, userData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Profile updated', response.data);
        } catch (error) {
            console.error("Failed to update profile data", error);
        }
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="profile-page">
            <h2>Profile</h2>
            <div className="profile-section">
                <div className="profile-image">
                    <img src={userData.profilePic || '/default-profile.png'} alt="Profile" />
                    <button className="upload-btn">Change Photo</button>
                </div>
                <div className="profile-info">
                    <label>Name</label>
                    <input type="text" name="name" value={userData.name} onChange={handleChange} />

                    <label>Email</label>
                    <input type="email" name="email" value={userData.email} disabled />

                    <label>Phone</label>
                    <input type="tel" name="phone" value={userData.phone} onChange={handleChange} />

                    <label>Address</label>
                    <input type="text" name="address" value={userData.address} onChange={handleChange} />

                    <button onClick={handleSave} className="save-btn">Save Changes</button>
                </div>
            </div>
            <div className="profile-links">
                <Link to="/orders">Order History</Link>
                <Link to="/wishlist">Wishlist</Link>
                <Link to="/addresses">Saved Addresses</Link>
                <Link to="/settings">Account Settings</Link>
            </div>
        </div>
    );
};

export default ProfilePage;
