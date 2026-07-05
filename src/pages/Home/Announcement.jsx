import React, { useState, useEffect } from 'react';
import { FaSun } from 'react-icons/fa';

const Announcement = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToServer = (e) => {
    e.preventDefault();
    const element = document.getElementById('home-two');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Hero Banner Section */}
      <section
        className="pt-24 pb-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{
          backgroundImage: `url('/bg.jpg')`,
          backgroundSize: isMobile ? '390% auto' : '140% auto',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          minHeight: isMobile ? 'auto' : '600px',
          backgroundColor: '#05081134',
        }}
      >
        {/* Blackish gradient*/}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ 
            background: isMobile 
              ? 'linear-gradient(to bottom, rgba(5, 8, 17, 0.65) 0%, rgba(5, 8, 17, 0.8) 60%, rgba(5, 8, 17, 1) 100%)'
              : 'linear-gradient(to bottom, rgba(5, 8, 17, 0.5) 0%, rgba(5, 8, 17, 0.7) 60%, rgba(5, 8, 17, 1) 100%)'
          }} 
        />

        <div className="w-full max-w-7xl mx-auto relative z-10">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-bold text-white text-center mb-4 sm:mb-6 leading-tight animate-fade-up animation-delay-1-2s">
            The United States of <span className="text-cyan-400">Paraiso</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-2xl md:text-2xl text-center text-gray-300 mb-6 sm:mb-8 font-light px-2 animate-fade-up animation-delay-1-4s">
            This is not just a game server—it is a <span className="text-cyan-400 font-semibold">living, breathing nation</span>.
          </p>

          {/* Divider Line */}
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-8 sm:mb-12 animate-fade-up animation-delay-1-6s"></div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8">
            <a
              href="https://discord.com/invite/7AsJaG3KSV"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-[#1e40af] hover:bg-blue-700 active:scale-95 text-white font-bold rounded-full transition-all duration-200 shadow-lg shadow-blue-500/20 hover:scale-105 whitespace-nowrap min-w-[150px] animate-fade-up animation-delay-1-8s"
            >
              Join Discord
            </a>
            <a
              href="https://forums.pgaming.net/index.php"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-black active:scale-95 text-yellow-500 font-bold rounded-full transition-all duration-200 hover:scale-105 whitespace-nowrap min-w-[150px] animate-fade-up animation-delay-2s"
            >
              Forum
            </a>
          </div>

          {/* SA:MP Server Card Button */}
          {/* <div className="flex justify-center mt-10">
            <button
              onClick={scrollToServer}
              className="flex items-center gap-4 bg-[#0d1219]/45 backdrop-blur-md border border-[#1e293b]/70 hover:border-cyan-500/60 hover:bg-[#121a24]/45 transition-all duration-300 px-6 py-3.5 rounded-2xl cursor-pointer text-left group shadow-lg min-w-[280px] select-none animate-fade-up animation-delay-2-2s"
            >
              
              <div className="text-yellow-500 group-hover:rotate-45 transition-transform duration-500 text-3xl flex items-center justify-center">
                <FaSun />
              </div>
              <div>
                <p className="text-white font-bold text-base leading-tight tracking-wide">
                  SA:MP [Los Santos]
                </p>
                <p className="text-gray-500 font-bold text-[10px] uppercase tracking-wider mt-1.5 flex items-center gap-1">
                  View Server <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
                </p>
              </div>
            </button>
          </div> */}

          {/* The Foundation Section */}
          <div className="w-full mt-12 p-4 sm:p-8 md:p-10 bg-[#0d1219]/40 backdrop-blur-md border border-cyan-500/25 rounded-2xl max-w-7xl mx-auto shadow-2xl relative z-10">
            {/* Top Label */}
            <div className="text-center mb-6 sm:mb-8">
              <p className="text-cyan-400 font-space-mono font-bold text-xs sm:text-sm uppercase tracking-widest">
                The Foundation
              </p>
            </div> 

            {/* Main Content */}
            <div className="space-y-6 sm:space-y-8 font-poppins text-center text-gray-300">

              {/* First Paragraph */}
              <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed px-0 sm:px-4">
                The United States of Paraiso is a player-driven roleplay experience built to mirror the structure, responsibility, and complexity of a real country. From federal agencies and law enforcement to emergency services, local businesses, courts, media, and civilian life, every system exists with <span className="text-cyan-400 font-semibold">purpose, continuity, and consequence</span>.
              </p>

              {/* Emphasis Box */}
              <div className="max-w-3xl mx-auto text-center my-8 sm:my-10 py-6 sm:py-8 px-4 sm:px-6 border-l-4 border-cyan-400 bg-cyan-950/20 text-left rounded-r-xl">
                <p className="text-base sm:text-xl text-white font-medium leading-relaxed">
                  Every Citizen of Paraiso has a role. Every department has a duty. Every decision shapes the future of the nation.
                </p>
              </div>

              {/* Second Paragraph */}
              <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed px-0 sm:px-4">
                Whether you choose to protect the innocent, save lives, report the news, build a thriving business, or carve your own path through the criminal underworld, your story becomes part of a nation that is <span className="text-cyan-400 font-semibold">constantly evolving</span> through the actions of its citizens.
              </p>

              {/* Third Paragraph */}
              <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed px-0 sm:px-4">
                Our goal isn't simply to create another roleplay server—it's to build a nation where <span className="text-cyan-400 font-semibold">every Citizen of Paraiso is respected, every story matters</span>, and every update is driven by a commitment to quality, realism, and the community that calls Paraiso home.
              </p>

              {/* Final Statement */}
              <div className="mt-10 sm:mt-12 space-y-3 sm:space-y-4 pb-2">
                <p className="text-xl sm:text-2xl md:text-3xl text-white font-bold">
                  This is more than roleplay.
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl text-cyan-400 font-bold">
                  This is the United States of Paraiso.
                </p>
                <p className="text-base sm:text-xl font-space-mono text-gray-200 italic mt-4 sm:mt-6">
                  Welcome home, Citizen.
                </p>
              </div>

            </div>

            
          </div>
        </div>
      </section>
    </>
  );
};

export default Announcement;