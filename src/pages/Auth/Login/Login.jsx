import { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import { FiEye, FiEyeOff } from "react-icons/fi";


const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signInUser } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (data) => {
        setServerError('');
        setSubmitting(true);

        try {
            const user = await signInUser(data.email, data.password);
            if (user?.role === 'admin' || user?.role === 'master') {
                navigate('/dashboard');
            } else {
                navigate('/');
            }
        } catch (error) {
            setServerError(error.message || 'Login failed. Please check your credentials.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-[#121820]/80 backdrop-blur-md p-8 rounded-2xl border border-slate-700 shadow-2xl">
            <form onSubmit={handleSubmit(handleLogin)}>
                <fieldset className="fieldset w-full space-y-6">
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
                    </div>

                    {/* Forgot Password */}
                    <div className="text-right">
                        <Link to="/forgot-password" className="text-cyan-400 text-xs font-medium hover:text-white transition-colors cursor-pointer">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Server Error */}
                    {serverError && (
                        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-lg">
                            ⚠️ {serverError}
                        </p>
                    )}

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full mb-5 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold uppercase tracking-widest rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] mt-4 active:scale-95"
                    >
                        {submitting ? 'Logging in...' : 'Login'}
                    </button>
                </fieldset>
                <p className='text-base-100'>New at Paraiso Gaming? Please <Link to="/register" className='text-cyan-400 underline'>Register</Link></p>
            </form>
        </div>
    );
};

export default Login;
