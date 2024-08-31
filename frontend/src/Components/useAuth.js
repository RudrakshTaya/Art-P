import { useState, useEffect } from 'react';

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            setIsLoggedIn(true);
            setUsername(parsedUser.username);
        } else {
            setIsLoggedIn(false);
            setUsername('');
        }
    }, []);

    const signIn = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setIsLoggedIn(true);
        setUsername(userData.username);
    };

    return { isLoggedIn, username, signIn };
};
