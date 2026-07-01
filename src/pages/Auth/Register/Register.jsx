import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link, useNavigate } from 'react-router';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { registerUser, loading } = useAuth();
    const [serverError, setServerError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleRegistration = async (data) => {
        setServerError('');
        try {
            await registerUser(data.username, data.email, data.password);
            navigate('/');
        } catch (error) {
            setServerError(error.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="bg-[#121820]/80 backdrop-blur-md p-8 rounded-2xl border border-slate-700 shadow-2xl">
            <form onSubmit={handleSubmit(handleRegistration)}>
                <fieldset className="fieldset w-full space-y-6">

                    {/* Username Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-300 font-bold text-sm uppercase tracking-wider">Username</label>
                        <input
                            type="text"
                            {...register("username", { required: true })}
                            className="w-full px-4 py-3 bg-[#0a0f14] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                            placeholder="Enter your username"
                        />
                        {errors.username?.type === "required" && (
                            <p role="alert" className='text-red-500'>Username is required!</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-300 font-bold text-sm uppercase tracking-wider">Email</label>
                        <input
                            type="email"
                            {...register("email", { required: true })}
                            className="w-full px-4 py-3 bg-[#0a0f14] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                            placeholder="Enter your email"
                        />
                        {errors.email?.type === "required" && (
                            <p role="alert" className='text-red-500'>Email is required!</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-300 font-bold text-sm uppercase tracking-wider">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password",
                                {
                                    required: true,
                                    minLength: 6,
                                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                                })}
                                className="w-full px-4 py-3 pr-12 bg-[#0a0f14] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                            >
                                {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                            </button>
                        </div>
                        {errors.password?.type === "required" && (
                            <p role="alert" className='text-red-500'>Password is required!</p>
                        )}
                        {errors.password?.type === "minLength" && (
                            <p role="alert" className='text-red-500'>Password must be at least 6 characters!</p>
                        )}
                        {errors.password?.type === "pattern" && (
                            <p role="alert" className='text-red-500'>Must have uppercase, lowercase, number & special character.</p>
                        )}
                    </div>

                    {/* Server Error */}
                    {serverError && (
                        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-lg">
                            ⚠️ {serverError}
                        </p>
                    )}

                    {/* Register Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold uppercase tracking-widest rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] mt-4 active:scale-95 mb-5"
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </fieldset>
                <p className='text-base-100'>Already have an account? <Link to="/login" className='text-cyan-400 underline'>Login</Link></p>
            </form>
        </div>
    );
};

export default Register;