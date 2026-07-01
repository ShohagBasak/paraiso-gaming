import React from 'react';
import { FaSun } from 'react-icons/fa';
import { Link } from 'react-router';

const Announcement = () => {
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
        className="pt-16 sm:pt-20 pb-16 px-4 sm:px-8 relative overflow-hidden"
        style={{
          backgroundImage: `url('/bg.png')`,
          backgroundSize: '140% auto',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          minHeight: '600px',
          backgroundColor: '#070a13',
        }}
      >
        {/* Blackish gradient overlay fading to solid theme color at the bottom */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ 
            background: 'linear-gradient(to bottom, rgba(7, 10, 19, 0.7) 0%, rgba(7, 10, 19, 0.88) 50%, rgba(7, 10, 19, 1) 85%, rgba(7, 10, 19, 1) 100%)' 
          }} 
        />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-bold text-white text-center mb-4 sm:mb-6 leading-tight">
            The United States of <span className="text-cyan-400">Paraiso</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-center text-gray-300 mb-6 sm:mb-8 font-light px-2">
            This is not just a game server—it is a <span className="text-cyan-400 font-semibold">living, breathing nation</span>.
          </p>

          {/* Divider Line */}
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-8 sm:mb-12"></div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8">
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-cyan-500 hover:bg-cyan-500 hover:text-black active:scale-95 text-cyan-400 font-bold rounded-full transition-all duration-200 hover:scale-105 whitespace-nowrap min-w-[150px]"
            >
              Read More
            </Link>
            <a
              href="https://discord.com/invite/7AsJaG3KSV"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-[#1e40af] hover:bg-blue-700 active:scale-95 text-white font-bold rounded-full transition-all duration-200 shadow-lg shadow-blue-500/20 hover:scale-105 whitespace-nowrap min-w-[150px]"
            >
              Join Discord
            </a>
            <a
              href="https://forums.pgaming.net/index.php"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-black active:scale-95 text-yellow-500 font-bold rounded-full transition-all duration-200 hover:scale-105 whitespace-nowrap min-w-[150px]"
            >
              Forum
            </a>
          </div>

          {/* SA:MP Server Card Button */}
          <div className="flex justify-center mt-10">
            <button
              onClick={scrollToServer}
              className="flex items-center gap-4 bg-[#0d1219]/45 backdrop-blur-md border border-[#1e293b]/70 hover:border-cyan-500/60 hover:bg-[#121a24]/45 transition-all duration-300 px-6 py-3.5 rounded-2xl cursor-pointer text-left group shadow-lg min-w-[280px] select-none"
            >
              {/* Orange Sun Icon */}
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
          </div>
        </div>
      </section>
      
    </>
  );
};

export default Announcement;