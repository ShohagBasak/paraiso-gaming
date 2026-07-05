import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    MdAdd, MdDelete, MdEdit, MdClose, MdHelpOutline,
    MdDragIndicator, MdPeople, MdFolder, MdSave, MdExpandMore
} from 'react-icons/md';
import { toast } from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PRESET_COLORS = [
    { name: 'White', hex: '#ffffff' },
    { name: 'Emerald', hex: '#34d399' },
    { name: 'Green', hex: '#22c55e' },
    { name: 'Red', hex: '#ff3b30' },
    { name: 'Gold', hex: '#fbbf24' },
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

const emojiLib = [
    { char: '🤝', name: 'handshake helper assist support team' },
    { char: '👑', name: 'crown leader senior head chief' },
    { char: '🛡️', name: 'shield mod staff protection guard' },
    { char: '⭐', name: 'star senior lead premium' },
    { char: '🌟', name: 'star glowing lead senior' },
    { char: '🌱', name: 'sprout new trial junior' },
    { char: '✅', name: 'check active approved' },
    { char: '💬', name: 'chat support help community' },
    { char: '🔔', name: 'bell notify alert' },
    { char: '🎯', name: 'target focus goal' },
    { char: '🎖️', name: 'medal honor award' },
    { char: '💎', name: 'gem diamond premium' },
    { char: '🏆', name: 'trophy winner champion' },
    { char: '🔥', name: 'fire hot active' },
    { char: '⚡', name: 'lightning fast energy' },
    { char: '🚀', name: 'rocket boost speed' },
    { char: '🎮', name: 'game gaming' },
    { char: '👮', name: 'police officer mod' },
    { char: '👔', name: 'suit business management' },
    { char: '💼', name: 'briefcase work office' },
    { char: '⚙️', name: 'gear settings system' },
    { char: '🛠️', name: 'tools maintenance developer' },
    { char: '💻', name: 'computer developer tech' },
];

const HelperRosterManager = () => {
    const [activeTab, setActiveTab] = useState('members');
    const [members, setMembers] = useState([]);
    const [sectionsList, setSectionsList] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    // Section CRUD states
    const [newSectionName, setNewSectionName] = useState('');
    const [newSectionOrder, setNewSectionOrder] = useState(0);
    const [newSectionColor, setNewSectionColor] = useState('#34d399');
    const [newSectionIcon, setNewSectionIcon] = useState('🤝');
    const [editingSection, setEditingSection] = useState(null);

    // Emoji picker
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [emojiSearch, setEmojiSearch] = useState('');

    // Dropdowns
    const [showSectionDropdown, setShowSectionDropdown] = useState(false);
    const [showTitleDropdown, setShowTitleDropdown] = useState(false);
    const [showNameDropdown, setShowNameDropdown] = useState(false);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');
    const [nameSearch, setNameSearch] = useState('');
    const [lastAutofilledSection, setLastAutofilledSection] = useState('');

    // Drag reorder
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [draggedSecIndex, setDraggedSecIndex] = useState(null);
    const [dragOverSecIndex, setDragOverSecIndex] = useState(null);

    // Confirm modal
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

    // Collapsible factions
    const [expandedFactions, setExpandedFactions] = useState({});
    const toggleFactionExpand = (name) => setExpandedFactions(prev => ({ ...prev, [name]: !prev[name] }));

    // Filter
    const [filterSection, setFilterSection] = useState('ALL');

    // Member form
    const memberForm = useForm({
        defaultValues: {
            section: '',
            section_order: 0,
            title: '',
            name: '',
            country: 'us',
            description: '',
            sort_order: 0,
            color: '#ffffff',
            name_color: '#ffffff',
        }
    });

    const watchCountry = memberForm.watch('country', 'us');

    const watchSection = memberForm.watch('section');
    const watchColor = memberForm.watch('color') || '#ffffff';
    const watchNameColor = memberForm.watch('name_color', '#ffffff');
    const watchName = memberForm.watch('name') || '';

    const selectedSecObj = sectionsList.find(s => s.name.toUpperCase() === (watchSection || '').toUpperCase());

    const handleUpdateSelectedSecColor = async (newColor) => {
        if (!selectedSecObj) return;
        try {
            const res = await fetch(`${BASE_URL}/helper-roster/sections/${selectedSecObj.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: selectedSecObj.name,
                    sort_order: selectedSecObj.sort_order,
                    color: newColor,
                    icon: selectedSecObj.icon || '🤝'
                })
            });
            if (res.ok) {
                setSectionsList(prev => prev.map(s => s.id === selectedSecObj.id ? { ...s, color: newColor } : s));
                toast.success(`Updated ${selectedSecObj.name} color!`, { duration: 1000 });
                fetchMembers();
            }
        } catch (err) {
            console.error("Failed to update section color:", err);
        }
    };

    // Close dropdowns on outside click
    useEffect(() => {
        if (!showSectionDropdown && !showTitleDropdown && !showNameDropdown && !showCountryDropdown && !showEmojiPicker) return;
        const closeAll = () => {
            setShowSectionDropdown(false);
            setShowTitleDropdown(false);
            setShowNameDropdown(false);
            setShowCountryDropdown(false);
            setShowEmojiPicker(false);
        };
        window.addEventListener('click', closeAll);
        return () => window.removeEventListener('click', closeAll);
    }, [showSectionDropdown, showTitleDropdown, showNameDropdown, showCountryDropdown, showEmojiPicker]);

    const fetchMembers = async () => {
        try {
            const res = await fetch(`${BASE_URL}/helper-roster?_t=${Date.now()}`);
            const data = await res.json();
            setMembers(Array.isArray(data) ? data : []);
        } catch { setMembers([]); } finally { setLoading(false); }
    };

    const fetchSections = async () => {
        try {
            const res = await fetch(`${BASE_URL}/helper-roster/sections?_t=${Date.now()}`);
            const data = await res.json();
            const list = Array.isArray(data) ? data : [];
            setSectionsList(list);
            setNewSectionOrder(list.length + 1);
        } catch { setSectionsList([]); }
    };

    const fetchStaff = async () => {
        try {
            const res = await fetch(`${BASE_URL}/staff`);
            const data = await res.json();
            setStaffList(Array.isArray(data) ? data : []);
        } catch { setStaffList([]); }
    };

    // Auto-fill section_order when section changes
    useEffect(() => {
        if (!watchSection) return;
        const matched = sectionsList.find(s => s.name.toUpperCase() === watchSection.toUpperCase());
        if (matched) memberForm.setValue('section_order', matched.sort_order);

        if (watchSection.toUpperCase() !== lastAutofilledSection.toUpperCase()) {
            if (!editingMember) {
                const countInSec = members.filter(m => m.section.toUpperCase() === watchSection.toUpperCase()).length;
                memberForm.setValue('sort_order', countInSec + 1);
            }
            setLastAutofilledSection(watchSection);
        }
    }, [watchSection, sectionsList, members, editingMember, lastAutofilledSection]);

    useEffect(() => {
        fetchMembers();
        fetchSections();
        fetchStaff();
        const handleFocus = () => { fetchMembers(); fetchSections(); fetchStaff(); };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    // Grouped data
    const grouped = members.reduce((acc, m) => {
        if (!acc[m.section]) acc[m.section] = { section_order: m.section_order, members: [] };
        acc[m.section].members.push(m);
        return acc;
    }, {});
    const sections = Object.keys(grouped).sort((a, b) => grouped[a].section_order - grouped[b].section_order);
    const allSections = ['ALL', ...sections];

    const uniqueSectionsList = Array.from(new Set([
        ...sectionsList.map(s => s.name),
        ...sections,
    ]));

    const uniqueTitlesList = Array.from(new Set(
        members
            .filter(m => !watchSection || m.section.toUpperCase() === watchSection.toUpperCase())
            .map(m => m.title)
            .filter(Boolean)
    ));

    // Filtered staff names for dropdown
    const filteredStaffNames = staffList
        .map(s => s.name)
        .filter(n => n && n.toLowerCase().includes(nameSearch.toLowerCase()));

    // Filter countries based on search text
    const filteredCountries = countriesList.filter(c =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.code.toLowerCase().includes(countrySearch.toLowerCase())
    );

    const selectedCountry = countriesList.find(c => c.code === watchCountry.toLowerCase());

    const flagEmojiToCountryCode = (flagEmoji) => {
        const codePoints = Array.from(flagEmoji).map(c => c.codePointAt(0));
        if (codePoints.length >= 2 && codePoints[0] >= 127462 && codePoints[0] <= 127487) {
            const char1 = String.fromCharCode(codePoints[0] - 127397);
            const char2 = String.fromCharCode(codePoints[1] - 127397);
            return (char1 + char2).toLowerCase();
        }
        return null;
    };

    const filteredEmojis = emojiLib.filter(e =>
        e.name.toLowerCase().includes(emojiSearch.toLowerCase()) || e.char.includes(emojiSearch)
    );

    const filteredMembers = filterSection === 'ALL'
        ? members
        : members.filter(m => m.section === filterSection);

    // ════ MEMBERS CRUD ════

    const executeAddOrUpdateMember = async (data) => {
        const isEditing = !!editingMember;
        setSubmitting(true);
        const t = toast.loading(isEditing ? 'Updating member...' : 'Adding member...');
        try {
            const url = isEditing ? `${BASE_URL}/helper-roster/${editingMember.id}` : `${BASE_URL}/helper-roster`;
            const method = isEditing ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    ...data,
                    section_order: Number(data.section_order) || 0,
                    sort_order: Number(data.sort_order) || 0,
                }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            toast.success(isEditing ? 'Member updated!' : 'Member added!', { id: t });

            // Auto-add section if not in list
            const existsInList = sectionsList.some(s => s.name.toUpperCase() === data.section.toUpperCase());
            if (!existsInList && data.section.trim()) {
                await fetch(`${BASE_URL}/helper-roster/sections`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ name: data.section, sort_order: data.section_order }),
                });
                fetchSections();
            }

            const countInSec = members.filter(m => m.section.toUpperCase() === data.section.toUpperCase()).length;
            const nextOrder = isEditing ? (countInSec + 1) : (countInSec + 2);
            setLastAutofilledSection(data.section);
            setNameSearch('');

            memberForm.reset({
                section: data.section,
                section_order: data.section_order,
                title: '',
                name: '',
                country: 'us',
                description: '',
                sort_order: nextOrder,
                color: '#ffffff',
                name_color: '#ffffff',
            });
            setEditingMember(null);
            fetchMembers();
        } catch (err) {
            toast.error(err.message || 'Failed', { id: t });
        } finally {
            setSubmitting(false);
        }
    };

    const handleMemberSubmit = (data) => {
        setConfirmModal({
            isOpen: true,
            title: editingMember ? 'Update Helper Member' : 'Add Helper Member',
            message: editingMember
                ? 'Are you sure you want to update this member?'
                : 'Are you sure you want to add this helper to the roster?',
            onConfirm: () => {
                executeAddOrUpdateMember(data);
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            },
        });
    };

    const executeDeleteMember = async (id) => {
        const t = toast.loading('Deleting member...');
        try {
            const res = await fetch(`${BASE_URL}/helper-roster/${id}`, { method: 'DELETE', credentials: 'include' });
            if (!res.ok) throw new Error('Failed to delete');
            setMembers(prev => prev.filter(m => m.id !== id));
            toast.success('Member removed!', { id: t });
            if (editingMember?.id === id) handleCancelEdit();
        } catch (err) {
            toast.error(err.message || 'Delete failed', { id: t });
        }
    };

    const handleDeleteMember = (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Helper Member',
            message: 'Are you sure? This cannot be undone.',
            onConfirm: () => {
                executeDeleteMember(id);
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            },
        });
    };

    const handleStartEdit = (member) => {
        setEditingMember(member);
        setLastAutofilledSection(member.section);
        setNameSearch(member.name !== 'Vacant' ? member.name : '');
        setActiveTab('members');
        memberForm.setValue('section', member.section);
        memberForm.setValue('section_order', member.section_order);
        memberForm.setValue('title', member.title);
        memberForm.setValue('name', member.name !== 'Vacant' ? member.name : '');
        memberForm.setValue('country', member.country || 'us');
        memberForm.setValue('description', member.description || '');
        memberForm.setValue('sort_order', member.sort_order || 0);
        memberForm.setValue('color', member.color || '#ffffff');
        memberForm.setValue('name_color', member.name_color || '#ffffff');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingMember(null);
        setLastAutofilledSection('');
        setNameSearch('');
        memberForm.reset({ section: '', section_order: 0, title: '', name: '', country: 'us', description: '', sort_order: 0, color: '#ffffff', name_color: '#ffffff' });
    };

    const handleAddRoleForFaction = (factionName, factionOrder) => {
        handleCancelEdit();
        memberForm.setValue('section', factionName);
        memberForm.setValue('section_order', factionOrder);
        const countInSec = members.filter(m => m.section.toUpperCase() === factionName.toUpperCase()).length;
        memberForm.setValue('sort_order', countInSec + 1);
        memberForm.setValue('color', '#ffffff');
        setLastAutofilledSection(factionName);
        setActiveTab('members');
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    };

    // Drag reorder members
    const handleDragStart = (index) => setDraggedIndex(index);
    const handleDragOver = (e, index) => { e.preventDefault(); setDragOverIndex(index); };

    const handleDrop = async (targetIndex) => {
        if (draggedIndex === null || draggedIndex === targetIndex) {
            setDraggedIndex(null); setDragOverIndex(null); return;
        }
        const reordered = [...filteredMembers];
        const [removed] = reordered.splice(draggedIndex, 1);
        reordered.splice(targetIndex, 0, removed);
        const ids = new Set(reordered.map(m => m.id));
        const others = members.filter(m => !ids.has(m.id));
        setMembers([...others, ...reordered]);
        setDraggedIndex(null); setDragOverIndex(null);

        const orders = reordered.map((item, idx) => ({ id: item.id, sort_order: idx }));
        const t = toast.loading('Saving order...');
        try {
            const res = await fetch(`${BASE_URL}/helper-roster/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ orders }),
            });
            if (!res.ok) throw new Error('Reorder failed');
            toast.success('Order saved!', { id: t });
        } catch (err) {
            toast.error(err.message || 'Reorder failed', { id: t });
            fetchMembers();
        }
    };

    // ════ SECTIONS CRUD ════

    const handleAddSection = async (e) => {
        e.preventDefault();
        if (!newSectionName.trim()) return;
        const t = toast.loading('Creating section...');
        try {
            const res = await fetch(`${BASE_URL}/helper-roster/sections`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: newSectionName, sort_order: newSectionOrder, color: newSectionColor, icon: newSectionIcon }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            toast.success('Section created!', { id: t });
            setNewSectionName(''); setNewSectionOrder(0); setNewSectionColor('#34d399'); setNewSectionIcon('🤝');
            fetchSections(); fetchMembers();
        } catch (err) { toast.error(err.message || 'Failed', { id: t }); }
    };

    const handleUpdateSection = async (e) => {
        e.preventDefault();
        if (!editingSection || !editingSection.name.trim()) return;
        const t = toast.loading('Updating section...');
        try {
            const res = await fetch(`${BASE_URL}/helper-roster/sections/${editingSection.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: editingSection.name, sort_order: editingSection.sort_order, color: editingSection.color || '#34d399', icon: editingSection.icon || '🤝' }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            toast.success('Section updated!', { id: t });
            setEditingSection(null);
            fetchSections(); fetchMembers();
        } catch (err) { toast.error(err.message || 'Failed', { id: t }); }
    };

    const handleDeleteSection = (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Section',
            message: 'Delete this section? All helpers assigned to it will be permanently removed.',
            onConfirm: async () => {
                const t = toast.loading('Deleting section...');
                try {
                    const res = await fetch(`${BASE_URL}/helper-roster/sections/${id}`, { method: 'DELETE', credentials: 'include' });
                    if (!res.ok) throw new Error('Delete failed');
                    toast.success('Section deleted!', { id: t });
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    fetchSections(); fetchMembers();
                } catch (err) { toast.error(err.message || 'Failed', { id: t }); }
            },
        });
    };

    // Sections drag reorder
    const handleSecDragStart = (index) => setDraggedSecIndex(index);
    const handleSecDragOver = (e, index) => { e.preventDefault(); setDragOverSecIndex(index); };

    const handleSecDrop = async (targetIndex) => {
        if (draggedSecIndex === null || draggedSecIndex === targetIndex) {
            setDraggedSecIndex(null); setDragOverSecIndex(null); return;
        }
        const reordered = [...sectionsList];
        const [removed] = reordered.splice(draggedSecIndex, 1);
        reordered.splice(targetIndex, 0, removed);
        setSectionsList(reordered);
        setDraggedSecIndex(null); setDragOverSecIndex(null);

        const orders = reordered.map((item, idx) => ({ id: item.id, sort_order: idx }));
        const t = toast.loading('Saving sections order...');
        try {
            const res = await fetch(`${BASE_URL}/helper-roster/sections/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ orders }),
            });
            if (!res.ok) throw new Error('Reorder failed');
            toast.success('Sections order saved!', { id: t });
            fetchMembers();
        } catch (err) {
            toast.error(err.message || 'Reorder failed', { id: t });
            fetchSections();
        }
    };

    // ════ RENDER ════
    return (
        <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider">Helper Roster</h2>
                    <p className="text-slate-400 text-sm mt-1">Manage helper roster members, sections, and ordering.</p>
                </div>
                {/* Tabs */}
                <div className="flex bg-[#0d1117] border border-slate-800 rounded-xl p-1 self-start sm:self-center">
                    <button
                        onClick={() => { setActiveTab('members'); handleCancelEdit(); }}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'members'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        <MdPeople size={16} /> Members
                    </button>
                    <button
                        onClick={() => { setActiveTab('sections'); handleCancelEdit(); }}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'sections'
                            ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                            : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        <MdFolder size={16} /> Sections ({sectionsList.length})
                    </button>
                </div>
            </div>

            {/* Confirm Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md px-4">
                    <div className="bg-[#0b0f15] border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                        <div className="flex items-start gap-4 mb-4 mt-2">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-500/10 text-emerald-400">
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
                                onClick={() => { if (confirmModal.onConfirm) confirmModal.onConfirm(); }}
                                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                            >
                                Yes, Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ TAB: ADD/EDIT MEMBER ══ */}
            {activeTab === 'members' && (
                <div>
                    {/* Form */}
                    <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6 mb-8">
                        <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-5 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                {editingMember ? <MdEdit className="text-emerald-400" size={18} /> : <MdAdd className="text-emerald-400" size={18} />}
                                {editingMember ? 'Edit Helper Member' : 'Add Helper Member'}
                            </span>
                            {editingMember && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="flex items-center gap-1 text-slate-500 hover:text-slate-300 text-xs font-semibold uppercase tracking-wider transition-colors"
                                >
                                    <MdClose size={16} /> Cancel Edit
                                </button>
                            )}
                        </h3>

                        <form onSubmit={memberForm.handleSubmit(handleMemberSubmit)} className="space-y-4">
                            {/* Section Dropdown */}
                            <div className="flex flex-col gap-2 relative" onClick={(e) => e.stopPropagation()}>
                                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">
                                    Section / Group <span className="text-red-400">*</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            {...memberForm.register('section', { required: 'Section is required' })}
                                            placeholder="Type or choose a section"
                                            className="w-full pl-4 pr-10 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600 uppercase font-semibold"
                                            onClick={() => setShowSectionDropdown(true)}
                                            onFocus={() => setShowSectionDropdown(true)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowSectionDropdown(!showSectionDropdown)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
                                        >▼</button>
                                    </div>
                                    {selectedSecObj && (
                                        <div className="flex items-center gap-2 bg-[#080d13] border border-slate-700 px-3 py-2 rounded-xl flex-shrink-0" title="Selected Section Color">
                                            <input
                                                type="color"
                                                value={selectedSecObj.color || '#ffffff'}
                                                onChange={(e) => handleUpdateSelectedSecColor(e.target.value)}
                                                className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                                            />
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono select-none hidden sm:inline-block">Color</span>
                                        </div>
                                    )}
                                </div>
                                {showSectionDropdown && (
                                    <div className="absolute top-[78px] left-0 w-full bg-[#0b0f15] border border-slate-800 rounded-xl shadow-2xl z-30 max-h-52 overflow-y-auto divide-y divide-slate-800/50">
                                        {uniqueSectionsList.map((secLabel) => (
                                            <button
                                                key={secLabel}
                                                type="button"
                                                onClick={() => { memberForm.setValue('section', secLabel); setShowSectionDropdown(false); }}
                                                className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all"
                                            >
                                                {secLabel}
                                            </button>
                                        ))}
                                        <div className="p-2 bg-slate-900/40 text-[10px] text-slate-500 italic text-center">
                                            💡 Type a new name above to create a new section!
                                        </div>
                                    </div>
                                )}
                                {memberForm.formState.errors.section && (
                                    <p className="text-red-400 text-xs">{memberForm.formState.errors.section.message}</p>
                                )}
                            </div>

                            {/* Title Dropdown */}
                            <div className="flex flex-col gap-2 relative" onClick={(e) => e.stopPropagation()}>
                                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">
                                    Position / Title <span className="text-red-400">*</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            {...memberForm.register('title', { required: 'Title is required' })}
                                            placeholder="e.g. SENIOR HELPER, TRIAL HELPER"
                                            className="w-full pl-4 pr-10 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600 font-semibold"
                                            onClick={() => setShowTitleDropdown(true)}
                                            onFocus={() => setShowTitleDropdown(true)}
                                            style={{ color: watchColor }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowTitleDropdown(!showTitleDropdown)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
                                        >▼</button>
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#080d13] border border-slate-700 px-3 py-1.5 rounded-xl flex-shrink-0" title="Role/Title Custom Color">
                                        <input
                                            type="color"
                                            value={watchColor}
                                            onChange={(e) => memberForm.setValue('color', e.target.value)}
                                            className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={watchColor}
                                            onChange={(e) => memberForm.setValue('color', e.target.value)}
                                            placeholder="#FFFFFF"
                                            className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white text-xs font-mono uppercase focus:outline-none"
                                        />
                                    </div>
                                </div>
                                {showTitleDropdown && uniqueTitlesList.length > 0 && (
                                    <div className="absolute top-[78px] left-0 w-full bg-[#0b0f15] border border-slate-800 rounded-xl shadow-2xl z-30 max-h-48 overflow-y-auto divide-y divide-slate-800/50">
                                        {uniqueTitlesList.map((tLabel) => (
                                            <button
                                                key={tLabel}
                                                type="button"
                                                onClick={() => { memberForm.setValue('title', tLabel); setShowTitleDropdown(false); }}
                                                className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all"
                                            >
                                                {tLabel}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {memberForm.formState.errors.title && (
                                    <p className="text-red-400 text-xs">{memberForm.formState.errors.title.message}</p>
                                )}
                            </div>

                            {/* Name — Staff Dropdown */}
                            <div className="flex flex-col gap-2 relative" onClick={(e) => e.stopPropagation()}>
                                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                                    <span>Helper Name <span className="text-slate-500 font-normal">(from Staff List — leave blank for Vacant)</span></span>
                                    <span className="text-[10px] text-emerald-400/70 font-normal normal-case">{staffList.length} staff available</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={nameSearch}
                                            onChange={(e) => {
                                                setNameSearch(e.target.value);
                                                memberForm.setValue('name', e.target.value);
                                                setShowNameDropdown(true);
                                            }}
                                            onClick={() => setShowNameDropdown(true)}
                                            onFocus={() => setShowNameDropdown(true)}
                                            placeholder="Search staff name or leave blank for Vacant..."
                                            className="w-full pl-4 pr-10 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600 font-bold"
                                            style={{ color: watchNameColor }}
                                        />
                                        {nameSearch && (
                                            <button
                                                type="button"
                                                onClick={() => { setNameSearch(''); memberForm.setValue('name', ''); setShowNameDropdown(false); }}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-400 text-xs"
                                            >
                                                <MdClose size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#080d13] border border-slate-700 px-3 py-1.5 rounded-xl flex-shrink-0" title="Helper Name Custom Color">
                                        <input
                                            type="color"
                                            value={watchNameColor}
                                            onChange={(e) => memberForm.setValue('name_color', e.target.value)}
                                            className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={watchNameColor}
                                            onChange={(e) => memberForm.setValue('name_color', e.target.value)}
                                            placeholder="#FFFFFF"
                                            className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white text-xs font-mono uppercase focus:outline-none"
                                        />
                                    </div>
                                </div>
                                {showNameDropdown && filteredStaffNames.length > 0 && (
                                    <div className="absolute top-[78px] left-0 w-full bg-[#0b0f15] border border-emerald-900/50 rounded-xl shadow-2xl z-30 max-h-52 overflow-y-auto divide-y divide-slate-800/50">
                                        {filteredStaffNames.slice(0, 20).map((name) => (
                                            <button
                                                key={name}
                                                type="button"
                                                onClick={() => {
                                                    memberForm.setValue('name', name);
                                                    setNameSearch(name);
                                                    setShowNameDropdown(false);
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:text-emerald-300 hover:bg-emerald-900/20 transition-all flex items-center gap-2"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 flex-shrink-0" />
                                                {name}
                                            </button>
                                        ))}
                                        {filteredStaffNames.length === 0 && (
                                            <div className="px-4 py-3 text-slate-500 text-xs italic">No matching staff found</div>
                                        )}
                                    </div>
                                )}
                                {/* Hidden field to register 'name' with react-hook-form */}
                                <input type="hidden" {...memberForm.register('name')} />
                            </div>

                            {/* Country Flag Input */}
                            <div className="flex flex-col gap-2 relative" onClick={(e) => e.stopPropagation()}>
                                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Country Flag <span className="text-slate-500">(Optional)</span></label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                        className="w-full flex items-center justify-between px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm text-left focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                    >
                                        {selectedCountry ? (
                                            <span className="flex items-center gap-2">
                                                <span className="text-xl">{selectedCountry.emoji}</span>
                                                <span>{selectedCountry.name} ({selectedCountry.code.toUpperCase()})</span>
                                            </span>
                                        ) : watchCountry ? (
                                            <span className="flex items-center gap-2">
                                                <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/30 px-1.5 py-0.5 rounded uppercase">{watchCountry}</span>
                                                <span className="text-slate-400">Custom Code</span>
                                            </span>
                                        ) : (
                                            <span className="text-slate-500">Select Country...</span>
                                        )}
                                        <span className="text-slate-400 text-xs">▼</span>
                                    </button>
                                    <input
                                        type="text"
                                        maxLength={2}
                                        {...memberForm.register('country')}
                                        placeholder="Code"
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const code = flagEmojiToCountryCode(val);
                                            if (code) {
                                                memberForm.setValue('country', code);
                                            } else {
                                                memberForm.setValue('country', val.toLowerCase());
                                            }
                                        }}
                                        className="w-20 px-3 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-center text-sm font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all uppercase placeholder:text-slate-600"
                                        title="Direct Country Code (e.g. US, BD, PH)"
                                    />
                                </div>
                                {showCountryDropdown && (
                                    <div className="absolute top-[78px] left-0 w-full bg-[#0b0f15] border border-slate-800 rounded-xl shadow-2xl z-30 p-3">
                                        <input
                                            type="text"
                                            value={countrySearch}
                                            onChange={(e) => setCountrySearch(e.target.value)}
                                            placeholder="Search country..."
                                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none mb-2"
                                        />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-40 overflow-y-auto">
                                            {filteredCountries.map((c) => (
                                                <button
                                                    key={c.code}
                                                    type="button"
                                                    onClick={() => {
                                                        memberForm.setValue('country', c.code);
                                                        setShowCountryDropdown(false);
                                                    }}
                                                    className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 transition-all text-xs text-slate-300"
                                                >
                                                    <span className="text-base">{c.emoji}</span>
                                                    <span>{c.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">
                                    Description / Note <span className="text-slate-500">(Optional)</span>
                                </label>
                                <textarea
                                    rows={2}
                                    {...memberForm.register('description')}
                                    placeholder="e.g. Veteran helper, guides new players"
                                    className="w-full px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:opacity-50 text-white font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg text-sm"
                            >
                                {submitting ? 'Saving...' : editingMember ? 'Update Member' : 'Add to Helper Roster'}
                            </button>
                        </form>
                    </div>

                    {/* Section Filter */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className="text-slate-500 text-xs uppercase tracking-wider font-bold">Filter:</span>
                        {allSections.map(s => (
                            <button
                                key={s}
                                onClick={() => setFilterSection(s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filterSection === s
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    : 'text-slate-500 hover:text-slate-300 bg-slate-900/60'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    {/* Members List */}
                    {loading ? (
                        <div className="flex items-center gap-3 text-slate-400 py-8">
                            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            Loading members...
                        </div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="text-center py-12 text-slate-600 text-sm">
                            No helper roster members yet. Add one above!
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {sections
                                .filter(s => filterSection === 'ALL' || s === filterSection)
                                .map(sectionName => {
                                    const sectionData = grouped[sectionName];
                                    const isExpanded = expandedFactions[sectionName] !== false;
                                    const sectionMembers = filterSection === 'ALL'
                                        ? sectionData.members
                                        : filteredMembers.filter(m => m.section === sectionName);

                                    return (
                                        <div key={sectionName} className="bg-[#080d13] border border-slate-800/60 rounded-2xl overflow-hidden">
                                            {/* Section row */}
                                            <div
                                                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-800/30 transition-all"
                                                onClick={() => toggleFactionExpand(sectionName)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">🤝</span>
                                                    <div>
                                                        <p className="text-white font-bold uppercase tracking-wider text-sm">{sectionName}</p>
                                                        <p className="text-slate-500 text-xs">{sectionMembers.length} member{sectionMembers.length !== 1 ? 's' : ''}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); handleAddRoleForFaction(sectionName, sectionData.section_order); }}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-emerald-500/20 transition-all"
                                                    >
                                                        <MdAdd size={14} /> Add
                                                    </button>
                                                    <MdExpandMore
                                                        size={20}
                                                        className={`text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                                    />
                                                </div>
                                            </div>

                                            {/* Members in section */}
                                            {isExpanded && (
                                                <div className="border-t border-slate-800/60 divide-y divide-slate-800/40">
                                                    {sectionMembers
                                                        .sort((a, b) => a.sort_order - b.sort_order)
                                                        .map((member, index) => {
                                                            const globalIndex = filteredMembers.indexOf(member);
                                                            const isVacant = !member.name || member.name === 'Vacant';
                                                            return (
                                                                <div
                                                                    key={member.id}
                                                                    draggable
                                                                    onDragStart={() => handleDragStart(globalIndex)}
                                                                    onDragOver={(e) => handleDragOver(e, globalIndex)}
                                                                    onDrop={() => handleDrop(globalIndex)}
                                                                    onDragEnd={() => { setDraggedIndex(null); setDragOverIndex(null); }}
                                                                    className={`flex items-center gap-3 px-5 py-3 transition-all cursor-grab active:cursor-grabbing ${dragOverIndex === globalIndex ? 'bg-emerald-500/10 border-l-2 border-emerald-500' : 'hover:bg-slate-800/30'}`}
                                                                >
                                                                    <MdDragIndicator className="text-slate-600 flex-shrink-0" size={18} />

                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 flex-wrap">
                                                                            <span
                                                                                className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border"
                                                                                style={{ color: member.color || '#34d399', borderColor: `${member.color || '#34d399'}44`, backgroundColor: `${member.color || '#34d399'}11` }}
                                                                            >
                                                                                {member.title}
                                                                            </span>
                                                                            <span className={`text-sm font-bold ${isVacant ? 'text-yellow-400' : 'text-white'}`}>
                                                                                {isVacant ? '— VACANT —' : member.name}
                                                                            </span>
                                                                        </div>
                                                                        {member.description && (
                                                                            <p className="text-slate-500 text-xs mt-0.5 truncate">{member.description}</p>
                                                                        )}
                                                                    </div>

                                                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                                                        <button
                                                                            onClick={() => handleStartEdit(member)}
                                                                            className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-all"
                                                                            title="Edit"
                                                                        >
                                                                            <MdEdit size={15} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteMember(member.id)}
                                                                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                                                                            title="Delete"
                                                                        >
                                                                            <MdDelete size={15} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            )}

            {/* ══ TAB: SECTIONS ══ */}
            {activeTab === 'sections' && (
                <div>
                    {/* Add / Edit Section Form */}
                    <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6 mb-6">
                        <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-5 flex items-center gap-2">
                            {editingSection ? <MdEdit className="text-green-400" size={18} /> : <MdAdd className="text-green-400" size={18} />}
                            {editingSection ? 'Edit Section' : 'Add New Section'}
                            {editingSection && (
                                <button
                                    type="button"
                                    onClick={() => setEditingSection(null)}
                                    className="ml-auto flex items-center gap-1 text-slate-500 hover:text-slate-300 text-xs font-semibold uppercase transition-colors"
                                >
                                    <MdClose size={16} /> Cancel
                                </button>
                            )}
                        </h3>

                        <form onSubmit={editingSection ? handleUpdateSection : handleAddSection} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Section Name */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">
                                        Section Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editingSection ? editingSection.name : newSectionName}
                                        onChange={(e) => editingSection
                                            ? setEditingSection(prev => ({ ...prev, name: e.target.value }))
                                            : setNewSectionName(e.target.value)
                                        }
                                        placeholder="e.g. SENIOR HELPERS"
                                        className="w-full px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-slate-600 uppercase font-semibold"
                                        required
                                    />
                                </div>

                                {/* Sort Order */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Display Order</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={editingSection ? editingSection.sort_order : newSectionOrder}
                                        onChange={(e) => editingSection
                                            ? setEditingSection(prev => ({ ...prev, sort_order: Number(e.target.value) }))
                                            : setNewSectionOrder(Number(e.target.value))
                                        }
                                        className="w-full px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Color & Icon Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Color */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Section Color</label>
                                    <div className="flex items-center gap-3 bg-[#080d13] border border-slate-700 p-3 rounded-xl">
                                        <input
                                            type="color"
                                            value={editingSection ? (editingSection.color || '#34d399') : newSectionColor}
                                            onChange={(e) => editingSection
                                                ? setEditingSection(prev => ({ ...prev, color: e.target.value }))
                                                : setNewSectionColor(e.target.value)
                                            }
                                            className="w-9 h-9 rounded border border-slate-700 bg-transparent cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={editingSection ? (editingSection.color || '#34d399') : newSectionColor}
                                            onChange={(e) => editingSection
                                                ? setEditingSection(prev => ({ ...prev, color: e.target.value }))
                                                : setNewSectionColor(e.target.value)
                                            }
                                            className="flex-1 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white text-xs font-mono uppercase focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Icon */}
                                <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                                    <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Section Icon</label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            className="w-full flex items-center gap-3 px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm hover:border-green-500/50 transition-all"
                                        >
                                            <span className="text-xl">
                                                {editingSection ? (editingSection.icon || '🤝') : newSectionIcon}
                                            </span>
                                            <span className="text-slate-400 text-xs">Click to change icon</span>
                                            <span className="ml-auto text-slate-500 text-xs">▼</span>
                                        </button>
                                        {showEmojiPicker && (
                                            <div className="absolute top-full left-0 w-full mt-2 bg-[#0b0f15] border border-slate-800 rounded-xl shadow-2xl z-30 p-3">
                                                <input
                                                    type="text"
                                                    value={emojiSearch}
                                                    onChange={(e) => setEmojiSearch(e.target.value)}
                                                    placeholder="Search emoji..."
                                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none mb-2"
                                                />
                                                <div className="grid grid-cols-8 gap-1 max-h-40 overflow-y-auto">
                                                    {filteredEmojis.map((e) => (
                                                        <button
                                                            key={e.char}
                                                            type="button"
                                                            onClick={() => {
                                                                if (editingSection) setEditingSection(prev => ({ ...prev, icon: e.char }));
                                                                else setNewSectionIcon(e.char);
                                                                setShowEmojiPicker(false);
                                                            }}
                                                            className="text-xl p-1 rounded hover:bg-slate-800 transition-all"
                                                            title={e.name}
                                                        >
                                                            {e.char}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg text-sm flex items-center justify-center gap-2"
                            >
                                <MdSave size={16} />
                                {editingSection ? 'Update Section' : 'Create Section'}
                            </button>
                        </form>
                    </div>

                    {/* Sections List */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-slate-400 text-xs uppercase tracking-wider font-bold">
                                {sectionsList.length} Section{sectionsList.length !== 1 ? 's' : ''} — drag to reorder
                            </h3>
                        </div>

                        {sectionsList.length === 0 ? (
                            <div className="text-center py-12 text-slate-600 text-sm">
                                No sections yet. Add one above!
                            </div>
                        ) : (
                            sectionsList.map((sec, index) => {
                                const memberCount = members.filter(m => m.section.toUpperCase() === sec.name.toUpperCase()).length;
                                return (
                                    <div
                                        key={sec.id}
                                        draggable
                                        onDragStart={() => handleSecDragStart(index)}
                                        onDragOver={(e) => handleSecDragOver(e, index)}
                                        onDrop={() => handleSecDrop(index)}
                                        onDragEnd={() => { setDraggedSecIndex(null); setDragOverSecIndex(null); }}
                                        className={`flex items-center gap-3 bg-[#0d1117] border rounded-xl px-4 py-3 cursor-grab active:cursor-grabbing transition-all ${dragOverSecIndex === index
                                            ? 'border-emerald-500/60 bg-emerald-900/10'
                                            : 'border-slate-800 hover:border-slate-700'
                                            }`}
                                    >
                                        <MdDragIndicator className="text-slate-600 flex-shrink-0" size={20} />

                                        <span className="text-xl flex-shrink-0">{sec.icon || '🤝'}</span>

                                        <div
                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: sec.color || '#34d399', boxShadow: `0 0 8px ${sec.color || '#34d399'}80` }}
                                        />

                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-bold uppercase tracking-wider text-sm">{sec.name}</p>
                                            <p className="text-slate-500 text-xs">{memberCount} member{memberCount !== 1 ? 's' : ''} · order #{sec.sort_order}</p>
                                        </div>

                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                            <button
                                                onClick={() => setEditingSection({ ...sec })}
                                                className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <MdEdit size={15} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSection(sec.id)}
                                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <MdDelete size={15} />
                                            </button>
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

export default HelperRosterManager;
