import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const ForgotPassword = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [serverError, setServerError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    const newPassword = watch('newPassword');

    const handleReset = async (data) => {
        setServerError('');
        setSuccess('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    email: data.email,
                    newPassword: data.newPassword,
                }),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message || 'Failed to reset password');

            setSuccess('Password updated successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2500);
        } catch (error) {
            setServerError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#121820]/80 backdrop-blur-md p-8 rounded-2xl border border-slate-700 shadow-2xl">

            {/* Header */}
            <div className="mb-6 text-center">
                <div className="text-4xl mb-3">🔑</div>
                <h2 className="text-white font-bold text-xl uppercase tracking-widest">Reset Password</h2>
                <p className="text-slate-400 text-sm mt-1">Enter your email and set a new password</p>
            </div>

            <form onSubmit={handleSubmit(handleReset)}>
                <fieldset className="fieldset w-full space-y-5">

                    {/* Email Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-300 font-bold text-sm uppercase tracking-wider">
                            Email Address
                        </label>
                        <input
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            className="w-full px-4 py-3 bg-[#0a0f14] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                            placeholder="Enter your registered email"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email.message}</p>
                        )}
                    </div>

                    {/* New Password Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-300 font-bold text-sm uppercase tracking-wider">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNew ? "text" : "password"}
                                {...register('newPassword', {
                                    required: 'New password is required',
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                        message: 'Must have uppercase, lowercase, number & special character'
                                    }
                                })}
                                className="w-full px-4 py-3 pr-12 bg-[#0a0f14] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                            >
                                {showNew ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-300 font-bold text-sm uppercase tracking-wider">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: (value) =>
                                        value === newPassword || 'Passwords do not match'
                                })}
                                className="w-full px-4 py-3 pr-12 bg-[#0a0f14] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                            >
                                {showConfirm ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Server Error */}
                    {serverError && (
                        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-lg">
                            ⚠️ {serverError}
                        </p>
                    )}

                    {/* Success Message */}
                    {success && (
                        <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-lg">
                            ✅ {success}
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold uppercase tracking-widest rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] mt-2 active:scale-95"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </fieldset>

                {/* Back to Login */}
                <p className="text-slate-400 text-sm mt-5 text-center">
                    Remember your password?{' '}
                    <Link to="/login" className="text-cyan-400 underline hover:text-white transition-colors">
                        Back to Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default ForgotPassword;
