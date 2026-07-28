import { useState, useEffect, useContext, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import {
  MdConfirmationNumber, MdPerson, MdClose, MdSend, MdAssignment,
  MdCheckCircle, MdAccessTime, MdFilterList, MdRefresh, MdStore, MdDelete, MdHelpOutline
} from 'react-icons/md';
import { HiShoppingCart } from 'react-icons/hi';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const statusConfig = {
  open: { label: 'Open', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', dot: 'bg-amber-400' },
  claimed: { label: 'Claimed', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30', dot: 'bg-cyan-400' },
  closed: { label: 'Closed', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/30', dot: 'bg-slate-500' },
};

// ─── Delete Confirm Modal ──────────────────────────────────────────
const DeleteConfirmModal = ({ isOpen, ticketId, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md px-4">
      <div className="bg-[#0b0f15] border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-500"></div>
        <div className="flex items-start gap-4 mb-4 mt-2">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 flex-shrink-0">
            <MdHelpOutline size={24} />
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-base">Delete Ticket</h4>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white">Ticket #{ticketId}</strong>? This action cannot be undone.
            </p>
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

const TicketManager = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketDetail, setTicketDetail] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    fetchTickets();
    fetchAdmins();

    // Socket.IO connection
    const token = localStorage.getItem('token');
    if (token) {
      const socket = io(BASE_URL, { auth: { token } });
      socketRef.current = socket;

      socket.on('new-ticket', () => { fetchTickets(); });
      socket.on('ticket-updated', () => { fetchTickets(); });

      return () => { socket.disconnect(); };
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [filterStatus]);

  useEffect(() => {
    if (selectedTicket) {
      fetchTicketDetail(selectedTicket);
      fetchMessages(selectedTicket);

      // Join ticket room
      if (socketRef.current) {
        socketRef.current.emit('join-ticket', selectedTicket);
        socketRef.current.on('new-message', (msg) => {
          setMessages(prev => {
            if (prev.some(m => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        });
        socketRef.current.on('ticket-updated', (data) => {
          if (data.id == selectedTicket) {
            fetchTicketDetail(selectedTicket);
          }
        });
      }

      return () => {
        if (socketRef.current) {
          socketRef.current.emit('leave-ticket', selectedTicket);
          socketRef.current.off('new-message');
        }
      };
    }
  }, [selectedTicket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      let url = `${BASE_URL}/tickets`;
      if (filterStatus) url += `?status=${filterStatus}`;
      const res = await fetch(url, { credentials: 'include' });
      const data = await res.json();
      setTickets(data);
    } catch { /* silent */ }
    setLoading(false);
  };

  const fetchAdmins = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admins`, { credentials: 'include' });
      const data = await res.json();
      setAdmins(data);
    } catch { /* silent */ }
  };

  const fetchTicketDetail = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/tickets/${id}`, { credentials: 'include' });
      const data = await res.json();
      setTicketDetail(data);
    } catch { /* silent */ }
  };

  const fetchMessages = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/tickets/${id}/messages`, { credentials: 'include' });
      const data = await res.json();
      setMessages(data);
    } catch { /* silent */ }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;
    setSending(true);
    try {
      const res = await fetch(`${BASE_URL}/tickets/${selectedTicket}/messages`, {
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

  const handleClaim = async (ticketId) => {
    try {
      const res = await fetch(`${BASE_URL}/tickets/${ticketId}/claim`, {
        method: 'PUT', credentials: 'include'
      });
      if (res.ok) {
        toast.success('Ticket claimed!');
        fetchTickets();
        if (selectedTicket === ticketId) fetchTicketDetail(ticketId);
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed');
      }
    } catch { toast.error('Network error'); }
  };

  const handleAssign = async (ticketId, adminId) => {
    try {
      const res = await fetch(`${BASE_URL}/tickets/${ticketId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ admin_id: adminId }),
      });
      if (res.ok) {
        toast.success('Ticket assigned!');
        setShowAssignModal(false);
        fetchTickets();
        if (selectedTicket === ticketId) fetchTicketDetail(ticketId);
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed');
      }
    } catch { toast.error('Network error'); }
  };

  const handleClose = async (ticketId) => {
    try {
      const res = await fetch(`${BASE_URL}/tickets/${ticketId}/close`, {
        method: 'PUT', credentials: 'include'
      });
      if (res.ok) {
        toast.success('Ticket closed!');
        fetchTickets();
        if (selectedTicket === ticketId) fetchTicketDetail(ticketId);
      }
    } catch { toast.error('Network error'); }
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      const res = await fetch(`${BASE_URL}/tickets/${ticketId}`, {
        method: 'DELETE', credentials: 'include'
      });
      if (res.ok) {
        toast.success('Ticket deleted successfully!');
        setShowDeleteModal(false);
        if (selectedTicket === ticketId) {
          setSelectedTicket(null);
          setTicketDetail(null);
          setMessages([]);
        }
        fetchTickets();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to delete ticket');
      }
    } catch { toast.error('Network error'); }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">Tickets</h2>
          <p className="text-slate-400 text-sm mt-1">Manage purchase requests & chat with users</p>
        </div>
        <button onClick={fetchTickets} className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-all">
          <MdRefresh size={20} />
        </button>
      </div>

      <div className="flex gap-4 h-[calc(100%-4rem)]">
        {/* ── TICKET LIST (Left Panel) ── */}
        <div className="w-80 flex-shrink-0 bg-[#0d1117] border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
          {/* Filter */}
          <div className="p-3 border-b border-slate-800 flex items-center gap-2">
            <MdFilterList className="text-slate-500" size={16} />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="flex-1 bg-transparent text-slate-300 text-xs font-bold uppercase tracking-wider focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-[#0b0f15] text-slate-200">All Tickets</option>
              <option value="open" className="bg-[#0b0f15] text-slate-200">Open</option>
              <option value="claimed" className="bg-[#0b0f15] text-slate-200">Claimed</option>
              <option value="closed" className="bg-[#0b0f15] text-slate-200">Closed</option>
            </select>
            <span className="bg-slate-800 text-slate-400 text-xs font-mono px-2 py-0.5 rounded">{tickets.length}</span>
          </div>

          {/* Ticket list */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-12">
                <MdConfirmationNumber className="text-slate-700 mx-auto mb-2" size={32} />
                <p className="text-slate-600 text-xs">No tickets found</p>
              </div>
            ) : (
              tickets.map(ticket => {
                const sc = statusConfig[ticket.status] || statusConfig.open;
                return (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket.id)}
                    className={`w-full text-left px-4 py-3.5 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${
                      selectedTicket === ticket.id ? 'bg-cyan-500/5 border-l-2 border-l-cyan-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-white text-xs font-bold">#{ticket.id}</span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${sc.bg} ${sc.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                        {sc.label}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs font-medium truncate">{ticket.item_name}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-slate-500 text-[10px] flex items-center gap-1">
                        <MdPerson size={12} /> {ticket.user_name}
                      </span>
                      <span className="text-slate-600 text-[10px]">{formatTime(ticket.created_at)}</span>
                    </div>
                    {ticket.admin_name && (
                      <p className="text-cyan-400/60 text-[10px] mt-1 font-mono">→ {ticket.admin_name}</p>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── CHAT PANEL (Right) ── */}
        <div className="flex-1 bg-[#0d1117] border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
          {selectedTicket && ticketDetail ? (
            <>
              {/* Ticket header */}
              <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <MdConfirmationNumber className="text-cyan-400" size={18} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm flex items-center gap-2">
                      Ticket #{ticketDetail.id}
                      <span className={`text-[10px] px-2 py-0.5 rounded-md border ${statusConfig[ticketDetail.status]?.bg} ${statusConfig[ticketDetail.status]?.color}`}>
                        {statusConfig[ticketDetail.status]?.label}
                      </span>
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Item: <span className="text-white font-semibold">{ticketDetail.item_name}</span> (x{ticketDetail.quantity || 1})
                      {ticketDetail.ingame_name && <span className="text-cyan-400 font-mono ml-2">• IGN: {ticketDetail.ingame_name}</span>}
                      {ticketDetail.discord_username && <span className="text-purple-400 font-mono ml-2">• Discord: {ticketDetail.discord_username}</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {ticketDetail.status === 'open' && (
                    <>
                      <button onClick={() => handleClaim(ticketDetail.id)} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-cyan-500/20 transition-all">
                        Claim
                      </button>
                      <button onClick={() => setShowAssignModal(true)} className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-purple-500/20 transition-all">
                        Assign
                      </button>
                    </>
                  )}
                  {ticketDetail.status !== 'closed' && (
                    <button onClick={() => handleClose(ticketDetail.id)} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-amber-500/20 transition-all">
                      Close
                    </button>
                  )}
                  <button onClick={() => setShowDeleteModal(true)} className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-red-500/20 transition-all flex items-center gap-1">
                    <MdDelete size={12} /> Delete
                  </button>
                  <button onClick={() => { setSelectedTicket(null); setTicketDetail(null); setMessages([]); }} className="p-1.5 text-slate-500 hover:text-white transition-colors ml-1">
                    <MdClose size={18} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5 space-y-3">
                {messages.map(msg => {
                  const isAdmin = msg.sender_role === 'admin' || msg.sender_role === 'master';
                  const isMe = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${isMe ? 'order-2' : 'order-1'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isAdmin ? 'text-cyan-400' : 'text-amber-400'}`}>
                            {msg.sender_name}
                          </span>
                          {isAdmin && <span className="text-[8px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded font-mono">STAFF</span>}
                          <span className="text-slate-600 text-[10px]">{formatTime(msg.created_at)}</span>
                        </div>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                          isMe
                            ? 'bg-cyan-500/15 border border-cyan-500/20 text-slate-200 rounded-tr-md'
                            : 'bg-[#080d13] border border-slate-800 text-slate-300 rounded-tl-md'
                        }`}>
                          {msg.message}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              {ticketDetail.status !== 'closed' ? (
                <form onSubmit={handleSendMessage} className="px-5 py-3.5 border-t border-slate-800">
                  <div className="flex items-center gap-3">
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
                    />
                    <button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      className="p-2.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      <MdSend size={18} />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="px-5 py-3.5 border-t border-slate-800 text-center">
                  <p className="text-slate-500 text-xs">This ticket is closed</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MdConfirmationNumber className="text-slate-800 mx-auto mb-3" size={48} />
                <p className="text-slate-500 text-sm font-medium">Select a ticket to view</p>
                <p className="text-slate-600 text-xs mt-1">Chat with users and manage their purchase requests</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── ASSIGN MODAL ── */}
      {showAssignModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm bg-[#0b0f15] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-bold uppercase tracking-wider text-sm">Assign Ticket</h3>
                <button onClick={() => setShowAssignModal(false)} className="text-slate-500 hover:text-white"><MdClose size={20} /></button>
              </div>
              <p className="text-slate-400 text-xs mb-4">Select an admin to handle ticket #{selectedTicket}</p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {admins.map(admin => (
                  <button
                    key={admin.id}
                    onClick={() => handleAssign(selectedTicket, admin.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-[#080d13] border border-slate-800 rounded-xl hover:border-purple-500/40 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 text-xs font-bold uppercase">
                      {admin.username?.[0] || 'A'}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{admin.username}</p>
                      <p className="text-slate-500 text-[10px] font-mono">{admin.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Ticket Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        ticketId={selectedTicket}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => handleDeleteTicket(selectedTicket)}
      />
    </div>
  );
};

export default TicketManager;
