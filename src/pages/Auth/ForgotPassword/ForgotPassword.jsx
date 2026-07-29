import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { MdSecurity, MdKey, MdEmail, MdCheckCircle, MdArrowBack } from 'react-icons/md';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP + New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ── Step 1: Send OTP Code ──
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success('6-digit code sent to your email!');
        setSuccessMsg(`We sent a 6-digit code to ${email.trim()}`);
        setStep(2);
      } else {
        setErrorMsg(data.message || 'Failed to send reset code.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP & Reset Password ──
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!otp.trim() || otp.trim().length !== 6) {
      setErrorMsg('Please enter the complete 6-digit OTP code.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
          newPassword: newPassword,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success('Password updated successfully!');
        setSuccessMsg('Your password has been reset! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      } else {
        setErrorMsg(data.message || 'Failed to reset password.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#121820]/90 backdrop-blur-md p-8 rounded-2xl border border-slate-700 shadow-2xl max-w-md w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          {step === 1 ? <MdSecurity size={32} /> : <MdKey size={32} />}
        </div>
        <h2 className="text-white font-bold text-xl uppercase tracking-widest">
          {step === 1 ? 'Reset Password' : 'Set New Password'}
        </h2>
        <p className="text-slate-400 text-xs mt-2 leading-relaxed">
          {step === 1
            ? 'Enter your registered email address to receive a 6-digit verification code.'
            : `Enter the 6-digit code sent to ${email} and choose a new password.`}
        </p>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
          ⚠️ {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <MdCheckCircle size={18} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Step 1: Request OTP Form */}
      {step === 1 && (
        <form onSubmit={handleRequestOtp} className="space-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-slate-300 font-bold text-xs uppercase tracking-wider">Account Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#0a0f14] border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                placeholder="e.g. name@domain.com"
              />
              <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold uppercase tracking-widest text-xs rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Sending Code...
              </>
            ) : (
              'Send 6-Digit Reset Code'
            )}
          </button>
        </form>
      )}

      {/* Step 2: Verify OTP & Change Password Form */}
      {step === 2 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          {/* OTP Code Field */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-300 font-bold text-xs uppercase tracking-wider">6-Digit Verification Code</label>
            <input
              type="text"
              maxLength="6"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 bg-[#0a0f14] border border-slate-700 rounded-lg text-cyan-400 text-center font-mono font-bold tracking-[8px] text-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              placeholder="123456"
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-300 font-bold text-xs uppercase tracking-wider">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 bg-[#0a0f14] border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                placeholder="At least 6 characters"
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

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-300 font-bold text-xs uppercase tracking-wider">Confirm New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0a0f14] border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
              placeholder="Re-enter new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !otp || !newPassword || newPassword !== confirmPassword}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold uppercase tracking-widest text-xs rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 cursor-pointer mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Updating Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => { setStep(1); setErrorMsg(''); setSuccessMsg(''); }}
              className="text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <MdArrowBack size={16} /> Change Email
            </button>
            <button
              type="button"
              onClick={handleRequestOtp}
              disabled={loading}
              className="text-cyan-400 hover:underline text-xs font-semibold transition-colors"
            >
              Resend Code
            </button>
          </div>
        </form>
      )}

      {/* Back to Login Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800 text-center">
        <Link
          to="/login"
          className="text-slate-400 hover:text-white text-xs font-semibold inline-flex items-center gap-1 transition-colors"
        >
          <MdArrowBack size={16} /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
