import { useEffect, useState, useContext } from 'react';
import { MdImage, MdCampaign, MdTrendingUp, MdPeople, MdPeopleOutline, MdOutlineAccountBalance, MdPersonAdd, MdSupervisedUserCircle, MdQuestionAnswer, MdAccountTree, MdStore, MdConfirmationNumber } from 'react-icons/md';
import { Link } from 'react-router';
import { AuthContext } from '../../context/AuthContext';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const StatCard = ({ icon, label, value, color, to }) => (
    <Link to={to} className="block bg-[#0d1117] border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                {icon}
            </div>
            <MdTrendingUp className="text-slate-600 group-hover:text-cyan-400 transition-colors" size={20} />
        </div>
        <p className="text-3xl font-black text-white mb-1">{value}</p>
        <p className="text-slate-400 text-sm uppercase tracking-wider font-medium">{label}</p>
    </Link>
);

// All possible sections with their metadata
const ALL_SECTIONS = [
    {
        key: 'banners',
        to: '/dashboard/banners',
        label: 'Banner Slides',
        actionLabel: 'Add Banner Slide',
        icon: <MdImage className="text-cyan-400" size={24} />,
        actionIcon: <MdImage size={16} />,
        color: 'bg-cyan-500/10',
        actionClass: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20',
    },
    {
        key: 'announcements',
        to: '/dashboard/announcements',
        label: 'Announcements',
        actionLabel: 'Add Announcement',
        icon: <MdCampaign className="text-purple-400" size={24} />,
        actionIcon: <MdCampaign size={16} />,
        color: 'bg-purple-500/10',
        actionClass: 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20',
    },
    {
        key: 'staff',
        to: '/dashboard/staff',
        label: 'Staff Members',
        actionLabel: 'Manage Staff Team',
        icon: <MdSupervisedUserCircle className="text-emerald-400" size={24} />,
        actionIcon: <MdPeople size={16} />,
        color: 'bg-emerald-500/10',
        actionClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20',
    },
    {
        key: 'roster',
        to: '/dashboard/roster',
        label: 'Faction Roster',
        actionLabel: 'Faction Roster',
        icon: <MdOutlineAccountBalance className="text-amber-400" size={24} />,
        actionIcon: <MdOutlineAccountBalance size={16} />,
        color: 'bg-amber-500/10',
        actionClass: 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20',
    },
    {
        key: 'helper-roster',
        to: '/dashboard/helper-roster',
        label: 'Helper Roster',
        actionLabel: 'Helper Roster',
        icon: <MdPeopleOutline className="text-green-400" size={24} />,
        actionIcon: <MdPeopleOutline size={16} />,
        color: 'bg-green-500/10',
        actionClass: 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20',
    },
    {
        key: 'faqs',
        to: '/dashboard/faqs',
        label: 'FAQ Manager',
        actionLabel: 'FAQ Manager',
        icon: <MdQuestionAnswer className="text-sky-400" size={24} />,
        actionIcon: <MdQuestionAnswer size={16} />,
        color: 'bg-sky-500/10',
        actionClass: 'bg-sky-500/10 border-sky-500/30 text-sky-400 hover:bg-sky-500/20',
    },
    {
        key: 'coc',
        to: '/dashboard/coc',
        label: 'CoC Manager',
        actionLabel: 'CoC Manager',
        icon: <MdAccountTree className="text-rose-400" size={24} />,
        actionIcon: <MdAccountTree size={16} />,
        color: 'bg-rose-500/10',
        actionClass: 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20',
    },
    {
        key: 'donate',
        to: '/dashboard/donate',
        label: 'Donate Items',
        actionLabel: 'Donate Shop',
        icon: <MdStore className="text-indigo-400" size={24} />,
        actionIcon: <MdStore size={16} />,
        color: 'bg-indigo-500/10',
        actionClass: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20',
    },
    {
        key: 'tickets',
        to: '/dashboard/tickets',
        label: 'Tickets',
        actionLabel: 'View Tickets',
        icon: <MdConfirmationNumber className="text-orange-400" size={24} />,
        actionIcon: <MdConfirmationNumber size={16} />,
        color: 'bg-orange-500/10',
        actionClass: 'bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20',
    },
];

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [counts, setCounts] = useState({});
    const [loading, setLoading] = useState(true);

    // Determine which sections this user can access
    const isMaster = user?.role === 'master';
    const visibleSections = isMaster
        ? ALL_SECTIONS
        : ALL_SECTIONS.filter(s => s.key === 'tickets' || user?.permissions?.includes(s.key));

    useEffect(() => {
        const fetchCounts = async () => {
            const endpoints = {
                banners: '/banners',
                announcements: '/announcements',
                staff: '/staff',
                'helper-roster': '/helper-roster',
                roster: '/roster',
                faqs: '/faqs',
                coc: '/chain-of-command',
                donate: '/donate-items',
                tickets: '/tickets',
            };

            // Only fetch for sections this user can see
            const keysToFetch = isMaster
                ? Object.keys(endpoints)
                : Object.keys(endpoints).filter(k => k === 'tickets' || user?.permissions?.includes(k));

            try {
                const results = await Promise.all(
                    keysToFetch.map(key =>
                        fetch(`${BASE_URL}${endpoints[key]}`, { credentials: 'include' })
                            .then(r => r.json())
                            .then(data => ({ key, count: Array.isArray(data) ? data.length : 0 }))
                            .catch(() => ({ key, count: 0 }))
                    )
                );
                const newCounts = {};
                results.forEach(({ key, count }) => { newCounts[key] = count; });
                setCounts(newCounts);
            } catch {
                // silent
            } finally {
                setLoading(false);
            }
        };
        fetchCounts();
    }, [user]);

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-wider">Overview</h2>
                <p className="text-slate-400 text-sm mt-1">Manage your server's content from here.</p>
            </div>

            {/* Stat Cards */}
            {loading ? (
                <div className="flex items-center gap-3 text-slate-400">
                    <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    Loading stats...
                </div>
            ) : visibleSections.length === 0 ? (
                <div className="bg-[#0d1117] border border-dashed border-slate-700 rounded-2xl p-10 text-center max-w-md">
                    <p className="text-slate-500 text-sm">No sections assigned yet.</p>
                    <p className="text-slate-600 text-xs mt-1">Contact Master Admin to get access.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl">
                    {visibleSections.map(sec => (
                        <StatCard
                            key={sec.key}
                            to={sec.to}
                            icon={sec.icon}
                            label={sec.label}
                            value={counts[sec.key] ?? 0}
                            color={sec.color}
                        />
                    ))}
                </div>
            )}

            {/* Quick Actions */}
            {visibleSections.length > 0 && (
                <div className="mt-10">
                    <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-3">
                        {visibleSections.map(sec => (
                            <Link
                                key={sec.key}
                                to={sec.to}
                                className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-all ${sec.actionClass}`}
                            >
                                {sec.actionIcon} {sec.actionLabel}
                            </Link>
                        ))}
                        {isMaster && (
                            <Link
                                to="/dashboard/create-user"
                                className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-sm font-medium hover:bg-amber-500/20 transition-all"
                            >
                                <MdPersonAdd size={16} /> Create User
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
