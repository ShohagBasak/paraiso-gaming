import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import useAuth from './useAuth';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/notifications`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();

    if (!user) return;

    const token = localStorage.getItem('token');
    if (token) {
      const socket = io(BASE_URL, { auth: { token } });
      socketRef.current = socket;

      socket.on('new-notification', (notif) => {
        setNotifications(prev => [notif, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Show Real-time Toast Popup (deduplicated by notification id)
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-sm w-full bg-[#0d1117] border border-cyan-500/40 rounded-2xl p-4 shadow-2xl flex items-start gap-3 pointer-events-auto font-sans`}
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0 font-bold text-lg">
              🔔
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">{notif.title}</h4>
              <p className="text-slate-400 text-xs mt-1 leading-snug truncate">{notif.message}</p>
              {notif.link && (
                <a
                  href={notif.link}
                  onClick={() => toast.dismiss(t.id)}
                  className="inline-block text-cyan-400 text-[11px] font-bold uppercase tracking-wider mt-2 hover:underline"
                >
                  View Details →
                </a>
              )}
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-slate-500 hover:text-slate-300 text-sm font-bold ml-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        ), { id: `notif-${notif.id}`, duration: 5000 });
      });

      socket.on('ticket-deleted', (data) => {
        const deletedId = data?.id;
        if (deletedId) {
          setNotifications(prev =>
            prev.filter(n => {
              const linkMatch = n.link && (
                n.link.includes(`id=${deletedId}`) ||
                n.link.includes(`/my-tickets/${deletedId}`)
              );
              const titleMatch = n.title && n.title.includes(`#${deletedId}`);
              return !(linkMatch || titleMatch);
            })
          );
          fetchNotifications();
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
        method: 'PUT',
        credentials: 'include'
      });
      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, is_read: 1 } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch(`${BASE_URL}/notifications/read-all`, {
        method: 'PUT',
        credentials: 'include'
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications
  };
};

export default useNotifications;
