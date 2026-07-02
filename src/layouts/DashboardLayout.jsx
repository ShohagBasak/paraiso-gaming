import { useState, useContext } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import {
    MdDashboard, MdImage, MdCampaign, MdLogout, MdMenu, MdClose, MdPeople, MdSupervisedUserCircle, MdHome, MdOutlineAccountBalance
} from 'react-icons/md';
import { FaGamepad } from 'react-icons/fa';

const navItems = [
    { to: '/dashboard', label: 'Overview', icon: <MdDashboard size={20} />, end: true },
    { to: '/dashboard/banners', label: 'Banner Slides', icon: <MdImage size={20} /> },
    { to: '/dashboard/announcements', label: 'Announcements', icon: <MdCampaign size={20} /> },
    { to: '/dashboard/staff', label: 'Staff Roster', icon: <MdSupervisedUserCircle size={20} /> },
    { to: '/dashboard/roster', label: 'Faction Roster', icon: <MdOutlineAccountBalance size={20} /> },
    { to: '/dashboard/users', label: 'Users', icon: <MdPeople size={20} /> },
];

const DashboardLayout = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate('/login');
    };

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
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
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
                        <p className="text-cyan-400 text-xs font-mono">Admin</p>
                    </div>
                </div>
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
            <Toaster toastOptions={{ style: { background: '#0d1117', color: '#fff', border: '1px solid #1e293b' } }} />
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
                        <Link
                            to="/"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all duration-200"
                        >
                            <MdHome size={16} />
                            <span className="hidden sm:inline">Home</span>
                        </Link>
                        <span className="hidden sm:block text-slate-400 text-sm">{user?.email}</span>
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
        </div>
    );
};

export default DashboardLayout;
