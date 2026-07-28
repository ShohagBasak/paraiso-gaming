import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { MdConfirmationNumber, MdAccessTime, MdStore } from 'react-icons/md';
import { HiShoppingCart, HiChatAlt2, HiExternalLink } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const statusConfig = {
  open: { label: 'Open', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', dot: 'bg-amber-400' },
  claimed: { label: 'In Progress', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30', dot: 'bg-cyan-400 animate-pulse' },
  closed: { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', dot: 'bg-emerald-400' },
};

const MyTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${BASE_URL}/tickets/my`, { credentials: 'include' });
      const data = await res.json();
      setTickets(data);
    } catch { /* silent */ }
    setLoading(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#080d13] pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <MdConfirmationNumber className="text-cyan-400" size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider">
                My Tickets
              </h1>
              <p className="text-slate-500 text-xs uppercase tracking-widest font-medium">
                Track your purchases & chat with support
              </p>
            </div>
          </div>
          <div className="h-[2px] bg-gradient-to-r from-cyan-500/60 via-cyan-500/20 to-transparent mt-4"></div>
        </div>

        {/* Tickets list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 text-sm uppercase tracking-widest">Loading tickets...</p>
            </div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#0d1117] border border-dashed border-slate-800 rounded-2xl">
            <HiShoppingCart className="text-slate-700 mb-4" size={48} />
            <p className="text-slate-500 font-medium text-lg">No purchase tickets yet</p>
            <p className="text-slate-600 text-sm mt-1 mb-6">Visit the store to make your first purchase!</p>
            <Link
              to="/donate"
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-cyan-500/20 transition-all"
            >
              <MdStore size={18} /> Visit Store
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map(ticket => {
              const sc = statusConfig[ticket.status] || statusConfig.open;
              return (
                <Link
                  key={ticket.id}
                  to={`/my-tickets/${ticket.id}`}
                  className="block bg-[#0d1117] border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/30 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between">
                    {/* Left: Item info */}
                    <div className="flex items-start gap-4">
                      {ticket.item_image ? (
                        <img src={ticket.item_image} alt={ticket.item_name} className="w-14 h-14 rounded-xl object-cover border border-slate-700 group-hover:border-cyan-500/30 transition-colors" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center">
                          <MdStore className="text-slate-600" size={24} />
                        </div>
                      )}
                      <div>
                        <h3 className="text-white font-bold text-base mb-1 flex items-center gap-2">
                          {ticket.item_name} <span className="text-slate-400 font-normal text-xs">(x{ticket.quantity || 1})</span>
                          <span className="text-emerald-400 text-sm font-mono">${(parseFloat(ticket.item_price) * (ticket.quantity || 1)).toFixed(2)}</span>
                        </h3>
                        <p className="text-slate-500 text-xs flex items-center gap-2">
                          <MdAccessTime size={12} />
                          {formatDate(ticket.created_at)}
                          {ticket.ingame_name && <span className="text-cyan-400 font-mono">• IGN: {ticket.ingame_name}</span>}
                        </p>
                        {ticket.admin_name && (
                          <p className="text-cyan-400/70 text-xs mt-1">
                            Assigned to: <span className="font-semibold">{ticket.admin_name}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Status + action */}
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${sc.bg} ${sc.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                        {sc.label}
                      </span>
                      <span className="text-slate-600 text-xs flex items-center gap-1 group-hover:text-cyan-400 transition-colors">
                        <HiChatAlt2 size={12} /> View Chat <HiExternalLink size={10} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
