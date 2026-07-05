import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

// Let's use standard icons from react-icons/md instead of material icon imports to avoid matching issues with existing files.
import {
    MdDashboard, MdImage, MdCampaign, MdLogout, MdMenu, MdClose, MdPeople, MdSupervisedUserCircle, MdHome, MdOutlineAccountBalance, MdGroup, MdQuestionAnswer,
    MdAccountTree, MdFormatListBulleted, MdCategory, MdOutlineReceipt, MdAdd, MdDelete, MdEdit, MdArrowUpward, MdArrowDownward, MdSave, MdCancel
} from 'react-icons/md';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ChainOfCommandManager = () => {
    const [activeTab, setActiveTab] = useState('cards'); // 'cards' | 'categories'

    // Categories State
    const [categories, setCategories] = useState([]);
    const [catLoading, setCatLoading] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [editingCatId, setEditingCatId] = useState(null);
    const [editingCatName, setEditingCatName] = useState('');

    // Cards State
    const [cocList, setCocList] = useState([]);
    const [cardsLoading, setCardsLoading] = useState(true);
    const [savingCard, setSavingCard] = useState(false);

    // Card Form State
    const [isEditingCard, setIsEditingCard] = useState(false);
    const [currentCardId, setCurrentCardId] = useState(null);
    const [categoryId, setCategoryId] = useState('');
    const [layout, setLayout] = useState('detailed'); // 'simple' | 'detailed'
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('');
    const [footerText, setFooterText] = useState('');
    const [color, setColor] = useState('#22d3ee');
    const [reportsGroups, setReportsGroups] = useState([]);
    const [newGroupTitle, setNewGroupTitle] = useState('');

    // Collapsed states
    const [expandedCoC, setExpandedCoC] = useState({});

    // Fetch Categories
    const fetchCategories = async () => {
        try {
            setCatLoading(true);
            const res = await fetch(`${BASE_URL}/chain-of-command/categories`);
            if (!res.ok) throw new Error('Failed to fetch categories');
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
            if (data.length > 0 && !categoryId) {
                setCategoryId(data[0].id.toString());
            }
        } catch (err) {
            toast.error(err.message || 'Error loading categories');
        } finally {
            setCatLoading(false);
        }
    };

    // Fetch Cards
    const fetchCards = async () => {
        try {
            setCardsLoading(true);
            const res = await fetch(`${BASE_URL}/chain-of-command`);
            if (!res.ok) throw new Error('Failed to fetch CoC entries');
            const data = await res.json();
            setCocList(Array.isArray(data) ? data : []);
        } catch (err) {
            toast.error(err.message || 'Error loading CoC entries');
        } finally {
            setCardsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchCards();
    }, []);

    // ════════════ CATEGORY CRUD ════════════

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!newCatName.trim()) return;

        try {
            const res = await fetch(`${BASE_URL}/chain-of-command/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: newCatName.trim() })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to create category');

            toast.success('Category created successfully!');
            setNewCatName('');
            fetchCategories();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleUpdateCategory = async (id) => {
        if (!editingCatName.trim()) return;
        try {
            const res = await fetch(`${BASE_URL}/chain-of-command/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: editingCatName.trim() })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to rename category');

            toast.success('Category renamed!');
            setEditingCatId(null);
            fetchCategories();
            fetchCards(); // Refresh joined names
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDeleteCategory = async (id, name) => {
        if (!window.confirm(`WARNING: Deleting category "${name}" will delete all associated Chain of Command cards inside it. Proceed?`)) return;

        try {
            const res = await fetch(`${BASE_URL}/chain-of-command/categories/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to delete category');

            toast.success('Category deleted successfully');
            fetchCategories();
            fetchCards();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleMoveCategory = async (index, direction) => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= categories.length) return;

        const updatedCategories = [...categories];
        const temp = updatedCategories[index];
        updatedCategories[index] = updatedCategories[targetIndex];
        updatedCategories[targetIndex] = temp;

        const orders = updatedCategories.map((cat, idx) => ({
            id: cat.id,
            sort_order: idx
        }));

        setCategories(updatedCategories);

        try {
            const res = await fetch(`${BASE_URL}/chain-of-command/categories/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ orders })
            });
            if (!res.ok) throw new Error('Failed to save category sequence');
            fetchCards(); // Re-sort cards list as well
        } catch (err) {
            toast.error(err.message);
            fetchCategories();
        }
    };

    // ════════════ CARD CRUD ════════════

    const handleAddGroup = () => {
        if (!newGroupTitle.trim()) {
            toast.error('Please enter a group title');
            return;
        }
        setReportsGroups(prev => [
            ...prev,
            { id: Date.now(), group_title: newGroupTitle.trim(), items: [] }
        ]);
        setNewGroupTitle('');
    };

    const handleRemoveGroup = (groupId) => {
        setReportsGroups(prev => prev.filter(g => g.id !== groupId));
    };

    const handleAddItemToGroup = (groupId, itemText) => {
        if (!itemText.trim()) return;
        setReportsGroups(prev => prev.map(g => {
            if (g.id === groupId) {
                if (g.items.includes(itemText.trim())) {
                    toast.error('Item already exists in this group');
                    return g;
                }
                return { ...g, items: [...g.items, itemText.trim()] };
            }
            return g;
        }));
    };

    const handleRemoveItemFromGroup = (groupId, itemIndex) => {
        setReportsGroups(prev => prev.map(g => {
            if (g.id === groupId) {
                const newItems = [...g.items];
                newItems.splice(itemIndex, 1);
                return { ...g, items: newItems };
            }
            return g;
        }));
    };

    const handleResetCardForm = () => {
        setIsEditingCard(false);
        setCurrentCardId(null);
        setCategoryId(categories[0]?.id?.toString() || '');
        setLayout('detailed');
        setTitle('');
        setSubtitle('');
        setDescription('');
        setFooterText('');
        setColor('#22d3ee');
        setReportsGroups([]);
    };

    const handleEditCardClick = (coc) => {
        setIsEditingCard(true);
        setCurrentCardId(coc.id);
        setCategoryId(coc.category_id.toString());
        setLayout(coc.layout || 'detailed');
        setTitle(coc.title);
        setSubtitle(coc.subtitle || '');
        setDescription(coc.description || '');
        setFooterText(coc.footer || '');
        setColor(coc.color || '#22d3ee');

        let loadedGroups = [];
        try {
            if (coc.reports) {
                const parsed = typeof coc.reports === 'string' ? JSON.parse(coc.reports) : coc.reports;
                if (Array.isArray(parsed)) {
                    loadedGroups = parsed.map((g, idx) => ({
                        id: idx,
                        group_title: g.group_title || '',
                        items: Array.isArray(g.items) ? g.items : []
                    }));
                }
            }
        } catch (e) {
            console.error("Failed to parse reports JSON", e);
        }
        setReportsGroups(loadedGroups);
        setExpandedCoC(prev => ({ ...prev, [coc.id]: true }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSaveCard = async (e) => {
        e.preventDefault();
        if (!categoryId) {
            toast.error('Please select or create a category first!');
            return;
        }
        if (!title.trim()) {
            toast.error('Please enter a Title');
            return;
        }

        setSavingCard(true);
        const formattedReports = reportsGroups.map(g => ({
            group_title: g.group_title,
            items: g.items
        }));

        const bodyData = {
            category_id: parseInt(categoryId),
            layout,
            title: title.trim(),
            subtitle: layout === 'detailed' ? subtitle.trim() : null,
            description: layout === 'simple' ? description.trim() : null,
            reports: layout === 'detailed' ? formattedReports : null,
            footer: layout === 'detailed' ? footerText.trim() : null,
            color
        };

        try {
            const url = isEditingCard ? `${BASE_URL}/chain-of-command/${currentCardId}` : `${BASE_URL}/chain-of-command`;
            const method = isEditingCard ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(bodyData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to save card');

            toast.success(isEditingCard ? 'Card updated!' : 'Card created!');
            handleResetCardForm();
            fetchCards();
        } catch (err) {
            toast.error(err.message || 'Error saving card');
        } finally {
            setSavingCard(false);
        }
    };

    const handleDeleteCard = async (id) => {
        if (!window.confirm('Are you sure you want to delete this card?')) return;
        try {
            const res = await fetch(`${BASE_URL}/chain-of-command/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to delete card');

            toast.success('Card deleted successfully');
            fetchCards();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleMoveCard = async (cardId, direction) => {
        const cardToMove = cocList.find(c => c.id === cardId);
        if (!cardToMove) return;

        const subList = cocList.filter(c => c.category_id === cardToMove.category_id);
        const subIndex = subList.findIndex(c => c.id === cardId);

        const targetSubIndex = direction === 'up' ? subIndex - 1 : subIndex + 1;
        if (targetSubIndex < 0 || targetSubIndex >= subList.length) return;

        const newSubList = [...subList];
        const temp = newSubList[subIndex];
        newSubList[subIndex] = newSubList[targetSubIndex];
        newSubList[targetSubIndex] = temp;

        const orders = newSubList.map((c, idx) => ({
            id: c.id,
            sort_order: idx
        }));

        // Optimistically update
        const updatedList = cocList.map(c => {
            if (c.category_id === cardToMove.category_id) {
                const subItem = newSubList.find(s => s.id === c.id);
                return subItem ? { ...c, sort_order: newSubList.indexOf(subItem) } : c;
            }
            return c;
        }).sort((a, b) => {
            if (a.cat_sort_order !== b.cat_sort_order) return a.cat_sort_order - b.cat_sort_order;
            if (a.category_id !== b.category_id) return a.category_id - b.category_id;
            return a.sort_order - b.sort_order;
        });

        setCocList(updatedList);

        try {
            const res = await fetch(`${BASE_URL}/chain-of-command/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ orders })
            });
            if (!res.ok) throw new Error('Failed to save card sequence');
        } catch (err) {
            toast.error(err.message);
            fetchCards();
        }
    };

    // Helper: group cards by category
    const cardsByCategory = categories.reduce((acc, cat) => {
        acc[cat.id] = cocList.filter(c => c.category_id === cat.id);
        return acc;
    }, {});

    return (
        <div className="max-w-5xl">
            {/* Page Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider">Chain of Command Manager</h2>
                    <p className="text-slate-400 text-sm mt-1">Configure layout styles and organization hierarchies dynamically.</p>
                </div>
                {/* Tabs Toggle */}
                <div className="flex bg-[#0b0f15] border border-slate-800 rounded-xl p-1">
                    <button
                        onClick={() => setActiveTab('cards')}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${activeTab === 'cards' ? 'bg-cyan-600 text-black shadow-md shadow-cyan-600/10' : 'text-slate-400 hover:text-white'}`}
                    >
                        <MdAccountTree size={16} />
                        Manage Cards
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${activeTab === 'categories' ? 'bg-cyan-600 text-black shadow-md shadow-cyan-600/10' : 'text-slate-400 hover:text-white'}`}
                    >
                        <MdCategory size={16} />
                        Manage Categories
                    </button>
                </div>
            </div>

            {/* TAB 1: MANAGE CARDS */}
            {activeTab === 'cards' && (
                <>
                    {/* Add/Edit Card Form */}
                    <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6 mb-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                        <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-6 flex items-center gap-2">
                            <MdAccountTree className="text-cyan-400" />
                            {isEditingCard ? 'Edit Chain of Command Card' : 'Add Chain of Command Card'}
                        </h3>

                        {categories.length === 0 ? (
                            <div className="p-4 bg-yellow-950/20 border border-yellow-900/50 rounded-xl text-yellow-500 text-sm">
                                ⚠️ No categories available. Please create a category in the <strong>Manage Categories</strong> tab first!
                            </div>
                        ) : (
                            <form onSubmit={handleSaveCard} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Select Category</label>
                                        <select
                                            value={categoryId}
                                            onChange={(e) => setCategoryId(e.target.value)}
                                            className="px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 transition-all font-bold"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Card Layout Style</label>
                                        <select
                                            value={layout}
                                            onChange={(e) => {
                                                setLayout(e.target.value);
                                                if (e.target.value === 'simple') setColor('#c9a84c');
                                                else setColor('#22d3ee');
                                            }}
                                            className="px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 transition-all font-bold"
                                        >
                                            <option value="simple">Simple Card (Title + Description)</option>
                                            <option value="detailed">Detailed Card (Reports Grid + Footer)</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Card Title</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Secretary of Defense"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600 font-bold"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Accent Color (Hex)</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={color}
                                                onChange={(e) => setColor(e.target.value)}
                                                className="w-12 h-11 bg-transparent border-0 cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={color}
                                                onChange={(e) => setColor(e.target.value)}
                                                placeholder="#22d3ee"
                                                className="px-4 py-3 flex-1 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 font-mono"
                                            />
                                        </div>
                                    </div>

                                    {layout === 'detailed' && (
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Subtitle</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Oversees all law enforcement departments."
                                                value={subtitle}
                                                onChange={(e) => setSubtitle(e.target.value)}
                                                className="px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600 font-semibold"
                                            />
                                        </div>
                                    )}
                                </div>

                                {layout === 'simple' ? (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Description (Paragraph)</label>
                                        <textarea
                                            rows={3}
                                            placeholder="e.g. The highest-ranking official within the government..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 font-medium"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        {/* Reports Builder */}
                                        <div className="bg-[#080d13] border border-slate-800 rounded-xl p-5 space-y-4">
                                            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Reports Under Card</h4>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Faction Management"
                                                    value={newGroupTitle}
                                                    onChange={(e) => setNewGroupTitle(e.target.value)}
                                                    className="px-4 py-2 flex-1 bg-[#05080c] border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500 font-bold"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddGroup}
                                                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                                                >
                                                    Add Group
                                                </button>
                                            </div>

                                            <div className="space-y-4 pt-2">
                                                {reportsGroups.map((group) => (
                                                    <div key={group.id} className="bg-[#0d1117] border border-slate-800/80 rounded-xl p-4 space-y-3 relative">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveGroup(group.id)}
                                                            className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-xs font-bold"
                                                        >
                                                            Remove Group
                                                        </button>
                                                        <h5 className="text-cyan-400 font-bold text-xs uppercase tracking-wider">{group.group_title}</h5>

                                                        <div className="flex flex-wrap gap-2">
                                                            {group.items.map((item, idx) => (
                                                                <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-medium">
                                                                    {item}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveItemFromGroup(group.id, idx)}
                                                                        className="text-red-400 hover:text-red-300 font-bold text-xs ml-1"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </span>
                                                            ))}
                                                        </div>

                                                        <form
                                                            onSubmit={(e) => {
                                                                e.preventDefault();
                                                                const input = e.target.elements.itemName;
                                                                handleAddItemToGroup(group.id, input.value);
                                                                input.value = '';
                                                            }}
                                                            className="flex gap-2 max-w-sm"
                                                        >
                                                            <input
                                                                name="itemName"
                                                                type="text"
                                                                placeholder="Add item (e.g. Police Department)"
                                                                className="px-3 py-1.5 flex-1 bg-[#05080c] border border-slate-800 rounded-lg text-white text-[11px] focus:outline-none"
                                                            />
                                                            <button
                                                                type="submit"
                                                                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded-lg uppercase tracking-wider"
                                                            >
                                                                Add
                                                            </button>
                                                        </form>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Footer Explanation Text</label>
                                            <textarea
                                                rows={2}
                                                placeholder="Type additional description about these groups..."
                                                value={footerText}
                                                onChange={(e) => setFooterText(e.target.value)}
                                                className="px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 font-medium"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="flex items-center gap-3 justify-end pt-2">
                                    {isEditingCard && (
                                        <button
                                            type="button"
                                            onClick={handleResetCardForm}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                                        >
                                            <MdCancel size={16} />
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={savingCard}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-black rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] disabled:opacity-50"
                                    >
                                        <MdSave size={16} />
                                        {savingCard ? 'Saving...' : isEditingCard ? 'Save Changes' : 'Add Card'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Grouped Cards list */}
                    <div className="space-y-6">
                        {cardsLoading ? (
                            <div className="p-10 flex items-center gap-3 text-slate-400 bg-[#0d1117] border border-slate-800 rounded-2xl">
                                <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                Loading cards...
                            </div>
                        ) : categories.length === 0 ? (
                            null
                        ) : (
                            categories.map(cat => {
                                const cards = cardsByCategory[cat.id] || [];
                                return (
                                    <div key={cat.id} className="bg-[#0d1117] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                                        <div className="px-6 py-4 bg-slate-900/30 border-b border-slate-800 flex justify-between items-center">
                                            <h4 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                                                {cat.name} ({cards.length})
                                            </h4>
                                        </div>

                                        {cards.length === 0 ? (
                                            <div className="p-6 text-slate-600 text-xs uppercase font-bold tracking-wider">
                                                No cards inside this category. Create one above!
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-slate-800/60">
                                                {cards.map((coc, index) => {
                                                    const isExpanded = !!expandedCoC[coc.id];

                                                    let reportsSummary = [];
                                                    try {
                                                        if (coc.reports) {
                                                            const parsed = typeof coc.reports === 'string' ? JSON.parse(coc.reports) : coc.reports;
                                                            if (Array.isArray(parsed)) {
                                                                reportsSummary = parsed.map(g => `${g.group_title} (${g.items?.length || 0})`);
                                                            }
                                                        }
                                                    } catch (e) { }

                                                    return (
                                                        <div key={coc.id} className="p-5 hover:bg-slate-800/10 transition-colors">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div className="flex-1 min-w-0">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setExpandedCoC(prev => ({ ...prev, [coc.id]: !isExpanded }))}
                                                                        className="w-full flex items-center justify-between text-left focus:outline-none group"
                                                                    >
                                                                        <div>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                                                                                    {coc.layout}
                                                                                </span>
                                                                                <p className="text-cyan-400 font-bold text-sm group-hover:text-cyan-300 transition-colors">
                                                                                    {coc.title}
                                                                                </p>
                                                                            </div>
                                                                            {coc.subtitle && (
                                                                                <p className="text-xs text-slate-400 italic mt-0.5">{coc.subtitle}</p>
                                                                            )}
                                                                        </div>
                                                                        <span className="text-slate-500 group-hover:text-slate-300 font-mono text-lg ml-2">
                                                                            {isExpanded ? '−' : '+'}
                                                                        </span>
                                                                    </button>

                                                                    {isExpanded && (
                                                                        <div className="text-slate-300 text-xs mt-3 bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 space-y-2">
                                                                            {coc.description && (
                                                                                <p className="leading-relaxed"><strong className="text-slate-400 uppercase tracking-wider block mb-1">Description:</strong>{coc.description}</p>
                                                                            )}
                                                                            {reportsSummary.length > 0 && (
                                                                                <p className="leading-relaxed">
                                                                                    <strong className="text-slate-400 uppercase tracking-wider block mb-1 font-mono">Report Groups:</strong>
                                                                                    {reportsSummary.join(', ')}
                                                                                </p>
                                                                            )}
                                                                            {coc.footer && (
                                                                                <p className="leading-relaxed italic border-t border-slate-800/50 pt-2 text-slate-400 mt-2"><strong className="text-slate-500 uppercase tracking-wider block not-italic mb-1">Explanation:</strong>{coc.footer}</p>
                                                                            )}
                                                                            <div className="flex items-center gap-2 mt-2 pt-1 border-t border-slate-800/50 text-[10px] text-slate-500">
                                                                                <span>Accent:</span>
                                                                                <span className="w-3 h-3 rounded" style={{ backgroundColor: coc.color }} />
                                                                                <span className="font-mono">{coc.color}</span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Action Buttons */}
                                                                <div className="flex items-center gap-1.5 flex-shrink-0 ml-4">
                                                                    <button
                                                                        onClick={() => handleMoveCard(coc.id, 'up')}
                                                                        disabled={index === 0}
                                                                        title="Move Up"
                                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800"
                                                                    >
                                                                        <MdArrowUpward size={16} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleMoveCard(coc.id, 'down')}
                                                                        disabled={index === cards.length - 1}
                                                                        title="Move Down"
                                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800"
                                                                    >
                                                                        <MdArrowDownward size={16} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleEditCardClick(coc)}
                                                                        title="Edit"
                                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300"
                                                                    >
                                                                        <MdEdit size={16} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteCard(coc.id)}
                                                                        title="Delete"
                                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 hover:text-red-400"
                                                                    >
                                                                        <MdDelete size={16} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </>
            )}

            {/* TAB 2: MANAGE CATEGORIES */}
            {activeTab === 'categories' && (
                <div className="space-y-6">
                    {/* Add Category Form */}
                    <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500"></div>
                        <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
                            <MdCategory className="text-cyan-400" />
                            Create Category
                        </h3>
                        <form onSubmit={handleCreateCategory} className="flex gap-2 max-w-lg">
                            <input
                                type="text"
                                placeholder="e.g. Advisory Council"
                                value={newCatName}
                                onChange={(e) => setNewCatName(e.target.value)}
                                className="px-4 py-3 flex-1 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600 font-bold"
                                required
                            />
                            <button
                                type="submit"
                                className="px-5 py-3 bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5"
                            >
                                <MdAdd size={16} />
                                Add
                            </button>
                        </form>
                    </div>

                    {/* Category List */}
                    <div className="bg-[#0d1117] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                        <div className="px-6 py-4 bg-slate-900/30 border-b border-slate-800">
                            <h4 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
                                <MdFormatListBulleted className="text-cyan-400" />
                                Active Categories ({categories.length})
                            </h4>
                        </div>

                        {catLoading ? (
                            <div className="p-10 flex items-center gap-3 text-slate-400">
                                <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                Loading categories...
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="p-10 text-center text-slate-500 text-sm">
                                No categories found. Add one above!
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-800/60">
                                {categories.map((cat, index) => {
                                    const isEditing = editingCatId === cat.id;

                                    return (
                                        <div key={cat.id} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-800/10 transition-colors">
                                            {isEditing ? (
                                                <div className="flex-1 flex items-center gap-2 max-w-md">
                                                    <input
                                                        type="text"
                                                        value={editingCatName}
                                                        onChange={(e) => setEditingCatName(e.target.value)}
                                                        className="px-3 py-1.5 bg-[#05080c] border border-slate-700 rounded-lg text-white text-xs focus:outline-none"
                                                        required
                                                    />
                                                    <button
                                                        onClick={() => handleUpdateCategory(cat.id)}
                                                        className="p-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg"
                                                    >
                                                        <MdSave size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingCatId(null)}
                                                        className="p-1.5 bg-slate-800 text-slate-400 hover:bg-slate-700 rounded-lg"
                                                    >
                                                        <MdCancel size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white text-sm font-bold uppercase tracking-wider">{cat.name}</p>
                                                    <p className="text-slate-500 text-[10px] mt-0.5">ID: {cat.id} • Order: {cat.sort_order}</p>
                                                </div>
                                            )}

                                            {/* Action Control Buttons */}
                                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                                <button
                                                    onClick={() => handleMoveCategory(index, 'up')}
                                                    disabled={index === 0}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30"
                                                >
                                                    <MdArrowUpward size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleMoveCategory(index, 'down')}
                                                    disabled={index === categories.length - 1}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30"
                                                >
                                                    <MdArrowDownward size={16} />
                                                </button>
                                                {!isEditing && (
                                                    <button
                                                        onClick={() => {
                                                            setEditingCatId(cat.id);
                                                            setEditingCatName(cat.name);
                                                        }}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20"
                                                    >
                                                        <MdEdit size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20"
                                                >
                                                    <MdDelete size={16} />
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
        </div>
    );
};

export default ChainOfCommandManager;
