import { useState, useEffect, useContext } from 'react';
import { MdPeople, MdShield, MdPerson, MdSearch, MdDelete, MdHelpOutline } from 'react-icons/md';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const RoleBadge = ({ role }) => (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
        role === 'master'
            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
            : role === 'admin'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'bg-slate-700/50 text-slate-400 border border-slate-600/30'
    }`}>
        {role === 'master' ? <MdShield size={12} className="text-amber-400" /> : role === 'admin' ? <MdShield size={12} /> : <MdPerson size={12} />}
        {role}
    </span>
);

const permissionOptions = [
    { key: 'banners', label: '🖼️ Banners' },
    { key: 'announcements', label: '📢 Announcements' },
    { key: 'staff', label: '👥 Staff Roster' },
    { key: 'roster', label: '🛡️ Faction Roster' },
    { key: 'helper-roster', label: '🤝 Helper Roster' },
    { key: 'faqs', label: '❓ FAQ Manager' },
    { key: 'coc', label: '📜 CoC Manager' },
];

const UserManager = () => {
    const { user: currentAdmin } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null); // id of user being updated
    const [deleting, setDeleting] = useState(null); // id of user being deleted
    const [search, setSearch] = useState('');
    const [expandedUserId, setExpandedUserId] = useState(null);
    const [userPermissions, setUserPermissions] = useState({}); // userId -> array of permission keys
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null
    });

    const [error, setError] = useState('');

    const handleDeleteUser = (userId, username) => {
        if (userId === currentAdmin?.id) {
            toast.error("You cannot delete your own admin account.");
            return;
        }

        setConfirmModal({
            isOpen: true,
            title: 'Delete User Account',
            message: `Are you sure you want to permanently delete user "${username}"? This action cannot be undone.`,
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                setDeleting(userId);
                try {
                    const res = await fetch(`${BASE_URL}/users/${userId}`, {
                        method: 'DELETE',
                        credentials: 'include',
                      });
                      const data = await res.json();
                      if (!res.ok) {
                          throw new Error(data.message || 'Failed to delete user');
                      }
                      setUsers(prev => prev.filter(u => u.id !== userId));
                      toast.success(`User "${username}" deleted successfully!`);
                  } catch (err) {
                      toast.error(err.message || 'Failed to delete user');
                  } finally {
                      setDeleting(null);
                  }
              }
          });
      };

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
            if (!res.ok) throw new Error('Failed to update role');
            // Update local state
            setUsers(prev =>
                prev.map(u => u.id === userId ? { ...u, role: newRole } : u)
            );
            if (newRole !== 'admin') {
                if (expandedUserId === userId) {
                    setExpandedUserId(null);
                }
            }
            toast.success(`User role updated to "${newRole}" successfully!`);
        } catch (err) {
            toast.error(err.message || 'Failed to update role');
        } finally {
            setUpdating(null);
        }
    };

    const toggleExpand = async (userId) => {
        if (expandedUserId === userId) {
            setExpandedUserId(null);
        } else {
            setExpandedUserId(userId);
            if (!userPermissions[userId]) {
                try {
                    const res = await fetch(`${BASE_URL}/users/${userId}/permissions`, { credentials: 'include' });
                    if (res.ok) {
                        const perms = await res.json();
                        setUserPermissions(prev => ({ ...prev, [userId]: perms }));
                    }
                } catch (err) {
                    console.error("Failed to fetch permissions:", err);
                }
            }
        }
    };

    const handleTogglePermission = async (userId, permKey) => {
        const currentPerms = userPermissions[userId] || [];
        const isAdding = !currentPerms.includes(permKey);
        const updatedPerms = isAdding 
            ? [...currentPerms, permKey] 
            : currentPerms.filter(k => k !== permKey);
            
        setUserPermissions(prev => ({ ...prev, [userId]: updatedPerms }));
        
        try {
            const res = await fetch(`${BASE_URL}/users/${userId}/permissions`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ permissions: updatedPerms })
            });
            if (!res.ok) {
                throw new Error("Failed to save permissions");
            }
            toast.success(`Permissions updated successfully!`);
        } catch (err) {
            toast.error(err.message || "Failed to update permissions");
            setUserPermissions(prev => ({ ...prev, [userId]: currentPerms }));
        }
    };

    const handleToggleAllPermissions = async (userId) => {
        const currentPerms = userPermissions[userId] || [];
        const allKeys = permissionOptions.map(opt => opt.key);
        const shouldSelectAll = currentPerms.length !== allKeys.length;
        
        const updatedPerms = shouldSelectAll ? allKeys : [];
        
        setUserPermissions(prev => ({ ...prev, [userId]: updatedPerms }));
        
        try {
            const res = await fetch(`${BASE_URL}/users/${userId}/permissions`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ permissions: updatedPerms })
            });
            if (!res.ok) {
                throw new Error("Failed to save permissions");
            }
            toast.success(shouldSelectAll ? "All permissions granted!" : "All permissions removed!");
        } catch (err) {
            toast.error(err.message || "Failed to update permissions");
            setUserPermissions(prev => ({ ...prev, [userId]: currentPerms }));
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
                <p className="text-slate-400 text-sm mt-1">Configure user roles and granular feature permissions.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-black text-white">{users.length}</p>
                    <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Total Users</p>
                </div>
                <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-black text-amber-500">{users.filter(u => u.role === 'master').length}</p>
                    <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Master Admins</p>
                </div>
                <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-black text-cyan-400">{users.filter(u => u.role === 'admin').length}</p>
                    <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Sub Admins</p>
                </div>
                <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-black text-slate-400">{users.filter(u => u.role === 'user').length}</p>
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
                        <div className="col-span-3">Name</div>
                        <div className="col-span-3">Email</div>
                        <div className="col-span-2">Role</div>
                        <div className="col-span-3 text-right">Actions</div>
                    </div>

                    {/* Table Rows */}
                    {filteredUsers.map((u, index) => {
                        const isExpanded = expandedUserId === u.id;
                        return (
                            <div key={u.id} className="border-b border-slate-800/50 last:border-0">
                                <div
                                    className={`grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-slate-800/10 transition-colors ${
                                        u.id === currentAdmin?.id ? 'bg-cyan-500/5' : ''
                                    }`}
                                >
                                    {/* Index */}
                                    <div className="col-span-1 text-slate-600 text-xs font-mono">{index + 1}</div>

                                    {/* Name */}
                                    <div className="col-span-3 flex items-center gap-3 min-w-0">
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
                                    <div className="col-span-3 min-w-0">
                                        <p className="text-slate-300 text-sm truncate">{u.email}</p>
                                    </div>

                                    {/* Role Badge */}
                                    <div className="col-span-2">
                                        <RoleBadge role={u.role} />
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-3 flex items-center gap-2 justify-end">
                                        {u.id === currentAdmin?.id ? (
                                            <span className="text-slate-600 text-xs">—</span>
                                        ) : (
                                            <>
                                                {/* Role Dropdown */}
                                                <select
                                                    value={u.role}
                                                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                    disabled={updating === u.id || deleting === u.id}
                                                    className="bg-[#080d13] border border-slate-700 rounded-xl px-2 py-1.5 text-white text-xs font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer disabled:opacity-50"
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                    <option value="master">Master</option>
                                                </select>

                                                {/* Permissions Settings button */}
                                                {u.role === 'admin' && (
                                                    <button
                                                        onClick={() => toggleExpand(u.id)}
                                                        title="Feature Access Control"
                                                        className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all ${
                                                            isExpanded
                                                                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                                                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'
                                                        }`}
                                                    >
                                                        <MdShield size={16} />
                                                    </button>
                                                )}

                                                {/* Delete User */}
                                                <button
                                                    onClick={() => handleDeleteUser(u.id, u.username)}
                                                    disabled={updating === u.id || deleting === u.id}
                                                    title="Delete User"
                                                    className="w-9 h-9 flex items-center justify-center rounded-xl transition-all text-sm font-bold bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 disabled:opacity-50"
                                                >
                                                    {deleting === u.id ? (
                                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <MdDelete size={16} />
                                                    )}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Expandable Permissions Panel */}
                                {isExpanded && u.role === 'admin' && (
                                    <div className="px-14 py-4 bg-slate-900/30 border-t border-b border-slate-800/40">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                <span>🔧 Section Permissions for {u.username}</span>
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => handleToggleAllPermissions(u.id)}
                                                className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-all select-none animate-in fade-in duration-200"
                                            >
                                                { (userPermissions[u.id] || []).length === permissionOptions.length ? 'Deselect All' : 'Select All' }
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                            {permissionOptions.map(opt => {
                                                const hasPerm = userPermissions[u.id]?.includes(opt.key);
                                                return (
                                                    <label
                                                        key={opt.key}
                                                        className={`flex items-center gap-2 px-3 py-2 border rounded-xl cursor-pointer transition-all text-white text-xs select-none font-semibold ${
                                                            hasPerm 
                                                                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                                                                : 'bg-[#080d13] border-slate-700/50 hover:border-slate-600 text-slate-400'
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={hasPerm || false}
                                                            onChange={() => handleTogglePermission(u.id, opt.key)}
                                                            className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-900 cursor-pointer"
                                                        />
                                                        <span>{opt.label}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><MdShield size={12} className="text-cyan-400" /> = Manage Permissions</span>
                <span className="flex items-center gap-1.5"><MdDelete size={12} className="text-red-500" /> = Delete User</span>
            </div>

            {/* Custom Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md px-4">
                    <div className="bg-[#0b0f15] border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                        
                        <div className="flex items-start gap-4 mb-4 mt-2">
                            <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 flex-shrink-0">
                                <MdHelpOutline size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold uppercase tracking-wider text-base">{confirmModal.title}</h4>
                                <p className="text-slate-400 text-sm mt-2 leading-relaxed">{confirmModal.message}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-end gap-3 mt-6">
                            <button
                                onClick={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })}
                                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (confirmModal.onConfirm) confirmModal.onConfirm();
                                }}
                                className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-black rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                            >
                                Yes, Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManager;
