import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import {
    MdPersonAdd, MdEmail, MdDelete, MdLock, MdPerson, MdShield, MdPlaylistAdd,
    MdCheckCircle, MdHelpOutline, MdSecurity
} from 'react-icons/md';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useForm } from 'react-hook-form';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const permissionOptions = [
    { key: 'banners',       label: '🖼️ Banners' },
    { key: 'announcements', label: '📢 Announcements' },
    { key: 'staff',         label: '👥 Staff Roster' },
    { key: 'roster',        label: '🛡️ Faction Roster' },
    { key: 'helper-roster', label: '🤝 Helper Roster' },
    { key: 'faqs',          label: '❓ FAQ Manager' },
    { key: 'coc',           label: '📜 CoC Manager' },
];

// ─── Confirm Modal ─────────────────────────────────────────────────
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md px-4">
            <div className="bg-[#0b0f15] border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                <div className="flex items-start gap-4 mb-4 mt-2">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 flex-shrink-0">
                        <MdHelpOutline size={24} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider text-base">{title}</h4>
                        <p className="text-slate-400 text-sm mt-2 leading-relaxed">{message}</p>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                    >
                        Yes, Remove
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────
const CreateUserManager = () => {
    const { user: currentAdmin } = useContext(AuthContext);

    // ── Whitelist state ──
    const [allowedEmails, setAllowedEmails] = useState([]);
    const [whitelistLoading, setWhitelistLoading] = useState(true);
    const [addingEmail, setAddingEmail] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [removingId, setRemovingId] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, email: '' });

    // ── Create user form state ──
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({ defaultValues: { role: 'admin' } });
    const [creatingUser, setCreatingUser] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [lastCreated, setLastCreated] = useState(null);

    // ── Permissions for the new user (only shown when role = admin) ──
    const [selectedPerms, setSelectedPerms] = useState([]);
    const selectedRole = watch('role');

    const togglePerm = (key) => {
        setSelectedPerms(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const toggleAllPerms = () => {
        const allKeys = permissionOptions.map(o => o.key);
        setSelectedPerms(prev => prev.length === allKeys.length ? [] : allKeys);
    };

    // ── Fetch whitelist ──
    const fetchAllowedEmails = async () => {
        setWhitelistLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/allowed-emails`, { credentials: 'include' });
            const data = await res.json();
            if (res.ok) setAllowedEmails(Array.isArray(data) ? data : []);
            else toast.error(data.message || 'Failed to fetch whitelist');
        } catch {
            toast.error('Network error. Could not fetch whitelist.');
        } finally {
            setWhitelistLoading(false);
        }
    };

    useEffect(() => { fetchAllowedEmails(); }, []);

    // ── Add email to whitelist ──
    const handleAddEmail = async (e) => {
        e.preventDefault();
        const trimmed = newEmail.trim().toLowerCase();
        if (!trimmed || !trimmed.includes('@')) {
            toast.error('Please enter a valid email address.');
            return;
        }
        setAddingEmail(true);
        try {
            const res = await fetch(`${BASE_URL}/allowed-emails`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email: trimmed })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(`"${trimmed}" added to whitelist!`);
                setAllowedEmails(prev => [{ id: data.id, email: data.email, created_at: new Date().toISOString() }, ...prev]);
                setNewEmail('');
            } else {
                toast.error(data.message || 'Failed to add email.');
            }
        } catch {
            toast.error('Network error. Please try again.');
        } finally {
            setAddingEmail(false);
        }
    };

    // ── Remove email from whitelist ──
    const handleRemoveEmail = (id, email) => {
        setConfirmModal({ isOpen: true, id, email });
    };

    const confirmRemove = async () => {
        const { id, email } = confirmModal;
        setConfirmModal({ isOpen: false, id: null, email: '' });
        setRemovingId(id);
        try {
            const res = await fetch(`${BASE_URL}/allowed-emails/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(`"${email}" removed from whitelist.`);
                setAllowedEmails(prev => prev.filter(e => e.id !== id));
            } else {
                toast.error(data.message || 'Failed to remove email.');
            }
        } catch {
            toast.error('Network error. Please try again.');
        } finally {
            setRemovingId(null);
        }
    };

    // ── Create new user ──
    const handleCreateUser = async (data) => {
        setCreatingUser(true);
        try {
            const res = await fetch(`${BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    username: data.username,
                    email: data.email.trim().toLowerCase(),
                    password: data.password,
                    role: data.role,
                    permissions: data.role === 'admin' ? selectedPerms : [],
                })
            });
            const result = await res.json();
            if (res.ok) {
                toast.success(`User "${data.username}" created successfully!`);
                setLastCreated({ ...result.user, permissions: data.role === 'admin' ? selectedPerms : [] });
                reset({ role: 'admin' });
                setSelectedPerms([]);
                fetchAllowedEmails();
            } else {
                toast.error(result.message || 'Failed to create user.');
            }
        } catch {
            toast.error('Network error. Please try again.');
        } finally {
            setCreatingUser(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-8">
            {/* ── Header ─────────────────────────────────────────── */}
            <div className="mb-2">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                        <MdShield className="text-amber-400" size={22} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-wider">Create User</h2>
                        <p className="text-slate-500 text-xs font-mono">Master Admin Only</p>
                    </div>
                </div>
                <p className="text-slate-400 text-sm mt-1">
                    Whitelist an email first, then create a new user account with specific permissions.
                </p>
            </div>

            {/* ── Step 1: Email Whitelist ──────────────────────── */}
            <div className="bg-[#0d1117] border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/40">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-black text-xs">1</div>
                    <div>
                        <h3 className="text-white font-bold text-sm uppercase tracking-wider">Email Whitelist</h3>
                        <p className="text-slate-500 text-xs">Add emails that are allowed to be registered</p>
                    </div>
                    <span className="ml-auto text-cyan-400 text-xs font-mono bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-lg">
                        {allowedEmails.length} email{allowedEmails.length !== 1 ? 's' : ''}
                    </span>
                </div>

                <div className="p-6">
                    {/* Add Email Form */}
                    <form onSubmit={handleAddEmail} className="flex gap-3 mb-5">
                        <div className="relative flex-1">
                            <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="email"
                                value={newEmail}
                                onChange={e => setNewEmail(e.target.value)}
                                placeholder="Enter email to whitelist..."
                                className="w-full pl-10 pr-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all placeholder:text-slate-600"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={addingEmail || !newEmail.trim()}
                            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.35)] active:scale-95 whitespace-nowrap"
                        >
                            {addingEmail ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <MdPlaylistAdd size={18} />
                            )}
                            Add Email
                        </button>
                    </form>

                    {/* Whitelist Table */}
                    {whitelistLoading ? (
                        <div className="flex items-center gap-3 text-slate-400 py-6 justify-center">
                            <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm">Loading whitelist...</span>
                        </div>
                    ) : allowedEmails.length === 0 ? (
                        <div className="bg-slate-900/30 border border-dashed border-slate-700 rounded-xl p-8 text-center">
                            <MdEmail className="text-slate-600 mx-auto mb-2" size={32} />
                            <p className="text-slate-500 text-sm">No emails in whitelist.</p>
                            <p className="text-slate-600 text-xs mt-1">Add an email above to allow account creation.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {allowedEmails.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="flex items-center justify-between px-4 py-3 bg-[#080d13] border border-slate-800 rounded-xl group hover:border-cyan-500/20 transition-all"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                                            <MdEmail className="text-cyan-400" size={15} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-white text-sm font-medium truncate">{entry.email}</p>
                                            <p className="text-slate-600 text-xs font-mono">
                                                Added {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveEmail(entry.id, entry.email)}
                                        disabled={removingId === entry.id}
                                        title="Remove from whitelist"
                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 disabled:opacity-50 transition-all flex-shrink-0"
                                    >
                                        {removingId === entry.id ? (
                                            <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <MdDelete size={15} />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Step 2: Create User Form ──────────────────────── */}
            <div className="bg-[#0d1117] border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/40">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-black text-xs">2</div>
                    <div>
                        <h3 className="text-white font-bold text-sm uppercase tracking-wider">Create Account</h3>
                        <p className="text-slate-500 text-xs">Fill in the details and assign permissions</p>
                    </div>
                </div>

                <div className="p-6">
                    {/* Success Banner */}
                    {lastCreated && (
                        <div className="mb-6 flex items-start gap-3 px-4 py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                            <MdCheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5" size={20} />
                            <div className="flex-1">
                                <p className="text-emerald-400 text-sm font-bold">User Created Successfully!</p>
                                <p className="text-slate-400 text-xs mt-1">
                                    <span className="text-white font-semibold">{lastCreated.username}</span>
                                    {' '}({lastCreated.email}) — Role:{' '}
                                    <span className={`font-bold uppercase ${lastCreated.role === 'master' ? 'text-amber-400' : lastCreated.role === 'admin' ? 'text-cyan-400' : 'text-slate-400'}`}>
                                        {lastCreated.role}
                                    </span>
                                </p>
                                {lastCreated.permissions?.length > 0 && (
                                    <p className="text-slate-500 text-xs mt-1">
                                        Permissions: {lastCreated.permissions.join(', ')}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => setLastCreated(null)}
                                className="text-slate-500 hover:text-white text-xs"
                            >✕</button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-5">
                        {/* Email (select from whitelist) */}
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                                <MdEmail size={14} className="text-cyan-400" />
                                Email Address
                                <span className="text-red-400">*</span>
                            </label>
                            {allowedEmails.length > 0 ? (
                                <select
                                    {...register("email", { required: true })}
                                    className="w-full px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all cursor-pointer"
                                >
                                    <option value="">— Select a whitelisted email —</option>
                                    {allowedEmails.map(e => (
                                        <option key={e.id} value={e.email}>{e.email}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="px-4 py-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-amber-400 text-sm flex items-center gap-2">
                                    <MdEmail size={16} />
                                    No whitelisted emails. Add emails in Step 1 first.
                                </div>
                            )}
                            {errors.email?.type === "required" && (
                                <p role="alert" className="text-red-400 text-xs">Email is required.</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Username */}
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                                    <MdPerson size={14} className="text-cyan-400" />
                                    Username
                                    <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("username", { required: true, minLength: 3 })}
                                    className="w-full px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all placeholder:text-slate-600"
                                    placeholder="Enter username..."
                                />
                                {errors.username?.type === "required" && (
                                    <p role="alert" className="text-red-400 text-xs">Username is required.</p>
                                )}
                                {errors.username?.type === "minLength" && (
                                    <p role="alert" className="text-red-400 text-xs">At least 3 characters required.</p>
                                )}
                            </div>

                            {/* Role */}
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                                    <MdShield size={14} className="text-amber-400" />
                                    Role
                                </label>
                                <select
                                    {...register("role")}
                                    className="w-full px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all cursor-pointer"
                                >
                                    <option value="user">User (normal — no login access)</option>
                                    <option value="admin">Admin</option>
                                    <option value="master">Master Admin</option>
                                </select>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                                <MdLock size={14} className="text-cyan-400" />
                                Password
                                <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", {
                                        required: true,
                                        minLength: 8,
                                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                                    })}
                                    className="w-full px-4 py-3 pr-12 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all placeholder:text-slate-600"
                                    placeholder="Min 8 chars, upper, lower, number & special..."
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                                >
                                    {showPassword ? <FiEye size={17} /> : <FiEyeOff size={17} />}
                                </button>
                            </div>
                            {errors.password?.type === "required" && (
                                <p role="alert" className="text-red-400 text-xs">Password is required.</p>
                            )}
                            {errors.password?.type === "minLength" && (
                                <p role="alert" className="text-red-400 text-xs">Password must be at least 8 characters.</p>
                            )}
                            {errors.password?.type === "pattern" && (
                                <p role="alert" className="text-red-400 text-xs">Must include uppercase, lowercase, number & special character (@$!%*?&).</p>
                            )}
                        </div>

                        {/* ── Permissions Section (only when role = admin) ── */}
                        {selectedRole === 'admin' && (
                            <div className="border border-slate-700/60 rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="px-4 py-3 bg-slate-800/40 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MdSecurity className="text-cyan-400" size={16} />
                                        <span className="text-slate-300 font-bold text-xs uppercase tracking-wider">
                                            Section Permissions
                                        </span>
                                        <span className="text-slate-500 text-xs">
                                            ({selectedPerms.length}/{permissionOptions.length} selected)
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={toggleAllPerms}
                                        className="px-3 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-all select-none"
                                    >
                                        {selectedPerms.length === permissionOptions.length ? 'Deselect All' : 'Select All'}
                                    </button>
                                </div>
                                <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                    {permissionOptions.map(opt => {
                                        const active = selectedPerms.includes(opt.key);
                                        return (
                                            <label
                                                key={opt.key}
                                                className={`flex items-center gap-2 px-3 py-2.5 border rounded-xl cursor-pointer transition-all text-xs font-semibold select-none ${
                                                    active
                                                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                                                        : 'bg-[#080d13] border-slate-700/50 hover:border-slate-600 text-slate-400'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={active}
                                                    onChange={() => togglePerm(opt.key)}
                                                    className="w-3.5 h-3.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-900 cursor-pointer"
                                                />
                                                <span>{opt.label}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                                {selectedPerms.length === 0 && (
                                    <p className="px-4 pb-3 text-xs text-amber-400/70">
                                        ⚠️ No permissions selected — admin will only see the Overview page.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Info Box */}
                        <div className="flex items-start gap-2.5 px-4 py-3 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                            <MdShield className="text-blue-400 flex-shrink-0 mt-0.5" size={16} />
                            <p className="text-slate-400 text-xs leading-relaxed">
                                The email must be in the whitelist above. After account creation, the email is{' '}
                                <span className="text-white font-semibold">automatically removed</span> from the whitelist.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={creatingUser || allowedEmails.length === 0}
                            className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold uppercase tracking-widest text-sm rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] active:scale-[0.99]"
                        >
                            {creatingUser ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating User...
                                </>
                            ) : (
                                <>
                                    <MdPersonAdd size={18} />
                                    Create User Account
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* ── Confirm Remove Modal ─────────────────────────── */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title="Remove from Whitelist"
                message={`Are you sure you want to remove "${confirmModal.email}" from the whitelist?`}
                onConfirm={confirmRemove}
                onCancel={() => setConfirmModal({ isOpen: false, id: null, email: '' })}
            />
        </div>
    );
};

export default CreateUserManager;
