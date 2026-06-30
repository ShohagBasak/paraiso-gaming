import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link } from 'react-router';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {registerUser} = useAuth();
    const handleRegistration = (data) => {
        console.log("After reg data", data);
        registerUser(data.email, data.password)
        .then(result =>{
            console.log(result.user);
        }).catch(error =>{
            console.log(error);
        })
    }
    return (
        <div className="bg-[#121820]/80 backdrop-blur-md p-8 rounded-2xl border border-slate-700 shadow-2xl">
            <form onSubmit={handleSubmit(handleRegistration)}>
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
                        <input
                            type="password"
                            {...register("password", 
                            { 
                                required: true, 
                                minLength: 6 ,
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                            })}
                            className="w-full px-4 py-3 bg-[#0a0f14] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                            placeholder="Enter your password"
                        />
                        {errors.password?.type === "required" && (
                            <p role="alert" className='text-red-500'>Password is required!</p>
                        )}
                        {errors.password?.type === "minLength" && (
                            <p role="alert" className='text-red-500'>Password must be 6 characters or longer!</p>
                        )}
                        {errors.password?.type === "pattern" && (
                            <p role="alert" className='text-red-500'>Password must have at least one Uppercase,at least one lowercase,at least one number,at least one special characters</p>
                        )}
                    </div>

                    {/* Forgot Password */}
                    <div className="text-right">
                        <a className="text-cyan-400 text-xs font-medium hover:text-white transition-colors cursor-pointer">
                            Forgot password?
                        </a>
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-bold uppercase tracking-widest rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] mt-4 active:scale-95 mb-5"
                    >
                        Register
                    </button>
                </fieldset>
                <p className='text-base-100'>Already have account?Please <Link to="/login" className='text-cyan-400 underline'>Login</Link></p>
            </form>
        </div>
    );
};

export default Register;