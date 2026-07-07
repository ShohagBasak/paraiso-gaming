import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { MdAdd, MdDelete, MdCampaign, MdEdit, MdClose, MdHelpOutline, MdDragIndicator, MdPalette, MdFormatAlignLeft, MdFormatAlignCenter, MdFormatAlignRight } from 'react-icons/md';
import { toast } from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const sanitizeHTML = (htmlString) => {
    if (!htmlString) return '';
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const allowedTags = ['B', 'STRONG', 'I', 'EM', 'U', 'S', 'STRIKE', 'DIV', 'P', 'SPAN', 'BR', 'UL', 'OL', 'LI'];
    
    const sanitizeNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) return;
        if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName;
            if (['SCRIPT', 'IFRAME', 'STYLE', 'OBJECT', 'EMBED'].includes(tagName)) {
                node.remove();
                return;
            }
            if (!allowedTags.includes(tagName)) {
                while (node.firstChild) {
                    node.parentNode.insertBefore(node.firstChild, node);
                }
                node.remove();
                return;
            }
            const attrs = Array.from(node.attributes);
            for (const attr of attrs) {
                const name = attr.name.toLowerCase();
                if (name === 'style') {
                    const styleValue = attr.value.toLowerCase();
                    const isSafeStyle = styleValue.split(';').every(part => {
                        const cleanPart = part.trim();
                        if (!cleanPart) return true;
                        return cleanPart.startsWith('text-align') || cleanPart.startsWith('text-decoration') || cleanPart.startsWith('display');
                    });
                    if (!isSafeStyle) {
                        node.removeAttribute(attr.name);
                    }
                } else if (name === 'align') {
                    const alignVal = attr.value.toLowerCase();
                    if (!['left', 'center', 'right', 'justify'].includes(alignVal)) {
                        node.removeAttribute(attr.name);
                    }
                } else {
                    node.removeAttribute(attr.name);
                }
            }
            const children = Array.from(node.childNodes);
            children.forEach(sanitizeNode);
        }
    };
    
    Array.from(doc.body.childNodes).forEach(sanitizeNode);
    return doc.body.innerHTML;
};

const stripHTML = (htmlString) => {
    if (!htmlString) return '';
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
};

const AnnouncementManager = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            description: '',
            image_url: '',
            link: '',
            title_color: '#ffffff',
            description_color: '#cbd5e1',
            title_size: 'text-xl md:text-2xl',
            description_size: 'text-sm',
            image_shape: 'rectangle'
        }
    });

    const titleEditorRef = useRef(null);
    const descEditorRef = useRef(null);

    const [titleEditorStates, setTitleEditorStates] = useState({
        bold: false,
        italic: false,
        underline: false,
        strikeThrough: false,
        justifyLeft: false,
        justifyCenter: false,
        justifyRight: false
    });

    const [descEditorStates, setDescEditorStates] = useState({
        bold: false,
        italic: false,
        underline: false,
        strikeThrough: false,
        justifyLeft: false,
        justifyCenter: false,
        justifyRight: false
    });

    const updateEditorStates = (editorName) => {
        const ref = editorName === 'title' ? titleEditorRef : descEditorRef;
        if (!ref.current) return;
        
        const setter = editorName === 'title' ? setTitleEditorStates : setDescEditorStates;
        setter({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
            strikeThrough: document.queryCommandState('strikeThrough'),
            justifyLeft: document.queryCommandState('justifyLeft'),
            justifyCenter: document.queryCommandState('justifyCenter'),
            justifyRight: document.queryCommandState('justifyRight')
        });
    };

    const handleFormat = (command, editorName, value = null) => {
        const ref = editorName === 'title' ? titleEditorRef : descEditorRef;
        if (!ref.current) return;
        
        ref.current.focus();
        document.execCommand(command, false, value);
        setValue(editorName, ref.current.innerHTML, { shouldValidate: true, shouldDirty: true });
        updateEditorStates(editorName);
    };

    const handleKeyDown = (e, editorName) => {
        const isMeta = e.ctrlKey || e.metaKey;
        if (isMeta) {
            const key = e.key.toLowerCase();
            if (key === 'b') {
                e.preventDefault();
                e.stopPropagation();
                handleFormat('bold', editorName);
            } else if (key === 'i') {
                e.preventDefault();
                e.stopPropagation();
                handleFormat('italic', editorName);
            } else if (key === 'u') {
                e.preventDefault();
                e.stopPropagation();
                handleFormat('underline', editorName);
            } else if (key === 's' && e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                handleFormat('strikeThrough', editorName);
            }
        }
    };

    const watchTitleColor = watch('title_color', '#ffffff');
    const watchDescriptionColor = watch('description_color', '#cbd5e1');

    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadPreview, setUploadPreview] = useState('');
    const [editingItem, setEditingItem] = useState(null); // stores announcement object being edited

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

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch(`${BASE_URL}/announcements`, { credentials: 'include' });
            const data = await res.json();
            setAnnouncements(Array.isArray(data) ? data : []);
        } catch {
            setAnnouncements([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAnnouncements(); }, []);

    const executeAddOrUpdate = async (data) => {
        const isEditing = !!editingItem;
        setSubmitting(true);
        const loadingToast = toast.loading(isEditing ? 'Updating announcement...' : 'Posting announcement...');
        try {
            const url = isEditing ? `${BASE_URL}/announcements/${editingItem.id}` : `${BASE_URL}/announcements`;
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            
            toast.success(isEditing ? 'Announcement updated successfully!' : 'Announcement posted successfully!', { id: loadingToast });
            reset({
                title: '',
                description: '',
                image_url: '',
                link: '',
                title_color: '#ffffff',
                description_color: '#cbd5e1',
                title_size: 'text-xl md:text-2xl',
                description_size: 'text-sm',
                image_shape: 'rectangle'
            });
            setUploadPreview('');
            setEditingItem(null);
            if (titleEditorRef.current) {
                titleEditorRef.current.innerHTML = '';
            }
            if (descEditorRef.current) {
                descEditorRef.current.innerHTML = '';
            }
            setTitleEditorStates({
                bold: false,
                italic: false,
                underline: false,
                strikeThrough: false,
                justifyLeft: false,
                justifyCenter: false,
                justifyRight: false
            });
            setDescEditorStates({
                bold: false,
                italic: false,
                underline: false,
                strikeThrough: false,
                justifyLeft: false,
                justifyCenter: false,
                justifyRight: false
            });
            fetchAnnouncements();
        } catch (err) {
            toast.error(err.message || 'Failed to process request', { id: loadingToast });
        } finally {
            setSubmitting(false);
        }
    };

    const handleAdd = (data) => {
        const isEditing = !!editingItem;
        setConfirmModal({
            isOpen: true,
            title: isEditing ? 'Update Announcement' : 'Post Announcement',
            message: isEditing 
                ? 'Are you sure you want to update this announcement with the new details?' 
                : 'Are you sure you want to post this announcement to the home page features slider?',
            onConfirm: () => {
                executeAddOrUpdate(data);
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const executeDelete = async (id) => {
        const deletingToast = toast.loading('Deleting announcement...');
        try {
            const res = await fetch(`${BASE_URL}/announcements/${id}`, { method: 'DELETE', credentials: 'include' });
            if (!res.ok) throw new Error('Failed to delete');
            setAnnouncements(prev => prev.filter(a => a.id !== id));
            toast.success('Announcement deleted!', { id: deletingToast });
            if (editingItem?.id === id) {
                handleCancelEdit();
            }
        } catch (err) {
            toast.error(err.message || 'Failed to delete announcement', { id: deletingToast });
        }
    };

    const handleDelete = (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Announcement',
            message: 'Are you sure you want to permanently delete this announcement? This action cannot be undone.',
            onConfirm: () => {
                executeDelete(id);
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleStartEdit = (ann) => {
        setEditingItem(ann);
        setValue('title', ann.title);
        setValue('description', ann.description);
        setValue('image_url', ann.image_url);
        setValue('link', ann.link);
        setValue('title_color', ann.title_color || '#ffffff');
        setValue('description_color', ann.description_color || '#cbd5e1');
        setValue('title_size', ann.title_size || 'text-xl md:text-2xl');
        setValue('description_size', ann.description_size || 'text-sm');
        setValue('image_shape', ann.image_shape || 'rectangle');
        setUploadPreview(ann.image_url);
        if (titleEditorRef.current) {
            titleEditorRef.current.innerHTML = ann.title || '';
        }
        if (descEditorRef.current) {
            descEditorRef.current.innerHTML = ann.description || '';
        }
        setTimeout(() => {
            updateEditorStates('title');
            updateEditorStates('description');
        }, 50);
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        reset({
            title: '',
            description: '',
            image_url: '',
            link: '',
            title_color: '#ffffff',
            description_color: '#cbd5e1',
            title_size: 'text-xl md:text-2xl',
            description_size: 'text-sm',
            image_shape: 'rectangle'
        });
        setUploadPreview('');
        if (titleEditorRef.current) {
            titleEditorRef.current.innerHTML = '';
        }
        if (descEditorRef.current) {
            descEditorRef.current.innerHTML = '';
        }
        setTitleEditorStates({
            bold: false,
            italic: false,
            underline: false,
            strikeThrough: false,
            justifyLeft: false,
            justifyCenter: false,
            justifyRight: false
        });
        setDescEditorStates({
            bold: false,
            italic: false,
            underline: false,
            strikeThrough: false,
            justifyLeft: false,
            justifyCenter: false,
            justifyRight: false
        });
    };

    const handleFileUpload = async (file) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please drop/select a valid image file.');
            return;
        }
        setUploading(true);
        const uploadToast = toast.loading('Uploading image to ImgBB...');
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
                setValue('image_url', imageUrl);
                setUploadPreview(imageUrl);
                toast.success('Image uploaded successfully!', { id: uploadToast });
            } else {
                throw new Error(result.error?.message || 'ImgBB upload failed');
            }
        } catch (err) {
            toast.error('Upload failed: ' + err.message, { id: uploadToast });
        } finally {
            setUploading(false);
        }
    };

    // HTML5 Drag & Drop reorder handlers
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

        const reordered = [...announcements];
        const [removed] = reordered.splice(draggedIndex, 1);
        reordered.splice(targetIndex, 0, removed);

        // Update state locally for instant UI update
        setAnnouncements(reordered);
        setDraggedIndex(null);
        setDragOverIndex(null);

        // Map order details to upload to server
        const orders = reordered.map((ann, index) => ({
            id: ann.id,
            sort_order: index
        }));

        const reorderToast = toast.loading('Saving announcement layout order...');
        try {
            const res = await fetch(`${BASE_URL}/announcements/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ orders }),
            });
            if (!res.ok) throw new Error('Reorder failed');
            toast.success('Announcement order updated successfully!', { id: reorderToast });
        } catch (err) {
            toast.error(err.message || 'Failed to update order', { id: reorderToast });
            fetchAnnouncements(); // Reload original server order if sync fails
        }
    };

    return (
        <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-wider">Server Announcements</h2>
                <p className="text-slate-400 text-sm mt-1">Manage the FeaturesSlider announcements on the home page.</p>
            </div>

            {/* Custom Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md px-4">
                    <div className="bg-[#0b0f15] border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Gaming theme accent border */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                        
                        <div className="flex items-start gap-4 mb-4 mt-2">
                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 flex-shrink-0">
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
                                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                            >
                                Yes, Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Form */}
            <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6 mb-8">
                <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-5 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        {editingItem ? <MdEdit className="text-purple-400" size={18} /> : <MdAdd className="text-purple-400" size={18} />}
                        {editingItem ? 'Edit Announcement' : 'Add New Announcement'}
                    </span>
                    {editingItem && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="flex items-center gap-1 text-slate-500 hover:text-slate-300 text-xs font-semibold uppercase tracking-wider transition-colors"
                        >
                            <MdClose size={16} /> Cancel Edit
                        </button>
                    )}
                </h3>
                <form onSubmit={handleSubmit(handleAdd)} className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Title <span className="text-red-400">*</span></label>
                        <div className="w-full bg-[#080d13] border border-slate-700 rounded-xl overflow-hidden focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
                            {/* Editor Toolbar for Title */}
                            <div className="flex items-center justify-between px-3 py-2 bg-[#0d1219] border-b border-slate-800/80 select-none">
                                {/* Alignment Group */}
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleFormat('justifyLeft', 'title');
                                        }}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                            titleEditorStates.justifyLeft 
                                                ? 'bg-cyan-950/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
                                                : 'bg-slate-900/40 border border-slate-800/80 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 active:scale-95'
                                        }`}
                                        title="Align Left"
                                    >
                                        <MdFormatAlignLeft size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleFormat('justifyCenter', 'title');
                                        }}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                            titleEditorStates.justifyCenter 
                                                ? 'bg-cyan-950/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
                                                : 'bg-slate-900/40 border border-slate-800/80 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 active:scale-95'
                                        }`}
                                        title="Align Center"
                                    >
                                        <MdFormatAlignCenter size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleFormat('justifyRight', 'title');
                                        }}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                            titleEditorStates.justifyRight 
                                                ? 'bg-cyan-950/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
                                                : 'bg-slate-900/40 border border-slate-800/80 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 active:scale-95'
                                        }`}
                                        title="Align Right"
                                    >
                                        <MdFormatAlignRight size={16} />
                                    </button>
                                </div>

                                {/* Text Formatting Group */}
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleFormat('bold', 'title');
                                        }}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold active:scale-95 transition-all text-xs ${
                                            titleEditorStates.bold 
                                                ? 'bg-cyan-950/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
                                                : 'bg-slate-900/40 border border-slate-800/80 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40'
                                        }`}
                                        title="Bold"
                                    >
                                        B
                                    </button>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleFormat('italic', 'title');
                                        }}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center italic font-serif active:scale-95 transition-all text-xs ${
                                            titleEditorStates.italic 
                                                ? 'bg-cyan-950/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
                                                : 'bg-slate-900/40 border border-slate-800/80 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40'
                                        }`}
                                        title="Italic"
                                    >
                                        I
                                    </button>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleFormat('underline', 'title');
                                        }}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center underline active:scale-95 transition-all text-xs ${
                                            titleEditorStates.underline 
                                                ? 'bg-cyan-950/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
                                                : 'bg-slate-900/40 border border-slate-800/80 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40'
                                        }`}
                                        title="Underline"
                                    >
                                        U
                                    </button>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleFormat('strikeThrough', 'title');
                                        }}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center line-through active:scale-95 transition-all text-xs ${
                                            titleEditorStates.strikeThrough 
                                                ? 'bg-cyan-950/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
                                                : 'bg-slate-900/40 border border-slate-800/80 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40'
                                        }`}
                                        title="Strikethrough"
                                    >
                                        S
                                    </button>
                                </div>
                            </div>

                            {/* Hidden Input for react-hook-form */}
                            <input type="hidden" {...register('title', { required: 'Title is required' })} />

                            {/* ContentEditable Editor */}
                            <div
                                ref={titleEditorRef}
                                contentEditable
                                onInput={(e) => {
                                    setValue('title', e.currentTarget.innerHTML, { shouldValidate: true, shouldDirty: true });
                                    updateEditorStates('title');
                                }}
                                onKeyDown={(e) => handleKeyDown(e, 'title')}
                                onKeyUp={() => updateEditorStates('title')}
                                onMouseUp={() => updateEditorStates('title')}
                                onFocus={() => updateEditorStates('title')}
                                placeholder="e.g. Server Update v2.0"
                                className="w-full px-4 py-3 bg-transparent text-white text-sm focus:outline-none placeholder:text-slate-600 announcement-editor animate-none"
                                style={{ outline: 'none' }}
                            />
                        </div>
                        {errors.title && <p className="text-red-400 text-xs">{errors.title.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <style>{`
                            .announcement-editor:empty:before {
                                content: attr(placeholder);
                                color: #475569;
                                pointer-events: none;
                                display: block;
                            }
                        `}</style>
                        <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Description</label>
                        <div className="w-full bg-[#080d13] border border-slate-700 rounded-xl overflow-hidden focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
                            {/* Editor Toolbar */}
                            <div className="flex items-center justify-between px-3 py-2 bg-[#0d1219] border-b border-slate-800/80 select-none">
                                {/* Alignment Group */}
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleFormat('justifyLeft', 'description');
                                        }}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                            descEditorStates.justifyLeft 
                                                ? 'bg-cyan-950/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
                                                : 'bg-slate-900/40 border border-slate-800/80 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 active:scale-95'
                                        }`}
                                        title="Align Left"
                                    >
                                        <MdFormatAlignLeft size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleFormat('justifyCenter', 'description');
                                        }}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                            descEditorStates.justifyCenter 
                                                ? 'bg-cyan-950/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
                                                : 'bg-slate-900/40 border border-slate-800/80 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 active:scale-95'
                                        }`}
                                        title="Align Center"
                                    >
                                        <MdFormatAlignCenter size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleFormat('justifyRight', 'description');
                                        }}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                            descEditorStates.justifyRight 
                                                ? 'bg-cyan-950/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
                                                : 'bg-slate-900/40 border border-slate-800/80 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 active:scale-95'
                                        }`}
                                        title="Align Right"
                                    >
                                        <MdFormatAlignRight size={16} />
                                    </button>
                                </div>

                                {/* Text Formatting Group */}
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleFormat('bold', 'description');
                                        }}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold active:scale-95 transition-all text-xs ${
                                            descEditorStates.bold 
                                                ? 'bg-cyan-950/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
                                                : 'bg-slate-900/40 border border-slate-800/80 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40'
                                        }`}
                                        title="Bold"
                                    >
                                        B
                                    </button>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleFormat('italic', 'description');
                                        }}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center italic font-serif active:scale-95 transition-all text-xs ${
                                            descEditorStates.italic 
                                                ? 'bg-cyan-950/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
                                                : 'bg-slate-900/40 border border-slate-800/80 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40'
                                        }`}
                                        title="Italic"
                                    >
                                        I
                                    </button>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleFormat('underline', 'description');
                                        }}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center underline active:scale-95 transition-all text-xs ${
                                            descEditorStates.underline 
                                                ? 'bg-cyan-950/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
                                                : 'bg-slate-900/40 border border-slate-800/80 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40'
                                        }`}
                                        title="Underline"
                                    >
                                        U
                                    </button>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleFormat('strikeThrough', 'description');
                                        }}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center line-through active:scale-95 transition-all text-xs ${
                                            descEditorStates.strikeThrough 
                                                ? 'bg-cyan-950/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
                                                : 'bg-slate-900/40 border border-slate-800/80 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40'
                                        }`}
                                        title="Strikethrough"
                                    >
                                        S
                                    </button>
                                </div>
                            </div>

                            {/* Hidden Input for react-hook-form */}
                            <input type="hidden" {...register('description')} />

                            {/* ContentEditable Editor */}
                            <div
                                ref={descEditorRef}
                                contentEditable
                                onInput={(e) => {
                                    setValue('description', e.currentTarget.innerHTML);
                                    updateEditorStates('description');
                                }}
                                onKeyDown={(e) => handleKeyDown(e, 'description')}
                                onKeyUp={() => updateEditorStates('description')}
                                onMouseUp={() => updateEditorStates('description')}
                                onFocus={() => updateEditorStates('description')}
                                placeholder="Describe the announcement..."
                                className="w-full min-h-[150px] px-4 py-3 bg-transparent text-white text-sm focus:outline-none placeholder:text-slate-600 overflow-y-auto announcement-editor"
                                style={{ outline: 'none' }}
                            />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">💡 Select text and click the buttons above to format: Bold, Italic, Underline, Strikethrough, or Alignment.</p>
                    </div>

                    {/* Font Styling Options */}
                    <div className="border border-slate-800/80 bg-slate-900/30 rounded-2xl p-4 space-y-4">
                        <p className="text-purple-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <MdPalette size={16} /> Dynamic Font Customization
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Title Color */}
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Title Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={watchTitleColor}
                                        onChange={(e) => setValue('title_color', e.target.value)}
                                        className="w-10 h-10 border-0 bg-transparent rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        {...register('title_color')}
                                        placeholder="#ffffff"
                                        className="w-full px-3 py-2 bg-[#080d13] border border-slate-700 rounded-lg text-white text-xs font-mono focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Description Color */}
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Text Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={watchDescriptionColor}
                                        onChange={(e) => setValue('description_color', e.target.value)}
                                        className="w-10 h-10 border-0 bg-transparent rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        {...register('description_color')}
                                        placeholder="#cbd5e1"
                                        className="w-full px-3 py-2 bg-[#080d13] border border-slate-700 rounded-lg text-white text-xs font-mono focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Title Size Selector */}
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Title Size</label>
                                <select
                                    {...register('title_size')}
                                    className="w-full px-3 py-2.5 bg-[#080d13] border border-slate-700 rounded-lg text-white text-xs focus:outline-none"
                                >
                                    <option value="text-lg">Extra Small (lg)</option>
                                    <option value="text-xl">Small (xl)</option>
                                    <option value="text-xl md:text-2xl">Medium (2xl)</option>
                                    <option value="text-2xl md:text-3xl">Large (3xl)</option>
                                    <option value="text-3xl md:text-4xl">Extra Large (4xl)</option>
                                </select>
                            </div>

                            {/* Description Size Selector */}
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Text Size</label>
                                <select
                                    {...register('description_size')}
                                    className="w-full px-3 py-2.5 bg-[#080d13] border border-slate-700 rounded-lg text-white text-xs focus:outline-none"
                                >
                                    <option value="text-xs">Extra Small (xs)</option>
                                    <option value="text-sm">Small (sm)</option>
                                    <option value="text-base">Medium (base)</option>
                                    <option value="text-lg">Large (lg)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Drag & Drop Area */}
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Upload Announcement Image</label>
                        <div
                            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={(e) => { e.preventDefault(); setDragging(false); const file = e.dataTransfer.files[0]; if (file) handleFileUpload(file); }}
                            onClick={() => document.getElementById('ann-file-input').click()}
                            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                                dragging
                                    ? 'border-purple-400 bg-purple-500/5'
                                    : uploadPreview
                                    ? 'border-green-500/40 bg-green-500/5'
                                    : 'border-slate-700 hover:border-purple-500 bg-[#080d13]'
                            }`}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                id="ann-file-input"
                                onChange={(e) => { const file = e.target.files[0]; if (file) handleFileUpload(file); }}
                                className="hidden"
                            />
                            {uploading ? (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-purple-400 text-xs font-bold uppercase tracking-wider">Uploading to ImgBB...</p>
                                </div>
                            ) : uploadPreview ? (
                                <div className="flex flex-col items-center gap-2">
                                    <img src={uploadPreview} alt="Preview" className="h-20 object-contain rounded-lg border border-slate-700" />
                                    <p className="text-green-400 text-xs font-bold uppercase tracking-wider">✓ Image hosted successfully on ImgBB!</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-slate-300 text-sm font-semibold">Drag & drop announcement image here, or <span className="text-purple-400">browse</span></p>
                                    <p className="text-slate-500 text-xs">Hosts automatically on ImgBB. Or paste link manually below.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Image URL</label>
                            <input
                                type="url"
                                {...register('image_url')}
                                placeholder="https://example.com/image.png"
                                className="w-full px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Image Display Shape</label>
                            <select
                                {...register('image_shape')}
                                className="w-full px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-bold"
                            >
                                <option value="rectangle">Rectangle / Wide (16:9)</option>
                                <option value="square">Square (1:1)</option>
                                <option value="natural">Natural (Original Height)</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Forum Link</label>
                            <input
                                type="url"
                                {...register('link')}
                                placeholder="https://forums.pgaming.net/..."
                                className="w-full px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`flex items-center gap-2 px-6 py-3 disabled:opacity-50 text-white font-bold uppercase tracking-widest text-sm rounded-xl transition-all duration-300 shadow-lg active:scale-95 ${
                                editingItem
                                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
                                    : 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20'
                            }`}
                        >
                            {editingItem ? <MdEdit size={18} /> : <MdAdd size={18} />}
                            {submitting ? 'Processing...' : editingItem ? 'Update Announcement' : 'Post Announcement'}
                        </button>
                        {editingItem && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold uppercase tracking-widest text-sm rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Existing Announcements */}
            <div>
                <div className="mb-4">
                    <h3 className="text-white font-bold uppercase tracking-wider text-sm">
                        Current Announcements <span className="text-purple-400">({announcements.length})</span>
                    </h3>
                    <p className="text-slate-500 text-xs mt-1">💡 Drag and drop cards vertically to reorder how they display on the home page features section.</p>
                </div>

                {loading ? (
                    <div className="flex items-center gap-3 text-slate-400 py-8">
                        <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        Loading announcements...
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="bg-[#0d1117] border border-dashed border-slate-700 rounded-2xl p-10 text-center">
                        <MdCampaign className="text-slate-600 mx-auto mb-3" size={40} />
                        <p className="text-slate-500 text-sm">No announcements yet. Post one above.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {announcements.map((ann, index) => (
                            <div 
                                key={ann.id} 
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDrop={() => handleDropReorder(index)}
                                className={`bg-[#0d1117] border rounded-2xl p-4 flex items-start gap-4 group transition-all cursor-move active:cursor-grabbing ${
                                    editingItem?.id === ann.id 
                                        ? 'border-amber-500/60 bg-amber-500/5' 
                                        : dragOverIndex === index
                                        ? 'border-purple-500 bg-purple-950/15 scale-[1.01] shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                                        : 'border-slate-800 hover:border-slate-600'
                                }`}
                            >
                                {/* Drag Grip Handle Indicator */}
                                <div className="text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0 cursor-move pt-1">
                                    <MdDragIndicator size={20} />
                                </div>

                                {ann.image_url && (
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                                        <img src={ann.image_url} alt={stripHTML(ann.title)} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div 
                                        className="text-white font-bold text-sm"
                                        dangerouslySetInnerHTML={{ __html: sanitizeHTML(ann.title) }}
                                    />
                                    {ann.description && (
                                        <div 
                                            className="text-slate-400 text-xs mt-1 leading-relaxed line-clamp-2"
                                            dangerouslySetInnerHTML={{ __html: sanitizeHTML(ann.description) }}
                                        />
                                    )}
                                    {ann.link && (
                                        <a href={ann.link} target="_blank" rel="noreferrer" className="text-purple-400 text-xs mt-1 inline-block hover:text-white truncate max-w-xs">
                                            {ann.link}
                                        </a>
                                    )}
                                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                                        <span className="text-[10px] font-mono text-purple-400/80 bg-purple-950/40 border border-purple-800/30 px-1.5 py-0.5 rounded">Title: {ann.title_color || '#fff'}</span>
                                        <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/40 border border-cyan-800/30 px-1.5 py-0.5 rounded">Text: {ann.description_color || '#cbd5e1'}</span>
                                        <span className="text-[10px] font-mono text-amber-400/80 bg-amber-950/40 border border-amber-800/30 px-1.5 py-0.5 rounded uppercase">Shape: {ann.image_shape || 'rectangle'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleStartEdit(ann)}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer"
                                        title="Edit Announcement"
                                    >
                                        <MdEdit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ann.id)}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                                        title="Delete Announcement"
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
    );
};

export default AnnouncementManager;
