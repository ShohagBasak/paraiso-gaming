import React from 'react';

const Announcement = () => {
  return (
    <section
      className="pt-16 sm:pt-20 pb-0 px-4 sm:px-8 relative overflow-hidden"
      style={{
        backgroundImage: `url('/bg.png')`,
        backgroundSize: '100% auto',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        minHeight: '600px',
      }}
    >
      {/* Dark navy overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(10, 18, 40, 0.82)' }} />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Top Label */}
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-cyan-400 font-space-mono font-bold text-xs sm:text-sm uppercase tracking-widest">
            The Foundation
          </p>
        </div>

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

        {/* Main Content */}
        <div className="space-y-5 sm:space-y-6 font-poppins text-center">

          {/* First Paragraph */}
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed px-0 sm:px-4">
            The United States of Paraiso is a player-driven roleplay experience built to mirror the structure, responsibility, and complexity of a real country. From federal agencies and law enforcement to emergency services, local businesses, courts, media, and civilian life, every system exists with <span className="text-cyan-400 font-semibold">purpose, continuity, and consequence</span>.
          </p>

          {/* Emphasis Box */}
          <div className="my-8 sm:my-10 py-6 sm:py-8 px-4 sm:px-6 border-l-4 border-cyan-400 bg-cyan-500/20 sm:bg-cyan-500/40 text-left">
            <p className="text-base sm:text-xl text-white font-semibold leading-relaxed">
              Every Citizen of Paraiso has a role. Every department has a duty. Every decision shapes the future of the nation.
            </p>
          </div>

          {/* Second Paragraph */}
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed px-0 sm:px-4">
            Whether you choose to protect the innocent, save lives, report the news, build a thriving business, or carve your own path through the criminal underworld, your story becomes part of a nation that is <span className="text-cyan-400 font-semibold">constantly evolving</span> through the actions of its citizens.
          </p>

          {/* Third Paragraph */}
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed px-0 sm:px-4">
            Our goal isn't simply to create another roleplay server—it's to build a nation where <span className="text-cyan-400 font-semibold">every Citizen of Paraiso is respected, every story matters</span>, and every update is driven by a commitment to quality, realism, and the community that calls Paraiso home.
          </p>

          {/* Final Statement */}
          <div className="mt-10 sm:mt-12 space-y-3 sm:space-y-4 pb-10">
            <p className="text-xl sm:text-2xl text-white font-bold">
              This is more than roleplay.
            </p>
            <p className="text-xl sm:text-2xl text-cyan-400 font-bold">
              This is the United States of Paraiso.
            </p>
            <p className="text-base sm:text-xl font-space-mono text-gray-200 italic mt-4 sm:mt-6">
              Welcome home, Citizen.
            </p>
          </div>

        </div>

      </div>

      {/* Bottom Full-Width Divider */}
      <div className="relative w-full mt-5">
        <div
          className="w-full h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #22d3ee 30%, #3b82f6 50%, #22d3ee 70%, transparent 100%)',
            boxShadow: '0 0 12px 2px rgba(34, 211, 238, 0.4)',
          }}
        />
      </div>

    </section>
  );
};

export default Announcement;