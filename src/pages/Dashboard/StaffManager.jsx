import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
    MdAdd, MdDelete, MdPeople, MdEdit, MdClose, MdHelpOutline, 
    MdDragIndicator, MdPalette, MdSettings, MdShield 
} from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PRESET_COLORS = [
    { hex: '#ff2d2d', name: 'Crimson Red' },
    { hex: '#ff6b6b', name: 'Coral Red' },
    { hex: '#F39C12', name: 'Orange' },
    { hex: '#F1C40F', name: 'Yellow' },
    { hex: '#7ED321', name: 'Lime Green' },
    { hex: '#10b981', name: 'Emerald Green' },
    { hex: '#1ABC9C', name: 'Teal' },
    { hex: '#06b6d4', name: 'Cyan' },
    { hex: '#3b82f6', name: 'Royal Blue' },
    { hex: '#9B59B6', name: 'Amethyst Purple' },
    { hex: '#ec4899', name: 'Hot Pink' },
    { hex: '#ffffff', name: 'Pure White' },
];

const iconOptions = [
    { value: 'FaUserTie', label: 'Management Tie' },
    { value: 'FaUserCog', label: 'Gear / Assistant' },
    { value: 'FaShieldAlt', label: 'Shield' },
    { value: 'FaUserShield', label: 'User Shield' },
    { value: 'FaCode', label: 'Code' },
    { value: 'FaUserCircle', label: 'Standard User' },
    { value: 'FaCrown', label: 'Crown' },
    { value: 'FaStar', label: 'Star' },
    { value: 'FaGamepad', label: 'Gamepad' }
];

const emojiLib = [
    { char: '👑', name: 'crown king queen leader gold vip royal winner boss management' },
    { char: '🛡️', name: 'shield admin protection guard moderator secure staff defense safety' },
    { char: '👮', name: 'police cop officer law force patrol admin security safety' },
    { char: '🕵️', name: 'detective spy search investigator helper inspector agency look find' },
    { char: '👔', name: 'tie suit business management staff leader head assistant job office' },
    { char: '💼', name: 'briefcase work job office business management portfolio' },
    { char: '⚙️', name: 'gear cog setting adjust assistant developer maintenance system' },
    { char: '🛠️', name: 'tools hammer wrench maintenance engineer setup config developer repair' },
    { char: '💻', name: 'computer laptop code program developer scripter technology software web engine' },
    { char: '👾', name: 'alien monster retro pixel space game gaming player controller space' },
    { char: '🎮', name: 'game gamepad controller play console ps xbox gaming nintendo arcade' },
    { char: '⭐', name: 'star gold premium special vip badge favorite highlight quality' },
    { char: '🌟', name: 'star glowing special premium favorite highlight sky galaxy shine' },
    { char: '✨', name: 'sparkles magic shiny clean new premium glow clean light' },
    { char: '💎', name: 'gem diamond rich premium value crystal treasure gold jewel gem' },
    { char: '🏆', name: 'trophy winner prize cup champion success gold award achievement' },
    { char: '🥇', name: 'medal gold first prize winner champion' },
    { char: '🥈', name: 'medal silver second prize' },
    { char: '🥉', name: 'medal bronze third prize' },
    { char: '🎖️', name: 'military medal honor roster reward tribute' },
    { char: '🔥', name: 'fire hot active hype burn spark flame energy' },
    { char: '⚡', name: 'lightning bolt flash speed fast power thunder energy force quick' },
    { char: '🚀', name: 'rocket launch boost fast speed space fly high mission travel' },
    { char: '💥', name: 'collision boom explode blast energy power clash spark hit' },
    { char: '🎯', name: 'target goal direct hit focus accuracy aim shooter mission target' },
    { char: '📢', name: 'megaphone alert news announcement feature voice speak talk loud news' },
    { char: '🔔', name: 'bell notify alert notification sound ring reminder update' },
    { char: '💬', name: 'chat balloon message forum talk type conversation text comment speech' },
    { char: '✉️', name: 'envelope mail letter contact inbox receive send' },
    { char: '📜', name: 'scroll rules terms document law history paper news ancient paper list' },
    { char: '🧠', name: 'brain smart think idea mastermind logic genius research' },
    { char: '💡', name: 'idea lightbulb bright smart electric light neon creativity' },
    { char: '🔑', name: 'key access lock password success enter secret security' },
    { char: '🔒', name: 'lock secure private safe key close shield' },
    { char: '🔓', name: 'unlock open access secure key' },
    { char: '❤️', name: 'heart love community red custom like friend heart' },
    { char: '🧡', name: 'heart orange' },
    { char: '💛', name: 'heart yellow' },
    { char: '💚', name: 'heart green' },
    { char: '💙', name: 'heart blue' },
    { char: '💜', name: 'heart purple' },
    { char: '🖤', name: 'heart black' },
    { char: '🤍', name: 'heart white' },
    { char: '🤎', name: 'heart brown' },
    { char: '🚩', name: 'flag red post point goal marker checkpoint' },
    { char: '🏳️‍🌈', name: 'rainbow flag pride lgbt community pride' },
    { char: '🏴‍☠️', name: 'pirate flag skull bones crossbones sea pirate' },
    { char: '🐲', name: 'dragon head mythical animal green fire monster fantasy' },
    { char: '🐉', name: 'dragon mythical green fire fantasy' },
    { char: '🦁', name: 'lion head king beast wild animal mascot courage' },
    { char: '🐺', name: 'wolf head wild animal pack alpha wild hunter' },
    { char: '🦅', name: 'eagle bird fly high freedom sky america bird hunting' },
    { char: '🦈', name: 'shark ocean predator beast fish water monster' }
];

const countriesList = [
    { code: 'us', name: 'United States', emoji: '🇺🇸' },
    { code: 'bd', name: 'Bangladesh', emoji: '🇧🇩' },
    { code: 'ph', name: 'Philippines', emoji: '🇵🇭' },
    { code: 'br', name: 'Brazil', emoji: '🇧🇷' },
    { code: 'gb', name: 'United Kingdom', emoji: '🇬🇧' },
    { code: 'nz', name: 'New Zealand', emoji: '🇳🇿' },
    { code: 'ca', name: 'Canada', emoji: '🇨🇦' },
    { code: 'au', name: 'Australia', emoji: '🇦🇺' },
    { code: 'in', name: 'India', emoji: '🇮🇳' },
    { code: 'pk', name: 'Pakistan', emoji: '🇵🇰' },
    { code: 'sa', name: 'Saudi Arabia', emoji: '🇸🇦' },
    { code: 'ae', name: 'United Arab Emirates', emoji: '🇦🇪' },
    { code: 'sg', name: 'Singapore', emoji: '🇸🇬' },
    { code: 'my', name: 'Malaysia', emoji: '🇲🇾' },
    { code: 'de', name: 'Germany', emoji: '🇩🇪' },
    { code: 'fr', name: 'France', emoji: '🇫🇷' },
    { code: 'it', name: 'Italy', emoji: '🇮🇹' },
    { code: 'es', name: 'Spain', emoji: '🇪🇸' },
    { code: 'jp', name: 'Japan', emoji: '🇯🇵' },
    { code: 'kr', name: 'South Korea', emoji: '🇰🇷' },
    { code: 'vn', name: 'Vietnam', emoji: '🇻🇳' },
    { code: 'th', name: 'Thailand', emoji: '🇹🇭' },
    { code: 'eg', name: 'Egypt', emoji: '🇪🇬' },
    { code: 'lb', name: 'Lebanon', emoji: '🇱🇧' },
    { code: 'bg', name: 'Bulgaria', emoji: '🇧🇬' },
    { code: 'pt', name: 'Portugal', emoji: '🇵🇹' },
    { code: 'cn', name: 'China', emoji: '🇨🇳' }
];

const StaffManager = () => {
    const [activeTab, setActiveTab] = useState('members'); // 'members' or 'roles'
    const [staff, setStaff] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loadingStaff, setLoadingStaff] = useState(true);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Emoji search states
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [emojiSearch, setEmojiSearch] = useState('');

    // Country Dropdown states
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');

    // Form 1: Staff member form
    const staffForm = useForm({
        defaultValues: {
            name: '',
            category: '',
            role: '',
            country: 'us',
            image_url: '',
            color: '#ffffff',
            name_color: '#ffffff'
        }
    });

    const watchCountry = staffForm.watch('country', 'us');
    const watchStaffColor = staffForm.watch('color', '#ffffff');
    const watchNameColor = staffForm.watch('name_color', '#ffffff');
    const watchCategory = staffForm.watch('category');

    const selectedRoleObj = roles.find(r => r.name === watchCategory);

    const handleUpdateSelectedRoleColor = async (newColor) => {
        if (!selectedRoleObj) return;
        try {
            const res = await fetch(`${BASE_URL}/staff-roles/${selectedRoleObj.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: selectedRoleObj.name,
                    color: newColor,
                    icon_name: selectedRoleObj.icon_name
                })
            });
            if (res.ok) {
                setRoles(prev => prev.map(r => r.id === selectedRoleObj.id ? { ...r, color: newColor } : r));
                toast.success(`Updated ${selectedRoleObj.name} color!`, { duration: 1000 });
            }
        } catch (err) {
            console.error("Failed to update role color:", err);
        }
    };

    // Form 2: Role / Department form
    const roleForm = useForm({
        defaultValues: {
            name: '',
            color: '#ffffff',
            icon_name: 'FaUserShield'
        }
    });

    const watchRoleColor = roleForm.watch('color', '#ffffff');

    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadPreview, setUploadPreview] = useState('');
    
    // Edit item states
    const [editingStaff, setEditingStaff] = useState(null);
    const [editingRole, setEditingRole] = useState(null);

    // Drag-to-Reorder states
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    // Custom Confirmation Modal state
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null
    });

    const fetchStaff = async () => {
        try {
            const res = await fetch(`${BASE_URL}/staff`, { credentials: 'include' });
            const data = await res.json();
            setStaff(Array.isArray(data) ? data : []);
        } catch {
            setStaff([]);
        } finally {
            setLoadingStaff(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const res = await fetch(`${BASE_URL}/staff-roles`, { credentials: 'include' });
            const data = await res.json();
            const fetchedRoles = Array.isArray(data) ? data : [];
            setRoles(fetchedRoles);
            
            // Set default category value on staff form once roles are loaded
            if (fetchedRoles.length > 0) {
                staffForm.setValue('category', fetchedRoles[0].name);
            }
        } catch {
            setRoles([]);
        } finally {
            setLoadingRoles(false);
        }
    };

    useEffect(() => {
        fetchStaff();
        fetchRoles();
    }, []);

    // Helper: translate country flag emoji (e.g. 🇧🇩) to country code (e.g. bd)
    const flagEmojiToCountryCode = (flagEmoji) => {
        const codePoints = Array.from(flagEmoji).map(c => c.codePointAt(0));
        if (codePoints.length >= 2 && codePoints[0] >= 127462 && codePoints[0] <= 127487) {
            const char1 = String.fromCharCode(codePoints[0] - 127397);
            const char2 = String.fromCharCode(codePoints[1] - 127397);
            return (char1 + char2).toLowerCase();
        }
        return null;
    };

    // ════════════════════════════════════════════════════════════
    // STAFF MEMBERS CRUD ACTIONS
    // ════════════════════════════════════════════════════════════

    const executeAddOrUpdateStaff = async (data) => {
        const isEditing = !!editingStaff;
        setSubmitting(true);
        const loadingToast = toast.loading(isEditing ? 'Updating staff member...' : 'Adding staff member...');
        try {
            const url = isEditing ? `${BASE_URL}/staff/${editingStaff.id}` : `${BASE_URL}/staff`;
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            
            toast.success(isEditing ? 'Staff details updated!' : 'Staff member added!', { id: loadingToast });
            staffForm.reset({
                name: '',
                category: roles[0]?.name || '',
                role: '',
                country: 'us',
                image_url: '',
                color: '#ffffff',
                name_color: '#ffffff'
            });
            setUploadPreview('');
            setEditingStaff(null);
            fetchStaff();
        } catch (err) {
            toast.error(err.message || 'Failed to process request', { id: loadingToast });
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddStaffSubmit = (data) => {
        const isEditing = !!editingStaff;
        setConfirmModal({
            isOpen: true,
            title: isEditing ? 'Update Staff Details' : 'Add Staff Member',
            message: isEditing 
                ? 'Are you sure you want to update this staff member\'s record?' 
                : 'Are you sure you want to post this staff member to the team roster?',
            onConfirm: () => {
                executeAddOrUpdateStaff(data);
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const executeDeleteStaff = async (id) => {
        const deletingToast = toast.loading('Removing staff member...');
        try {
            const res = await fetch(`${BASE_URL}/staff/${id}`, { method: 'DELETE', credentials: 'include' });
            if (!res.ok) throw new Error('Failed to delete');
            setStaff(prev => prev.filter(s => s.id !== id));
            toast.success('Staff member removed!', { id: deletingToast });
            if (editingStaff?.id === id) {
                handleCancelStaffEdit();
            }
        } catch (err) {
            toast.error(err.message || 'Failed to remove member', { id: deletingToast });
        }
    };

    const handleDeleteStaff = (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Remove Staff Member',
            message: 'Are you sure you want to delete this staff member? This action cannot be undone.',
            onConfirm: () => {
                executeDeleteStaff(id);
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleStartStaffEdit = (member) => {
        setEditingStaff(member);
        staffForm.setValue('name', member.name);
        staffForm.setValue('category', member.category);
        staffForm.setValue('role', member.role);
        staffForm.setValue('country', member.country || 'us');
        staffForm.setValue('image_url', member.image_url || '');
        staffForm.setValue('color', member.color || '#ffffff');
        staffForm.setValue('name_color', member.name_color || '#ffffff');
        setUploadPreview(member.image_url || '');
    };

    const handleCancelStaffEdit = () => {
        setEditingStaff(null);
        staffForm.reset({
            name: '',
            category: roles[0]?.name || '',
            role: '',
            country: 'us',
            image_url: '',
            color: '#ffffff',
            name_color: '#ffffff'
        });
        setUploadPreview('');
        setShowCountryDropdown(false);
    };

    // ════════════════════════════════════════════════════════════
    // ROLES / DEPARTMENTS CRUD ACTIONS
    // ════════════════════════════════════════════════════════════

    const executeAddOrUpdateRole = async (data) => {
        const isEditing = !!editingRole;
        setSubmitting(true);
        const loadingToast = toast.loading(isEditing ? 'Updating department role...' : 'Adding department role...');
        try {
            const url = isEditing ? `${BASE_URL}/staff-roles/${editingRole.id}` : `${BASE_URL}/staff-roles`;
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            
            toast.success(isEditing ? 'Department updated!' : 'Department role added!', { id: loadingToast });
            roleForm.reset({
                name: '',
                color: '#ffffff',
                icon_name: 'FaUserShield'
            });
            setEditingRole(null);
            fetchRoles();
            fetchStaff(); // cascade updates might alter categories in staff list
        } catch (err) {
            toast.error(err.message || 'Failed to process role request', { id: loadingToast });
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddRoleSubmit = (data) => {
        const isEditing = !!editingRole;
        setConfirmModal({
            isOpen: true,
            title: isEditing ? 'Update Roster Role' : 'Add Roster Role',
            message: isEditing 
                ? 'Are you sure you want to update this roster department? This will update any assigned staff members accordingly.' 
                : 'Are you sure you want to create this new administrative department?',
            onConfirm: () => {
                executeAddOrUpdateRole(data);
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const executeDeleteRole = async (id) => {
        const deletingToast = toast.loading('Removing department...');
        try {
            const res = await fetch(`${BASE_URL}/staff-roles/${id}`, { method: 'DELETE', credentials: 'include' });
            if (!res.ok) throw new Error('Failed to delete');
            setRoles(prev => prev.filter(r => r.id !== id));
            toast.success('Department deleted, matching staff unassigned.', { id: deletingToast });
            if (editingRole?.id === id) {
                handleCancelRoleEdit();
            }
            fetchStaff(); // Reload staff list to reflect cleared categories
        } catch (err) {
            toast.error(err.message || 'Failed to delete department', { id: deletingToast });
        }
    };

    const handleDeleteRole = (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Department',
            message: 'Are you sure you want to delete this department? Matching staff members will have their department cleared.',
            onConfirm: () => {
                executeDeleteRole(id);
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleStartRoleEdit = (role) => {
        setEditingRole(role);
        roleForm.setValue('name', role.name);
        roleForm.setValue('color', role.color || '#ffffff');
        roleForm.setValue('icon_name', role.icon_name || 'FaUserShield');
    };

    const handleCancelRoleEdit = () => {
        setEditingRole(null);
        roleForm.reset({
            name: '',
            color: '#ffffff',
            icon_name: 'FaUserShield'
        });
        setShowEmojiPicker(false);
    };

    // ════════════════════════════════════════════════════════════
    // REORDERING SEQUENCE SYNCS (BOTH MEMBERS & DEPARTMENTS)
    // ════════════════════════════════════════════════════════════

    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDropReorder = async (targetIndex) => {
        if (draggedIndex === null || draggedIndex === targetIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        const isMembers = activeTab === 'members';
        const reordered = isMembers ? [...staff] : [...roles];
        const [removed] = reordered.splice(draggedIndex, 1);
        reordered.splice(targetIndex, 0, removed);

        // Instant UI Response
        if (isMembers) setStaff(reordered); else setRoles(reordered);
        setDraggedIndex(null);
        setDragOverIndex(null);

        const orders = reordered.map((item, idx) => ({
            id: item.id,
            sort_order: idx
        }));

        const reorderToast = toast.loading('Saving new layout sequence...');
        const urlSuffix = isMembers ? 'staff/reorder' : 'staff-roles/reorder';
        try {
            const res = await fetch(`${BASE_URL}/${urlSuffix}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ orders }),
            });
            if (!res.ok) throw new Error('Reorder failed');
            toast.success('Display priority updated successfully!', { id: reorderToast });
        } catch (err) {
            toast.error(err.message || 'Failed to update priority list', { id: reorderToast });
            if (isMembers) fetchStaff(); else fetchRoles();
        }
    };

    // ImgBB Upload handle
    const handleFileUpload = async (file) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please drop/select a valid image file.');
            return;
        }
        setUploading(true);
        const uploadToast = toast.loading('Uploading avatar to ImgBB...');
        const formData = new FormData();
        formData.append('image', file);

        try {
            const apiKey = import.meta.env.VITE_IMGBB_API_KEY || '60d09e5b34467e4012981e00e008a68a';
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: 'POST',
                body: formData
            });
            const result = await res.json();
            if (result.success) {
                const imageUrl = result.data.url;
                staffForm.setValue('image_url', imageUrl);
                setUploadPreview(imageUrl);
                toast.success('Avatar uploaded successfully!', { id: uploadToast });
            } else {
                throw new Error(result.error?.message || 'ImgBB upload failed');
            }
        } catch (err) {
            toast.error('Upload failed: ' + err.message, { id: uploadToast });
        } finally {
            setUploading(false);
        }
    };

    const renderDynamicIcon = (iconName, color = '#22d3ee') => {
        if (FaIcons[iconName]) {
            const Icon = FaIcons[iconName];
            return <Icon style={{ color }} size={20} />;
        }
        return <span style={{ color }} className="font-sans text-lg select-none">{iconName}</span>;
    };

    // Filter emojis based on search text
    const filteredEmojis = emojiLib.filter(e => 
        e.name.toLowerCase().includes(emojiSearch.toLowerCase()) ||
        e.char.includes(emojiSearch)
    );

    // Filter countries based on search text
    const filteredCountries = countriesList.filter(c =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.code.toLowerCase().includes(countrySearch.toLowerCase())
    );

    const selectedCountry = countriesList.find(c => c.code === watchCountry.toLowerCase());

    return (
        <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider">Roster Administration</h2>
                    <p className="text-slate-400 text-sm mt-1">Manage staff roster groups, customize color tags, and order priorities.</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-[#0d1117] border border-slate-800 rounded-xl p-1 self-start sm:self-center">
                    <button
                        onClick={() => { setActiveTab('members'); handleCancelStaffEdit(); handleCancelRoleEdit(); }}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                            activeTab === 'members'
                                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <MdPeople size={16} /> Members
                    </button>
                    <button
                        onClick={() => { setActiveTab('roles'); handleCancelStaffEdit(); handleCancelRoleEdit(); }}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                            activeTab === 'roles'
                                ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <MdSettings size={16} /> Departments & Colors
                    </button>
                </div>
            </div>

            {/* Custom Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md px-4">
                    <div className="bg-[#0b0f15] border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className={`absolute top-0 left-0 w-full h-1 ${activeTab === 'members' ? 'bg-cyan-500' : 'bg-purple-500'}`}></div>
                        
                        <div className="flex items-start gap-4 mb-4 mt-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                activeTab === 'members' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400'
                            }`}>
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
                                className={`px-5 py-2.5 text-black rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md ${
                                    activeTab === 'members'
                                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white'
                                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
                                }`}
                            >
                                Yes, Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 1: MEMBERS MANAGEMENT */}
            {activeTab === 'members' && (
                <div>
                    {/* Member Form */}
                    <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6 mb-8">
                        <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-5 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                {editingStaff ? <MdEdit className="text-cyan-400" size={18} /> : <MdAdd className="text-cyan-400" size={18} />}
                                {editingStaff ? 'Edit Staff Member' : 'Add Roster Staff Member'}
                            </span>
                            {editingStaff && (
                                <button
                                    type="button"
                                    onClick={handleCancelStaffEdit}
                                    className="flex items-center gap-1 text-slate-500 hover:text-slate-300 text-xs font-semibold uppercase tracking-wider transition-colors"
                                >
                                    <MdClose size={16} /> Cancel Edit
                                </button>
                            )}
                        </h3>
                        <form onSubmit={staffForm.handleSubmit(handleAddStaffSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Staff Name <span className="text-red-400">*</span></label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            {...staffForm.register('name', { required: 'Name is required' })}
                                            placeholder="e.g. Surreal"
                                            className="flex-1 px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600 font-bold"
                                            style={{ color: watchNameColor }}
                                        />
                                        <div className="flex items-center gap-2 bg-[#080d13] border border-slate-700 px-3 py-1.5 rounded-xl flex-shrink-0" title="Staff Name Custom Color">
                                            <input
                                                type="color"
                                                value={watchNameColor}
                                                onChange={(e) => staffForm.setValue('name_color', e.target.value)}
                                                className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={watchNameColor}
                                                onChange={(e) => staffForm.setValue('name_color', e.target.value)}
                                                placeholder="#FFFFFF"
                                                className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white text-xs font-mono uppercase focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    {staffForm.formState.errors.name && <p className="text-red-400 text-xs">{staffForm.formState.errors.name.message}</p>}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Department Category <span className="text-red-400">*</span></label>
                                    {roles.length === 0 ? (
                                        <div className="text-amber-400 text-xs py-3">
                                            ⚠️ Create departments under the "Departments" tab first.
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <select
                                                {...staffForm.register('category')}
                                                className="flex-1 px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer"
                                            >
                                                {roles.map(r => (
                                                    <option key={r.id} value={r.name}>{r.name}</option>
                                                ))}
                                            </select>
                                            {selectedRoleObj && (
                                                <div className="flex items-center gap-2 bg-[#080d13] border border-slate-700 px-3 py-1.5 rounded-xl flex-shrink-0" title="Selected Department/Category Color">
                                                    <input
                                                        type="color"
                                                        value={selectedRoleObj.color || '#ffffff'}
                                                        onChange={(e) => handleUpdateSelectedRoleColor(e.target.value)}
                                                        className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={selectedRoleObj.color || '#ffffff'}
                                                        onChange={(e) => handleUpdateSelectedRoleColor(e.target.value)}
                                                        placeholder="#FFFFFF"
                                                        className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white text-xs font-mono uppercase focus:outline-none"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Subtitle Role <span className="text-slate-500">(Optional)</span></label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            {...staffForm.register('role')}
                                            placeholder="e.g. Lead Scripter"
                                            className="flex-1 px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600 font-bold"
                                            style={{ color: watchStaffColor }}
                                        />
                                        <div className="flex items-center gap-2 bg-[#080d13] border border-slate-700 px-3 py-1.5 rounded-xl flex-shrink-0" title="Subrole / Position Custom Color">
                                            <input
                                                type="color"
                                                value={watchStaffColor}
                                                onChange={(e) => staffForm.setValue('color', e.target.value)}
                                                className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={watchStaffColor}
                                                onChange={(e) => staffForm.setValue('color', e.target.value)}
                                                placeholder="#FFFFFF"
                                                className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white text-xs font-mono uppercase focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Searchable Country Flag dropdown list */}
                                <div className="flex flex-col gap-2 relative">
                                    <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Country Flag <span className="text-slate-500">(Optional)</span></label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                            className="w-full flex items-center justify-between px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm text-left focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                        >
                                            {selectedCountry ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="text-xl">{selectedCountry.emoji}</span>
                                                    <span>{selectedCountry.name} ({selectedCountry.code.toUpperCase()})</span>
                                                </span>
                                            ) : watchCountry ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="text-xs font-bold font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-1.5 py-0.5 rounded uppercase">{watchCountry}</span>
                                                    <span className="text-slate-400">Custom Code / Paste</span>
                                                </span>
                                            ) : (
                                                <span className="text-slate-500">Select Country...</span>
                                            )}
                                            <span className="text-slate-400 text-xs">▼</span>
                                        </button>
                                        <input
                                            type="text"
                                            maxLength={2}
                                            {...staffForm.register('country')}
                                            placeholder="Code"
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const code = flagEmojiToCountryCode(val);
                                                if (code) {
                                                    staffForm.setValue('country', code);
                                                } else {
                                                    staffForm.setValue('country', val.toLowerCase());
                                                }
                                            }}
                                            className="w-20 px-3 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-center text-sm font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all uppercase placeholder:text-slate-600"
                                            title="Direct Country Code (e.g. US, BD, PH)"
                                        />
                                    </div>

                                    {showCountryDropdown && (
                                        <div className="absolute top-[80px] right-0 left-0 z-30 bg-[#0b0f15] border border-slate-800 rounded-2xl p-4 shadow-2xl animate-in fade-in duration-200 flex flex-col gap-3">
                                            <div className="flex items-center justify-between gap-3">
                                                <input
                                                    type="text"
                                                    value={countrySearch}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        // Auto convert if they paste a flag emoji directly into the search box!
                                                        const code = flagEmojiToCountryCode(val);
                                                        if (code) {
                                                            staffForm.setValue('country', code);
                                                            setShowCountryDropdown(false);
                                                            setCountrySearch('');
                                                            return;
                                                        }
                                                        setCountrySearch(val);
                                                    }}
                                                    placeholder="Search country or paste flag emoji directly..."
                                                    className="w-full px-3 py-2 bg-[#080d13] border border-slate-700 rounded-lg text-white text-xs focus:outline-none"
                                                    autoFocus
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => { setShowCountryDropdown(false); setCountrySearch(''); }}
                                                    className="text-slate-500 hover:text-slate-300 p-1"
                                                >
                                                    <MdClose size={18} />
                                                </button>
                                            </div>

                                            <div className="overflow-y-auto max-h-40 space-y-1 pr-1">
                                                {filteredCountries.map(c => (
                                                    <button
                                                        key={c.code}
                                                        type="button"
                                                        onClick={() => {
                                                            staffForm.setValue('country', c.code);
                                                            setShowCountryDropdown(false);
                                                            setCountrySearch('');
                                                        }}
                                                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white text-xs text-left transition-all"
                                                    >
                                                        <span className="flex items-center gap-3">
                                                            <span className="text-lg">{c.emoji}</span>
                                                            <span>{c.name}</span>
                                                        </span>
                                                        <span className="text-slate-500 font-mono font-bold uppercase">{c.code}</span>
                                                    </button>
                                                ))}
                                                {filteredCountries.length === 0 && (
                                                    <div className="text-slate-500 text-xs py-4 text-center">
                                                        No matching countries. You can copy/paste any flag emoji from google here to load!
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-slate-500">💡 Tip: Copy a flag emoji like 🇧🇩 or 🇺🇸 from google, paste it in the search box above, and it will auto-detect!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
 


                            {/* Drag & Drop Avatar */}
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Staff Profile Photo</label>
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                    onDragLeave={() => setDragging(false)}
                                    onDrop={(e) => { e.preventDefault(); setDragging(false); const file = e.dataTransfer.files[0]; if (file) handleFileUpload(file); }}
                                    onClick={() => document.getElementById('staff-file-input').click()}
                                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                                        dragging
                                            ? 'border-cyan-400 bg-cyan-500/5'
                                            : uploadPreview
                                            ? 'border-green-500/40 bg-green-500/5'
                                            : 'border-slate-700 hover:border-cyan-500 bg-[#080d13]'
                                    }`}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="staff-file-input"
                                        onChange={(e) => { const file = e.target.files[0]; if (file) handleFileUpload(file); }}
                                        className="hidden"
                                    />
                                    {uploading ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Uploading to ImgBB...</p>
                                        </div>
                                    ) : uploadPreview ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <img src={uploadPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-slate-700" />
                                            <p className="text-green-400 text-xs font-bold uppercase tracking-wider">✓ Avatar hosted successfully on ImgBB!</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <p className="text-slate-300 text-sm font-semibold">Drag & drop profile picture here, or <span className="text-cyan-400">browse</span></p>
                                            <p className="text-slate-500 text-xs">Uploads dynamically to ImgBB host.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Avatar Image URL</label>
                                <input
                                    type="url"
                                    {...staffForm.register('image_url')}
                                    placeholder="https://example.com/avatar.png"
                                    className="w-full px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting || roles.length === 0}
                                    className="flex items-center gap-2 px-6 py-3 disabled:opacity-50 bg-cyan-600 hover:bg-cyan-500 text-black font-bold uppercase tracking-widest text-sm rounded-xl transition-all duration-300 shadow-lg active:scale-95"
                                >
                                    {editingStaff ? <MdEdit size={18} /> : <MdAdd size={18} />}
                                    {submitting ? 'Processing...' : editingStaff ? 'Update Details' : 'Add Member'}
                                </button>
                                {editingStaff && (
                                    <button
                                        type="button"
                                        onClick={handleCancelStaffEdit}
                                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold uppercase tracking-widest text-sm rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Members List */}
                    <div>
                        <div className="mb-4">
                            <h3 className="text-white font-bold uppercase tracking-wider text-sm">
                                Staff Roster Members <span className="text-cyan-400">({staff.length})</span>
                            </h3>
                            <p className="text-slate-500 text-xs mt-1">💡 Drag and drop cards vertically to adjust how members sort on the public page.</p>
                        </div>

                        {loadingStaff ? (
                            <div className="flex items-center gap-3 text-slate-400 py-8">
                                <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                Loading staff members...
                            </div>
                        ) : staff.length === 0 ? (
                            <div className="bg-[#0d1117] border border-dashed border-slate-700 rounded-2xl p-10 text-center">
                                <MdPeople className="text-slate-600 mx-auto mb-3" size={40} />
                                <p className="text-slate-500 text-sm">No staff members listed. Create department roles and add members above.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {staff.map((member, idx) => {
                                    const matchingRoleObj = roles.find(r => r.name === member.category);
                                    const roleColor = matchingRoleObj?.color || '#94a3b8';
                                    const countryObj = countriesList.find(c => c.code === member.country?.toLowerCase());
                                    return (
                                        <div 
                                            key={member.id} 
                                            draggable
                                            onDragStart={() => handleDragStart(idx)}
                                            onDragOver={(e) => handleDragOver(e, idx)}
                                            onDrop={() => handleDropReorder(idx)}
                                            className={`bg-[#0d1117] border rounded-2xl p-4 flex items-center gap-4 group transition-all cursor-move active:cursor-grabbing ${
                                                editingStaff?.id === member.id 
                                                    ? 'border-amber-500/60 bg-amber-500/5' 
                                                    : dragOverIndex === idx
                                                    ? 'border-cyan-500 bg-cyan-950/15 scale-[1.01] shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                                                    : 'border-slate-800 hover:border-slate-600'
                                            }`}
                                        >
                                            <div className="text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0">
                                                <MdDragIndicator size={20} />
                                            </div>

                                            <div className="w-12 h-12 rounded-full bg-[#080d13] border border-slate-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                                {member.image_url ? (
                                                    <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                                                ) : member.country ? (
                                                    <img 
                                                        src={`https://flagcdn.com/24x18/${member.country.toLowerCase()}.png`} 
                                                        alt={member.country} 
                                                        className="w-6 h-auto rounded-sm"
                                                    />
                                                ) : (
                                                    <span className="text-xs text-slate-600 font-bold uppercase font-mono">??</span>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-bold text-sm truncate">{member.name}</p>
                                                <p className="text-slate-400 text-xs truncate mt-0.5">{member.role || <span className="text-slate-600 italic">No subtitle role</span>}</p>
                                                <div className="mt-1.5 flex items-center gap-2">
                                                    <span 
                                                        style={{ color: member.color || roleColor, borderColor: `${member.color || roleColor}25`, backgroundColor: `${member.color || roleColor}10` }}
                                                        className="text-[10px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded"
                                                    >
                                                        {member.category || 'No Department'}
                                                    </span>
                                                    {member.country && (
                                                        <span className="text-xs flex items-center gap-1 text-slate-500 font-medium">
                                                            {countryObj?.emoji && <span>{countryObj.emoji}</span>}
                                                            <span className="uppercase font-mono">({member.country})</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleStartStaffEdit(member)}
                                                    className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer"
                                                >
                                                    <MdEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteStaff(member.id)}
                                                    className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                                                >
                                                    <MdDelete size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 2: DEPARTMENTS & ROLES SETTINGS */}
            {activeTab === 'roles' && (
                <div>
                    {/* Role Form */}
                    <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6 mb-8">
                        <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-5 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                {editingRole ? <MdEdit className="text-purple-400" size={18} /> : <MdAdd className="text-purple-400" size={18} />}
                                {editingRole ? 'Edit Department Role' : 'Add New Department Role'}
                            </span>
                            {editingRole && (
                                <button
                                    type="button"
                                    onClick={handleCancelRoleEdit}
                                    className="flex items-center gap-1 text-slate-500 hover:text-slate-300 text-xs font-semibold uppercase tracking-wider transition-colors"
                                >
                                    <MdClose size={16} /> Cancel Edit
                                </button>
                            )}
                        </h3>
                        <form onSubmit={roleForm.handleSubmit(handleAddRoleSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Department / Group Name <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        {...roleForm.register('name', { required: 'Department Name is required' })}
                                        placeholder="e.g. Junior Admin"
                                        className="w-full px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                                    />
                                    {roleForm.formState.errors.name && <p className="text-red-400 text-xs">{roleForm.formState.errors.name.message}</p>}
                                </div>

                                <div className="flex flex-col gap-2 relative">
                                    <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Choose Display Icon</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            {...roleForm.register('icon_name', { required: 'Icon is required' })}
                                            placeholder="e.g. FaUserShield or 👑"
                                            className="w-full px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 flex-shrink-0"
                                        >
                                            🔍 Search Emojis
                                        </button>
                                    </div>

                                    {/* Google-like Searchable Emoji Library Dropdown */}
                                    {showEmojiPicker && (
                                        <div className="absolute top-[80px] right-0 left-0 z-30 bg-[#0b0f15] border border-slate-800 rounded-2xl p-4 shadow-2xl animate-in fade-in duration-200 max-h-80 flex flex-col gap-3">
                                            <div className="flex items-center justify-between gap-3">
                                                <input
                                                    type="text"
                                                    value={emojiSearch}
                                                    onChange={(e) => setEmojiSearch(e.target.value)}
                                                    placeholder="Search emojis by name (e.g. king, star, code)..."
                                                    className="w-full px-3 py-2 bg-[#080d13] border border-slate-700 rounded-lg text-white text-xs focus:outline-none"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => { setShowEmojiPicker(false); setEmojiSearch(''); }}
                                                    className="text-slate-500 hover:text-slate-300 p-1"
                                                >
                                                    <MdClose size={18} />
                                                </button>
                                            </div>

                                            <div className="flex-1 overflow-y-auto grid grid-cols-6 gap-2 pr-1 max-h-48">
                                                {filteredEmojis.length === 0 ? (
                                                    <div className="col-span-6 text-slate-500 text-xs py-4 text-center">
                                                        No emojis match "{emojiSearch}". You can copy/paste any emoji from google directly!
                                                    </div>
                                                ) : (
                                                    filteredEmojis.map(emoji => (
                                                        <button
                                                            key={emoji.char}
                                                            type="button"
                                                            onClick={() => {
                                                                roleForm.setValue('icon_name', emoji.char);
                                                                setShowEmojiPicker(false);
                                                                setEmojiSearch('');
                                                            }}
                                                            className="w-10 h-10 rounded-lg bg-[#0e141c] hover:bg-slate-800 flex items-center justify-center text-xl transition-all border border-transparent hover:border-purple-500/50"
                                                            title={emoji.name}
                                                        >
                                                            {emoji.char}
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                            <p className="text-[10px] text-slate-500">💡 Or search and copy any emoji from google and paste it directly in the text input!</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Color settings */}
                            <div className="flex flex-col gap-2 max-w-sm">
                                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Department Color Tag</label>
                                <div className="flex items-center gap-3 bg-[#080d13] border border-slate-700 rounded-xl p-2">
                                    <input
                                        type="color"
                                        value={watchRoleColor}
                                        onChange={(e) => roleForm.setValue('color', e.target.value)}
                                        className="w-10 h-10 border-0 bg-transparent rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        {...roleForm.register('color')}
                                        placeholder="#ffffff"
                                        className="w-full bg-transparent text-white text-sm font-mono focus:outline-none uppercase"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center gap-2 px-6 py-3 disabled:opacity-50 bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-widest text-sm rounded-xl transition-all duration-300 shadow-lg active:scale-95"
                                >
                                    {editingRole ? <MdEdit size={18} /> : <MdAdd size={18} />}
                                    {submitting ? 'Processing...' : editingRole ? 'Update Department' : 'Add Department'}
                                </button>
                                {editingRole && (
                                    <button
                                        type="button"
                                        onClick={handleCancelRoleEdit}
                                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold uppercase tracking-widest text-sm rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Department Lists */}
                    <div>
                        <div className="mb-4">
                            <h3 className="text-white font-bold uppercase tracking-wider text-sm">
                                Custom Departments <span className="text-purple-400">({roles.length})</span>
                            </h3>
                            <p className="text-slate-500 text-xs mt-1">💡 Drag and drop cards vertically to adjust how departments are grouped and prioritized on the public roster.</p>
                        </div>

                        {loadingRoles ? (
                            <div className="flex items-center gap-3 text-slate-400 py-8">
                                <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                Loading departments...
                            </div>
                        ) : roles.length === 0 ? (
                            <div className="bg-[#0d1117] border border-dashed border-slate-700 rounded-2xl p-10 text-center">
                                <MdShield className="text-slate-600 mx-auto mb-3" size={40} />
                                <p className="text-slate-500 text-sm">No departments created yet. Create one above.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {roles.map((role, idx) => (
                                    <div 
                                        key={role.id} 
                                        draggable
                                        onDragStart={() => handleDragStart(idx)}
                                        onDragOver={(e) => handleDragOver(idx)}
                                        onDrop={() => handleDropReorder(idx)}
                                        className={`bg-[#0d1117] border rounded-2xl p-4 flex items-center gap-4 group transition-all cursor-move active:cursor-grabbing ${
                                            editingRole?.id === role.id 
                                                ? 'border-amber-500/60 bg-amber-500/5' 
                                                : dragOverIndex === idx
                                                ? 'border-purple-500 bg-purple-950/15 scale-[1.01] shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                                                : 'border-slate-800 hover:border-slate-600'
                                        }`}
                                    >
                                        <div className="text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0">
                                            <MdDragIndicator size={20} />
                                        </div>

                                        <div className="w-10 h-10 rounded-xl bg-[#080d13] border border-slate-850 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                            {renderDynamicIcon(role.icon_name, role.color)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p style={{ color: role.color }} className="font-bold text-sm truncate uppercase tracking-wider">{role.name}</p>
                                            <p className="text-slate-500 text-xs font-mono mt-0.5">Icon: {role.icon_name} | Color: {role.color}</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleStartRoleEdit(role)}
                                                className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer"
                                            >
                                                <MdEdit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRole(role.id)}
                                                className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                                            >
                                                <MdDelete size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffManager;
