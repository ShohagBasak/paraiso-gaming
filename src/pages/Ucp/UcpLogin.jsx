import React, { useState, useRef } from 'react';
import { useUcp } from '../../context/UcpContext';
import { FiEye, FiEyeOff, FiUser, FiLock, FiShield, FiArrowRight, FiMail, FiRefreshCw } from 'react-icons/fi';
import CaptchaWidget from '../../components/CaptchaWidget';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const UcpLogin = () => {
  const { loginUcp, checkUcpSession } = useUcp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Captcha Security States
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const captchaRef = useRef(null);

  // Verification Login States
  const [isVerifying, setIsVerifying] = useState(false);
  const [authMethod, setAuthMethod] = useState('google_auth'); // 'google_auth' | 'email_otp'
  const [has2fa, setHas2fa] = useState(false);
  const [hasEmailOtp, setHasEmailOtp] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [emailOtpCode, setEmailOtpCode] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [emailSentMsg, setEmailSentMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailSentMsg('');

    if (!username.trim() || !password) {
      setError('Please enter your in-game character username and password.');
      return;
    }

    if (showCaptcha && !captchaToken) {
      setError('Please check the security verification checkbox before logging in.');
      return;
    }

    try {
      setLoading(true);
      const data = await loginUcp(username.trim(), password, captchaToken);
      if (data && (data.status === '2fa_required' || data.status === 'email_otp_required' || data.status === 'verification_required')) {
        setTempToken(data.tempToken);
        setHas2fa(Boolean(data.has2fa));
        setHasEmailOtp(Boolean(data.hasEmailOtp));
        setMaskedEmail(data.maskedEmail || '');
        setIsVerifying(true);
        if (data.has2fa) {
          setAuthMethod('google_auth');
        } else {
          setAuthMethod('email_otp');
        }
      }
    } catch (err) {
      if (err.requiresCaptcha) {
        setShowCaptcha(true);
      }
      setCaptchaToken('');
      if (captchaRef.current) {
        captchaRef.current.reset();
      }
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToEmail = async () => {
    setAuthMethod('email_otp');
    setError('');
    if (!emailSentMsg) {
      handleSendEmailOtp();
    }
  };

  const handleSendEmailOtp = async () => {
    setError('');
    setEmailSentMsg('');
    try {
      setIsEmailSending(true);
      const res = await fetch(`${API_BASE_URL}/api/ucp/login/email-otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.maskedEmail) setMaskedEmail(data.maskedEmail);
        setEmailSentMsg(data.message || 'Verification code sent to your email.');
      } else {
        setError(data.message || 'Failed to send verification code.');
      }
    } catch {
      setError('Connection error sending email code.');
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleVerify2fa = async (e) => {
    e.preventDefault();
    setError('');

    if (otpCode.trim().length !== 6) {
      setError('Please enter a valid 6-digit code.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/ucp/login/2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken, code: otpCode.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || '2FA Verification failed');
      }

      if (data.token) {
        sessionStorage.setItem('ucp_token', data.token);
      }
      if (data.user) {
        sessionStorage.setItem('ucp_user', JSON.stringify(data.user));
      }

      if (checkUcpSession) {
        await checkUcpSession();
      }
    } catch (err) {
      setError(err.message || '2FA verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (emailOtpCode.trim().length !== 6) {
      setError('Please enter the 6-digit code sent to your email.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/ucp/login/email-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken, code: emailOtpCode.trim() })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Email OTP verification failed');

      if (data.token) sessionStorage.setItem('ucp_token', data.token);
      if (data.user) sessionStorage.setItem('ucp_user', JSON.stringify(data.user));

      if (checkUcpSession) await checkUcpSession();
    } catch (err) {
      setError(err.message || 'Email OTP verification failed.');
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
          <div className="flex flex-col gap-1.5 mb-6 p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs">
            <div className="flex items-center gap-2 text-cyan-300 font-bold">
              <FiShield className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Direct In-Game Character Authentication</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              💡 <span className="text-slate-300 font-semibold">Security Tip:</span> We strongly suggest enabling <span className="text-cyan-400 font-bold">Google 2FA</span> or <span className="text-blue-400 font-bold">Email OTP</span> in your Security Settings to protect your account.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}

          {isVerifying ? (
            <div className="space-y-5">
              {/* Switcher Tab if both 2FA and Email OTP are enabled */}
              {has2fa && hasEmailOtp && (
                <div className="flex bg-[#0a0f14] p-1 rounded-xl border border-slate-700/80 gap-1">
                  <button
                    type="button"
                    onClick={() => { setAuthMethod('google_auth'); setError(''); }}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${authMethod === 'google_auth' ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'}`}
                  >
                    <FiShield className="w-3.5 h-3.5" />
                    <span>Google Auth</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSwitchToEmail}
                    disabled={isEmailSending}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${authMethod === 'email_otp' ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}
                  >
                    <FiMail className="w-3.5 h-3.5" />
                    <span>Email OTP</span>
                  </button>
                </div>
              )}

              {authMethod === 'google_auth' ? (
                <form onSubmit={handleVerify2fa} className="space-y-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-300 font-bold text-xs uppercase tracking-wider text-center block">
                      Google Authenticator Code
                    </label>
                    <p className="text-xs text-slate-400 text-center mb-1">
                      Please enter the 6-digit verification code from your Google Authenticator app.
                    </p>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <FiLock className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="000 000"
                        required
                        autoFocus
                        className="w-full pl-10 pr-4 py-3 bg-[#0a0f14] border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-center font-mono font-bold text-xl tracking-widest"
                      />
                    </div>
                  </div>

                  {/* Verify & Cancel Buttons */}
                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-6 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] flex items-center justify-center gap-2 active:scale-95 text-sm"
                    >
                      {loading ? (
                        <span>Verifying Code...</span>
                      ) : (
                        <>
                          <span>Verify Code</span>
                          <FiArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {hasEmailOtp && (
                      <button
                        type="button"
                        onClick={handleSwitchToEmail}
                        disabled={isEmailSending}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold text-center transition-all underline"
                      >
                        {isEmailSending ? 'Sending email code...' : 'Can\'t use Google Auth? Verify with Email instead'}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setIsVerifying(false);
                        setOtpCode('');
                        setEmailOtpCode('');
                        setError('');
                        setEmailSentMsg('');
                      }}
                      className="w-full py-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs uppercase tracking-wider transition-all"
                    >
                      Back to Password Login
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyEmailOtp} className="space-y-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-center gap-2 text-blue-400 mb-1">
                      <FiMail className="w-5 h-5" />
                      <span className="text-sm font-extrabold uppercase tracking-wider">Email Verification</span>
                    </div>
                    <p className="text-xs text-slate-400 text-center">
                      A 6-digit code has been sent to <span className="font-mono font-bold text-blue-300">{maskedEmail}</span>.
                    </p>

                    {emailSentMsg && (
                      <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center font-semibold">
                        ✅ {emailSentMsg}
                      </div>
                    )}

                    <div className="relative mt-2">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <FiLock className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={emailOtpCode}
                        onChange={(e) => setEmailOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="000 000"
                        required
                        autoFocus
                        className="w-full pl-10 pr-4 py-3 bg-[#0a0f14] border border-blue-500/30 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-center font-mono font-bold text-xl tracking-widest"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-6 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 text-sm"
                    >
                      {loading ? <span>Verifying...</span> : <><span>Verify & Login</span><FiArrowRight className="w-4 h-4" /></>}
                    </button>

                    <div className="flex items-center justify-between text-xs px-1">
                      <button
                        type="button"
                        onClick={handleSendEmailOtp}
                        disabled={isEmailSending}
                        className="text-slate-400 hover:text-slate-200 transition-all flex items-center gap-1 underline disabled:opacity-50"
                      >
                        <FiRefreshCw className={`w-3.5 h-3.5 ${isEmailSending ? 'animate-spin' : ''}`} />
                        <span>{isEmailSending ? 'Sending...' : 'Resend Code'}</span>
                      </button>

                      {has2fa && (
                        <button
                          type="button"
                          onClick={() => { setAuthMethod('google_auth'); setError(''); }}
                          className="text-cyan-400 hover:text-cyan-300 transition-all font-semibold underline"
                        >
                          Use Google Auth
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsVerifying(false);
                        setOtpCode('');
                        setEmailOtpCode('');
                        setError('');
                        setEmailSentMsg('');
                      }}
                      className="w-full py-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs uppercase tracking-wider transition-all"
                    >
                      Back to Password Login
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
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

              {/* Security Captcha (Shown after repeated failed attempts) */}
              {showCaptcha && (
                <div className="space-y-1 pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                    <FiShield className="w-3.5 h-3.5" />
                    <span>Security Check (Required after repeated attempts)</span>
                  </div>
                  <CaptchaWidget
                    ref={captchaRef}
                    onVerify={(token) => {
                      setCaptchaToken(token);
                      setError('');
                    }}
                    onExpire={() => setCaptchaToken('')}
                  />
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading || (showCaptcha && !captchaToken)}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default UcpLogin;
