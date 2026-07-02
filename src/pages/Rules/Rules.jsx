
import React from 'react';
import { FaGavel, FaExchangeAlt, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const Rules = () => {
  // General Rules Data
  const generalRules = [
    "Advertising or promoting other gaming communities is not allowed.",
    "Do not spam text channels, voice channels, or abuse mentions.",
    "Keep all content appropriate. NSFW, graphic, or offensive content is prohibited.",
    "Use channels for their correct purpose and keep discussions in the proper areas.",
    "Do not distribute or use any illegal modifications, cheats, malicious files, or unauthorized content.",
    "Sharing another user’s personal information without their permission is strictly prohibited.",
    "English only in public community channels."
  ];

  // Trading Rules Data
  const tradingRules = [
    "Buying, selling, trading, or giving away any Paraiso Gaming accounts through public channels is not permitted.",
    "Buying, selling, or trading in-game items must only be done through official approved methods.",
    "Any attempts to scam, impersonate another user, or perform unsafe trades may result in action from staff."
  ];

  return (
    <section className="py-16 px-4 mt-10 sm:px-8 min-h-screen">
      <div className="max-w-5xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center mb-14">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4 tracking-tight">
            SERVER RULES
          </h1>
          <p className="text-lg text-base-100 max-w-2xl mx-auto">
            Please read and follow these rules carefully to ensure a safe and enjoyable experience for everyone in <span className='text-cyan-400'>Paraiso</span> Roleplay.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          
          {/* ==========================================
              1. GENERAL RULES SECTION
          ============================================== */}
          <div className="bg-[#121820] border border-slate-800 rounded-2xl p-6 md:p-10 shadow-xl hover:border-cyan-500/30 transition-colors duration-300">
            <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <FaGavel className="text-2xl text-cyan-400" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-wide">General</h2>
            </div>
            
            <ul className="space-y-5">
              {generalRules.map((rule, index) => (
                <li key={index} className="flex items-start gap-4 group">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a222d] text-cyan-400 flex items-center justify-center font-bold border border-slate-700 group-hover:bg-cyan-500 group-hover:text-black group-hover:border-cyan-500 transition-all duration-300">
                    {index + 1}
                  </span>
                  <p className="text-slate-300 text-base md:text-lg pt-1 group-hover:text-white transition-colors">
                    {rule}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* ==========================================
              2. TRADING RULES SECTION
          ============================================== */}
          <div className="bg-[#121820] border border-slate-800 rounded-2xl p-6 md:p-10 shadow-xl hover:border-purple-500/30 transition-colors duration-300">
            <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <FaExchangeAlt className="text-2xl text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-wide">Trading</h2>
            </div>
            
            <ul className="space-y-5">
              {tradingRules.map((rule, index) => (
                <li key={index} className="flex items-start gap-4 group">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a222d] text-purple-400 flex items-center justify-center font-bold border border-slate-700 group-hover:bg-purple-500 group-hover:text-white group-hover:border-purple-500 transition-all duration-300">
                    {index + 1}
                  </span>
                  <p className="text-slate-300 text-base md:text-lg pt-1 group-hover:text-white transition-colors">
                    {rule}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* ==========================================
              3. IMPORTANT NOTICE SECTION (Highlighted)
          ============================================== */}
          <div className="bg-[#121820] border border-red-500/30 rounded-2xl p-6 md:p-10 shadow-[0_0_30px_rgba(239,68,68,0.05)] relative overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 blur-[100px] rounded-full"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <FaExclamationTriangle className="text-3xl text-red-500 animate-pulse" />
                <h2 className="text-2xl md:text-3xl font-bold text-red-400 uppercase tracking-widest">
                  Important Notice
                </h2>
              </div>
              
              <div className="bg-black/40 rounded-xl p-6 border border-red-500/20">
                <p className="text-white text-lg md:text-xl font-medium leading-relaxed mb-4">
                  Paraiso Gaming Staff will <span className="text-red-400 font-bold underline decoration-red-500/50 underline-offset-4">NEVER</span> ask for your password or private account information. Never share your login details with anyone.
                </p>
                <div className="flex items-center gap-2 text-slate-400 font-medium">
                  <FaCheckCircle className="text-green-500" />
                  <p>Stay safe and help us keep Paraiso Gaming a trusted community.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Rules;