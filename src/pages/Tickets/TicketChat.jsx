import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { io } from 'socket.io-client';
import { MdSend, MdArrowBack, MdConfirmationNumber, MdStore, MdClose } from 'react-icons/md';
import { HiShoppingCart } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const statusConfig = {
  open: { label: 'Waiting for Admin', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', dot: 'bg-amber-400' },
  claimed: { label: 'In Progress', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30', dot: 'bg-cyan-400 animate-pulse' },
  closed: { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', dot: 'bg-emerald-400' },
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
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

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

      return () => {
        socket.emit('leave-ticket', parseInt(id));
        socket.disconnect();
      };
    }
  }, [id]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
        setMessages(data);
      }
    } catch { /* silent */ }
  };

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

  const handleCloseTicket = async () => {
    try {
      const res = await fetch(`${BASE_URL}/tickets/${id}/close`, {
        method: 'PUT', credentials: 'include'
      });
      if (res.ok) {
        toast.success('Ticket closed');
        fetchTicket();
      }
    } catch { toast.error('Failed'); }
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
              <span className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border ${sc.bg} ${sc.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                {sc.label}
              </span>
              {ticket.status !== 'closed' && (
                <button onClick={handleCloseTicket} className="p-1 text-slate-500 hover:text-amber-400 transition-colors" title="Close ticket">
                  <MdClose size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 bg-[#080d13] border-x border-slate-800 overflow-y-auto p-3 sm:p-5 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <HiShoppingCart className="text-slate-800 mx-auto mb-3" size={40} />
              <p className="text-slate-600 text-sm">No messages yet. Start the conversation!</p>
            </div>
          )}
          {messages.map(msg => {
            const isAdmin = msg.sender_role === 'admin' || msg.sender_role === 'master';
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[85%] sm:max-w-[75%]">
                  <div className={`flex items-center gap-2 mb-1 ${isMe ? 'justify-end' : ''}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isAdmin ? 'text-cyan-400' : 'text-amber-400'}`}>
                      {msg.sender_name}
                    </span>
                    {isAdmin && (
                      <span className="text-[8px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded font-mono">STAFF</span>
                    )}
                    <span className="text-slate-600 text-[10px]">{formatTime(msg.created_at)}</span>
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
                className="p-2.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
              >
                <MdSend size={18} />
              </button>
            </form>
          ) : (
            <div className="text-center py-2">
              <p className="text-slate-500 text-xs">This ticket has been completed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketChat;
