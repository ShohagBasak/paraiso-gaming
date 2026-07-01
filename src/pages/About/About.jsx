import React from 'react';

const About = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 min-h-screen flex flex-col justify-center">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        
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
          <div className="my-8 sm:my-10 py-6 sm:py-8 px-6 border-l-4 border-cyan-400 bg-cyan-950/20 text-left rounded-r-xl">
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
          <div className="mt-10 sm:mt-12 space-y-3 sm:space-y-4 pb-10">
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

        {/* Bottom Full-Width Divider */}
        <div className="relative w-full mt-10">
          <div
            className="w-full h-px"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #22d3ee 30%, #3b82f6 50%, #22d3ee 70%, transparent 100%)',
              boxShadow: '0 0 12px 2px rgba(34, 211, 238, 0.4)',
            }}
          />
        </div>

      </div>
    </section>
  );
};

export default About;
