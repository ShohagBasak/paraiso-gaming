import { useState, useEffect, useContext } from 'react';
import { MdPeople, MdShield, MdPerson, MdSearch } from 'react-icons/md';
import { AuthContext } from '../../context/AuthContext';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const RoleBadge = ({ role }) => (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
        role === 'admin'
            ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
            : 'bg-slate-700/50 text-slate-400 border border-slate-600/30'
    }`}>
        {role === 'admin' ? <MdShield size={12} /> : <MdPerson size={12} />}
        {role}
    </span>
);

const UserManager = () => {
    const { user: currentAdmin } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null); // id of user being updated
    const [search, setSearch] = useState('');

    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            setError('');
            const res = await fetch(`${BASE_URL}/users`, { credentials: 'include' });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || `HTTP ${res.status}`);
            }
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch users error:", err);
            setError(err.message || 'Failed to fetch users');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleRoleChange = async (userId, newRole) => {
        setUpdating(userId);
        try {
            const res = await fetch(`${BASE_URL}/users/${userId}/role`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ role: newRole }),
            });
            if (!res.ok) throw new Error('Failed');
            // Update local state
            setUsers(prev =>
                prev.map(u => u.id === userId ? { ...u, role: newRole } : u)
            );
        } catch {
            alert('Failed to update role');
        } finally {
            setUpdating(null);
        }
    };

    const filteredUsers = users.filter(u =>
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-wider">User Management</h2>
                <p className="text-slate-400 text-sm mt-1">View all users and assign admin roles.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-black text-white">{users.length}</p>
                    <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Total Users</p>
                </div>
                <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-black text-cyan-400">{users.filter(u => u.role === 'admin').length}</p>
                    <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Admins</p>
                </div>
                <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 text-center col-span-2 sm:col-span-1">
                    <p className="text-2xl font-black text-slate-300">{users.filter(u => u.role === 'user').length}</p>
                    <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Regular Users</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-5">
                <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#0d1117] border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600"
                />
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    ⚠️ {error}. Please try logging out and logging back in to ensure your admin permissions are refreshed.
                </div>
            )}

            {/* Users Table */}
            {loading ? (
                <div className="flex items-center gap-3 text-slate-400 py-8">
                    <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    Loading users...
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="bg-[#0d1117] border border-dashed border-slate-700 rounded-2xl p-10 text-center">
                    <MdPeople className="text-slate-600 mx-auto mb-3" size={40} />
                    <p className="text-slate-500 text-sm">{search ? 'No users match your search.' : 'No users found.'}</p>
                </div>
            ) : (
                <div className="bg-[#0d1117] border border-slate-800 rounded-2xl overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-slate-800/30 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                        <div className="col-span-1">#</div>
                        <div className="col-span-4">Name</div>
                        <div className="col-span-4">Email</div>
                        <div className="col-span-2">Role</div>
                        <div className="col-span-1">Action</div>
                    </div>

                    {/* Table Rows */}
                    {filteredUsers.map((u, index) => (
                        <div
                            key={u.id}
                            className={`grid grid-cols-12 gap-4 px-5 py-4 items-center border-b border-slate-800/50 last:border-0 hover:bg-slate-800/20 transition-colors ${
                                u.id === currentAdmin?.id ? 'bg-cyan-500/5' : ''
                            }`}
                        >
                            {/* Index */}
                            <div className="col-span-1 text-slate-600 text-xs font-mono">{index + 1}</div>

                            {/* Name */}
                            <div className="col-span-4 flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs uppercase flex-shrink-0">
                                    {u.username?.[0] || '?'}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-white text-sm font-semibold truncate">
                                        {u.username}
                                        {u.id === currentAdmin?.id && (
                                            <span className="ml-2 text-cyan-400 text-xs">(You)</span>
                                        )}
                                    </p>
                                    <p className="text-slate-600 text-xs font-mono">ID: {u.id}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="col-span-4 min-w-0">
                                <p className="text-slate-300 text-sm truncate">{u.email}</p>
                            </div>

                            {/* Role Badge */}
                            <div className="col-span-2">
                                <RoleBadge role={u.role} />
                            </div>

                            {/* Role Toggle */}
                            <div className="col-span-1">
                                {u.id === currentAdmin?.id ? (
                                    <span className="text-slate-600 text-xs">—</span>
                                ) : (
                                    <button
                                        onClick={() => handleRoleChange(u.id, u.role === 'admin' ? 'user' : 'admin')}
                                        disabled={updating === u.id}
                                        title={u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                        className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all text-sm font-bold disabled:opacity-50 ${
                                            u.role === 'admin'
                                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                                                : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20'
                                        }`}
                                    >
                                        {updating === u.id ? (
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : u.role === 'admin' ? (
                                            '↓'
                                        ) : (
                                            <MdShield size={16} />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><MdShield size={12} className="text-cyan-400" /> = Make Admin</span>
                <span className="flex items-center gap-1.5"><span className="text-red-400 font-bold">↓</span> = Remove Admin</span>
            </div>
        </div>
    );
};

export default UserManager;
