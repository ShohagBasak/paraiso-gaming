import React, { useState, useEffect } from 'react';
import { FaServer, FaGlobe, FaCircle } from 'react-icons/fa';
import { MdSave, MdRefresh } from 'react-icons/md';
import { toast } from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ServerSettingsManager = () => {
  const [serverIp, setServerIp] = useState('');
  const [discordUrl, setDiscordUrl] = useState('');
  const [status, setStatus] = useState('online');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchServerInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/server-info`);
      if (res.ok) {
        const data = await res.json();
        setServerIp(data.server_ip || '');
        setDiscordUrl(data.discord_url || '');
        setStatus(data.status || 'online');
      }
    } catch {
      toast.error('Failed to load server settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServerInfo();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/server-info`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ server_ip: serverIp, discord_url: discordUrl, status })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Server settings saved successfully!');
      } else {
        toast.error(data.message || 'Failed to save settings');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyPreview = () => {
    navigator.clipboard.writeText(serverIp || 'Coming Soon...');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'online':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Online
          </span>
        );
      case 'offline':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/10 border border-red-500/30 text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Offline
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Maintenance
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2.5">
            <FaServer className="text-cyan-400" size={24} />
            Server IP & Status Settings
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Manage your SA-MP server IP, live online/offline status, and community links.
          </p>
        </div>
        <button
          onClick={fetchServerInfo}
          className="p-2.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-xl transition-all border border-slate-800"
          title="Refresh Settings"
        >
          <MdRefresh size={20} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-slate-400 py-12">
          <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          Loading server settings...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Edit Form */}
          <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
            <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
              
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <FaGlobe className="text-cyan-400" />
                Connection Information & Status
              </h3>

              <div className="space-y-5">
                {/* Server Status Selection */}
                <div>
                  <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Server Live Status
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setStatus('online')}
                      className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        status === 'online'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10'
                          : 'bg-[#080d13] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Online
                    </button>

                    <button
                      type="button"
                      onClick={() => setStatus('offline')}
                      className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        status === 'offline'
                          ? 'bg-red-500/20 border-red-500 text-red-400 shadow-lg shadow-red-500/10'
                          : 'bg-[#080d13] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                      Offline
                    </button>

                    <button
                      type="button"
                      onClick={() => setStatus('maintenance')}
                      className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        status === 'maintenance'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-lg shadow-amber-500/10'
                          : 'bg-[#080d13] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                      Maintenance
                    </button>
                  </div>
                </div>

                {/* Server IP */}
                <div>
                  <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Server IP / Hostname & Port
                  </label>
                  <input
                    type="text"
                    value={serverIp}
                    onChange={(e) => setServerIp(e.target.value)}
                    placeholder="e.g. play.paraiso-rp.com:7777 or Coming Soon..."
                    className="w-full px-4 py-3 bg-[#080d13] border border-slate-800 focus:border-cyan-500 rounded-xl text-cyan-400 font-mono text-sm focus:outline-none transition-all"
                  />
                  <p className="text-slate-500 text-xs mt-1.5">
                    This text will be copied when users click "Click to Copy IP" on the home page.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-slate-800/80 mt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <MdSave size={18} />
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </form>

          {/* Live Homepage Widget Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/30 inline-block mb-4">
                Live Widget Preview
              </span>

              <div className="w-full bg-[#080d13] border border-[#1e293b] rounded-2xl p-5 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <FaServer className="text-cyan-500" />
                    <span className="text-cyan-500">SAMP</span> SERVER
                  </h4>
                  {getStatusBadge(status)}
                </div>

                <div
                  onClick={handleCopyPreview}
                  className="flex items-center justify-between bg-black/50 p-4 rounded-xl cursor-pointer border border-[#1e293b] hover:border-cyan-500/50 transition-colors group"
                >
                  <div>
                    <p className="text-[10px] text-slate-500 mb-1 uppercase font-bold tracking-wider">
                      {copied ? 'IP Copied!' : 'Click to Copy IP'}
                    </p>
                    <p className={`font-mono font-bold text-sm ${copied ? 'text-green-400' : 'text-cyan-400'}`}>
                      {serverIp || 'Coming Soon...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerSettingsManager;
