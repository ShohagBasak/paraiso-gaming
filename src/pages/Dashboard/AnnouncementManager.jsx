import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MdAdd, MdDelete, MdCampaign, MdEdit, MdClose, MdHelpOutline, MdDragIndicator, MdPalette } from 'react-icons/md';
import { toast } from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
            description_size: 'text-sm'
        }
    });

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
                description_size: 'text-sm'
            });
            setUploadPreview('');
            setEditingItem(null);
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
        setUploadPreview(ann.image_url);
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
            description_size: 'text-sm'
        });
        setUploadPreview('');
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
                        <input
                            type="text"
                            {...register('title', { required: 'Title is required' })}
                            placeholder="e.g. Server Update v2.0"
                            className="w-full px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                        />
                        {errors.title && <p className="text-red-400 text-xs">{errors.title.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Description</label>
                        <textarea
                            {...register('description')}
                            placeholder="Describe the announcement..."
                            rows={3}
                            className="w-full px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600 resize-none"
                        />
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        <img src={ann.image_url} alt={ann.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-bold text-sm">{ann.title}</p>
                                    {ann.description && (
                                        <p className="text-slate-400 text-xs mt-1 leading-relaxed line-clamp-2">{ann.description}</p>
                                    )}
                                    {ann.link && (
                                        <a href={ann.link} target="_blank" rel="noreferrer" className="text-purple-400 text-xs mt-1 inline-block hover:text-white truncate max-w-xs">
                                            {ann.link}
                                        </a>
                                    )}
                                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                                        <span className="text-[10px] font-mono text-purple-400/80 bg-purple-950/40 border border-purple-800/30 px-1.5 py-0.5 rounded">Title: {ann.title_color || '#fff'}</span>
                                        <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/40 border border-cyan-800/30 px-1.5 py-0.5 rounded">Text: {ann.description_color || '#cbd5e1'}</span>
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
