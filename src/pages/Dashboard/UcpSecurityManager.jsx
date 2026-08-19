import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  MdSecurity, 
  MdLockOpen, 
  MdRefresh, 
  MdSearch, 
  MdDeleteSweep, 
  MdShield, 
  MdAccessTime, 
  MdCheckCircle,
  MdWarning
} from 'react-icons/md';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const UcpSecurityManager = () => {
  const [lockouts, setLockouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unlockUsername, setUnlockUsername] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const fetchLockouts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/admin/ucp-lockouts`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLockouts(data.lockouts || []);
      } else {
        toast.error(data.message || 'Failed to fetch lockouts.');
      }
    } catch {
      toast.error('Network error fetching UCP security data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLockouts();
    const interval = setInterval(fetchLockouts, 15000); // Auto-refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const handleInstantUnlock = async (usernameToUnlock) => {
    const target = usernameToUnlock || unlockUsername;
    if (!target.trim()) {
      toast.error('Please enter an in-game character name.');
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch(`${BASE_URL}/api/admin/ucp-unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: target.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || `Account unlocked!`);
        if (!usernameToUnlock) setUnlockUsername('');
        fetchLockouts();
      } else {
        toast.error(data.message || 'Failed to unlock.');
      }
    } catch {
      toast.error('Failed to communicate with server.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all active login locks and failed attempt counters?')) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch(`${BASE_URL}/api/admin/ucp-unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ unlockAll: true })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || 'All locks cleared!');
        fetchLockouts();
      } else {
        toast.error(data.message || 'Failed to clear locks.');
      }
    } catch {
      toast.error('Failed to clear locks.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredLockouts = lockouts.filter(item => 
    item.username.toLowerCase().includes(searchFilter.toLowerCase()) ||
    item.ip.includes(searchFilter)
  );

  const activeLocksCount = lockouts.filter(l => l.isLocked).length;
  const captchaChallengeCount = lockouts.filter(l => l.requiresCaptcha && !l.isLocked).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <MdSecurity className="text-cyan-400" />
            UCP Security & Lockout Manager
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Master Admin control for brute-force protection, failed login challenges, and instant player unlocking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLockouts}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-slate-700 transition-all active:scale-95 disabled:opacity-50"
          >
            <MdRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {lockouts.length > 0 && (
            <button
              onClick={handleClearAll}
              disabled={actionLoading}
              className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
            >
              <MdDeleteSweep className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Lockouts</span>
            <span className="p-2 rounded-lg bg-rose-500/10 text-rose-400"><MdWarning size={18} /></span>
          </div>
          <p className="text-3xl font-black text-white">{activeLocksCount}</p>
          <p className="text-xs text-slate-500 mt-1">Accounts temporarily blocked (15m)</p>
        </div>

        <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Captcha Challenges</span>
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><MdShield size={18} /></span>
          </div>
          <p className="text-3xl font-black text-white">{captchaChallengeCount}</p>
          <p className="text-xs text-slate-500 mt-1">Accounts requiring reCAPTCHA</p>
        </div>

        <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Monitored</span>
            <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400"><MdCheckCircle size={18} /></span>
          </div>
          <p className="text-3xl font-black text-white">{lockouts.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total active session records</p>
        </div>
      </div>

      {/* Instant Unlock Search Box */}
      <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-base font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
          <MdLockOpen className="text-cyan-400" />
          Instant Unlock By Character Name
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Enter any SA-MP character name to immediately clear failed attempts and remove any active login cooldown.
        </p>

        <form 
          onSubmit={(e) => { e.preventDefault(); handleInstantUnlock(); }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <MdSearch size={18} />
            </div>
            <input
              type="text"
              value={unlockUsername}
              onChange={(e) => setUnlockUsername(e.target.value)}
              placeholder="e.g. Shohag"
              className="w-full pl-10 pr-4 py-3 bg-[#080c10] border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={actionLoading || !unlockUsername.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2 text-xs active:scale-95 whitespace-nowrap"
          >
            <MdLockOpen size={16} />
            <span>Instant Unlock Player</span>
          </button>
        </form>
      </div>

      {/* Live Tracked Lockouts Table */}
      <div className="bg-[#0d1117] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Currently Flagged & Locked Sessions
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live monitoring of users with failed password attempts.
            </p>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by name or IP..."
              className="w-full px-3.5 py-2 bg-[#080c10] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            <MdRefresh className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
            Loading security records...
          </div>
        ) : filteredLockouts.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            <MdCheckCircle className="w-8 h-8 text-emerald-400/60 mx-auto mb-2" />
            <p className="font-semibold text-slate-300">All Clear!</p>
            <p className="text-xs text-slate-500 mt-0.5">No accounts are currently locked or flagged.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080c10] text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-5">In-Game Character</th>
                  <th className="py-3.5 px-5">Client IP</th>
                  <th className="py-3.5 px-5 text-center">Failed Count</th>
                  <th className="py-3.5 px-5">Security Status</th>
                  <th className="py-3.5 px-5">Last Attempt</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLockouts.map((item) => (
                  <tr key={item.key} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-cyan-400 text-sm">
                      {item.username}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-slate-400">
                      {item.ip}
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-slate-800 font-mono font-bold text-white">
                        {item.count}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      {item.isLocked ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse">
                          <MdAccessTime size={13} />
                          <span>LOCKED ({item.remainingTimeMinutes}m left)</span>
                        </span>
                      ) : item.requiresCaptcha ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <MdShield size={13} />
                          <span>CAPTCHA REQUIRED</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">Monitoring</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-slate-400">
                      {new Date(item.lastAttempt).toLocaleTimeString()}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleInstantUnlock(item.username)}
                        disabled={actionLoading}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold hover:text-white transition-all text-xs active:scale-95 disabled:opacity-50 inline-flex items-center gap-1"
                      >
                        <MdLockOpen size={14} />
                        <span>Unlock</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UcpSecurityManager;
