import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { MdNotifications, MdCheckCircle, MdOutlineNotificationsNone } from 'react-icons/md';
import useNotifications from '../hooks/useNotifications';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleToggleDropdown = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState && unreadCount > 0) {
      markAllAsRead();
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggleDropdown}
        className="relative p-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all cursor-pointer focus:outline-none"
        title="Notifications"
      >
        <MdNotifications size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-black shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0d1117] border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 font-sans">
          {/* Header */}
          <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-bold text-xs uppercase tracking-wider">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 rounded-full text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-slate-400 hover:text-cyan-400 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <MdCheckCircle size={14} /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 space-y-2">
                <MdOutlineNotificationsNone className="mx-auto text-slate-600" size={32} />
                <p className="text-xs font-medium">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isUnread = !notif.is_read;
                return (
                  <div
                    key={notif.id}
                    className={`p-3.5 transition-colors flex items-start gap-3 hover:bg-slate-800/30 ${
                      isUnread ? 'bg-cyan-500/5' : ''
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${isUnread ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'}`} />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={notif.link || '#'}
                        onClick={() => {
                          markAllAsRead();
                          setIsOpen(false);
                        }}
                        className="block group"
                      >
                        <h4 className={`text-xs font-bold transition-colors ${isUnread ? 'text-white group-hover:text-cyan-400' : 'text-slate-300'}`}>
                          {notif.title}
                        </h4>
                        <p className="text-slate-400 text-xs mt-0.5 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          {formatTime(notif.created_at)}
                        </span>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
