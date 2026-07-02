import React from 'react';

const ChainOfCommand = () => {
  return (
    <div
      className="min-h-screen text-white pb-24"
      style={{
        backgroundColor: '#050811',
        backgroundImage: `
          linear-gradient(rgba(6, 182, 212, 0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(6, 182, 212, 0.04) 1px, transparent 1px),
          radial-gradient(circle at 50% 30%, rgba(6, 182, 212, 0.02) 0%, transparent 70%),
          linear-gradient(160deg, #050811 0%, #070c18 40%, #04070d 100%)
        `,
        backgroundSize: '36px 36px, 36px 36px, 100% 100%, 100% 100%',
        fontFamily: "'Rajdhani', 'Orbitron', sans-serif",
      }}
    >
      {/* ── HERO HEADER (STATIC) ── */}
      <div
        className="w-full flex flex-col items-center justify-center pt-28 pb-12 px-4 relative overflow-hidden text-center"
        style={{
          background: 'linear-gradient(180deg, #0a0f1e 0%, #0d1526 60%, #080d18 100%)',
          borderBottom: '1px solid rgba(34,211,238,0.12)',
        }}
      >
        <p className="text-cyan-400/90 font-black text-xs sm:text-sm uppercase tracking-[0.25em] mb-4">
          Issued by the Office of the President
        </p>
        <img
          src="https://i.imgur.com/YfVF1d0.png"
          alt="The Great Seal of the United States of Paraiso"
          className="w-36 h-36 sm:w-44 sm:h-44 object-contain mb-4 drop-shadow-[0_0_20px_rgba(201,168,76,0.35)] hover:scale-105 transition-transform duration-500"
        />
        
        <h2 className="text-[#c9a84c] font-black uppercase tracking-[0.15em] text-xl sm:text-2xl" style={{ textShadow: '0 0 10px rgba(201,168,76,0.4)' }}>
          Brian Gutierrez
        </h2>
        <p className="text-[#fbbf24] text-xs sm:text-sm font-semibold uppercase tracking-wider mt-1">
          President of the United States of Paraiso
        </p>
        
        <div className="flex flex-col gap-0.5 mt-4 text-[10px] sm:text-xs uppercase tracking-widest text-slate-500 font-black">
          <p>Office of the President</p>
          <p>Government of Paraiso</p>
        </div>
      </div>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="max-w-4xl mx-auto px-4 mt-12 space-y-12">
        
        {/* INTRODUCTION */}
        <div className="bg-[#0b0f15] border border-slate-900 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500/50" />
          <h3 className="text-lg font-black uppercase tracking-widest text-cyan-400 mb-3">Introduction</h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
            The Government of Paraiso serves as the executive authority responsible for maintaining structure, organization, and oversight across the community.
          </p>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium mt-3">
            Instead of having one person manage every department, responsibilities are divided between executive offices and specialized management teams.
          </p>
        </div>

        {/* EXECUTIVE LEADERSHIP */}
        <div className="space-y-4">
          <div className="relative flex items-center gap-4 py-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c9a84c]/20 to-[#c9a84c]/50" />
            <h3 className="text-base sm:text-lg font-black uppercase tracking-[0.25em] text-[#c9a84c] whitespace-nowrap">
              Executive Leadership
            </h3>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#c9a84c]/20 to-[#c9a84c]/50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* President */}
            <div 
              className="border rounded-2xl p-6 relative overflow-hidden"
              style={{
                borderColor: 'rgba(201,168,76,0.3)',
                background: '#0b0f15'
              }}
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#c9a84c] opacity-60" />
              <h4 className="text-[#c9a84c] text-base sm:text-lg font-black uppercase tracking-wider mb-3">
                President
              </h4>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                The highest-ranking official within the Government of Paraiso. The President sets the overall vision of the community and has final authority over major decisions, appointments, and policies.
              </p>
            </div>

            {/* Vice President */}
            <div 
              className="border rounded-2xl p-6 relative overflow-hidden"
              style={{
                borderColor: 'rgba(201,168,76,0.15)',
                background: '#0b0f15'
              }}
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-slate-500 opacity-60" />
              <h4 className="text-slate-300 text-base sm:text-lg font-black uppercase tracking-wider mb-3">
                Vice President
              </h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
                The second-highest executive official. The Vice President assists the President with government operations and acts on behalf of the President when necessary.
              </p>
            </div>
          </div>
        </div>

        {/* EXECUTIVE DEPARTMENTS */}
        <div className="space-y-8">
          <div className="relative flex items-center gap-4 py-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-cyan-500/50" />
            <h3 className="text-base sm:text-lg font-black uppercase tracking-[0.25em] text-cyan-400 whitespace-nowrap">
              Executive Departments
            </h3>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-cyan-500/20 to-cyan-500/50" />
          </div>

          <div className="space-y-8">
            
            {/* 1. Secretary of Defense */}
            <div className="border border-slate-900 rounded-3xl p-6 sm:p-8 bg-[#0b0f15] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/40" />
              <h4 className="text-cyan-400 text-lg font-black uppercase tracking-wider mb-2">Secretary of Defense</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 font-semibold">
                Oversees all law enforcement and emergency service departments.
              </p>

              {/* Reports Under Secretary of Defense - Unified Card Container */}
              <div className="bg-[#080d13] border border-slate-800/80 rounded-2xl p-5 space-y-4">
                <p className="text-xs uppercase tracking-wider text-cyan-400/80 font-black border-b border-slate-800 pb-2">
                  Reports Under Secretary of Defense:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Admin Personnel Group */}
                  <div className="space-y-2">
                    <p className="text-slate-200 text-xs font-bold uppercase tracking-wider">
                      Admin Personnel
                    </p>
                    <div className="flex items-start gap-2.5 pl-2">
                      <span className="text-cyan-400 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-cyan-400 shadow-md shadow-cyan-500/50" />
                      <span className="text-slate-300 text-xs sm:text-sm font-medium tracking-wide">
                        Helper Management
                      </span>
                    </div>
                  </div>

                  {/* Faction Management Group */}
                  <div className="space-y-2">
                    <p className="text-slate-200 text-xs font-bold uppercase tracking-wider">
                      Faction Management
                    </p>
                    <div className="space-y-2 pl-2">
                      {[
                        'Paraiso Police Department',
                        'Federal Bureau of Investigation',
                        'Paraiso Fire & Medical Department',
                        'National Guard',
                        'San Andreas News'
                      ].map(fac => (
                        <div key={fac} className="flex items-start gap-2.5">
                          <span className="text-cyan-400 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-cyan-400 shadow-md shadow-cyan-500/50" />
                          <span className="text-slate-300 text-xs sm:text-sm font-medium tracking-wide">{fac}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/60 text-slate-400 text-xs leading-relaxed font-medium">
                  Admin Personnel assists the Secretary of Defense in keeping Government employees on the right track. This includes professionalism, honor & loyalty. Aswel as issuing any punishments if any Government employees break the rules and or laws. Faction Management assists faction leaders, monitors activity, reviews department performance, and reports directly to the Secretary of Defense.
                </div>
              </div>
            </div>

            {/* 2. Secretary of State */}
            <div className="border border-slate-900 rounded-3xl p-6 sm:p-8 bg-[#0b0f15] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/40" />
              <h4 className="text-cyan-400 text-lg font-black uppercase tracking-wider mb-2">Secretary of State</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 font-semibold">
                Oversees all civilian and criminal organizations operating throughout Paraiso.
              </p>

              {/* Reports Under Secretary of State - Unified Card Container */}
              <div className="bg-[#080d13] border border-slate-800/80 rounded-2xl p-5 space-y-4">
                <p className="text-xs uppercase tracking-wider text-cyan-400/80 font-black border-b border-slate-800 pb-2">
                  Reports Under Secretary of State:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Gang Management */}
                  <div className="space-y-2">
                    <p className="text-slate-200 text-xs font-bold uppercase tracking-wider">
                      Gang Management
                    </p>
                    <div className="flex items-start gap-2.5 pl-2">
                      <span className="text-cyan-400 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-cyan-400 shadow-md shadow-cyan-500/50" />
                      <span className="text-slate-300 text-xs sm:text-sm font-medium tracking-wide">
                        All Official Criminal Organizations
                      </span>
                    </div>
                  </div>

                  {/* Civilian Management */}
                  <div className="space-y-2">
                    <p className="text-slate-200 text-xs font-bold uppercase tracking-wider">
                      Civilian Management
                    </p>
                    <div className="space-y-2 pl-2">
                      {[
                        'Paraiso News',
                        'Taxi Services',
                        'Future Civilian Organizations'
                      ].map(civ => (
                        <div key={civ} className="flex items-start gap-2.5">
                          <span className="text-cyan-400 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-cyan-400 shadow-md shadow-cyan-500/50" />
                          <span className="text-slate-300 text-xs sm:text-sm font-medium tracking-wide">{civ}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/60 text-slate-400 text-xs leading-relaxed font-medium">
                  Gang Management works with gang leaders, their applications, and reports directly to the Secretary of State.
                </div>
              </div>
            </div>

            {/* 3. Governor of Economic & Development */}
            <div className="border border-slate-900 rounded-3xl p-6 sm:p-8 bg-[#0b0f15] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/40" />
              <h4 className="text-cyan-400 text-lg font-black uppercase tracking-wider mb-2">Governor of Economic & Development</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 font-semibold">
                Oversees the economic development of Paraiso, including businesses, commercial enterprises, and economic affairs.
              </p>

              {/* Reports Under Governor - Unified Card Container */}
              <div className="bg-[#080d13] border border-slate-800/80 rounded-2xl p-5 space-y-4">
                <p className="text-xs uppercase tracking-wider text-cyan-400/80 font-black border-b border-slate-800 pb-2">
                  Reports Under Governor:
                </p>

                <div className="space-y-2">
                  <p className="text-slate-200 text-xs font-bold uppercase tracking-wider">
                    Business Management
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                    {[
                      'Business Applications',
                      'Ownership Transfers',
                      'Commercial Disputes',
                      'Business Owner Support'
                    ].map(biz => (
                      <div key={biz} className="flex items-start gap-2.5">
                        <span className="text-cyan-400 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-cyan-400 shadow-md shadow-cyan-500/50" />
                        <span className="text-slate-300 text-xs sm:text-sm font-medium tracking-wide">{biz}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/60 text-slate-400 text-xs leading-relaxed font-medium">
                  Business Management handles the daily business process while the Governor oversees the overall economy and commercial growth of Paraiso.
                </div>
              </div>
            </div>

            {/* 4. Governor of City Relations */}
            <div className="border border-slate-900 rounded-3xl p-6 sm:p-8 bg-[#0b0f15] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/40" />
              <h4 className="text-cyan-400 text-lg font-black uppercase tracking-wider mb-2">Governor of City Relations</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 font-semibold">
                Oversees the City relations of Paraiso, including complaints, appeals, and city helper organisations.
              </p>

              {/* Reports Under Governor - Unified Card Container */}
              <div className="bg-[#080d13] border border-slate-800/80 rounded-2xl p-5 space-y-4">
                <p className="text-xs uppercase tracking-wider text-cyan-400/80 font-black border-b border-slate-800 pb-2">
                  Reports Under Governor:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Community Management */}
                  <div className="space-y-2">
                    <p className="text-slate-200 text-xs font-bold uppercase tracking-wider">
                      Community Management
                    </p>
                    <div className="space-y-2 pl-2">
                      {[
                        'Ban Appeals',
                        'Warning Appeals',
                        'Complaints'
                      ].map(item => (
                        <div key={item} className="flex items-start gap-2.5">
                          <span className="text-cyan-400 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-cyan-400 shadow-md shadow-cyan-500/50" />
                          <span className="text-slate-300 text-xs sm:text-sm font-medium tracking-wide">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Helper Management */}
                  <div className="space-y-2">
                    <p className="text-slate-200 text-xs font-bold uppercase tracking-wider">
                      Helper Management
                    </p>
                    <div className="space-y-2 pl-2">
                      {[
                        'Helper Applications',
                        'Helper Complaints'
                      ].map(item => (
                        <div key={item} className="flex items-start gap-2.5">
                          <span className="text-cyan-400 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-cyan-400 shadow-md shadow-cyan-500/50" />
                          <span className="text-slate-300 text-xs sm:text-sm font-medium tracking-wide">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/60 text-slate-400 text-xs leading-relaxed font-medium">
                  Community Management handles the daily community issues and appeals. Helper Management handles the daily tasks and management of all Helper employees, while the Governor oversees the overall relations between the Government & Citizens.
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* WHY THIS SYSTEM EXISTS */}
        <div className="space-y-4">
          <div className="relative flex items-center gap-4 py-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-cyan-500/50" />
            <h3 className="text-base sm:text-lg font-black uppercase tracking-[0.25em] text-[#c9a84c] whitespace-nowrap">
              Why This System Exists
            </h3>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-cyan-500/20 to-cyan-500/50" />
          </div>

          <div className="bg-[#0b0f15] border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-4">
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
              This government system is built around delegation and accountability.
            </p>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
              Each executive position oversees a specific area of the server:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#070b10] border border-slate-900">
                <p className="text-cyan-400 text-xs font-black uppercase tracking-wider mb-2">Secretary of Defense</p>
                <p className="text-slate-400 text-xs">→ Government factions and emergency services.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#070b10] border border-slate-900">
                <p className="text-[#c9a84c] text-xs font-black uppercase tracking-wider mb-2">Secretary of State</p>
                <p className="text-slate-400 text-xs">→ Gangs, civilian factions, and community organizations.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#070b10] border border-slate-900">
                <p className="text-emerald-400 text-xs font-black uppercase tracking-wider mb-2">Governor</p>
                <p className="text-slate-400 text-xs">→ Businesses, economy, and commercial affairs.</p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed font-medium pt-2 border-t border-slate-900">
              This allows every faction, gang, civilian organization, and business to receive proper leadership without one person having to manage everything directly.
            </p>
          </div>
        </div>

        {/* SIGNATURE SECTION (STATIC) */}
        <div className="pt-12 border-t border-slate-900/60 flex flex-col items-start pl-4 select-none">
          <style dangerouslySetInnerHTML={{__html: `
            @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
          `}} />
          
          <p 
            className="text-white text-3xl md:text-4xl font-normal tracking-wide mb-1" 
            style={{ 
              fontFamily: "'Dancing Script', cursive",
              textShadow: '0 0 8px rgba(255,255,255,0.2)'
            }}
          >
            Brian Gutierrez
          </p>
          <p 
            className="text-[#fbbf24] text-xs font-bold uppercase tracking-wider mb-2"
            style={{ textShadow: '0 0 10px rgba(251,191,36,0.3)' }}
          >
            President of the United States of Paraiso
          </p>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
            Office of the President
          </p>
        </div>

      </div>
    </div>
  );
};

export default ChainOfCommand;
