import React, { createContext, useContext, useState, useEffect } from 'react';

const UcpContext = createContext(null);
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const UcpProvider = ({ children }) => {
  const [ucpPlayer, setUcpPlayer] = useState(() => {
    try {
      const savedUser = localStorage.getItem('ucp_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [ucpStats, setUcpStats] = useState(() => {
    try {
      const savedStats = localStorage.getItem('ucp_stats');
      return savedStats ? JSON.parse(savedStats) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(!ucpPlayer);

  // Check active UCP session on mount & periodically every 5 seconds
  useEffect(() => {
    checkUcpSession();

    const interval = setInterval(() => {
      const token = localStorage.getItem('ucp_token');
      if (token) checkUcpSession();
    }, 5000);

    const handleFocus = () => {
      const token = localStorage.getItem('ucp_token');
      if (token) checkUcpSession();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const checkUcpSession = async () => {
    try {
      const token = localStorage.getItem('ucp_token');
      if (!token) {
        setUcpPlayer(null);
        setUcpStats(null);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/ucp/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setUcpPlayer(data.user);
        localStorage.setItem('ucp_user', JSON.stringify(data.user));
        fetchUcpStats(token, data.user);
      } else if (res.status === 401 || res.status === 403 || res.status === 404) {
        localStorage.removeItem('ucp_token');
        localStorage.removeItem('ucp_user');
        localStorage.removeItem('ucp_stats');
        setUcpPlayer(null);
        setUcpStats(null);
      } else {
        fetchUcpStats(token, ucpPlayer);
      }
    } catch (err) {
      console.error("Failed to check UCP session:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUcpStats = async (overrideToken, fallbackUser) => {
    try {
      const token = overrideToken || localStorage.getItem('ucp_token');
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/api/ucp/stats?_t=${Date.now()}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setUcpStats(data.stats);
        localStorage.setItem('ucp_stats', JSON.stringify(data.stats));
      } else if (res.status === 401 || res.status === 403 || res.status === 404) {
        localStorage.removeItem('ucp_token');
        localStorage.removeItem('ucp_user');
        localStorage.removeItem('ucp_stats');
        setUcpPlayer(null);
        setUcpStats(null);
      } else if (fallbackUser && !ucpStats) {
        setUcpStats({ Username: fallbackUser.username, Level: fallbackUser.level || 1, ID: fallbackUser.id || 0 });
      }
    } catch (err) {
      console.error("Failed to fetch UCP stats:", err);
    }
  };

  const loginUcp = async (username, password) => {
    const res = await fetch(`${API_BASE_URL}/api/ucp/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'UCP login failed');
    }

    if (data.token) {
      localStorage.setItem('ucp_token', data.token);
    }
    if (data.user) {
      localStorage.setItem('ucp_user', JSON.stringify(data.user));
    }

    setUcpPlayer(data.user);
    await fetchUcpStats(data.token, data.user);
    return data;
  };

  const logoutUcp = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/ucp/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error("UCP logout error:", err);
    } finally {
      localStorage.removeItem('ucp_token');
      localStorage.removeItem('ucp_user');
      localStorage.removeItem('ucp_stats');
      setUcpPlayer(null);
      setUcpStats(null);
    }
  };

  return (
    <UcpContext.Provider
      value={{
        ucpPlayer,
        ucpStats,
        loading,
        loginUcp,
        logoutUcp,
        fetchUcpStats,
        checkUcpSession
      }}
    >
      {children}
    </UcpContext.Provider>
  );
};

export const useUcp = () => {
  const context = useContext(UcpContext);
  if (!context) {
    throw new Error('useUcp must be used within a UcpProvider');
  }
  return context;
};
