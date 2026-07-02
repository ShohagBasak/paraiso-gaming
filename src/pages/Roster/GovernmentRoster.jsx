import React, { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper to convert hex to rgba for glow and border effects
const hexToRgba = (hexStr, alpha) => {
  if (!hexStr) return `rgba(34, 211, 238, ${alpha})`;
  const cleanHex = hexStr.replace('#', '');
  // fallback if hex is invalid length
  if (cleanHex.length !== 6) return `rgba(34, 211, 238, ${alpha})`;
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Helper to determine faction icon based on keywords
const getSectionIcon = (sectionName) => {
  const lower = (sectionName || '').toLowerCase();
  if (lower.includes('government')) return '🏛️';
  if (lower.includes('law') || lower.includes('police') || lower.includes('emergency') || lower.includes('medical') || lower.includes('service') || lower.includes('fmd')) return '🛡️';
  if (lower.includes('agency') || lower.includes('agencies') || lower.includes('fbi') || lower.includes('cia')) return '📡';
  return '⚙️';
};

const GovernmentRoster = () => {
  const [members, setMembers] = useState([]);
  const [sectionsList, setSectionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRosterData = () => {
    Promise.all([
      fetch(`${BASE_URL}/roster/sections?_t=${Date.now()}`).then(r => r.json()),
      fetch(`${BASE_URL}/roster?_t=${Date.now()}`).then(r => r.json())
    ])
      .then(([sectionsData, membersData]) => {
        setSectionsList(Array.isArray(sectionsData) ? sectionsData : []);
        setMembers(Array.isArray(membersData) ? membersData : []);
        setLoading(false);
      })
      .catch(() => { setError('Failed to load roster.'); setLoading(false); });
  };

  useEffect(() => {
    loadRosterData();

    // Poll for new data every 8 seconds for a real-time feel
    const interval = setInterval(loadRosterData, 8000);

    // Refresh when the user switches tabs back to the roster page
    const handleFocus = () => {
      loadRosterData();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Get all unique section names from members
  const memberSections = Array.from(new Set(members.map(m => m.section).filter(Boolean)));
  
  // Combine sectionsList names and member sections names to avoid hiding any data
  const allSectionNames = Array.from(new Set([
    ...sectionsList.map(s => s.name),
    ...memberSections
  ]));

  // Build unified sections configuration with order, color & icon
  const unifiedSections = allSectionNames.map(name => {
    const matchedSection = sectionsList.find(s => s.name.toUpperCase() === name.toUpperCase());
    const matchedMember = members.find(m => m.section.toUpperCase() === name.toUpperCase());
    
    return {
      name,
      sort_order: matchedSection ? matchedSection.sort_order : (matchedMember ? matchedMember.section_order : 999),
      color: matchedSection ? matchedSection.color : (matchedMember ? matchedMember.section_color : '#22d3ee'),
      icon: matchedSection ? matchedSection.icon : (matchedMember ? matchedMember.section_icon : null)
    };
  }).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: 'linear-gradient(160deg, #050811 0%, #0a0f1e 40%, #080d18 100%)',
        fontFamily: "'Rajdhani', 'Orbitron', sans-serif",
      }}
    >
      {/* ── HERO HEADER (unchanged, kept as is) ── */}
      <div
        className="w-full flex flex-col items-center justify-center pt-20 pb-8 px-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0a0f1e 0%, #0d1526 60%, #080d18 100%)',
          borderBottom: '1px solid rgba(34,211,238,0.12)',
        }}
      >
        <img
          src="https://i.imgur.com/YfVF1d0.png"
          alt="The Great Seal of the United States of Paraiso"
          className="w-40 h-40 sm:w-52 sm:h-52 object-contain mb-6 drop-shadow-2xl"
        />
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-black tracking-widest uppercase text-center mb-2"
          style={{ color: '#c9a84c', letterSpacing: '0.15em' }}
        >
          THE UNITED STATES OF PARAISO
        </h1>
        <p className="text-sm sm:text-base tracking-wide" style={{ color: '#b9bbbe' }}>
          Official Government Directory
        </p>
      </div>

      {/* ── GAMING CONTENT ── */}
      <div className="relative">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 py-8 space-y-10">

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div
                className="w-14 h-14 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'rgba(34,211,238,0.3)', borderTopColor: 'transparent' }}
              />
              <p className="text-cyan-500/60 text-xs uppercase tracking-widest font-bold animate-pulse">
                Loading Roster Data...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-10 text-red-400 text-sm">{error}</div>
          )}

          {/* Empty */}
          {!loading && !error && unifiedSections.length === 0 && (
            <div className="text-center py-20 text-slate-600 text-sm uppercase tracking-widest">
              No roster data found.
            </div>
          )}

          {/* SECTIONS */}
          {!loading && unifiedSections.map((sec) => {
            const sectionMembers = members.filter(m => m.section.toUpperCase() === sec.name.toUpperCase());
            const sectionColor = sec.color || '#22d3ee';

            const cfg = {
              accent: sectionColor,
              glow: hexToRgba(sectionColor, 0.25),
              border: hexToRgba(sectionColor, 0.45),
              hex: sectionColor,
              icon: sec.icon || getSectionIcon(sec.name),
            };

            return (
              <div key={sec.name}>
                {/* Section Header */}
                <div className="relative mb-6">
                  {/* Top bar */}
                  <div 
                    className="h-px w-full mb-6 opacity-70"
                    style={{ background: `linear-gradient(90deg, transparent, ${cfg.hex}, transparent)` }}
                  />

                  <div className="flex items-center justify-center gap-4">
                    {/* Left corner bracket */}
                    <div
                      className="hidden sm:block w-6 h-6 border-t-2 border-l-2 flex-shrink-0"
                      style={{ borderColor: cfg.hex }}
                    />

                    <div className="text-center">
                      <span className="text-lg mr-2">{cfg.icon}</span>
                      <span
                        className="text-sm sm:text-base font-black tracking-[0.25em] uppercase"
                        style={{ color: cfg.hex, textShadow: `0 0 20px ${cfg.glow}` }}
                      >
                        {sec.name}
                      </span>
                    </div>

                    {/* Right corner bracket */}
                    <div
                      className="hidden sm:block w-6 h-6 border-t-2 border-r-2 flex-shrink-0"
                      style={{ borderColor: cfg.hex }}
                    />
                  </div>

                  <div 
                    className="h-px w-full mt-6 opacity-70"
                    style={{ background: `linear-gradient(90deg, transparent, ${cfg.hex}, transparent)` }}
                  />
                </div>

                {/* Member Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sectionMembers.length === 0 ? (
                    <div className="col-span-full py-8 text-center border border-dashed border-slate-805/30 rounded-xl bg-slate-950/20" style={{ borderColor: `${cfg.hex}44` }}>
                      <div className="w-1.5 h-1.5 rounded-full mx-auto mb-2 animate-pulse" style={{ backgroundColor: cfg.hex }} />
                      <p className="text-slate-500 text-xs uppercase tracking-widest font-black">
                        — NO ACTIVE PERSONNEL ASSIGNED —
                      </p>
                      <p className="text-[10px] text-slate-600 mt-1 uppercase font-medium">
                        Status: Operational / Vacant
                      </p>
                    </div>
                  ) : (
                    sectionMembers.map(member => {
                      const isVacant = !member.name || member.name === 'Vacant';
                      
                      return (
                        <div
                          key={member.id}
                          className="relative group rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.2) 100%)',
                            border: `1px solid ${cfg.border}`,
                            boxShadow: `0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.04)`,
                          }}
                        >
                          {/* Glow on hover */}
                          <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
                            style={{ boxShadow: `inset 0 0 30px ${cfg.glow}` }}
                          />

                          {/* Top accent bar */}
                          <div
                            className="h-[2px] w-full"
                            style={{ background: `linear-gradient(90deg, transparent, ${cfg.hex}, transparent)` }}
                          />

                          <div className="p-5 relative">
                            {/* Title badge */}
                            <div
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-black uppercase tracking-[0.2em] mb-3"
                              style={{ 
                                color: member.color || cfg.hex, 
                                borderColor: `${member.color || cfg.hex}55`, 
                                backgroundColor: `${member.color || cfg.hex}11`,
                                boxShadow: `0 0 10px ${member.color || cfg.hex}22` 
                              }}
                            >
                              {member.title}
                            </div>

                            {/* Name */}
                            <p
                              className="text-base font-black tracking-wide mb-1"
                              style={{
                                color: isVacant ? '#fbbf24' : (member.color || '#ffffff'),
                                textShadow: isVacant
                                  ? '0 0 12px rgba(251,191,36,0.5)'
                                  : `0 0 12px ${member.color || 'rgba(255,255,255,0.15)'}`,
                              }}
                            >
                              {isVacant ? '— VACANT —' : member.name}
                            </p>

                          {/* Description */}
                          {member.description && (
                            <p
                              className="text-xs leading-relaxed"
                              style={{ color: 'rgba(203,213,225,0.65)' }}
                            >
                              {member.description}
                            </p>
                          )}

                          {/* Vacant indicator */}
                          {isVacant && (
                            <div
                              className="mt-3 flex items-center gap-2"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60 animate-pulse" />
                              <span className="text-[10px] text-yellow-400/60 uppercase tracking-widest font-bold">
                                Position Open
                              </span>
                            </div>
                          )}

                          {/* Active indicator */}
                          {!isVacant && (
                            <div className="mt-3 flex items-center gap-2">
                              <div
                                className="w-1.5 h-1.5 rounded-full animate-pulse"
                                style={{ backgroundColor: cfg.hex, boxShadow: `0 0 6px ${cfg.hex}` }}
                              />
                              <span
                                className="text-[10px] uppercase tracking-widest font-bold"
                                style={{ color: `${cfg.hex}99` }}
                              >
                                Active
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Bottom corner */}
                        <div
                          className="absolute bottom-0 right-0 w-4 h-4 border-b border-r opacity-40"
                          style={{ borderColor: cfg.hex }}
                        />
                      </div>
                    );
                  }))}
                </div>
              </div>
            );
          })}

          {/* Footer Quote */}
          {!loading && unifiedSections.length > 0 && (
            <div className="text-center pt-8 pb-4">
              {/* Decorative HUD line */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                <div
                  className="w-2 h-2 rotate-45 border border-cyan-400/50"
                  style={{ boxShadow: '0 0 8px rgba(34,211,238,0.4)' }}
                />
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
              </div>

              <p
                className="text-sm sm:text-base font-black tracking-[0.2em] uppercase"
                style={{
                  color: '#c9a84c',
                  textShadow: '0 0 30px rgba(201,168,76,0.5)',
                  letterSpacing: '0.2em',
                }}
              >
                "One Nation. One Government. One Paraiso."
              </p>

              <div className="flex items-center gap-4 mt-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                <div
                  className="w-2 h-2 rotate-45 border border-cyan-400/50"
                  style={{ boxShadow: '0 0 8px rgba(34,211,238,0.4)' }}
                />
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GovernmentRoster;
