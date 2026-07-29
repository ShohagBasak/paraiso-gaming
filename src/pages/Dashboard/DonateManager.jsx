import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  MdAdd, MdEdit, MdDelete, MdCategory, MdStore, MdClose,
  MdImage, MdSave, MdVisibility, MdVisibilityOff, MdHelpOutline, MdDragIndicator
} from 'react-icons/md';
import { HiTag } from 'react-icons/hi';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── Confirm Modal ──────────────────────────────────────────────────
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md px-4">
      <div className="bg-[#0b0f15] border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
        <div className="flex items-start gap-4 mb-4 mt-2">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 flex-shrink-0">
            <MdHelpOutline size={24} />
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-base">{title}</h4>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button onClick={onCancel} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const DonateManager = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Drag & drop state
  const [draggedCatIndex, setDraggedCatIndex] = useState(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  // Category form
  const [showCatForm, setShowCatForm] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catName, setCatName] = useState('');
  const [savingCat, setSavingCat] = useState(false);

  // Item form
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm, setItemForm] = useState({ name: '', description: '', category_id: '', price: '', image_url: '' });
  const [imagePreview, setImagePreview] = useState('');
  const [savingItem, setSavingItem] = useState(false);

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: '', id: null, name: '' });

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}/donate-categories`, { credentials: 'include' });
      const data = await res.json();
      setCategories(data);
    } catch { /* silent */ }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/donate-items/all`, { credentials: 'include' });
      const data = await res.json();
      setItems(data);
    } catch { /* silent */ }
    setLoading(false);
  };

  // ─── Drag & Drop Reorder Handlers ─────────────────
  const handleCatDragStart = (e, index) => {
    setDraggedCatIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCatDragOver = (e, index) => {
    e.preventDefault();
    if (draggedCatIndex === null || draggedCatIndex === index) return;
    const newCategories = [...categories];
    const draggedCat = newCategories[draggedCatIndex];
    newCategories.splice(draggedCatIndex, 1);
    newCategories.splice(index, 0, draggedCat);
    setDraggedCatIndex(index);
    setCategories(newCategories);
  };

  const handleCatDragEnd = async () => {
    setDraggedCatIndex(null);
    const reordered = categories.map((cat, idx) => ({ id: cat.id, sort_order: idx }));
    try {
      const res = await fetch(`${BASE_URL}/donate-categories-reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ orders: reordered })
      });
      if (res.ok) {
        toast.success('Categories order saved!');
      } else {
        toast.error('Failed to save category order');
      }
    } catch {
      toast.error('Network error while reordering');
    }
  };

  const handleItemDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleItemDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    const newItems = [...items];
    const draggedItem = newItems[draggedItemIndex];
    newItems.splice(draggedItemIndex, 1);
    newItems.splice(index, 0, draggedItem);
    setDraggedItemIndex(index);
    setItems(newItems);
  };

  const handleItemDragEnd = async () => {
    setDraggedItemIndex(null);
    const reordered = items.map((item, idx) => ({ id: item.id, sort_order: idx }));
    try {
      const res = await fetch(`${BASE_URL}/donate-items-reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ orders: reordered })
      });
      if (res.ok) {
        toast.success('Items order saved!');
      } else {
        toast.error('Failed to save item order');
      }
    } catch {
      toast.error('Network error while reordering');
    }
  };

  // ─── Category CRUD ──────────────────────────────
  const handleSaveCat = async () => {
    if (!catName.trim()) return toast.error('Category name is required');
    setSavingCat(true);
    try {
      const url = editingCat
        ? `${BASE_URL}/donate-categories/${editingCat.id}`
        : `${BASE_URL}/donate-categories`;
      const res = await fetch(url, {
        method: editingCat ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: catName.trim() }),
      });
      if (res.ok) {
        toast.success(editingCat ? 'Category updated!' : 'Category created!');
        setShowCatForm(false);
        setEditingCat(null);
        setCatName('');
        fetchCategories();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed');
      }
    } catch { toast.error('Network error'); }
    setSavingCat(false);
  };

  const handleDeleteCat = async () => {
    try {
      const res = await fetch(`${BASE_URL}/donate-categories/${deleteConfirm.id}`, {
        method: 'DELETE', credentials: 'include'
      });
      if (res.ok) {
        toast.success('Category deleted!');
        fetchCategories();
        fetchItems();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed');
      }
    } catch { toast.error('Network error'); }
    setDeleteConfirm({ open: false, type: '', id: null, name: '' });
  };

  // ─── Item CRUD ──────────────────────────────
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      return toast.error('Please select a valid image file');
    }
    setUploading(true);
    const uploadToast = toast.loading('Uploading image to ImgBB...');
    const formData = new FormData();
    formData.append('image', file);

    try {
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY || '60d09e5b34467e4012981e00e008a68a';
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        const imageUrl = result.data.url;
        setItemForm(f => ({ ...f, image_url: imageUrl }));
        setImagePreview(imageUrl);
        toast.success('Image hosted successfully on ImgBB!', { id: uploadToast });
      } else {
        throw new Error(result.error?.message || 'ImgBB upload failed');
      }
    } catch (err) {
      toast.error('Upload failed: ' + err.message, { id: uploadToast });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveItem = async () => {
    if (!itemForm.name.trim()) return toast.error('Item name is required');
    if (!itemForm.category_id) return toast.error('Select a category');
    setSavingItem(true);
    try {
      const url = editingItem
        ? `${BASE_URL}/donate-items/${editingItem.id}`
        : `${BASE_URL}/donate-items`;
      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...itemForm,
          price: parseFloat(itemForm.price) || 0,
          category_id: parseInt(itemForm.category_id),
        }),
      });
      if (res.ok) {
        toast.success(editingItem ? 'Item updated!' : 'Item created!');
        setShowItemForm(false);
        setEditingItem(null);
        setItemForm({ name: '', description: '', category_id: '', price: '', image_url: '' });
        setImagePreview('');
        fetchItems();
        fetchCategories();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed');
      }
    } catch { toast.error('Network error'); }
    setSavingItem(false);
  };

  const handleToggleActive = async (item) => {
    try {
      const res = await fetch(`${BASE_URL}/donate-items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_active: item.is_active ? 0 : 1 }),
      });
      if (res.ok) {
        toast.success(item.is_active ? 'Item hidden' : 'Item visible');
        fetchItems();
      }
    } catch { toast.error('Failed'); }
  };

  const handleDeleteItem = async () => {
    try {
      const res = await fetch(`${BASE_URL}/donate-items/${deleteConfirm.id}`, {
        method: 'DELETE', credentials: 'include'
      });
      if (res.ok) {
        toast.success('Item deleted!');
        fetchItems();
        fetchCategories();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed');
      }
    } catch { toast.error('Network error'); }
    setDeleteConfirm({ open: false, type: '', id: null, name: '' });
  };

  const openEditItem = (item) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      description: item.description || '',
      category_id: item.category_id,
      price: item.price,
      image_url: item.image_url || '',
    });
    setImagePreview(item.image_url || '');
    setShowItemForm(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">Shop</h2>
          <p className="text-slate-400 text-sm mt-1">Manage categories and shop items</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
            activeTab === 'categories'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
              : 'bg-slate-800/40 text-slate-400 border border-slate-700/50 hover:text-white hover:bg-slate-800'
          }`}
        >
          <MdCategory size={18} /> Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
            activeTab === 'items'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
              : 'bg-slate-800/40 text-slate-400 border border-slate-700/50 hover:text-white hover:bg-slate-800'
          }`}
        >
          <MdStore size={18} /> Items ({items.length})
        </button>
      </div>

      {/* ════════ CATEGORIES TAB ════════ */}
      {activeTab === 'categories' && (
        <div>
          <button
            onClick={() => { setShowCatForm(true); setEditingCat(null); setCatName(''); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-cyan-500/20 transition-all mb-6"
          >
            <MdAdd size={18} /> Add Category
          </button>

          {/* Category form modal */}
          {showCatForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
              <div className="w-full max-w-sm bg-[#0b0f15] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-white font-bold uppercase tracking-wider text-sm">{editingCat ? 'Edit Category' : 'New Category'}</h3>
                    <button onClick={() => setShowCatForm(false)} className="text-slate-500 hover:text-white"><MdClose size={20} /></button>
                  </div>
                  <div className="flex flex-col gap-2 mb-5">
                    <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Category Name</label>
                    <input
                      type="text"
                      value={catName}
                      onChange={e => setCatName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#080d13] border border-slate-800 focus:border-cyan-500 rounded-xl text-white text-sm focus:outline-none transition-all"
                      placeholder="e.g. Vehicles, Boomboxes"
                      autoFocus
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => setShowCatForm(false)} className="px-4 py-2 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-slate-300 text-xs font-bold uppercase tracking-wider transition-all">Cancel</button>
                    <button onClick={handleSaveCat} disabled={savingCat} className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 disabled:opacity-50">
                      {savingCat ? <><div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" /> Saving...</> : <><MdSave size={14} /> Save</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Categories list */}
          <div className="space-y-2">
            <p className="text-slate-500 text-xs mb-3 flex items-center gap-1.5 font-medium">
              💡 Drag & drop category cards to change their display order.
            </p>
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                draggable
                onDragStart={(e) => handleCatDragStart(e, idx)}
                onDragOver={(e) => handleCatDragOver(e, idx)}
                onDragEnd={handleCatDragEnd}
                className={`flex items-center justify-between bg-[#0d1117] border rounded-xl px-5 py-4 transition-all ${
                  draggedCatIndex === idx
                    ? 'border-cyan-500 bg-cyan-950/20 opacity-70 shadow-lg scale-[1.01]'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-slate-600 hover:text-cyan-400 transition-colors p-1 cursor-grab active:cursor-grabbing">
                    <MdDragIndicator size={20} />
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <HiTag className="text-cyan-400" size={16} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{cat.name}</h4>
                    <p className="text-slate-500 text-xs">{cat.item_count || 0} items</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setEditingCat(cat); setCatName(cat.name); setShowCatForm(true); }}
                    className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-all"
                  >
                    <MdEdit size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ open: true, type: 'category', id: cat.id, name: cat.name })}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <MdDelete size={16} />
                  </button>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="text-center py-12 bg-[#0d1117] border border-dashed border-slate-800 rounded-2xl">
                <MdCategory className="text-slate-700 mx-auto mb-2" size={40} />
                <p className="text-slate-500 text-sm">No categories yet. Add your first one!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════ ITEMS TAB ════════ */}
      {activeTab === 'items' && (
        <div>
          <button
            onClick={() => { setShowItemForm(true); setEditingItem(null); setItemForm({ name: '', description: '', category_id: '', price: '', image_url: '' }); setImagePreview(''); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-cyan-500/20 transition-all mb-6"
          >
            <MdAdd size={18} /> Add Item
          </button>

          {/* Item form modal */}
          {showItemForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4 overflow-y-auto py-8">
              <div className="w-full max-w-lg bg-[#0b0f15] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-cyan-500 to-emerald-500"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-white font-bold uppercase tracking-wider text-sm">{editingItem ? 'Edit Item' : 'New Item'}</h3>
                    <button onClick={() => setShowItemForm(false)} className="text-slate-500 hover:text-white"><MdClose size={20} /></button>
                  </div>

                  <div className="space-y-4">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Item Name *</label>
                      <input type="text" value={itemForm.name} onChange={e => setItemForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-[#080d13] border border-slate-800 focus:border-cyan-500 rounded-xl text-white text-sm focus:outline-none transition-all"
                        placeholder="e.g. 1x Boombox" />
                    </div>

                    {/* Category + Price row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Category *</label>
                        <select value={itemForm.category_id} onChange={e => setItemForm(f => ({ ...f, category_id: e.target.value }))}
                          className="w-full px-4 py-2.5 bg-[#080d13] border border-slate-800 focus:border-cyan-500 rounded-xl text-white text-sm focus:outline-none transition-all">
                          <option value="" className="bg-[#0b0f15] text-slate-200">Select...</option>
                          {categories.map(c => <option key={c.id} value={c.id} className="bg-[#0b0f15] text-slate-200">{c.name}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Price ($)</label>
                        <input type="number" step="0.01" min="0" value={itemForm.price} onChange={e => setItemForm(f => ({ ...f, price: e.target.value }))}
                          className="w-full px-4 py-2.5 bg-[#080d13] border border-slate-800 focus:border-cyan-500 rounded-xl text-white text-sm focus:outline-none transition-all"
                          placeholder="0.00" />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Description</label>
                      <textarea value={itemForm.description} onChange={e => setItemForm(f => ({ ...f, description: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-[#080d13] border border-slate-800 focus:border-cyan-500 rounded-xl text-white text-sm focus:outline-none transition-all resize-none"
                        rows={3} placeholder="Optional description..." />
                    </div>

                    {/* Image */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Item Image</label>
                      <div className="flex items-start gap-4">
                        {(imagePreview || itemForm.image_url) && (
                          <img src={imagePreview || itemForm.image_url} alt="preview" className="w-20 h-20 rounded-xl object-contain p-1 border border-slate-700 bg-[#080d13]" />
                        )}
                        <label className="flex-1 flex flex-col items-center justify-center px-4 py-6 bg-[#080d13] border-2 border-dashed border-slate-800 rounded-xl cursor-pointer hover:border-cyan-500/40 transition-colors">
                          <MdImage className="text-slate-600 mb-1" size={24} />
                          <span className="text-slate-500 text-xs">
                            {uploading ? 'Uploading to ImgBB...' : 'Click to upload to ImgBB'}
                          </span>
                          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                        </label>
                      </div>
                      {/* Or paste URL */}
                      <input type="text" value={itemForm.image_url} onChange={e => { setItemForm(f => ({ ...f, image_url: e.target.value })); setImagePreview(e.target.value); }}
                        className="w-full px-4 py-2 bg-[#080d13] border border-slate-800 focus:border-cyan-500 rounded-xl text-white text-xs focus:outline-none transition-all mt-1"
                        placeholder="Or paste image URL manually..." />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800/60">
                    <button onClick={() => setShowItemForm(false)} className="px-4 py-2 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-slate-300 text-xs font-bold uppercase tracking-wider transition-all">Cancel</button>
                    <button onClick={handleSaveItem} disabled={savingItem} className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 disabled:opacity-50">
                      {savingItem ? <><div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" /> Saving...</> : <><MdSave size={14} /> {editingItem ? 'Update' : 'Create'}</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Items list */}
          {loading ? (
            <div className="flex items-center gap-3 text-slate-400 py-8">
              <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              Loading items...
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-slate-500 text-xs mb-3 flex items-center gap-1.5 font-medium">
                💡 Drag & drop item cards to change their display order.
              </p>
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleItemDragStart(e, idx)}
                  onDragOver={(e) => handleItemDragOver(e, idx)}
                  onDragEnd={handleItemDragEnd}
                  className={`flex items-center justify-between bg-[#0d1117] border rounded-xl px-5 py-4 transition-all ${
                    draggedItemIndex === idx
                      ? 'border-cyan-500 bg-cyan-950/20 opacity-70 shadow-lg scale-[1.01]'
                      : item.is_active
                      ? 'border-slate-800 hover:border-slate-700'
                      : 'border-slate-800/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-slate-600 hover:text-cyan-400 transition-colors p-1 cursor-grab active:cursor-grabbing">
                      <MdDragIndicator size={20} />
                    </div>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-lg object-contain p-1 border border-slate-700 bg-[#080d13]" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center">
                        <MdStore className="text-slate-600" size={20} />
                      </div>
                    )}
                    <div>
                      <h4 className="text-white font-bold text-sm flex items-center gap-2">
                        {item.name}
                        {!item.is_active && <span className="text-[10px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded font-mono">HIDDEN</span>}
                      </h4>
                      {item.description && (
                        <p className="text-slate-400 text-xs mt-1 whitespace-pre-line leading-relaxed">{item.description}</p>
                      )}
                      <p className="text-slate-500 text-xs flex items-center gap-2 mt-1">
                        <span className="text-cyan-400">{item.category_name}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">${parseFloat(item.price).toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => handleToggleActive(item)} className={`p-2 rounded-lg transition-all ${item.is_active ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-slate-500 hover:bg-slate-800'}`} title={item.is_active ? 'Hide item' : 'Show item'}>
                      {item.is_active ? <MdVisibility size={16} /> : <MdVisibilityOff size={16} />}
                    </button>
                    <button onClick={() => openEditItem(item)} className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-all">
                      <MdEdit size={16} />
                    </button>
                    <button onClick={() => setDeleteConfirm({ open: true, type: 'item', id: item.id, name: item.name })} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                      <MdDelete size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="text-center py-12 bg-[#0d1117] border border-dashed border-slate-800 rounded-2xl">
                  <MdStore className="text-slate-700 mx-auto mb-2" size={40} />
                  <p className="text-slate-500 text-sm">No items yet. Add your first one!</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmModal
        isOpen={deleteConfirm.open}
        title={`Delete ${deleteConfirm.type}`}
        message={`Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`}
        onCancel={() => setDeleteConfirm({ open: false, type: '', id: null, name: '' })}
        onConfirm={deleteConfirm.type === 'category' ? handleDeleteCat : handleDeleteItem}
      />
    </div>
  );
};

export default DonateManager;
