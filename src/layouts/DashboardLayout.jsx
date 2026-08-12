import { useState, useContext } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router';
import { Toaster, toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import {
    MdDashboard, MdImage, MdCampaign, MdLogout, MdMenu, MdClose, MdPeople, MdSupervisedUserCircle, MdHome, MdOutlineAccountBalance, MdGroup, MdQuestionAnswer, MdAccountTree, MdPersonAdd, MdVpnKey, MdStore, MdConfirmationNumber
} from 'react-icons/md';
import { FaGamepad, FaServer } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import NotificationDropdown from '../components/NotificationDropdown';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const navItems = [
    { to: '/dashboard', label: 'Overview', icon: <MdDashboard size={20} />, end: true },
    { to: '/dashboard/server-settings', label: 'Server Settings', icon: <FaServer size={20} />, permission: 'settings' },
    { to: '/dashboard/banners', label: 'Banner Slides', icon: <MdImage size={20} />, permission: 'banners' },
    { to: '/dashboard/announcements', label: 'Announcements', icon: <MdCampaign size={20} />, permission: 'announcements' },
    { to: '/dashboard/staff', label: 'Staff Roster', icon: <MdSupervisedUserCircle size={20} />, permission: 'staff' },
    { to: '/dashboard/roster', label: 'Faction Roster', icon: <MdOutlineAccountBalance size={20} />, permission: 'roster' },
    { to: '/dashboard/helper-roster', label: 'Helper Roster', icon: <MdGroup size={20} />, permission: 'helper-roster' },
    { to: '/dashboard/faqs', label: 'FAQ Manager', icon: <MdQuestionAnswer size={20} />, permission: 'faqs' },
    { to: '/dashboard/coc', label: 'CoC Manager', icon: <MdAccountTree size={20} />, permission: 'coc' },
    { to: '/dashboard/donate', label: 'Shop', icon: <MdStore size={20} />, permission: 'donate' },
    { to: '/dashboard/tickets', label: 'Tickets', icon: <MdConfirmationNumber size={20} />, permission: 'tickets' },
    { to: '/dashboard/users', label: 'Users', icon: <MdPeople size={20} />, permission: 'users' },
    { to: '/dashboard/create-user', label: 'Create User', icon: <MdPersonAdd size={20} />, masterOnly: true },
];

const DashboardLayout = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [resetting, setResetting] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate('/login');
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }
        setResetting(true);
        try {
            const res = await fetch(`${BASE_URL}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    email: user.email,
                    newPassword: newPassword
                })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Failed to reset password");
            }
            toast.success("Password reset successfully!");
            setShowResetModal(false);
            setNewPassword('');
        } catch (err) {
            toast.error(err.message || "Failed to reset password");
        } finally {
            setResetting(false);
        }
    };

    const filteredNavItems = navItems.filter(item => {
        if (item.masterOnly) return user?.role === 'master';
        if (!item.permission) return true;
        if (user?.role === 'master') return true;
        if (item.permission === 'users') return false; // strictly master only
        if (item.permission === 'tickets') return true; // Show Tickets menu for assigned admins & staff
        return user?.role === 'admin' && user?.permissions?.includes(item.permission);
    });

    const Sidebar = () => (
        <aside className="w-64 h-full bg-[#0d1117] border-r border-slate-800 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-slate-800">
                <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-9 h-9 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                        <FaGamepad className="text-cyan-400" size={18} />
                    </div>
                    <div>
                        <p className="text-white font-black text-sm uppercase tracking-wider">Paraiso</p>
                        <p className="text-cyan-400 text-xs font-mono">Admin Panel</p>
                    </div>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {filteredNavItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isActive
                                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`
                        }
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* User + Logout */}
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-3 py-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs uppercase">
                        {user?.username?.[0] || 'A'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-white text-xs font-semibold truncate">{user?.username}</p>
                        <p className="text-cyan-400 text-xs font-mono">{user?.role === 'master' ? 'Master Admin' : 'Admin'}</p>
                    </div>
                </div>
                {user?.role === 'master' && (
                    <button
                        onClick={() => {
                            setSidebarOpen(false);
                            setShowResetModal(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 mb-2 rounded-xl text-sm text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 transition-all duration-200"
                    >
                        <MdVpnKey size={18} />
                        Reset Password
                    </button>
                )}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                >
                    <MdLogout size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );

    return (
        <div className="min-h-screen bg-[#080d13] flex">
            <Toaster position="top-right" toastOptions={{ style: { background: '#0d1117', color: '#fff', border: '1px solid #1e293b' } }} />
            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 z-40">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    <div className="w-64 h-full flex flex-col">
                        <Sidebar />
                    </div>
                    <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Topbar */}
                <header className="h-16 bg-[#0d1117] border-b border-slate-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
                    <button
                        className="md:hidden text-slate-400 hover:text-white"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
                    </button>
                    <h1 className="text-white font-bold text-base md:text-lg uppercase tracking-wider">
                        Admin Dashboard
                    </h1>
                    <div className="flex items-center gap-3">
                        <NotificationDropdown />
                        <Link
                            to="/"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all duration-200"
                        >
                            <MdHome size={16} />
                            <span className="hidden sm:inline">Home</span>
                        </Link>
                        <span className="hidden sm:block text-slate-400 text-sm font-mono bg-slate-800/40 px-2.5 py-1 rounded-lg border border-slate-700/50">
                            {user?.email} <span className="text-cyan-400 ml-1.5">{user?.role === 'master' ? 'Master' : 'Admin'}</span>
                        </span>
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs uppercase">
                            {user?.username?.[0] || 'A'}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>

            {/* Reset Password Modal */}
            {showResetModal && user?.role === 'master' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-sm bg-[#0b0f15] border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden animate-in zoom-in duration-200">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                        
                        <div className="flex items-start gap-4 mb-4 mt-2">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 flex-shrink-0">
                                <MdVpnKey size={24} />
                            </div>
                            <div className="flex-grow min-w-0">
                                <h4 className="text-white font-bold uppercase tracking-wider text-base">Reset Own Password</h4>
                                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                                    Set a new password for <span className="text-amber-400 font-semibold">{user?.username}</span> ({user?.email})
                                </p>
                            </div>
                            <button 
                                onClick={() => {
                                    setShowResetModal(false);
                                    setNewPassword('');
                                }} 
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <MdClose size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleResetPassword}>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-[#080d13] border border-slate-800 focus:border-cyan-500 rounded-xl text-white text-sm focus:outline-none transition-all pr-10"
                                            placeholder="Enter new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                        >
                                            {showNewPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-6 border-t border-slate-800/60 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowResetModal(false);
                                        setNewPassword('');
                                    }}
                                    className="px-4 py-2 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-slate-300 text-xs font-bold uppercase tracking-wider transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={resetting}
                                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {resetting ? (
                                        <>
                                            <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                            Resetting...
                                        </>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardLayout;
