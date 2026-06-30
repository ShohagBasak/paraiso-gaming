import React from 'react';
import { Link, Outlet } from 'react-router';

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#0a0f14]">
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 relative">
                <Link to="/" className="absolute top-8 left-8"> 
                    <img src="/logo.png" alt="logo" className="w-16 h-16 hover:opacity-80 transition-opacity" />
                </Link>

                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </div>

            <div className="hidden md:flex w-1/2 relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/50 to-blue-900/50 z-10"></div>
                <img 
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920" 
                    alt="auth-bg" 
                    className="w-full h-full object-cover" 
                />
                <div className="absolute bottom-16 left-16 z-20 text-white">
                    <h2 className="text-4xl font-black uppercase mb-2">Paraiso Roleplay</h2>
                    <p className="text-cyan-400 font-medium tracking-widest uppercase text-sm">Join the elite gaming community</p>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;