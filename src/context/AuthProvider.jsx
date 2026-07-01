import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

const BASE_URL = 'http://localhost:5000';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Register — POST /register
    const registerUser = async (username, email, password) => {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // httpOnly cookie
            body: JSON.stringify({ username, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        setUser(data.user || data);
        setLoading(false);
        return data;
    };

    // Login — POST /login
    const signInUser = async (email, password) => {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // httpOnly cookie
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        const userData = data.user || data;
        setUser(userData);
        setLoading(false);
        return userData;
    };

    // Logout — clears user state (backend can clear cookie too)
    const logoutUser = async () => {
        try {
            await fetch(`${BASE_URL}/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (_) {
            // ignore if no logout endpoint
        }
        setUser(null);
    };

    // Check if already logged in (on page refresh)
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${BASE_URL}/me`, {
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    // handle both { user: {...} } and direct object
                    setUser(data.user || data);
                }
            } catch (_) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const authInfo = {
        user,
        loading,
        registerUser,
        signInUser,
        logoutUser,
    };

    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;
