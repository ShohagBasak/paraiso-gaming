import React from 'react';

const Announcement = () => {
  return (
    <section className="pt-20 mb-15 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Top Label */}
        <div className="text-center mb-8">
          <p className="text-cyan-400 font-space-mono font-bold text-sm uppercase tracking-widest mb-4">
            The Foundation
          </p>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl font-playfair sm:text-6xl md:text-7xl font-bold text-white text-center mb-6 leading-tight">
          The United States of <span className="text-cyan-400">Paraiso</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-center text-gray-300 mb-8 font-light">
          This is not just a game server—it is a <span className="text-cyan-400 font-semibold">living, breathing nation</span>.
        </p>

        {/* Divider Line */}
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-12"></div>

        {/* Main Content */}
        <div className="space-y-6 font-poppins text-center">
          
          {/* First Paragraph */}
          <p className="text-gray-300 text-lg leading-relaxed">
            The United States of Paraiso is a player-driven roleplay experience built to mirror the structure, responsibility, and complexity of a real country. From federal agencies and law enforcement to emergency services, local businesses, courts, media, and civilian life, every system exists with <span className="text-cyan-400 font-semibold">purpose, continuity, and consequence</span>.
          </p>

          {/* Emphasis Box */}
          <div className="my-10 py-8 px-6 border-l-4 border-cyan-400 bg-cyan-500/40">
            <p className="text-xl text-white font-semibold">
              Every Citizen of Paraiso has a role. Every department has a duty. Every decision shapes the future of the nation.
            </p>
          </div>

          {/* Second Paragraph */}
          <p className="text-gray-300 text-lg leading-relaxed">
            Whether you choose to protect the innocent, save lives, report the news, build a thriving business, or carve your own path through the criminal underworld, your story becomes part of a nation that is <span className="text-cyan-400 font-semibold">constantly evolving</span> through the actions of its citizens.
          </p>

          {/* Third Paragraph */}
          <p className="text-gray-300 text-lg leading-relaxed">
            Our goal isn't simply to create another roleplay server—it's to build a nation where <span className="text-cyan-400 font-semibold">every Citizen of Paraiso is respected, every story matters</span>, and every update is driven by a commitment to quality, realism, and the community that calls Paraiso home.
          </p>

          {/* Final Statement */}
          <div className="mt-12 space-y-4">
            <p className="text-2xl text-white font-bold">
              This is more than roleplay.
            </p>
            <p className="text-2xl text-cyan-400 font-bold">
              This is the United States of Paraiso.
            </p>
            <p className="text-xl font-space-mono text-gray-200 italic mt-6">
              Welcome home, Citizen.
            </p>
          </div>

        </div>

        {/* Bottom Accent */}
        <div className="flex justify-center mt-10">
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-transparent"></div>
        </div>

      </div>
    </section>
  );
};

export default Announcement;