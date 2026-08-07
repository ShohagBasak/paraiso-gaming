import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { io } from 'socket.io-client';
import { MdSend, MdArrowBack, MdConfirmationNumber, MdStore, MdClose, MdRefresh, MdAdd, MdShoppingCart, MdExpandMore, MdExpandLess, MdRemove, MdSearch, MdDelete } from 'react-icons/md';
import { HiShoppingCart, HiPlus } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const statusConfig = {
  open: { label: 'Waiting for Admin', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', dot: 'bg-amber-400' },
  claimed: { label: 'In Progress', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30', dot: 'bg-cyan-400 animate-pulse' },
  closed: { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', dot: 'bg-emerald-400' },
};

// ─── Add Item Modal Component ───
const AddItemModal = ({ isOpen, onClose, ticketId, onItemAdded }) => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}/donate-categories`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch { setCategories([]); }
  };

  const fetchItems = async (categoryId = null) => {
    setLoading(true);
    try {
      let url = `${BASE_URL}/donate-items`;
      if (categoryId) url += `?category_id=${categoryId}`;
      const res = await fetch(url);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch { setItems([]); }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchItems();
      setSelectedItem(null);
      setQuantity(1);
      setSearchQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) fetchItems(selectedCategory);
  }, [selectedCategory]);

  const handleAddItem = async () => {
    if (!selectedItem) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/tickets/${ticketId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ item_id: selectedItem.id, quantity: Math.max(1, quantity) }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`"${selectedItem.name}" added to ticket!`);
        onItemAdded?.();
        onClose();
      } else {
        toast.error(data.message || 'Failed to add item');
      }
    } catch { toast.error('Network error'); }
    setSubmitting(false);
  };

  if (!isOpen) return null;

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md px-3">
      <div className="bg-[#0b0f15] border border-slate-800 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Accent bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-emerald-500"></div>

        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <MdShoppingCart className="text-cyan-400" size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider">Add Item to Ticket</h3>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest">Select an item from the store</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1.5 hover:bg-slate-800 rounded-lg cursor-pointer">
            <MdClose size={20} />
          </button>
        </div>

        {/* If an item is selected — show confirmation */}
        {selectedItem ? (
          <div className="p-5 flex-1 flex flex-col">
            <div className="bg-[#080d13] border border-slate-700 rounded-xl p-4 flex items-start gap-4 mb-4">
              {selectedItem.image_url ? (
                <img src={selectedItem.image_url} alt={selectedItem.name} className="w-16 h-16 rounded-xl object-cover border border-slate-700 flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <MdStore className="text-slate-600" size={24} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="text-white font-bold text-sm">{selectedItem.name}</h4>
                <p className="text-emerald-400 text-sm font-mono font-bold mt-1">${parseFloat(selectedItem.price).toFixed(2)}</p>
                {selectedItem.category_name && (
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider mt-1">{selectedItem.category_name}</p>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-slate-400 text-xs uppercase tracking-wider font-medium">Quantity:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <MdRemove size={16} />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 text-center bg-[#080d13] border border-slate-700 text-white text-sm rounded-lg py-1.5 focus:border-cyan-500 focus:outline-none"
                />
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <MdAdd size={16} />
                </button>
              </div>
              <span className="text-emerald-400 font-mono text-sm font-bold ml-auto">
                ${(parseFloat(selectedItem.price) * quantity).toFixed(2)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-auto">
              <button
                onClick={() => setSelectedItem(null)}
                className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleAddItem}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <MdAdd size={16} /> Add to Ticket
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Search + Categories */}
            <div className="px-5 pt-4 pb-2 space-y-3 flex-shrink-0">
              {/* Search */}
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#080d13] border border-slate-700 text-white text-sm rounded-xl focus:border-cyan-500 focus:outline-none transition-all"
                  placeholder="Search items..."
                />
              </div>

              {/* Category pills */}
              {categories.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
                      !selectedCategory
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400 border border-transparent hover:border-slate-700'
                    }`}
                  >
                    All
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                          : 'bg-slate-800 text-slate-400 border border-transparent hover:border-slate-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-7 h-7 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <MdStore className="text-slate-700 mx-auto mb-2" size={36} />
                  <p className="text-slate-500 text-sm">No items found</p>
                </div>
              ) : (
                filteredItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setSelectedItem(item); setQuantity(1); }}
                    className="w-full flex items-center gap-3 p-3 bg-[#080d13] border border-slate-800 rounded-xl hover:border-cyan-500/30 transition-all group text-left cursor-pointer"
                  >
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-11 h-11 rounded-lg object-cover border border-slate-700 group-hover:border-cyan-500/30 transition-colors flex-shrink-0" />
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                        <MdStore className="text-slate-600" size={18} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-semibold text-xs truncate">{item.name}</p>
                      {item.category_name && (
                        <p className="text-slate-500 text-[10px] uppercase tracking-wider">{item.category_name}</p>
                      )}
                    </div>
                    <span className="text-emerald-400 text-xs font-mono font-bold flex-shrink-0">${parseFloat(item.price).toFixed(2)}</span>
                    <HiPlus className="text-slate-600 group-hover:text-cyan-400 transition-colors flex-shrink-0" size={16} />
                  </button>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Ticket Items Section Component ───
const TicketItemsSection = ({ ticketId, refreshTrigger, isClosed, onOpenAddItemModal }) => {
  const [ticketItems, setTicketItems] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${BASE_URL}/tickets/${ticketId}/items`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setTicketItems(Array.isArray(data) ? data : []);
      }
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [ticketId, refreshTrigger]);

  const handleUpdateQuantity = async (itemId, newQty) => {
    if (newQty < 1 || isClosed) return;
    setUpdatingId(itemId);
    try {
      const res = await fetch(`${BASE_URL}/tickets/${ticketId}/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ quantity: newQty })
      });
      if (res.ok) {
        toast.success('Quantity updated');
        fetchItems();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to update quantity');
      }
    } catch { toast.error('Network error'); }
    setUpdatingId(null);
  };

  const handleDeleteItem = async (itemId, itemName) => {
    if (isClosed) return;
    if (ticketItems.length <= 1) {
      toast.error('A ticket must have at least one item');
      return;
    }
    setUpdatingId(itemId);
    try {
      const res = await fetch(`${BASE_URL}/tickets/${ticketId}/items/${itemId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        toast.success(`Removed "${itemName}"`);
        fetchItems();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to remove item');
      }
    } catch { toast.error('Network error'); }
    setUpdatingId(null);
  };

  if (loading) return null;

  const grandTotal = ticketItems.reduce((sum, ti) => sum + (parseFloat(ti.item_price || 0) * (ti.quantity || 1)), 0);

  return (
    <div className="bg-[#080d13] border-x border-slate-800">
      <div className="flex items-center justify-between px-4 py-2 hover:bg-slate-800/30 transition-colors">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 flex-1 text-left cursor-pointer"
        >
          <MdShoppingCart className="text-cyan-400" size={16} />
          <span className="text-cyan-400 text-xs uppercase tracking-wider font-bold">
            {ticketItems.length} {ticketItems.length === 1 ? 'Item' : 'Items'} in Ticket
          </span>
          <span className="text-emerald-400 text-xs font-mono font-bold">• ${grandTotal.toFixed(2)} Total</span>
          {expanded ? <MdExpandLess className="text-slate-500 ml-1" size={18} /> : <MdExpandMore className="text-slate-500 ml-1" size={18} />}
        </button>

        {!isClosed && onOpenAddItemModal && (
          <button
            onClick={onOpenAddItemModal}
            className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-md hover:bg-emerald-500/20 transition-all cursor-pointer flex-shrink-0"
          >
            <MdAdd size={14} />
            <span>Add Item</span>
          </button>
        )}
      </div>

      {expanded && ticketItems.length > 0 && (
        <div className="px-4 pb-3 space-y-2 border-t border-slate-800/60 pt-2">
          {ticketItems.map((ti, idx) => {
            const itemPrice = parseFloat(ti.item_price || 0);
            const itemTotal = itemPrice * (ti.quantity || 1);
            return (
              <div key={ti.id || idx} className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 py-2 px-3 rounded-xl bg-[#0d1117]/80 border border-slate-800/80">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {ti.item_image ? (
                    <img src={ti.item_image} alt={ti.item_name} className="w-9 h-9 rounded-lg object-cover border border-slate-700 flex-shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <MdStore className="text-slate-600" size={16} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-xs font-bold truncate">{ti.item_name}</p>
                    <p className="text-slate-400 text-[10px] font-mono">${itemPrice.toFixed(2)} each</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Quantity Controls */}
                  {!isClosed ? (
                    <div className="flex items-center gap-1 bg-[#080d13] border border-slate-700 rounded-lg p-0.5">
                      <button
                        onClick={() => handleUpdateQuantity(ti.id, (ti.quantity || 1) - 1)}
                        disabled={updatingId === ti.id || (ti.quantity || 1) <= 1}
                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 flex items-center justify-center text-white text-xs transition-colors cursor-pointer"
                        title="Decrease quantity"
                      >
                        <MdRemove size={12} />
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-bold text-white">
                        {ti.quantity || 1}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(ti.id, (ti.quantity || 1) + 1)}
                        disabled={updatingId === ti.id}
                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 flex items-center justify-center text-white text-xs transition-colors cursor-pointer"
                        title="Increase quantity"
                      >
                        <MdAdd size={12} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-xs font-mono">x{ti.quantity || 1}</span>
                  )}

                  {/* Subtotal */}
                  <span className="text-emerald-400 text-xs font-mono font-bold w-16 text-right">
                    ${itemTotal.toFixed(2)}
                  </span>

                  {/* Delete Item Button */}
                  {!isClosed && ticketItems.length > 1 && (
                    <button
                      onClick={() => handleDeleteItem(ti.id, ti.item_name)}
                      disabled={updatingId === ti.id}
                      className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all cursor-pointer"
                      title="Remove item from ticket"
                    >
                      <MdDelete size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const TicketChat = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [itemRefreshTrigger, setItemRefreshTrigger] = useState(0);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const fetchTicket = async () => {
    try {
      const res = await fetch(`${BASE_URL}/tickets/${id}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setTicket(data);
      }
    } catch { /* silent */ }
    setLoading(false);
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${BASE_URL}/tickets/${id}/messages`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } else {
        setMessages([]);
      }
    } catch { setMessages([]); }
  };

  useEffect(() => {
    fetchTicket();
    fetchMessages();

    // Socket.IO
    const token = localStorage.getItem('token');
    if (token) {
      const socket = io(BASE_URL, { auth: { token } });
      socketRef.current = socket;

      socket.emit('join-ticket', parseInt(id));

      socket.on('new-message', (msg) => {
        setMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      });

      socket.on('ticket-updated', (data) => {
        if (data.id == id) {
          fetchTicket();
        }
      });

      socket.on('ticket-deleted', (data) => {
        if (data.id == id) {
          toast.error('This ticket has been deleted');
          navigate('/my-tickets');
        }
      });

      socket.on('ticket-item-added', (data) => {
        if (data.ticketId == id) {
          setItemRefreshTrigger(prev => prev + 1);
          fetchTicket();
        }
      });

      socket.on('ticket-item-updated', (data) => {
        if (data.ticketId == id) {
          setItemRefreshTrigger(prev => prev + 1);
          fetchTicket();
          fetchMessages();
        }
      });

      socket.on('ticket-item-deleted', (data) => {
        if (data.ticketId == id) {
          setItemRefreshTrigger(prev => prev + 1);
          fetchTicket();
        }
      });

      socket.on('message-deleted', (data) => {
        if (data.ticketId == id) {
          setMessages(prev => prev.filter(m => m.id !== data.messageId));
        }
      });

      return () => {
        socket.emit('leave-ticket', parseInt(id));
        socket.disconnect();
      };
    }
  }, [id]);

  const handleDeleteMessage = async (msgId) => {
    try {
      const res = await fetch(`${BASE_URL}/tickets/${id}/messages/${msgId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        toast.success('Message deleted');
        setMessages(prev => prev.filter(m => m.id !== msgId));
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to delete message');
      }
    } catch { toast.error('Network error'); }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);



  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`${BASE_URL}/tickets/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: newMessage.trim() }),
      });
      if (res.ok) {
        setNewMessage('');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to send');
      }
    } catch { toast.error('Network error'); }
    setSending(false);
  };

  const handleReopenTicket = async () => {
    try {
      const res = await fetch(`${BASE_URL}/tickets/${id}/reopen`, {
        method: 'PUT', credentials: 'include'
      });
      if (res.ok) {
        toast.success('Ticket reopened');
        fetchTicket();
      } else {
        toast.error('Failed to reopen ticket');
      }
    } catch { toast.error('Network error'); }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080d13] pt-28 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm uppercase tracking-widest">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-[#080d13] pt-28 flex items-center justify-center">
        <div className="text-center">
          <MdConfirmationNumber className="text-slate-700 mx-auto mb-4" size={48} />
          <p className="text-slate-400 font-medium">Ticket not found</p>
          <Link to="/my-tickets" className="text-cyan-400 text-sm mt-2 inline-block hover:underline">← Back to My Tickets</Link>
        </div>
      </div>
    );
  }

  const sc = statusConfig[ticket.status] || statusConfig.open;

  return (
    <div className="min-h-screen bg-[#080d13] pt-28 mb-10 sm:pt-28 pb-4 flex flex-col">
      <div className="max-w-3xl w-full mx-auto px-3 sm:px-4 h-[calc(100vh-8rem)] min-h-[500px] flex flex-col">

        {/* Header */}
        <div className="bg-[#0d1117] border border-slate-800 rounded-t-2xl p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Link to="/my-tickets" className="text-slate-500 hover:text-cyan-400 transition-colors flex-shrink-0">
                <MdArrowBack size={20} />
              </Link>

              {ticket.item_image ? (
                <img src={ticket.item_image} alt={ticket.item_name} className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-contain p-0.5 border border-slate-700 bg-[#080d13] flex-shrink-0" />
              ) : (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <MdStore className="text-slate-600" size={18} />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="text-white font-bold text-xs sm:text-sm truncate">{ticket.item_name}</h2>
                  <span className="text-slate-400 font-normal text-xs">(x{ticket.quantity || 1})</span>
                  <span className="text-emerald-400 text-xs font-mono font-bold">${(parseFloat(ticket.item_price) * (ticket.quantity || 1)).toFixed(2)}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-slate-400 text-[10px] sm:text-[11px] mt-0.5">
                  {ticket.ingame_name && <span className="text-cyan-400 font-mono">IGN: {ticket.ingame_name}</span>}
                  {ticket.discord_username && <span className="text-purple-400 font-mono">• Discord: {ticket.discord_username}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
              {ticket.admin_name ? (
                <span className="text-[10px] text-cyan-400 font-medium bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Claimed by <strong className="text-white font-bold ml-0.5">{ticket.admin_name}</strong>
                </span>
              ) : (
                <span className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border ${sc.bg} ${sc.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                  {sc.label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Ticket Items Section */}
        <TicketItemsSection
          ticketId={id}
          refreshTrigger={itemRefreshTrigger}
          isClosed={ticket.status === 'closed'}
          onOpenAddItemModal={() => setShowAddItemModal(true)}
        />

        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 bg-[#080d13] border-x border-slate-800 overflow-y-auto p-3 sm:p-5 space-y-3">
          {(!Array.isArray(messages) || messages.length === 0) && (
            <div className="text-center py-12">
              <HiShoppingCart className="text-slate-800 mx-auto mb-3" size={40} />
              <p className="text-slate-600 text-sm">No messages yet. Start the conversation!</p>
            </div>
          )}
          {(Array.isArray(messages) ? messages : []).map(msg => {
            const isAdmin = msg.sender_role === 'admin' || msg.sender_role === 'master';
            const isMe = msg.sender_id === user?.id;
            const canDelete = isMe || user?.role === 'admin' || user?.role === 'master' || ticket.user_id === user?.id;

            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                <div className="max-w-[85%] sm:max-w-[75%] relative">
                  <div className={`flex items-center gap-2 mb-1 ${isMe ? 'justify-end' : ''}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isAdmin ? 'text-cyan-400' : 'text-amber-400'}`}>
                      {msg.sender_name}
                    </span>
                    {isAdmin && (
                      <span className="text-[8px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded font-mono">STAFF</span>
                    )}
                    <span className="text-slate-600 text-[10px]">{formatTime(msg.created_at)}</span>
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all p-0.5 ml-1 cursor-pointer"
                        title="Delete message"
                      >
                        <MdDelete size={13} />
                      </button>
                    )}
                  </div>
                  <div className={`px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${isMe
                      ? 'bg-cyan-500/15 border border-cyan-500/20 text-slate-200 rounded-tr-md'
                      : 'bg-[#0d1117] border border-slate-800 text-slate-300 rounded-tl-md'
                    }`}>
                    {msg.message}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-[#0d1117] border border-slate-800 rounded-b-2xl p-3 sm:px-5 sm:py-3.5">
          {ticket.status !== 'closed' ? (
            <>
              {ticket.status === 'open' && (
                <div className="mb-2 text-center text-amber-400/90 text-[11px] font-medium flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  Your ticket is now open. A staff member will contact you soon.
                </div>
              )}
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <textarea
                  rows={1}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  className="flex-1 px-4 py-2.5 bg-[#080d13] border border-slate-800 focus:border-cyan-500 rounded-xl text-white text-sm focus:outline-none transition-all resize-none max-h-32 overflow-y-auto"
                  placeholder="Type a message..."
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="p-2.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 cursor-pointer"
                >
                  <MdSend size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-2 flex items-center justify-center gap-3">
              <p className="text-slate-500 text-xs">This ticket has been completed.</p>
              <button
                onClick={handleReopenTicket}
                className="text-cyan-400 hover:text-cyan-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:underline cursor-pointer transition-all"
              >
                <MdRefresh size={14} /> Re-open Ticket
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        ticketId={id}
        onItemAdded={() => setItemRefreshTrigger(prev => prev + 1)}
      />
    </div>
  );
};

export default TicketChat;
