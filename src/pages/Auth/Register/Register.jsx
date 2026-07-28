import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router';
import { FiEye, FiEyeOff, FiMail, FiCheckCircle, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

const Register = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const { publicRegister, sendOtp } = useAuth();
    const [step, setStep] = useState(1); // Step 1: Info, Step 2: OTP
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [turnstileToken, setTurnstileToken] = useState('');
    const [registeredData, setRegisteredData] = useState(null);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [devOtpHint, setDevOtpHint] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    // Load Turnstile Script
    useEffect(() => {
        if (!document.getElementById('turnstile-script')) {
            const script = document.createElement('script');
            script.id = 'turnstile-script';
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        }
    }, []);

    // Render Turnstile widget
    useEffect(() => {
        let checkAndRender;
        if (step === 1) {
            checkAndRender = setInterval(() => {
                const el = document.getElementById('turnstile-widget');
                if (window.turnstile && el && el.children.length === 0) {
                    try {
                        window.turnstile.render('#turnstile-widget', {
                            sitekey: TURNSTILE_SITE_KEY,
                            theme: 'dark',
                            callback: (token) => setTurnstileToken(token),
                            'expired-callback': () => setTurnstileToken(''),
                        });
                        clearInterval(checkAndRender);
                    } catch (_) { /* silent */ }
                }
            }, 300);
        }
        return () => clearInterval(checkAndRender);
    }, [step]);

    // Resend countdown timer
    useEffect(() => {
        let timer;
        if (step === 2 && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setCanResend(true);
        }
        return () => clearInterval(timer);
    }, [step, countdown]);

    // Step 1: Send OTP to Email
    const handleSendOtp = async (formData) => {
        setServerError('');
        setSubmitting(true);
        try {
            const res = await sendOtp(formData.email);
            setRegisteredData(formData);
            setStep(2);
            setCountdown(60);
            setCanResend(false);
            if (res.devOtp) {
                setDevOtpHint(res.devOtp);
            }
            toast.success('OTP code sent to your email!');
        } catch (error) {
            setServerError(error.message || 'Failed to send OTP code.');
        } finally {
            setSubmitting(false);
        }
    };

    // Step 2: Complete Registration with OTP
    const handleVerifyAndRegister = async (e) => {
        e.preventDefault();
        if (!otpCode || otpCode.length < 6) {
            return setServerError('Please enter the 6-digit OTP code.');
        }
        setServerError('');
        setSubmitting(true);
        try {
            await publicRegister(
                registeredData.username,
                registeredData.email,
                registeredData.password,
                otpCode.trim(),
                turnstileToken
            );
            toast.success('Registration successful! Welcome to Paraiso Gaming.');
            navigate(from, { replace: true });
        } catch (error) {
            setServerError(error.message || 'Registration failed. Please check your OTP code.');
        } finally {
            setSubmitting(false);
        }
    };

    // Resend OTP handler
    const handleResendOtp = async () => {
        if (!canResend || !registeredData) return;
        setServerError('');
        setSubmitting(true);
        try {
            const res = await sendOtp(registeredData.email);
            setCountdown(60);
            setCanResend(false);
            if (res.devOtp) {
                setDevOtpHint(res.devOtp);
            }
            toast.success('New OTP code sent!');
        } catch (error) {
            setServerError(error.message || 'Failed to resend OTP.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-[#121820]/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-2xl max-w-md mx-auto">
            {step === 1 ? (
                /* ── STEP 1: REGISTRATION FORM ── */
                <form onSubmit={handleSubmit(handleSendOtp)}>
                    <div className="mb-6 text-center">
                        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">Create Account</h2>
                        <p className="text-slate-400 text-xs mt-1">Join the Paraiso Gaming community</p>
                    </div>

                    <fieldset className="fieldset w-full space-y-4">
                        {/* Username Field */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-300 font-bold text-xs uppercase tracking-wider">Username</label>
                            <input
                                type="text"
                                {...register("username", { required: true, minLength: 3 })}
                                className="w-full px-4 py-2.5 bg-[#0a0f14] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                                placeholder="Enter your username"
                            />
                            {errors.username?.type === "required" && (
                                <p role="alert" className='text-red-400 text-xs'>Username is required!</p>
                            )}
                            {errors.username?.type === "minLength" && (
                                <p role="alert" className='text-red-400 text-xs'>At least 3 characters required.</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-300 font-bold text-xs uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                {...register("email", { required: true, pattern: /^\S+@\S+\.\S+$/ })}
                                className="w-full px-4 py-2.5 bg-[#0a0f14] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                                placeholder="Enter your email"
                            />
                            {errors.email?.type === "required" && (
                                <p role="alert" className='text-red-400 text-xs'>Email is required!</p>
                            )}
                            {errors.email?.type === "pattern" && (
                                <p role="alert" className='text-red-400 text-xs'>Please enter a valid email address.</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-300 font-bold text-xs uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", {
                                        required: true,
                                        minLength: 6,
                                    })}
                                    className="w-full px-4 py-2.5 pr-12 bg-[#0a0f14] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                                    placeholder="Create a password (min 6 chars)"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors p-1"
                                >
                                    {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                                </button>
                            </div>
                            {errors.password?.type === "required" && (
                                <p role="alert" className='text-red-400 text-xs'>Password is required!</p>
                            )}
                            {errors.password?.type === "minLength" && (
                                <p role="alert" className='text-red-400 text-xs'>Password must be at least 6 characters.</p>
                            )}
                        </div>

                        {/* Turnstile Bot Protection Widget */}
                        <div id="turnstile-widget" className="flex justify-center my-2 min-h-[65px]" />

                        {/* Server Error */}
                        {serverError && (
                            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 px-4 py-2.5 rounded-xl font-medium">
                                ⚠️ {serverError}
                            </p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] mt-2 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    Sending OTP...
                                </>
                            ) : (
                                <>
                                    <FiMail size={16} /> Register
                                </>
                            )}
                        </button>
                    </fieldset>

                    <p className='text-slate-400 text-xs text-center mt-5'>
                        Already have an account? <Link to="/login" className='text-cyan-400 font-bold hover:underline ml-1'>Login</Link>
                    </p>
                </form>
            ) : (
                /* ── STEP 2: OTP VERIFICATION SCREEN ── */
                <form onSubmit={handleVerifyAndRegister} className="space-y-5">
                    <div className="text-center">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-3">
                            <FiMail size={24} />
                        </div>
                        <h2 className="text-xl font-black text-white uppercase tracking-wider">Verify Email</h2>
                        <p className="text-slate-400 text-xs mt-1">
                            We sent a 6-digit OTP code to <strong className="text-cyan-400 font-mono">{registeredData?.email}</strong>
                        </p>
                    </div>

                    {devOtpHint && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-center">
                            <p className="text-amber-400 text-xs font-bold">DEV MODE OTP CODE:</p>
                            <p className="text-white text-lg font-mono font-black tracking-widest mt-0.5">{devOtpHint}</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="text-slate-300 font-bold text-xs uppercase tracking-wider text-center">Enter 6-Digit OTP Code</label>
                        <input
                            type="text"
                            maxLength={6}
                            value={otpCode}
                            onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-4 py-3 bg-[#0a0f14] border border-slate-700 rounded-xl text-white text-center text-xl font-mono font-bold tracking-[0.5em] focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600 placeholder:tracking-normal placeholder:font-sans placeholder:text-xs"
                            placeholder="0 0 0 0 0 0"
                            autoFocus
                        />
                    </div>

                    {/* Server Error */}
                    {serverError && (
                        <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 px-4 py-2.5 rounded-xl font-medium text-center">
                            ⚠️ {serverError}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting || otpCode.length < 6}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {submitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                <FiCheckCircle size={16} /> Verify & Create Account
                            </>
                        )}
                    </button>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={() => { setStep(1); setServerError(''); }}
                            className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                        >
                            <FiArrowLeft size={14} /> Back / Edit Email
                        </button>
                        <button
                            type="button"
                            disabled={!canResend || submitting}
                            onClick={handleResendOtp}
                            className="text-cyan-400 hover:text-cyan-300 disabled:text-slate-600 disabled:cursor-not-allowed flex items-center gap-1 font-bold transition-colors cursor-pointer"
                        >
                            <FiRefreshCw size={12} className={submitting ? 'animate-spin' : ''} />
                            {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Register;
