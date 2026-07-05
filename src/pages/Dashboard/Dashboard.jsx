import { useEffect, useState } from 'react';
import { MdImage, MdCampaign, MdTrendingUp, MdPeople, MdPeopleOutline, MdOutlineAccountBalance } from 'react-icons/md';
import { Link } from 'react-router';

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

const Dashboard = () => {
    const [bannerCount, setBannerCount] = useState(0);
    const [announcementCount, setAnnouncementCount] = useState(0);
    const [staffCount, setStaffCount] = useState(0);
    const [helperRosterCount, setHelperRosterCount] = useState(0);
    const [factionRosterCount, setFactionRosterCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [b, a, s, hr, fr] = await Promise.all([
                    fetch(`${BASE_URL}/banners`, { credentials: 'include' }).then(r => r.json()),
                    fetch(`${BASE_URL}/announcements`, { credentials: 'include' }).then(r => r.json()),
                    fetch(`${BASE_URL}/staff`, { credentials: 'include' }).then(r => r.json()),
                    fetch(`${BASE_URL}/helper-roster`, { credentials: 'include' }).then(r => r.json()),
                    fetch(`${BASE_URL}/roster`, { credentials: 'include' }).then(r => r.json()),
                ]);
                setBannerCount(Array.isArray(b) ? b.length : 0);
                setAnnouncementCount(Array.isArray(a) ? a.length : 0);
                setStaffCount(Array.isArray(s) ? s.length : 0);
                setHelperRosterCount(Array.isArray(hr) ? hr.length : 0);
                setFactionRosterCount(Array.isArray(fr) ? fr.length : 0);
            } catch {
                // silent
            } finally {
                setLoading(false);
            }
        };
        fetchCounts();
    }, []);

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
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-6xl">
                    <StatCard
                        to="/dashboard/banners"
                        icon={<MdImage className="text-cyan-400" size={24} />}
                        label="Banner Slides"
                        value={bannerCount}
                        color="bg-cyan-500/10"
                    />
                    <StatCard
                        to="/dashboard/announcements"
                        icon={<MdCampaign className="text-purple-400" size={24} />}
                        label="Announcements"
                        value={announcementCount}
                        color="bg-purple-500/10"
                    />
                    <StatCard
                        to="/dashboard/staff"
                        icon={<MdPeople className="text-emerald-400" size={24} />}
                        label="Staff Members"
                        value={staffCount}
                        color="bg-emerald-500/10"
                    />
                    <StatCard
                        to="/dashboard/roster"
                        icon={<MdOutlineAccountBalance className="text-amber-400" size={24} />}
                        label="Faction Roster"
                        value={factionRosterCount}
                        color="bg-amber-500/10"
                    />
                    <StatCard
                        to="/dashboard/helper-roster"
                        icon={<MdPeopleOutline className="text-green-400" size={24} />}
                        label="Helper Roster"
                        value={helperRosterCount}
                        color="bg-green-500/10"
                    />
                </div>
            )}

            {/* Quick Links */}
            <div className="mt-10">
                <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                    <Link
                        to="/dashboard/banners"
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl text-sm font-medium hover:bg-cyan-500/20 transition-all"
                    >
                        <MdImage size={16} /> Add Banner Slide
                    </Link>
                    <Link
                        to="/dashboard/announcements"
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-xl text-sm font-medium hover:bg-purple-500/20 transition-all"
                    >
                        <MdCampaign size={16} /> Add Announcement
                    </Link>
                    <Link
                        to="/dashboard/staff"
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm font-medium hover:bg-emerald-500/20 transition-all"
                    >
                        <MdPeople size={16} /> Manage Staff Team
                    </Link>
                    <Link
                        to="/dashboard/roster"
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-sm font-medium hover:bg-amber-500/20 transition-all"
                    >
                        <MdOutlineAccountBalance size={16} /> Faction Roster
                    </Link>
                    <Link
                        to="/dashboard/helper-roster"
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl text-sm font-medium hover:bg-green-500/20 transition-all"
                    >
                        <MdPeopleOutline size={16} /> Helper Roster
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
