import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import {
    MdAdd, MdDelete, MdEdit, MdClose, MdHelpOutline,
    MdDragIndicator, MdPeople, MdFolder, MdSave, MdChevronRight, MdExpandMore,
    MdImage, MdPalette, MdCloudUpload
} from 'react-icons/md';
import { toast } from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PRESET_COLORS = [
    { name: 'White', hex: '#ffffff' },
    { name: 'Red', hex: '#ff3b30' },
    { name: 'Green', hex: '#34c759' },
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

const getSectionIcon = (sectionName) => {
  const name = (sectionName || '').toUpperCase();
  if (name.includes('GOVERNMENT')) return '🏛️';
  if (name.includes('LAW') || name.includes('POLICE') || name.includes('SHERIFF')) return '🛡️';
  if (name.includes('AGENCY') || name.includes('AGENCIE')) return '📡';
  return '⚙️';
};

const RosterManager = () => {
    const [activeTab, setActiveTab] = useState('members'); // 'members' | 'sections' | 'header'
    const [members, setMembers] = useState([]);
    const [sectionsList, setSectionsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    // Section CRUD local states
    const [newSectionName, setNewSectionName] = useState('');
    const [newSectionOrder, setNewSectionOrder] = useState(0);
    const [newSectionColor, setNewSectionColor] = useState('#22d3ee');
    const [newSectionIcon, setNewSectionIcon] = useState('⚙️');
    const [editingSection, setEditingSection] = useState(null); // { id, name, sort_order, color, icon }

    // Emoji search popover states
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [emojiSearch, setEmojiSearch] = useState('');

    // Dropdown toggle
    const [showSectionDropdown, setShowSectionDropdown] = useState(false);
    const [showTitleDropdown, setShowTitleDropdown] = useState(false);
    const [lastAutofilledSection, setLastAutofilledSection] = useState('');

    // Drag reorder members
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    // Drag reorder sections
    const [draggedSecIndex, setDraggedSecIndex] = useState(null);
    const [dragOverSecIndex, setDragOverSecIndex] = useState(null);

    // Confirm modal
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

    // ── Govt Header state ──
    const [headerData, setHeaderData] = useState({
        image_url: 'https://i.imgur.com/YfVF1d0.png',
        title: 'THE UNITED STATES OF PARAISO',
        subtitle: 'Official Government Directory',
        title_color: '#c9a84c',
        subtitle_color: '#b9bbbe',
        footer_quote: 'One Nation. One Government. One Paraiso.'
    });
    const [headerSaving, setHeaderSaving] = useState(false);
    const [headerUploading, setHeaderUploading] = useState(false);
    const [headerDragging, setHeaderDragging] = useState(false);
    const [headerPreview, setHeaderPreview] = useState('');

    const fetchHeader = useCallback(async () => {
        try {
            const res = await fetch(`${BASE_URL}/page-settings/govt-header`);
            const data = await res.json();
            if (data && data.title) {
                setHeaderData(data);
                setHeaderPreview(data.image_url || '');
            }
        } catch { /* silent */ }
    }, []);

    const handleHeaderImageUpload = async (file) => {
        if (!file || !file.type.startsWith('image/')) {
            toast.error('Please select a valid image file.');
            return;
        }
        setHeaderUploading(true);
        const uploadToast = toast.loading('Uploading image to ImgBB...');
        const formData = new FormData();
        formData.append('image', file);
        try {
            const apiKey = import.meta.env.VITE_IMGBB_API_KEY || '60d09e5b34467e4012981e00e008a68a';
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: 'POST', body: formData });
            const result = await res.json();
            if (result.success) {
                const url = result.data.url;
                setHeaderData(prev => ({ ...prev, image_url: url }));
                setHeaderPreview(url);
                toast.success('Image uploaded!', { id: uploadToast });
            } else {
                throw new Error(result.error?.message || 'Upload failed');
            }
        } catch (err) {
            toast.error('Upload failed: ' + err.message, { id: uploadToast });
        } finally {
            setHeaderUploading(false);
        }
    };

    const handleSaveHeader = async () => {
        setHeaderSaving(true);
        const t = toast.loading('Saving header settings...');
        try {
            const res = await fetch(`${BASE_URL}/page-settings/govt-header`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(headerData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to save');
            toast.success('Header settings saved!', { id: t });
        } catch (err) {
            toast.error(err.message, { id: t });
        } finally {
            setHeaderSaving(false);
        }
    };

    // Collapsible Factions State
    const [expandedFactions, setExpandedFactions] = useState({});

    const toggleFactionExpand = (factionName) => {
        setExpandedFactions(prev => ({
            ...prev,
            [factionName]: !prev[factionName]
        }));
    };

    // Filter by section
    const [filterSection, setFilterSection] = useState('ALL');

    // Member form
    const memberForm = useForm({
        defaultValues: {
            section: '',
            section_order: 0,
            title: '',
            name: '',
            description: '',
            sort_order: 0,
            color: '#ffffff',
            name_color: '#ffffff',
        }
    });

    const watchSection = memberForm.watch('section');
    const watchColor = memberForm.watch('color') || '#ffffff';
    const watchNameColor = memberForm.watch('name_color', '#ffffff');

    const selectedSecObj = sectionsList.find(s => s.name.toUpperCase() === (watchSection || '').toUpperCase());

    const handleUpdateSelectedSecColor = async (newColor) => {
        if (!selectedSecObj) return;
        try {
            const res = await fetch(`${BASE_URL}/roster/sections/${selectedSecObj.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: selectedSecObj.name,
                    sort_order: selectedSecObj.sort_order,
                    color: newColor,
                    icon: selectedSecObj.icon || '⚙️'
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

    // Close dropdowns & emoji picker on click outside
    useEffect(() => {
        if (!showSectionDropdown && !showTitleDropdown && !showEmojiPicker) return;
        const closeOnOutsideClick = () => {
            setShowSectionDropdown(false);
            setShowTitleDropdown(false);
            setShowEmojiPicker(false);
        };
        window.addEventListener('click', closeOnOutsideClick);
        return () => window.removeEventListener('click', closeOnOutsideClick);
    }, [showSectionDropdown, showTitleDropdown, showEmojiPicker]);

    const fetchMembers = async () => {
        try {
            const res = await fetch(`${BASE_URL}/roster?_t=${Date.now()}`);
            const data = await res.json();
            setMembers(Array.isArray(data) ? data : []);
        } catch {
            setMembers([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchSections = async () => {
        try {
            const res = await fetch(`${BASE_URL}/roster/sections?_t=${Date.now()}`);
            const data = await res.json();
            const list = Array.isArray(data) ? data : [];
            setSectionsList(list);
            // Default new section order to list length + 1
            setNewSectionOrder(list.length + 1);
        } catch {
            setSectionsList([]);
        }
    };

    // Auto-fill section_order and member sort_order when a section is selected/changed
    useEffect(() => {
        if (!watchSection) return;

        const matched = sectionsList.find(s => s.name.toUpperCase() === watchSection.toUpperCase());
        if (matched) {
            memberForm.setValue('section_order', matched.sort_order);
        }

        // Only auto-fill sort_order if the section actually changed (prevents overwriting manual input)
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
        fetchHeader();

        // Auto-refresh when switching back to the admin manager tab
        const handleFocus = () => {
            fetchMembers();
            fetchSections();
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [fetchHeader]);

    // Group members by section
    const grouped = members.reduce((acc, m) => {
        if (!acc[m.section]) acc[m.section] = { section_order: m.section_order, members: [] };
        acc[m.section].members.push(m);
        return acc;
    }, {});
    const sections = Object.keys(grouped).sort((a, b) => grouped[a].section_order - grouped[b].section_order);
    const allSections = ['ALL', ...sections];

    // Unique sections combining explicitly managed ones & dynamic ones
    const uniqueSectionsList = Array.from(new Set([
        ...sectionsList.map(s => s.name),
        ...sections
    ]));

    // Unique role titles present in current database members (filtered by selected section so suggestions are section-specific)
    const uniqueTitlesList = Array.from(new Set(
        members
            .filter(m => !watchSection || m.section.toUpperCase() === watchSection.toUpperCase())
            .map(m => m.title)
            .filter(Boolean)
    ));

    // Filter emojis based on search query
    const filteredEmojis = emojiLib.filter(emoji => 
        emoji.name.toLowerCase().includes(emojiSearch.toLowerCase()) || 
        emoji.char.includes(emojiSearch)
    );

    const filteredMembers = filterSection === 'ALL'
        ? members
        : members.filter(m => m.section === filterSection);

    // ════════════ MEMBERS CRUD ════════════

    const executeAddOrUpdateMember = async (data) => {
        const isEditing = !!editingMember;
        setSubmitting(true);
        const t = toast.loading(isEditing ? 'Updating member...' : 'Adding member...');
        try {
            const url = isEditing ? `${BASE_URL}/roster/${editingMember.id}` : `${BASE_URL}/roster`;
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
            
            // Auto add section if it doesn't exist yet in sectionsList
            const existsInList = sectionsList.some(s => s.name.toUpperCase() === data.section.toUpperCase());
            if (!existsInList && data.section.trim()) {
                await fetch(`${BASE_URL}/roster/sections`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ name: data.section, sort_order: data.section_order })
                });
                fetchSections();
            }

            // Set member sort order for the next one automatically
            const countInSec = members.filter(m => m.section.toUpperCase() === data.section.toUpperCase()).length;
            const nextOrder = isEditing ? (countInSec + 1) : (countInSec + 2);
            setLastAutofilledSection(data.section);

            memberForm.reset({
                section: data.section,
                section_order: data.section_order,
                title: '',
                name: '',
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
            title: editingMember ? 'Update Roster Member' : 'Add Roster Member',
            message: editingMember
                ? 'Are you sure you want to update this member?'
                : 'Are you sure you want to add this member to the roster?',
            onConfirm: () => {
                executeAddOrUpdateMember(data);
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const executeDeleteMember = async (id) => {
        const t = toast.loading('Deleting member...');
        try {
            const res = await fetch(`${BASE_URL}/roster/${id}`, { method: 'DELETE', credentials: 'include' });
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
            title: 'Delete Roster Member',
            message: 'Are you sure? This cannot be undone.',
            onConfirm: () => {
                executeDeleteMember(id);
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleStartEdit = (member) => {
        setEditingMember(member);
        setLastAutofilledSection(member.section);
        setActiveTab('members');
        memberForm.setValue('section', member.section);
        memberForm.setValue('section_order', member.section_order);
        memberForm.setValue('title', member.title);
        memberForm.setValue('name', member.name);
        memberForm.setValue('description', member.description || '');
        memberForm.setValue('sort_order', member.sort_order || 0);
        memberForm.setValue('color', member.color || '#ffffff');
        memberForm.setValue('name_color', member.name_color || '#ffffff');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingMember(null);
        setLastAutofilledSection('');
        memberForm.reset({ section: '', section_order: 0, title: '', name: '', description: '', sort_order: 0, color: '#ffffff', name_color: '#ffffff' });
    };

    // Quick shortcut to add a new role/position under a specific faction
    const handleAddRoleForFaction = (factionName, factionOrder) => {
        handleCancelEdit();
        memberForm.setValue('section', factionName);
        memberForm.setValue('section_order', factionOrder);

        const countInSec = members.filter(m => m.section.toUpperCase() === factionName.toUpperCase()).length;
        memberForm.setValue('sort_order', countInSec + 1);
        memberForm.setValue('color', '#ffffff');

        setLastAutofilledSection(factionName);
        setActiveTab('members');

        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const titleInput = document.querySelector('input[placeholder*="PRESIDENT"]');
            if (titleInput) titleInput.focus();
        }, 100);
    };

    // Member Drag reorder
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
        const t = toast.loading('Saving member order...');
        try {
            const res = await fetch(`${BASE_URL}/roster/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ orders }),
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || 'Reorder failed');
            }
            toast.success('Order saved!', { id: t });
        } catch (err) {
            toast.error(err.message || 'Reorder failed', { id: t });
            fetchMembers();
        }
    };

    // ════════════ FACTIONS / SECTIONS CRUD ════════════

    const handleAddSection = async (e) => {
        e.preventDefault();
        if (!newSectionName.trim()) return;
        const t = toast.loading('Creating section...');
        try {
            const res = await fetch(`${BASE_URL}/roster/sections`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ 
                    name: newSectionName, 
                    sort_order: newSectionOrder, 
                    color: newSectionColor,
                    icon: newSectionIcon
                }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            toast.success('Section created!', { id: t });
            setNewSectionName('');
            setNewSectionOrder(0);
            setNewSectionColor('#22d3ee');
            setNewSectionIcon('⚙️');
            fetchSections();
            fetchMembers();
        } catch (err) {
            toast.error(err.message || 'Failed to create section', { id: t });
        }
    };

    const handleUpdateSection = async (e) => {
        e.preventDefault();
        if (!editingSection || !editingSection.name.trim()) return;
        const t = toast.loading('Updating section...');
        try {
            const res = await fetch(`${BASE_URL}/roster/sections/${editingSection.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ 
                    name: editingSection.name, 
                    sort_order: editingSection.sort_order,
                    color: editingSection.color || '#22d3ee',
                    icon: editingSection.icon || '⚙️'
                }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            toast.success('Section updated!', { id: t });
            setEditingSection(null);
            fetchSections();
            fetchMembers();
        } catch (err) {
            toast.error(err.message || 'Failed to update section', { id: t });
        }
    };

    const handleDeleteSection = (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Section',
            message: 'Are you sure you want to delete this section? All roster members assigned to it will be permanently deleted.',
            onConfirm: async () => {
                const t = toast.loading('Deleting section...');
                try {
                    const res = await fetch(`${BASE_URL}/roster/sections/${id}`, {
                        method: 'DELETE',
                        credentials: 'include'
                     });
                     if (!res.ok) throw new Error('Delete failed');
                     toast.success('Section deleted!', { id: t });
                     setConfirmModal(prev => ({ ...prev, isOpen: false }));
                     fetchSections();
                     fetchMembers();
                } catch (err) {
                    toast.error(err.message || 'Failed to delete section', { id: t });
                }
            }
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
            const res = await fetch(`${BASE_URL}/roster/sections/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ orders }),
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || 'Reorder failed');
            }
            toast.success('Sections order saved!', { id: t });
            fetchMembers();
        } catch (err) {
            toast.error(err.message || 'Reorder failed', { id: t });
            fetchSections();
        }
    };

    return (
        <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider">Faction Roster</h2>
                    <p className="text-slate-400 text-sm mt-1">Manage government roster members, sections, and ordering.</p>
                </div>
                {/* Tabs */}
                <div className="flex flex-wrap gap-1 bg-[#0d1117] border border-slate-800 rounded-xl p-1 self-start sm:self-center">
                    <button
                        onClick={() => { setActiveTab('members'); handleCancelEdit(); }}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                            activeTab === 'members'
                                ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <MdPeople size={16} /> Members
                    </button>
                    <button
                        onClick={() => { setActiveTab('sections'); handleCancelEdit(); }}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                            activeTab === 'sections'
                                ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <MdFolder size={16} /> Factions & Sections ({sectionsList.length})
                    </button>
                    <button
                        onClick={() => { setActiveTab('header'); handleCancelEdit(); fetchHeader(); }}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                            activeTab === 'header'
                                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <MdImage size={16} /> Page Header
                    </button>
                </div>
            </div>

            {/* Confirm Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md px-4">
                    <div className="bg-[#0b0f15] border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500" />
                        <div className="flex items-start gap-4 mb-4 mt-2">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-yellow-500/10 text-yellow-400">
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
                                className="px-5 py-2.5 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                            >
                                Yes, Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: ADD/EDIT MEMBER */}
            {activeTab === 'members' && (
                <div>
                    {/* Form */}
                    <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6 mb-8">
                        <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-5 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                {editingMember ? <MdEdit className="text-yellow-400" size={18} /> : <MdAdd className="text-yellow-400" size={18} />}
                                {editingMember ? 'Edit Roster Member' : 'Add Roster Member'}
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
                            {/* Section / Faction Dropdown Input */}
                            <div className="flex flex-col gap-2 relative" onClick={(e) => e.stopPropagation()}>
                                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">
                                    Section / Faction Group <span className="text-red-400">*</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            {...memberForm.register('section', { required: 'Section/Faction is required' })}
                                            placeholder="Type custom name or click arrow to choose"
                                            className="w-full pl-4 pr-10 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-slate-600 uppercase font-semibold"
                                            onClick={() => setShowSectionDropdown(true)}
                                            onFocus={() => setShowSectionDropdown(true)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowSectionDropdown(!showSectionDropdown)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none text-xs"
                                        >
                                            ▼
                                        </button>
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
                                                onClick={() => {
                                                    memberForm.setValue('section', secLabel);
                                                    setShowSectionDropdown(false);
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all"
                                            >
                                                {secLabel}
                                            </button>
                                        ))}
                                        <div className="p-2 bg-slate-900/40 text-[10px] text-slate-500 italic text-center">
                                            💡 Type a brand new name directly above to create a new section/faction!
                                        </div>
                                    </div>
                                )}
                                {memberForm.formState.errors.section && (
                                    <p className="text-red-400 text-xs">{memberForm.formState.errors.section.message}</p>
                                )}
                            </div>

                            {/* Position / Role Title Input */}
                            <div className="flex flex-col gap-2 relative" onClick={(e) => e.stopPropagation()}>
                                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">
                                    Position / Role Title <span className="text-red-400">*</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            {...memberForm.register('title', { required: 'Title is required' })}
                                            placeholder="e.g. PRESIDENT, CHIEF OF POLICE"
                                            className="w-full pl-4 pr-10 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-slate-600 font-semibold"
                                            onClick={() => setShowTitleDropdown(true)}
                                            onFocus={() => setShowTitleDropdown(true)}
                                            style={{ color: watchColor }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowTitleDropdown(!showTitleDropdown)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none text-xs"
                                        >
                                            ▼
                                        </button>
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
                                                onClick={() => {
                                                    memberForm.setValue('title', tLabel);
                                                    setShowTitleDropdown(false);
                                                }}
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

                            {/* Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">
                                    Member Name <span className="text-slate-500">(leave blank for "Vacant")</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        {...memberForm.register('name')}
                                        placeholder="e.g. Brian Gutierrez  (or leave blank = Vacant)"
                                        className="flex-1 px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-slate-600 font-bold"
                                        style={{ color: watchNameColor }}
                                    />
                                    <div className="flex items-center gap-2 bg-[#080d13] border border-slate-700 px-3 py-1.5 rounded-xl flex-shrink-0" title="Member Name Custom Color">
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
                            </div>



                            {/* Description */}
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">
                                    Description / Responsibilities <span className="text-slate-500">(Optional)</span>
                                </label>
                                <textarea
                                    rows={3}
                                    {...memberForm.register('description')}
                                    placeholder="e.g. Head of State and Government"
                                    className="w-full px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-slate-600 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:opacity-50 text-white font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg text-sm"
                            >
                                {submitting ? 'Saving...' : editingMember ? 'Update Member' : 'Add to Roster'}
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
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                    filterSection === s
                                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                                }`}
                            >
                                {s === 'ALL' ? 'All' : s.length > 20 ? s.substring(0, 20) + '…' : s}
                            </button>
                        ))}
                    </div>

                    {/* Members List */}
                    {loading ? (
                        <div className="flex items-center gap-3 text-slate-400 py-10">
                            <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                            Loading members...
                        </div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-10 text-center text-slate-500">
                            No members found. Add one above!
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredMembers.map((member, index) => (
                                <div
                                    key={member.id}
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDrop={() => handleDrop(index)}
                                    onDragEnd={() => { setDraggedIndex(null); setDragOverIndex(null); }}
                                    className={`bg-[#0d1117] border rounded-xl px-4 py-3 flex items-start gap-3 transition-all cursor-grab active:cursor-grabbing ${
                                        dragOverIndex === index && draggedIndex !== index
                                            ? 'border-yellow-500/60 bg-yellow-500/5'
                                            : draggedIndex === index
                                            ? 'border-yellow-500/30 opacity-50'
                                            : 'border-slate-800 hover:border-slate-700'
                                    }`}
                                >
                                    <MdDragIndicator className="text-slate-600 mt-1 flex-shrink-0" size={18} />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                                                {member.section}
                                            </span>
                                        </div>
                                        <p 
                                            style={{ color: member.color || '#ffffff' }}
                                            className="font-black text-sm uppercase tracking-wide"
                                        >
                                            {member.title}
                                        </p>
                                        <p className={`text-sm font-bold ${member.name === 'Vacant' ? 'text-yellow-400' : 'text-green-400'}`}>
                                            {member.name}
                                        </p>
                                        {member.description && (
                                            <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{member.description}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <button
                                            onClick={() => handleStartEdit(member)}
                                            className="p-2 rounded-lg bg-slate-800 hover:bg-yellow-500/20 text-slate-400 hover:text-yellow-400 transition-all"
                                            title="Edit"
                                        >
                                            <MdEdit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteMember(member.id)}
                                            className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                                            title="Delete"
                                        >
                                            <MdDelete size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB: SECTIONS / FACTIONS MANAGEMENT */}
            {activeTab === 'sections' && (
                <div className="space-y-6">
                    {/* Section Creator / Editor Form */}
                    <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-5 flex items-center justify-between">
                            <span className="flex items-center gap-2 text-red-400">
                                <MdFolder size={18} />
                                {editingSection ? 'Edit Roster Faction / Section' : 'Create Roster Faction / Section'}
                            </span>
                            {editingSection && (
                                <button
                                    onClick={() => setEditingSection(null)}
                                    className="flex items-center gap-1 text-slate-500 hover:text-slate-300 text-xs font-semibold uppercase tracking-wider transition-colors"
                                >
                                    <MdClose size={16} /> Cancel Edit
                                </button>
                            )}
                        </h3>

                        <form
                            onSubmit={editingSection ? handleUpdateSection : handleAddSection}
                            className="flex flex-col gap-4"
                        >
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Faction / Section Name</label>
                                <input
                                    type="text"
                                    value={editingSection ? editingSection.name : newSectionName}
                                    onChange={(e) => {
                                        if (editingSection) setEditingSection({ ...editingSection, name: e.target.value });
                                        else setNewSectionName(e.target.value);
                                    }}
                                    placeholder="e.g. FEDERAL GOVERNMENT"
                                    className="w-full px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all uppercase font-semibold placeholder:text-slate-600"
                                    required
                                />
                            </div>

                            {/* Color Palette Picker for Faction */}
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                                    <span>Faction Accent Color</span>
                                    <span className="text-[10px] text-slate-500 font-normal">Styles the header & theme color of this faction on the roster</span>
                                </label>
                                <div className="flex items-center gap-3 bg-[#080d13] border border-slate-700 p-3 rounded-xl">
                                    <div className="flex flex-wrap gap-2 flex-1">
                                        {PRESET_COLORS.map(c => {
                                            const activeColor = editingSection ? (editingSection.color || '#22d3ee') : newSectionColor;
                                            return (
                                                <button
                                                    key={c.hex}
                                                    type="button"
                                                    onClick={() => {
                                                        if (editingSection) setEditingSection({ ...editingSection, color: c.hex });
                                                        else setNewSectionColor(c.hex);
                                                    }}
                                                    className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                                                        activeColor.toLowerCase() === c.hex.toLowerCase()
                                                            ? 'border-white scale-105 shadow-md shadow-white/20'
                                                            : 'border-slate-800'
                                                    }`}
                                                    style={{ backgroundColor: c.hex }}
                                                    title={c.name}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
                                        <input
                                            type="color"
                                            value={editingSection ? (editingSection.color || '#22d3ee') : newSectionColor}
                                            onChange={(e) => {
                                                if (editingSection) setEditingSection({ ...editingSection, color: e.target.value });
                                                else setNewSectionColor(e.target.value);
                                            }}
                                            className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={editingSection ? (editingSection.color || '#22d3ee') : newSectionColor}
                                            onChange={(e) => {
                                                if (editingSection) setEditingSection({ ...editingSection, color: e.target.value });
                                                else setNewSectionColor(e.target.value);
                                            }}
                                            placeholder="#22D3EE"
                                            className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white text-xs font-mono uppercase focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Emoji Icon Picker for Faction */}
                            <div className="flex flex-col gap-2 relative" onClick={(e) => e.stopPropagation()}>
                                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                                    <span>Faction Icon / Emoji</span>
                                    <span className="text-[10px] text-slate-500 font-normal">Pick or search an icon for this section</span>
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={editingSection ? (editingSection.icon || '⚙️') : newSectionIcon}
                                        onChange={(e) => {
                                            if (editingSection) setEditingSection({ ...editingSection, icon: e.target.value });
                                            else setNewSectionIcon(e.target.value);
                                        }}
                                        placeholder="e.g. ⚙️ or 🏛️"
                                        className="w-full px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-semibold"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 flex-shrink-0"
                                    >
                                        🔍 Search Emojis
                                    </button>
                                </div>

                                {/* Google-like Searchable Emoji Library Dropdown */}
                                {showEmojiPicker && (
                                    <div className="absolute top-[80px] right-0 w-80 z-30 bg-[#0b0f15] border border-slate-800 rounded-2xl p-4 shadow-2xl animate-in fade-in duration-200 max-h-80 flex flex-col gap-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <input
                                                type="text"
                                                value={emojiSearch}
                                                onChange={(e) => setEmojiSearch(e.target.value)}
                                                placeholder="Search emojis by name (e.g. king, star, shield, cop)..."
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
                                                            if (editingSection) setEditingSection({ ...editingSection, icon: emoji.char });
                                                            else setNewSectionIcon(emoji.char);
                                                            setShowEmojiPicker(false);
                                                            setEmojiSearch('');
                                                        }}
                                                        className="w-10 h-10 rounded-lg bg-[#0e141c] hover:bg-slate-800 flex items-center justify-center text-xl transition-all border border-transparent hover:border-red-500/50"
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

                            <button
                                type="submit"
                                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg text-sm flex items-center justify-center gap-2"
                            >
                                {editingSection ? <MdSave size={18} /> : <MdAdd size={18} />}
                                {editingSection ? 'Save' : 'Create'}
                            </button>
                        </form>
                    </div>

                    {/* Factions & Sections List */}
                    <div className="space-y-4">
                        <h3 className="text-slate-400 font-bold uppercase tracking-wider text-xs">Existing Factions & Sections List (Drag to Reorder)</h3>
                        
                        {sectionsList.length === 0 ? (
                            <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-10 text-center text-slate-500">
                                No sections created yet. Add one above!
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {sectionsList.map((sec, index) => {
                                    const factionMembers = members.filter(m => m.section.toUpperCase() === sec.name.toUpperCase());
                                    const isExpanded = !!expandedFactions[sec.name];
                                    
                                    return (
                                        <div
                                            key={sec.id}
                                            draggable
                                            onDragStart={() => handleSecDragStart(index)}
                                            onDragOver={(e) => handleSecDragOver(e, index)}
                                            onDrop={() => handleSecDrop(index)}
                                            onDragEnd={() => { setDraggedSecIndex(null); setDragOverSecIndex(null); }}
                                            className={`bg-[#0d1117] border rounded-2xl p-4 transition-all ${
                                                dragOverSecIndex === index && draggedSecIndex !== index
                                                    ? 'border-red-500/60 bg-red-500/5'
                                                    : draggedSecIndex === index
                                                    ? 'border-red-500/30 opacity-50'
                                                    : 'border-slate-800 hover:border-slate-700'
                                            }`}
                                        >
                                            {/* Faction Header Info (Click to Toggle collapse/expand) */}
                                            <div 
                                                onClick={() => toggleFactionExpand(sec.name)}
                                                className="flex items-center justify-between cursor-pointer select-none group"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div 
                                                        className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-slate-300"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <MdDragIndicator size={18} />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {isExpanded ? (
                                                            <MdExpandMore size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                                                        ) : (
                                                            <MdChevronRight size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                                                        )}
                                                        <span className="text-base flex-shrink-0">{sec.icon || getSectionIcon(sec.name)}</span>
                                                        <div>
                                                            <p 
                                                                style={{ color: sec.color || '#22d3ee' }}
                                                                className="font-black text-sm uppercase tracking-wider group-hover:text-yellow-400/90 transition-colors"
                                                            >
                                                                {sec.name}
                                                            </p>
                                                            <p className="text-slate-500 text-xs mt-0.5 font-medium">
                                                                Order: {sec.sort_order} · Total Roles/Positions: {factionMembers.length}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => handleAddRoleForFaction(sec.name, sec.sort_order)}
                                                        className="px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/20 text-yellow-400 text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-1"
                                                        title="Add Role to this Faction"
                                                    >
                                                        <MdAdd size={14} /> Add Role
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingSection(sec)}
                                                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                                                        title="Rename Faction"
                                                    >
                                                        <MdEdit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSection(sec.id)}
                                                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                                                        title="Delete Faction"
                                                    >
                                                        <MdDelete size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Roles under this Faction (Collapsible) */}
                                            {isExpanded && (
                                                <div className="space-y-1.5 pl-6 mt-4 pt-3 border-t border-slate-800/60 animate-fadeIn">
                                                    {factionMembers.length === 0 ? (
                                                        <p className="text-slate-600 text-xs italic py-1">
                                                            No roles/positions created under this faction yet. Click "+ Add Role" above to start!
                                                        </p>
                                                    ) : (
                                                        factionMembers.map((member) => (
                                                            <div
                                                                key={member.id}
                                                                className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-[#080d13] border border-slate-900 hover:border-slate-800 transition-all"
                                                            >
                                                                <div className="min-w-0">
                                                                    <span 
                                                                        style={{ color: member.color || '#ffffff' }}
                                                                        className="text-xs font-black uppercase tracking-wide"
                                                                    >
                                                                        {member.title}
                                                                    </span>
                                                                    <span className="text-slate-500 text-[11px] ml-2 font-semibold">
                                                                        — {member.name || 'Vacant'}
                                                                    </span>
                                                                </div>
                                                                <div className="flex gap-1.5">
                                                                    <button
                                                                        onClick={() => handleStartEdit(member)}
                                                                        className="p-1 text-slate-500 hover:text-yellow-400 transition-all"
                                                                        title="Edit Role Details"
                                                                    >
                                                                        <MdEdit size={14} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteMember(member.id)}
                                                                        className="p-1 text-slate-500 hover:text-red-400 transition-all"
                                                                        title="Delete Role"
                                                                    >
                                                                        <MdDelete size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB: PAGE HEADER SETTINGS */}
            {activeTab === 'header' && (
                <div className="space-y-6">
                    <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-1 flex items-center gap-2">
                            <MdPalette className="text-cyan-400" size={18} /> Government Roster — Page Header
                        </h3>
                        <p className="text-slate-500 text-xs mb-6">Edit the top section of the Government Roster public page: seal image, title, subtitle, and footer quote.</p>

                        {/* Seal Image Upload */}
                        <div className="mb-6">
                            <label className="text-slate-300 text-xs font-bold uppercase tracking-wider block mb-2">Seal / Header Image</label>
                            <div
                                onDragOver={(e) => { e.preventDefault(); setHeaderDragging(true); }}
                                onDragLeave={() => setHeaderDragging(false)}
                                onDrop={(e) => { e.preventDefault(); setHeaderDragging(false); const file = e.dataTransfer.files[0]; if (file) handleHeaderImageUpload(file); }}
                                onClick={() => document.getElementById('header-img-input').click()}
                                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                                    headerDragging ? 'border-cyan-400 bg-cyan-500/5'
                                    : headerPreview ? 'border-green-500/40 bg-green-500/5'
                                    : 'border-slate-700 hover:border-cyan-500 bg-[#080d13]'
                                }`}
                            >
                                <input type="file" accept="image/*" id="header-img-input" className="hidden" onChange={(e) => { const f = e.target.files[0]; if (f) handleHeaderImageUpload(f); }} />
                                {headerUploading ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                                        <p className="text-cyan-400 text-xs font-bold uppercase">Uploading to ImgBB...</p>
                                    </div>
                                ) : headerPreview ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <img src={headerPreview} alt="Preview" className="h-24 w-24 object-contain rounded-xl border border-slate-700 drop-shadow-lg" />
                                        <p className="text-green-400 text-xs font-bold uppercase">✓ Image ready — click to change</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <MdCloudUpload className="text-slate-500" size={32} />
                                        <p className="text-slate-300 text-sm font-semibold">Drag & drop image here, or <span className="text-cyan-400">browse</span></p>
                                        <p className="text-slate-500 text-xs">Hosts automatically on ImgBB. Or paste URL below.</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-3">
                                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1.5">Or Paste Image URL</label>
                                <input
                                    type="url"
                                    value={headerData.image_url || ''}
                                    onChange={(e) => { setHeaderData(prev => ({ ...prev, image_url: e.target.value })); setHeaderPreview(e.target.value); }}
                                    placeholder="https://i.imgur.com/..."
                                    className="w-full px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        {/* Title & Subtitle */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Page Title</label>
                                <input
                                    type="text"
                                    value={headerData.title || ''}
                                    onChange={(e) => setHeaderData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="THE UNITED STATES OF PARAISO"
                                    className="w-full px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Subtitle</label>
                                <input
                                    type="text"
                                    value={headerData.subtitle || ''}
                                    onChange={(e) => setHeaderData(prev => ({ ...prev, subtitle: e.target.value }))}
                                    placeholder="Official Government Directory"
                                    className="w-full px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        {/* Color Pickers */}
                        <div className="border border-slate-800/80 bg-slate-900/30 rounded-2xl p-4 mb-4">
                            <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-3">
                                <MdPalette size={16} /> Color Settings
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Title Color</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={headerData.title_color || '#c9a84c'} onChange={(e) => setHeaderData(prev => ({ ...prev, title_color: e.target.value }))} className="w-10 h-10 border-0 bg-transparent rounded cursor-pointer flex-shrink-0" />
                                        <input type="text" value={headerData.title_color || '#c9a84c'} onChange={(e) => setHeaderData(prev => ({ ...prev, title_color: e.target.value }))} placeholder="#c9a84c" className="w-full px-3 py-2 bg-[#080d13] border border-slate-700 rounded-lg text-white text-xs font-mono focus:outline-none" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Subtitle Color</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={headerData.subtitle_color || '#b9bbbe'} onChange={(e) => setHeaderData(prev => ({ ...prev, subtitle_color: e.target.value }))} className="w-10 h-10 border-0 bg-transparent rounded cursor-pointer flex-shrink-0" />
                                        <input type="text" value={headerData.subtitle_color || '#b9bbbe'} onChange={(e) => setHeaderData(prev => ({ ...prev, subtitle_color: e.target.value }))} placeholder="#b9bbbe" className="w-full px-3 py-2 bg-[#080d13] border border-slate-700 rounded-lg text-white text-xs font-mono focus:outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Quote */}
                        <div className="flex flex-col gap-2 mb-6">
                            <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Footer Quote</label>
                            <input
                                type="text"
                                value={headerData.footer_quote || ''}
                                onChange={(e) => setHeaderData(prev => ({ ...prev, footer_quote: e.target.value }))}
                                placeholder="One Nation. One Government. One Paraiso."
                                className="w-full px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                            />
                        </div>

                        {/* Live Preview */}
                        <div className="border border-cyan-500/20 bg-[#0a0f1e] rounded-2xl p-6 mb-6 flex flex-col items-center">
                            <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">Live Preview</p>
                            {headerData.image_url && (
                                <img src={headerData.image_url} alt="Seal preview" className="w-24 h-24 object-contain mb-3 drop-shadow-lg" onError={(e) => { e.target.style.display = 'none'; }} />
                            )}
                            <p className="text-xl font-black tracking-widest uppercase text-center mb-1" style={{ color: headerData.title_color || '#c9a84c' }}>{headerData.title || 'PAGE TITLE'}</p>
                            <p className="text-sm" style={{ color: headerData.subtitle_color || '#b9bbbe' }}>{headerData.subtitle || 'Subtitle'}</p>
                            {headerData.footer_quote && (
                                <p className="mt-3 text-xs font-bold uppercase tracking-wider" style={{ color: headerData.title_color || '#c9a84c', opacity: 0.7 }}>&quot;{headerData.footer_quote}&quot;</p>
                            )}
                        </div>

                        <button
                            onClick={handleSaveHeader}
                            disabled={headerSaving}
                            className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-black font-bold uppercase tracking-widest text-sm rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/20 active:scale-95"
                        >
                            <MdSave size={18} />
                            {headerSaving ? 'Saving...' : 'Save Header Settings'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RosterManager;
