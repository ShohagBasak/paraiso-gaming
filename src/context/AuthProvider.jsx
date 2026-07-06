import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Global fetch interceptor to append JWT token in headers
const originalFetch = window.fetch;
window.fetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const urlStr = url.toString();
    // Only attach token to requests intended for our API, not third-party APIs (like imgbb)
    const isApiRequest = urlStr.startsWith(BASE_URL) || urlStr.startsWith('/') || !urlStr.startsWith('http');
    
    if (token && isApiRequest) {
        if (!options.headers) {
            options.headers = {};
        }
        if (options.headers instanceof Headers) {
            options.headers.set('Authorization', `Bearer ${token}`);
        } else {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`
            };
        }
    }
    return originalFetch(url, options);
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Register — POST /register
    const registerUser = async (username, email, password) => {
        const res = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // fallback httpOnly cookie
            body: JSON.stringify({ username, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        setUser(data.user || data);
        return data;
    };

    // Login — POST /login
    const signInUser = async (email, password) => {
        const res = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // fallback httpOnly cookie
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        const userData = data.user || data;
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        setUser(userData);
        return userData;
    };

    // Logout — clears user state
    const logoutUser = async () => {
        try {
            await fetch(`${BASE_URL}/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (_) {
            // ignore if no logout endpoint
        }
        localStorage.removeItem('token');
        setUser(null);
    };

    // Check if already logged in (on page refresh)
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`${BASE_URL}/me`, {
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user || data);
                } else {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            } catch (_) {
                localStorage.removeItem('token');
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
