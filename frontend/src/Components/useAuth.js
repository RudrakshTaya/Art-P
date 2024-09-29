import React, { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState(''); // State to hold user ID
    const [role, setRole] = useState(''); // State to hold user role

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            setIsLoggedIn(true);
            setUsername(parsedUser.username);
            setUserId(parsedUser.userId); // Retrieve user ID from local storage
            setRole(parsedUser.role); // Retrieve user role from local storage
        } else {
            setIsLoggedIn(false);
            setUsername('');
            setUserId(''); // Reset user ID
            setRole(''); // Reset role
        }
    }, []);

    const signIn = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setIsLoggedIn(true);
        setUsername(userData.username);
        setUserId(userData.userId); // Store user ID in state
        setRole(userData.role); // Store user role in state
    };

    const signOut = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUsername('');
        setUserId(''); // Clear user ID on sign-out
        setRole(''); // Clear role on sign-out
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, username, userId, role, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
