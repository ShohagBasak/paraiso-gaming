import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
    MdAdd, MdDelete, MdEdit, MdArrowUpward, MdArrowDownward, MdSave, MdCancel,
    MdFormatBold, MdFormatItalic, MdFormatUnderlined, MdFormatStrikethrough,
    MdFormatAlignLeft, MdFormatAlignCenter, MdFormatAlignRight, MdCloudUpload,
    MdSettings, MdDragIndicator, MdTextFields, MdImage, MdOutlineAccountBalance, MdAssignment
} from 'react-icons/md';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ChainOfCommandManager = () => {
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Active Block for editing
    const [editingBlock, setEditingBlock] = useState(null);
    // Temp state for editing fields
    const [editContent, setEditContent] = useState({});

    // Drag and Drop reordering states
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    // Fetch Blocks
    const fetchBlocks = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/chain-of-command/blocks`);
            if (!res.ok) throw new Error('Failed to fetch blocks');
            const data = await res.json();
            setBlocks(Array.isArray(data) ? data : []);
        } catch (err) {
            toast.error(err.message || 'Error loading blocks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlocks();
    }, []);

    // Save Block updates to backend
    const handleSaveBlock = async (id, updatedBlock) => {
        // Clean sub_boxes items: filter out empty bullet points before saving
        const cleanedBlock = { ...updatedBlock };
        if (cleanedBlock.content && Array.isArray(cleanedBlock.content.sub_boxes)) {
            cleanedBlock.content = {
                ...cleanedBlock.content,
                sub_boxes: cleanedBlock.content.sub_boxes.map(box => ({
                    ...box,
                    items: (box.items || []).map(item => item.trim()).filter(Boolean)
                }))
            };
        }

        try {
            const res = await fetch(`${BASE_URL}/chain-of-command/blocks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(cleanedBlock)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to update block');
            
            toast.success('Block updated successfully!');
            fetchBlocks();
            setEditingBlock(null);
        } catch (err) {
            toast.error(err.message);
        }
    };

    // Delete block
    const handleDeleteBlock = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <span className="text-white text-xs font-semibold">Are you sure you want to delete this block?</span>
                <div className="flex justify-end gap-2 mt-1">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                const res = await fetch(`${BASE_URL}/chain-of-command/blocks/${id}`, {
                                    method: 'DELETE',
                                    credentials: 'include'
                                });
                                if (!res.ok) throw new Error('Failed to delete block');
                                
                                toast.success('Block deleted');
                                if (editingBlock && editingBlock.id === id) {
                                    setEditingBlock(null);
                                }
                                fetchBlocks();
                            } catch (err) {
                                toast.error(err.message);
                            }
                        }}
                        className="px-2.5 py-1 bg-red-650 hover:bg-red-600 text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: 6000,
            style: {
                background: '#0d1117',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '12px',
                color: '#fff',
                borderRadius: '12px'
            }
        });
    };

    // Drag and Drop event handlers
    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === index) return;
        setDragOverIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDrop = async (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const updatedBlocks = [...blocks];
        const draggedItem = updatedBlocks[draggedIndex];
        
        // Move item
        updatedBlocks.splice(draggedIndex, 1);
        updatedBlocks.splice(index, 0, draggedItem);

        // Prepare orders list
        const orders = updatedBlocks.map((b, idx) => ({ id: b.id, sort_order: idx }));

        // Optimistically update
        setBlocks(updatedBlocks);
        setDraggedIndex(null);
        setDragOverIndex(null);

        try {
            const res = await fetch(`${BASE_URL}/chain-of-command/blocks/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ orders })
            });
            if (!res.ok) throw new Error('Failed to save layout sequence');
            toast.success('Sequence reordered successfully!');
        } catch (err) {
            toast.error(err.message);
            fetchBlocks();
        }
    };

    // Reorder blocks up or down
    const handleMoveBlock = async (index, direction) => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= blocks.length) return;

        const updatedBlocks = [...blocks];
        const temp = updatedBlocks[index];
        updatedBlocks[index] = updatedBlocks[targetIndex];
        updatedBlocks[targetIndex] = temp;

        // Prepare orders list
        const orders = updatedBlocks.map((b, idx) => ({ id: b.id, sort_order: idx }));

        try {
            const res = await fetch(`${BASE_URL}/chain-of-command/blocks/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ orders })
            });
            if (!res.ok) throw new Error('Failed to reorder blocks');
            
            // Instantly update local state to feel snappy
            setBlocks(updatedBlocks);
        } catch (err) {
            toast.error(err.message);
        }
    };

    // Add new block
    const handleAddBlock = async (type) => {
        let initialContent = {};

        if (type === 'text') {
            initialContent = {
                text: "New Text Block",
                type: "paragraph", // 'title' | 'subtitle' | 'paragraph' | 'bullet'
                color: "#ffffff",
                alignment: "left",
                bold: false,
                italic: false,
                underline: false,
                strikethrough: false
            };
        } else if (type === 'title_strokes') {
            initialContent = {
                text: "NEW TITLE SECTION",
                color: "#22d3ee"
            };
        } else if (type === 'image') {
            initialContent = {
                url: "https://i.imgur.com/YfVF1d0.png",
                alt: "Image block",
                size: "md", // 'sm' | 'md' | 'lg' | 'full'
                alignment: "center"
            };
        } else if (type === 'half_box') {
            initialContent = {
                color: "#22d3ee",
                width: "full", // 'half' | 'full'
                lines: [
                    { text: "Box Title", type: "title", bold: true, alignment: "left", color: "#22d3ee" },
                    { text: "Box content paragraph text here.", type: "paragraph", alignment: "left", color: "#cbd5e1" }
                ]
            };
        } else if (type === 'hybrid_box') {
            initialContent = {
                color: "#22d3ee",
                title: "SECRETARY OF OPERATIONS",
                subtitle: "Oversees general operations and community management.",
                columns_title: "REPORTS UNDER OPERATIONS:",
                sub_boxes: [
                    { title: "DEPARTMENT STAFF", items: ["Lead Administrators"] },
                    { title: "FACTION STAFF", items: ["Helper Staff"] }
                ],
                footer: "Footer notes and guidelines go here."
            };
        } else if (type === 'signature') {
            initialContent = {
                name: "Your Name",
                role: "Your Role",
                office: "Your Office",
                color: "#fbbf24"
            };
        }

        try {
            const res = await fetch(`${BASE_URL}/chain-of-command/blocks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ type, content: initialContent })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to add block');

            toast.success(`${type.toUpperCase()} block added!`);
            fetchBlocks();
        } catch (err) {
            toast.error(err.message);
        }
    };

    // Open block editor panel
    const startEditing = (block) => {
        setEditingBlock(block);
        setEditContent(JSON.parse(JSON.stringify(block.content))); // deep copy

        // Smooth scroll to editor panel (highly useful for mobile screens)
        setTimeout(() => {
            const panel = document.getElementById('block-editor-panel');
            if (panel) {
                panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    // Handle local image file upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result;
            try {
                toast.loading('Uploading image...', { id: 'uploading' });
                const res = await fetch(`${BASE_URL}/upload`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ image: base64String })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Upload failed');
                
                setEditContent(prev => ({ ...prev, url: data.url }));
                toast.success('Image uploaded successfully!', { id: 'uploading' });
            } catch (err) {
                toast.error(err.message || 'Failed to upload image', { id: 'uploading' });
            }
        };
        reader.readAsDataURL(file);
    };

    // Renders short preview text of block content in list view
    const getBlockPreview = (block) => {
        const content = block.content;
        switch (block.type) {
            case 'text':
                return `${content.type.toUpperCase()}: "${content.text || ''}"`;
            case 'title_strokes':
                return `STROKED TITLE: "${content.text || ''}"`;
            case 'image':
                return `IMAGE: ${content.url ? content.url.substring(0, 45) + '...' : 'No URL'}`;
            case 'half_box':
                return `BOX/TILE (${content.width || 'full'}): "${content.lines?.[0]?.text || ''}"`;
            case 'hybrid_box':
                return `HYBRID ENVELOPE: "${content.title || ''}" - ${content.subtitle || ''}`;
            case 'signature':
                return `SIGNATURE: "${content.name || ''}" (${content.role || ''})`;
            default:
                return 'Block';
        }
    };

    return (
        <div className="max-w-6xl">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-wider">Chain of Command Page Builder</h2>
                <p className="text-slate-400 text-sm mt-1">Design, style, and reposition layout sections dynamically.</p>
            </div>

            {loading ? (
                <div className="flex items-center gap-3 text-slate-400 py-12 justify-center">
                    <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    Loading builder blocks...
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Pane: Block Stream */}
                    <div className="lg:col-span-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                <MdDragIndicator size={16} className="text-cyan-500" /> Page Layout Blocks ({blocks.length})
                            </h3>
                        </div>

                        {blocks.length === 0 ? (
                            <div className="bg-[#0d1117] border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                                No layout blocks found. Select one from below to get started!
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
                                {blocks.map((block, idx) => {
                                    const isSelected = editingBlock?.id === block.id;
                                    const isDragged = draggedIndex === idx;
                                    const isDragOver = dragOverIndex === idx;

                                    return (
                                        <div
                                            key={block.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, idx)}
                                            onDragOver={(e) => handleDragOver(e, idx)}
                                            onDragEnd={handleDragEnd}
                                            onDrop={(e) => handleDrop(e, idx)}
                                            className={`p-4 bg-[#0d1117] border rounded-2xl transition-all flex items-start gap-4 justify-between hover:border-slate-700 ${
                                                isDragged 
                                                    ? 'opacity-40 border-dashed border-cyan-500/30 bg-[#0d1117]/80' 
                                                    : isDragOver
                                                    ? 'border-cyan-400 bg-cyan-950/20 scale-[1.01] shadow-[0_0_15px_rgba(6,182,212,0.1)] ring-1 ring-cyan-400/30'
                                                    : isSelected
                                                    ? 'border-cyan-500 bg-cyan-950/5 ring-1 ring-cyan-500/20'
                                                    : 'border-slate-800'
                                            }`}
                                        >
                                            {/* Drag Indicator Handle */}
                                            <div 
                                                className="flex-shrink-0 cursor-grab active:cursor-grabbing text-slate-600 hover:text-cyan-400 p-1 self-center transition-colors select-none"
                                                title="Drag to reposition block"
                                            >
                                                <MdDragIndicator size={20} />
                                            </div>

                                            <div className="min-w-0 flex-1 cursor-pointer" onClick={() => startEditing(block)}>
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold uppercase">
                                                        #{idx + 1} &bull; {block.type}
                                                    </span>
                                                    {block.content.color && (
                                                        <span 
                                                            className="w-2.5 h-2.5 rounded-full inline-block" 
                                                            style={{ backgroundColor: block.content.color || '#fff' }} 
                                                        />
                                                    )}
                                                </div>
                                                <p className="text-slate-300 text-xs font-semibold truncate leading-relaxed">
                                                    {getBlockPreview(block)}
                                                </p>
                                            </div>

                                            {/* Reordering and Edit buttons */}
                                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                                <button
                                                    onClick={() => handleMoveBlock(idx, 'up')}
                                                    disabled={idx === 0}
                                                    title="Move Up"
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <MdArrowUpward size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleMoveBlock(idx, 'down')}
                                                    disabled={idx === blocks.length - 1}
                                                    title="Move Down"
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <MdArrowDownward size={14} />
                                                </button>
                                                <button
                                                    onClick={() => startEditing(block)}
                                                    title="Edit Block Settings"
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-cyan-600/10 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all"
                                                >
                                                    <MdEdit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBlock(block.id)}
                                                    title="Delete Block"
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-all"
                                                >
                                                    <MdDelete size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Add Blocks Floating Picker */}
                        <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4 mt-6">
                            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">Add Custom Item Block:</h4>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => handleAddBlock('text')}
                                    className="p-2.5 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl flex flex-col items-center justify-center gap-1.5 text-slate-300 text-xs font-bold transition-all hover:bg-slate-800"
                                >
                                    <MdTextFields size={18} className="text-cyan-400" />
                                    <span>Rich Text</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('title_strokes')}
                                    className="p-2.5 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl flex flex-col items-center justify-center gap-1.5 text-slate-300 text-xs font-bold transition-all hover:bg-slate-800"
                                >
                                    <MdSettings size={18} className="text-amber-500" />
                                    <span>Stroked Title</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('image')}
                                    className="p-2.5 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl flex flex-col items-center justify-center gap-1.5 text-slate-300 text-xs font-bold transition-all hover:bg-slate-800"
                                >
                                    <MdImage size={18} className="text-[#10b981]" />
                                    <span>Image Upload</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('half_box')}
                                    className="p-2.5 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl flex flex-col items-center justify-center gap-1.5 text-slate-300 text-xs font-bold transition-all hover:bg-slate-800"
                                >
                                    <MdAssignment size={18} className="text-[#fbbf24]" />
                                    <span>Half Box Tile</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('hybrid_box')}
                                    className="p-2.5 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl flex flex-col items-center justify-center gap-1.5 text-slate-300 text-xs font-bold transition-all hover:bg-slate-800"
                                >
                                    <MdOutlineAccountBalance size={18} className="text-cyan-500" />
                                    <span>Hybrid Box</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('signature')}
                                    className="p-2.5 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl flex flex-col items-center justify-center gap-1.5 text-slate-300 text-xs font-bold transition-all hover:bg-slate-800"
                                >
                                    <span className="font-serif italic text-base text-pink-400">S</span>
                                    <span>Signature</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Pane: Active Block Settings Form */}
                    <div id="block-editor-panel" className="lg:col-span-6 scroll-mt-24">
                        {editingBlock ? (
                            <div className="bg-[#0d1117] border border-cyan-500/20 rounded-3xl p-6 relative overflow-hidden animate-in fade-in slide-in-from-right-3 duration-250">
                                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-500 to-blue-500"></div>

                                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                        ⚙️ Block Editor &bull; {editingBlock.type.toUpperCase()}
                                    </h3>
                                    <button
                                        onClick={() => setEditingBlock(null)}
                                        className="text-slate-500 hover:text-white transition-colors"
                                    >
                                        <MdCancel size={20} />
                                    </button>
                                </div>

                                {/* Form settings for block content */}
                                <div className="space-y-6">

                                    {/* ─── TEXT BLOCK SETTINGS ─── */}
                                    {editingBlock.type === 'text' && (
                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Text Content</label>
                                                <textarea
                                                    rows={3}
                                                    value={editContent.text || ''}
                                                    onChange={e => setEditContent(prev => ({ ...prev, text: e.target.value }))}
                                                    className="w-full px-4 py-3 bg-[#080d13] border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 transition-all font-semibold"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Style Size</label>
                                                    <select
                                                        value={editContent.type || 'paragraph'}
                                                        onChange={e => setEditContent(prev => ({ ...prev, type: e.target.value }))}
                                                        className="px-3 py-2.5 bg-[#080d13] border border-slate-800 rounded-xl text-white text-xs font-bold focus:outline-none"
                                                    >
                                                        <option value="title">Title (H2 size)</option>
                                                        <option value="subtitle">Subtitle (H3 size)</option>
                                                        <option value="paragraph">Paragraph (P size)</option>
                                                        <option value="bullet">Bullet Item</option>
                                                    </select>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Color Picker</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="color"
                                                            value={editContent.color || '#ffffff'}
                                                            onChange={e => setEditContent(prev => ({ ...prev, color: e.target.value }))}
                                                            className="w-10 h-9 bg-transparent border-0 rounded cursor-pointer"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={editContent.color || '#ffffff'}
                                                            onChange={e => setEditContent(prev => ({ ...prev, color: e.target.value }))}
                                                            className="flex-1 px-3 py-1.5 bg-[#080d13] border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none uppercase"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Alignment and Font Weight options */}
                                            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                                                <div className="flex gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditContent(prev => ({ ...prev, alignment: 'left' }))}
                                                        className={`p-2 rounded-lg border transition-all ${editContent.alignment === 'left' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
                                                    >
                                                        <MdFormatAlignLeft size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditContent(prev => ({ ...prev, alignment: 'center' }))}
                                                        className={`p-2 rounded-lg border transition-all ${editContent.alignment === 'center' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
                                                    >
                                                        <MdFormatAlignCenter size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditContent(prev => ({ ...prev, alignment: 'right' }))}
                                                        className={`p-2 rounded-lg border transition-all ${editContent.alignment === 'right' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
                                                    >
                                                        <MdFormatAlignRight size={16} />
                                                    </button>
                                                </div>

                                                <div className="flex gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditContent(prev => ({ ...prev, bold: !prev.bold }))}
                                                        className={`p-2 rounded-lg border transition-all ${editContent.bold ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
                                                    >
                                                        <MdFormatBold size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditContent(prev => ({ ...prev, italic: !prev.italic }))}
                                                        className={`p-2 rounded-lg border transition-all ${editContent.italic ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
                                                    >
                                                        <MdFormatItalic size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditContent(prev => ({ ...prev, underline: !prev.underline }))}
                                                        className={`p-2 rounded-lg border transition-all ${editContent.underline ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
                                                    >
                                                        <MdFormatUnderlined size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditContent(prev => ({ ...prev, strikethrough: !prev.strikethrough }))}
                                                        className={`p-2 rounded-lg border transition-all ${editContent.strikethrough ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
                                                    >
                                                        <MdFormatStrikethrough size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ─── TITLE WITH STROKES SETTINGS ─── */}
                                    {editingBlock.type === 'title_strokes' && (
                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Title Text</label>
                                                <input
                                                    type="text"
                                                    value={editContent.text || ''}
                                                    onChange={e => setEditContent(prev => ({ ...prev, text: e.target.value }))}
                                                    className="w-full px-4 py-3 bg-[#080d13] border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 transition-all font-semibold"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Accent Color</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="color"
                                                        value={editContent.color || '#22d3ee'}
                                                        onChange={e => setEditContent(prev => ({ ...prev, color: e.target.value }))}
                                                        className="w-10 h-9 bg-transparent border-0 rounded cursor-pointer"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editContent.color || '#22d3ee'}
                                                        onChange={e => setEditContent(prev => ({ ...prev, color: e.target.value }))}
                                                        className="flex-1 px-3 py-1.5 bg-[#080d13] border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none uppercase"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ─── IMAGE BLOCK SETTINGS ─── */}
                                    {editingBlock.type === 'image' && (
                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Direct Upload</label>
                                                <div className="border border-dashed border-slate-800 hover:border-cyan-500/40 rounded-xl p-4 bg-[#080d13]/50 flex flex-col items-center justify-center cursor-pointer transition-all relative">
                                                    <input 
                                                        type="file" 
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                    />
                                                    <MdCloudUpload className="text-cyan-500 mb-1.5" size={24} />
                                                    <span className="text-slate-400 text-xs font-bold">Upload Image File</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Or Paste Image URL</label>
                                                <input
                                                    type="text"
                                                    placeholder="https://..."
                                                    value={editContent.url || ''}
                                                    onChange={e => setEditContent(prev => ({ ...prev, url: e.target.value }))}
                                                    className="w-full px-4 py-3 bg-[#080d13] border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-cyan-500 transition-all"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Width Size</label>
                                                    <select
                                                        value={editContent.size || 'md'}
                                                        onChange={e => setEditContent(prev => ({ ...prev, size: e.target.value }))}
                                                        className="px-3 py-2 bg-[#080d13] border border-slate-800 rounded-xl text-white text-xs font-bold focus:outline-none"
                                                    >
                                                        <option value="sm">Small (w-24)</option>
                                                        <option value="md">Medium (w-44)</option>
                                                        <option value="lg">Large (w-64)</option>
                                                        <option value="full">Full Width</option>
                                                    </select>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Alignment</label>
                                                    <select
                                                        value={editContent.alignment || 'center'}
                                                        onChange={e => setEditContent(prev => ({ ...prev, alignment: e.target.value }))}
                                                        className="px-3 py-2 bg-[#080d13] border border-slate-800 rounded-xl text-white text-xs font-bold focus:outline-none"
                                                    >
                                                        <option value="left">Left</option>
                                                        <option value="center">Center</option>
                                                        <option value="right">Right</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ─── HALF BOX / TILE SETTINGS ─── */}
                                    {editingBlock.type === 'half_box' && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Width Mode</label>
                                                    <select
                                                        value={editContent.width || 'full'}
                                                        onChange={e => setEditContent(prev => ({ ...prev, width: e.target.value }))}
                                                        className="px-3 py-2 bg-[#080d13] border border-slate-800 rounded-xl text-white text-xs font-bold focus:outline-none"
                                                    >
                                                        <option value="full">Full Width Box</option>
                                                        <option value="half">Half Width Box (Side-by-side if consecutive)</option>
                                                    </select>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Accent Color</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="color"
                                                            value={editContent.color || '#22d3ee'}
                                                            onChange={e => setEditContent(prev => ({ ...prev, color: e.target.value }))}
                                                            className="w-9 h-8 bg-transparent border-0 rounded cursor-pointer"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={editContent.color || '#22d3ee'}
                                                            onChange={e => setEditContent(prev => ({ ...prev, color: e.target.value }))}
                                                            className="flex-1 px-3 py-1 bg-[#080d13] border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none uppercase"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Rich lines builder */}
                                            <div className="border-t border-slate-800 pt-4 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Lines inside Box ({editContent.lines?.length || 0})</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newLines = [...(editContent.lines || [])];
                                                            newLines.push({ text: "New line", type: "paragraph", color: "#cbd5e1", alignment: "left", bold: false });
                                                            setEditContent(prev => ({ ...prev, lines: newLines }));
                                                        }}
                                                        className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 transition-all"
                                                    >
                                                        <MdAdd size={14} /> Add Line
                                                    </button>
                                                </div>

                                                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                                                    {(editContent.lines || []).map((line, idx) => (
                                                        <div key={idx} className="p-3 bg-[#080d13] border border-slate-800/80 rounded-xl space-y-2 relative">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const updatedLines = (editContent.lines || []).filter((_, lineIdx) => lineIdx !== idx);
                                                                    setEditContent(prev => ({ ...prev, lines: updatedLines }));
                                                                }}
                                                                className="absolute top-2 right-2 text-slate-500 hover:text-red-500 transition-colors"
                                                            >
                                                                <MdDelete size={14} />
                                                            </button>

                                                            <div className="grid grid-cols-3 gap-2 pr-6">
                                                                <select
                                                                    value={line.type || 'paragraph'}
                                                                    onChange={e => {
                                                                        const updatedLines = [...(editContent.lines || [])];
                                                                        updatedLines[idx].type = e.target.value;
                                                                        setEditContent(prev => ({ ...prev, lines: updatedLines }));
                                                                    }}
                                                                    className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-white text-[10px] focus:outline-none"
                                                                >
                                                                    <option value="title">Title (H4)</option>
                                                                    <option value="subtitle">Subtitle</option>
                                                                    <option value="paragraph">Paragraph</option>
                                                                </select>
                                                                <input
                                                                    type="color"
                                                                    value={line.color || '#cbd5e1'}
                                                                    onChange={e => {
                                                                        const updatedLines = [...(editContent.lines || [])];
                                                                        updatedLines[idx].color = e.target.value;
                                                                        setEditContent(prev => ({ ...prev, lines: updatedLines }));
                                                                    }}
                                                                    className="w-full h-6 bg-transparent border-0 rounded cursor-pointer"
                                                                />
                                                                <div className="flex gap-1">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const updatedLines = [...(editContent.lines || [])];
                                                                            updatedLines[idx].bold = !updatedLines[idx].bold;
                                                                            setEditContent(prev => ({ ...prev, lines: updatedLines }));
                                                                        }}
                                                                        className={`p-1 rounded border text-[10px] ${line.bold ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500'}`}
                                                                    >
                                                                        B
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const updatedLines = [...(editContent.lines || [])];
                                                                            updatedLines[idx].italic = !updatedLines[idx].italic;
                                                                            setEditContent(prev => ({ ...prev, lines: updatedLines }));
                                                                        }}
                                                                        className={`p-1 rounded border text-[10px] ${line.italic ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500'}`}
                                                                    >
                                                                        I
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <input
                                                                type="text"
                                                                value={line.text || ''}
                                                                onChange={e => {
                                                                    const updatedLines = [...(editContent.lines || [])];
                                                                    updatedLines[idx].text = e.target.value;
                                                                    setEditContent(prev => ({ ...prev, lines: updatedLines }));
                                                                }}
                                                                className="w-full px-2.5 py-1.5 bg-[#0d1117] border border-slate-800 rounded-lg text-white text-xs font-semibold"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ─── HYBRID BOX SETTINGS ─── */}
                                    {editingBlock.type === 'hybrid_box' && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Title</label>
                                                    <input
                                                        type="text"
                                                        value={editContent.title || ''}
                                                        onChange={e => setEditContent(prev => ({ ...prev, title: e.target.value }))}
                                                        className="px-3 py-2 bg-[#080d13] border border-slate-800 rounded-xl text-white text-xs font-bold focus:outline-none"
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Accent Color</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="color"
                                                            value={editContent.color || '#22d3ee'}
                                                            onChange={e => setEditContent(prev => ({ ...prev, color: e.target.value }))}
                                                            className="w-9 h-8 bg-transparent border-0 rounded cursor-pointer"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={editContent.color || '#22d3ee'}
                                                            onChange={e => setEditContent(prev => ({ ...prev, color: e.target.value }))}
                                                            className="flex-1 px-3 py-1 bg-[#080d13] border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none uppercase"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Subtitle</label>
                                                <input
                                                    type="text"
                                                    value={editContent.subtitle || ''}
                                                    onChange={e => setEditContent(prev => ({ ...prev, subtitle: e.target.value }))}
                                                    className="w-full px-4 py-2 bg-[#080d13] border border-slate-800 rounded-xl text-xs text-white"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Columns Header Title</label>
                                                <input
                                                    type="text"
                                                    value={editContent.columns_title || ''}
                                                    onChange={e => setEditContent(prev => ({ ...prev, columns_title: e.target.value }))}
                                                    className="w-full px-4 py-2 bg-[#080d13] border border-slate-800 rounded-xl text-xs text-white"
                                                />
                                            </div>

                                            {/* Nested reports columns builder */}
                                            <div className="border-t border-slate-800 pt-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Inner Sub-Boxes Columns</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const currentBoxes = [...(editContent.sub_boxes || [])];
                                                            currentBoxes.push({ title: "New Group", items: ["Example Item"] });
                                                            setEditContent(prev => ({ ...prev, sub_boxes: currentBoxes }));
                                                        }}
                                                        className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-black text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1 transition-all"
                                                    >
                                                        <MdAdd size={12} /> Add Column
                                                    </button>
                                                </div>

                                                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                                                    {(editContent.sub_boxes || []).map((col, idx) => (
                                                        <div key={idx} className="p-3 bg-[#080d13] border border-slate-800 rounded-xl space-y-2 relative">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const updated = (editContent.sub_boxes || []).filter((_, lineIdx) => lineIdx !== idx);
                                                                    setEditContent(prev => ({ ...prev, sub_boxes: updated }));
                                                                }}
                                                                className="absolute top-2 right-2 text-slate-500 hover:text-red-500 transition-colors"
                                                            >
                                                                <MdDelete size={14} />
                                                            </button>

                                                            <input
                                                                type="text"
                                                                value={col.title || ''}
                                                                onChange={e => {
                                                                    const updated = [...(editContent.sub_boxes || [])];
                                                                    updated[idx].title = e.target.value;
                                                                    setEditContent(prev => ({ ...prev, sub_boxes: updated }));
                                                                }}
                                                                className="w-3/4 px-2 py-1 bg-[#0d1117] border border-slate-800 rounded text-xs font-bold text-cyan-400"
                                                                placeholder="Column Title"
                                                            />

                                                            <textarea
                                                                rows={2}
                                                                value={(col.items || []).join('\n')}
                                                                onChange={e => {
                                                                    const updated = [...(editContent.sub_boxes || [])];
                                                                    updated[idx].items = e.target.value.split('\n');
                                                                    setEditContent(prev => ({ ...prev, sub_boxes: updated }));
                                                                }}
                                                                className="w-full px-2 py-1.5 bg-[#0d1117] border border-slate-800 rounded text-xs text-white"
                                                                placeholder="Enter bullet point items (one per line)"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 border-t border-slate-800 pt-4">
                                                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Footer Notes</label>
                                                <textarea
                                                    rows={3}
                                                    value={editContent.footer || ''}
                                                    onChange={e => setEditContent(prev => ({ ...prev, footer: e.target.value }))}
                                                    className="w-full px-4 py-2 bg-[#080d13] border border-slate-800 rounded-xl text-xs text-slate-300 font-semibold"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* ─── SIGNATURE SETTINGS ─── */}
                                    {editingBlock.type === 'signature' && (
                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Name (Signature Font)</label>
                                                <input
                                                    type="text"
                                                    value={editContent.name || ''}
                                                    onChange={e => setEditContent(prev => ({ ...prev, name: e.target.value }))}
                                                    className="w-full px-4 py-3 bg-[#080d13] border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 transition-all font-semibold"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Role Name</label>
                                                <input
                                                    type="text"
                                                    value={editContent.role || ''}
                                                    onChange={e => setEditContent(prev => ({ ...prev, role: e.target.value }))}
                                                    className="w-full px-4 py-3 bg-[#080d13] border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 transition-all font-semibold"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Office Details</label>
                                                    <input
                                                        type="text"
                                                        value={editContent.office || ''}
                                                        onChange={e => setEditContent(prev => ({ ...prev, office: e.target.value }))}
                                                        className="px-4 py-2.5 bg-[#080d13] border border-slate-800 rounded-xl text-white text-xs"
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Signature Color</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="color"
                                                            value={editContent.color || '#fbbf24'}
                                                            onChange={e => setEditContent(prev => ({ ...prev, color: e.target.value }))}
                                                            className="w-10 h-9 bg-transparent border-0 rounded cursor-pointer"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={editContent.color || '#fbbf24'}
                                                            onChange={e => setEditContent(prev => ({ ...prev, color: e.target.value }))}
                                                            className="flex-1 px-3 py-1.5 bg-[#080d13] border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none uppercase"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>

                                {/* Form Submit Actions */}
                                <div className="flex items-center justify-end gap-3 mt-8 border-t border-slate-800 pt-5">
                                    <button
                                        type="button"
                                        onClick={() => setEditingBlock(null)}
                                        className="px-4 py-2.5 bg-[#0b0f15] hover:bg-slate-800 border border-slate-850 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSaveBlock(editingBlock.id, { type: editingBlock.type, content: editContent })}
                                        className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-black rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                                    >
                                        <MdSave size={16} /> Save Block
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#0d1117] border border-dashed border-slate-800 rounded-3xl p-16 text-center text-slate-500 flex flex-col items-center justify-center min-h-[400px]">
                                <MdSettings className="text-slate-700 animate-spin-slow mb-3 animate-pulse" size={40} />
                                <h4 className="text-slate-400 font-bold uppercase tracking-wider text-sm">Active Configuration Pane</h4>
                                <p className="text-xs text-slate-600 max-w-xs mt-2 leading-relaxed">
                                    Select any layout block from the left panel to edit its settings, or click on a custom block adder type.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChainOfCommandManager;
