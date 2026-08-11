import React, { useState } from 'react';
import { useUcp } from '../../context/UcpContext';
import { FiEye, FiEyeOff, FiUser, FiLock, FiShield, FiArrowRight } from 'react-icons/fi';

const UcpLogin = () => {
  const { loginUcp } = useUcp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter your in-game character username and password.');
      return;
    }

    try {
      setLoading(true);
      await loginUcp(username.trim(), password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center bg-[#0a0f14] text-white relative overflow-hidden">
      {/* Background Subtle Cyan Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Logo & Title */}
        <div className="text-center mb-6 flex flex-col items-center">
          <img src="/logonobg.png" alt="Paraiso Gaming" className="w-20 h-20 object-contain mb-3 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]" />
          <h1 className="text-3xl font-black uppercase tracking-wider text-white">
            User Control Panel
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Log in with your <span className="text-cyan-400 font-bold">SA-MP In-Game Character</span>
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#121820]/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-8 shadow-2xl shadow-black/80">
          <div className="flex items-center gap-2.5 mb-6 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 font-medium">
            <FiShield className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Connects directly to your SA-MP server character account</span>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Character Name */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-300 font-bold text-xs uppercase tracking-wider">
                In-Game Character Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <FiUser className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your ingame name"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#0a0f14] border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* Character Password */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-300 font-bold text-xs uppercase tracking-wider">
                Character Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <FiLock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter SA-MP password"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-[#0a0f14] border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] flex items-center justify-center gap-2 mt-4 active:scale-95 text-sm"
            >
              {loading ? (
                <span>Accessing UCP...</span>
              ) : (
                <>
                  <span>Access Control Panel</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UcpLogin;
