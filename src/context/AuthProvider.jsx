import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Global fetch interceptor to append JWT token in headers
const originalFetch = window.fetch;
window.fetch = async (input, options = {}) => {
    const token = localStorage.getItem('token');
    
    // Determine the URL string depending on whether input is a string, URL, or Request object
    let urlStr = '';
    if (typeof input === 'string') {
        urlStr = input;
    } else if (input instanceof URL) {
        urlStr = input.toString();
    } else if (input && typeof input === 'object' && 'url' in input) {
        urlStr = input.url;
    }

    const apiHostname = (() => {
        try {
            return new URL(BASE_URL, window.location.origin).hostname;
        } catch (_) {
            return '';
        }
    })();

    const requestHostname = (() => {
        try {
            return new URL(urlStr, window.location.origin).hostname;
        } catch (_) {
            return '';
        }
    })();

    // Check if the request is to our API (same hostname, relative path, or non-http relative URL)
    const isApiRequest = requestHostname === apiHostname || urlStr.startsWith('/') || !urlStr.startsWith('http');
    
    if (token && isApiRequest) {
        if (input instanceof Request) {
            // If the input is a Request object, we must clone it and set the headers
            // to avoid mutating the original read-only headers.
            const headers = new Headers(input.headers);
            headers.set('Authorization', `Bearer ${token}`);
            
            // If options.headers exists, merge them as well
            if (options.headers) {
                if (options.headers instanceof Headers) {
                    options.headers.forEach((val, key) => headers.set(key, val));
                } else {
                    Object.entries(options.headers).forEach(([key, val]) => headers.set(key, val));
                }
            }
            
            const newRequest = new Request(input, { ...options, headers });
            return originalFetch(newRequest);
        } else {
            // If the input is a string or URL object, modify options.headers
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
    }
    return originalFetch(input, options);
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Register — POST /register (admin-managed, master only)
    const registerUser = async (username, email, password) => {
        const res = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
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

    // Public Register — POST /public-register (community users)
    const publicRegister = async (username, email, password) => {
        const res = await fetch(`${BASE_URL}/public-register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
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
            credentials: 'include',
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
                    if (res.status === 401 || res.status === 403) {
                        localStorage.removeItem('token');
                    }
                    setUser(null);
                }
            } catch (err) {
                console.error("Auth check failed due to network error:", err);
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
        publicRegister,
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
