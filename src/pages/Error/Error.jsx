import React from 'react';
import { Link } from 'react-router';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const Error = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0a0f14] px-4 relative overflow-hidden">
      
      {/* Background Neon Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 text-center max-w-2xl mx-auto flex flex-col items-center">
        
        {/* Warning Icon */}
        <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/20 mb-6 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
          <FaExclamationTriangle className="text-5xl text-cyan-400 animate-pulse" />
        </div>

        {/* 404 Massive Text */}
        <h1 className="text-8xl md:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-700 leading-none tracking-tighter mb-4 drop-shadow-2xl">
          404
        </h1>

        {/* Error Title */}
        <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-widest mb-6">
          <span className="text-cyan-500">Page</span> Not Found
        </h2>

        {/* Error Description */}
        <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-lg leading-relaxed">
          Oops! It looks like you got lost in the streets of Los Santos. The page you are looking for does not exist or has been moved.
        </p>

        {/* Redirect Button */}
        <Link 
          to="/" 
          className="flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-4 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.7)] hover:scale-105 transition-all duration-300 uppercase tracking-widest"
        >
          <FaHome className="text-xl" />
          Return to Home
        </Link>
        
      </div>
    </section>
  );
};

export default Error;