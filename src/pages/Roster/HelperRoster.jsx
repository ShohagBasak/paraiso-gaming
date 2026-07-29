import React, { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const hexToRgba = (hexStr, alpha) => {
  if (!hexStr) return `rgba(52, 211, 153, ${alpha})`;
  const cleanHex = hexStr.replace('#', '');
  if (cleanHex.length !== 6) return `rgba(52, 211, 153, ${alpha})`;
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getSectionIcon = (sectionName) => {
  const lower = (sectionName || '').toLowerCase();
  if (lower.includes('senior') || lower.includes('lead')) return '⭐';
  if (lower.includes('head') || lower.includes('chief') || lower.includes('manager')) return '👑';
  if (lower.includes('support') || lower.includes('assist')) return '🤝';
  if (lower.includes('trial') || lower.includes('junior') || lower.includes('new')) return '🌱';
  if (lower.includes('mod') || lower.includes('staff')) return '🛡️';
  return '🤝';
};

const HelperRoster = () => {
  const [members, setMembers] = useState([]);
  const [sectionsList, setSectionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRosterData = () => {
    Promise.all([
      fetch(`${BASE_URL}/helper-roster/sections?_t=${Date.now()}`).then(r => r.json()),
      fetch(`${BASE_URL}/helper-roster?_t=${Date.now()}`).then(r => r.json()),
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
    const interval = setInterval(loadRosterData, 8000);
    const handleFocus = () => loadRosterData();
    window.addEventListener('focus', handleFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const memberSections = Array.from(new Set(members.map(m => m.section).filter(Boolean)));
  const allSectionNames = Array.from(new Set([
    ...sectionsList.map(s => s.name),
    ...memberSections,
  ]));

  const unifiedSections = allSectionNames.map(name => {
    const matchedSection = sectionsList.find(s => s.name.toUpperCase() === name.toUpperCase());
    const matchedMember = members.find(m => m.section.toUpperCase() === name.toUpperCase());
    return {
      name,
      sort_order: matchedSection ? matchedSection.sort_order : (matchedMember ? matchedMember.section_order : 999),
      color: matchedSection ? matchedSection.color : (matchedMember ? matchedMember.section_color : '#34d399'),
      icon: matchedSection ? matchedSection.icon : (matchedMember ? matchedMember.section_icon : null),
    };
  }).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: 'linear-gradient(160deg, #050811 0%, #020d0a 40%, #040d08 100%)',
        fontFamily: "'Rajdhani', 'Orbitron', sans-serif",
      }}
    >
      {/* ── HERO HEADER ── */}
      <div
        className="w-full flex flex-col items-center justify-center pt-30 pb-8 px-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #020d0a 0%, #051a12 60%, #040d08 100%)',
          borderBottom: '1px solid rgba(52,211,153,0.12)',
        }}
      >
        {/* Background glow orb */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(52,211,153,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Icon / Emblem */}
        <div
          className="w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center mb-6 relative"
          style={{
            background: 'linear-gradient(135deg, rgba(52,211,153,0.15) 0%, rgba(16,185,129,0.08) 100%)',
            border: '2px solid rgba(52,211,153,0.3)',
            boxShadow: '0 0 60px rgba(52,211,153,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <span className="text-5xl sm:text-6xl select-none">🤝</span>
          {/* Ring pulse */}
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              border: '1px solid rgba(52,211,153,0.15)',
              animationDuration: '3s',
            }}
          />
        </div>

        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-black tracking-widest uppercase text-center mb-2"
          style={{ color: '#34d399', letterSpacing: '0.15em', textShadow: '0 0 40px rgba(52,211,153,0.4)' }}
        >
          HELPER ROSTER
        </h1>
        <div
          className="h-px w-32 my-3"
          style={{ background: 'linear-gradient(90deg, transparent, #34d399, transparent)' }}
        />
        <p className="text-sm sm:text-base tracking-wide text-center max-w-md" style={{ color: '#6ee7b7' }}>
          Official Helper Team Directory
        </p>

        {/* Corner brackets */}
        <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 hidden sm:block" style={{ borderColor: 'rgba(52,211,153,0.4)' }} />
        <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 hidden sm:block" style={{ borderColor: 'rgba(52,211,153,0.4)' }} />
        <div className="absolute bottom-0 left-8 w-8 h-8 border-b-2 border-l-2 hidden sm:block" style={{ borderColor: 'rgba(52,211,153,0.4)' }} />
        <div className="absolute bottom-0 right-8 w-8 h-8 border-b-2 border-r-2 hidden sm:block" style={{ borderColor: 'rgba(52,211,153,0.4)' }} />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(52,211,153,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.025) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 py-8 space-y-10">

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div
                className="w-14 h-14 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'rgba(52,211,153,0.3)', borderTopColor: 'transparent' }}
              />
              <p className="text-emerald-500/60 text-xs uppercase tracking-widest font-bold animate-pulse">
                Loading Helper Roster...
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
              No helper roster data found.
            </div>
          )}

          {/* SECTIONS */}
          {!loading && unifiedSections.map((sec) => {
            const sectionMembers = members.filter(m => m.section.toUpperCase() === sec.name.toUpperCase());
            const sectionColor = sec.color || '#34d399';

            const cfg = {
              accent: sectionColor,
              glow: hexToRgba(sectionColor, 0.25),
              border: hexToRgba(sectionColor, 0.4),
              hex: sectionColor,
              icon: sec.icon || getSectionIcon(sec.name),
            };

            return (
              <div key={sec.name}>
                {/* Section Header */}
                <div className="relative mb-6">
                  <div
                    className="h-px w-full mb-6 opacity-70"
                    style={{ background: `linear-gradient(90deg, transparent, ${cfg.hex}, transparent)` }}
                  />
                  <div className="flex items-center justify-center gap-4">
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
                    <div
                      className="col-span-full py-8 text-center border border-dashed rounded-xl bg-slate-950/20"
                      style={{ borderColor: `${cfg.hex}44` }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full mx-auto mb-2 animate-pulse" style={{ backgroundColor: cfg.hex }} />
                      <p className="text-slate-500 text-xs uppercase tracking-widest font-black">
                        — NO ACTIVE HELPERS ASSIGNED —
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
                                boxShadow: `0 0 10px ${member.color || cfg.hex}22`,
                              }}
                            >
                              {member.title}
                            </div>

                            {/* Name */}
                            <p
                              className="text-base font-black tracking-wide mb-1 flex items-center gap-2"
                              style={{
                                color: isVacant ? '#fbbf24' : (member.name_color || '#ffffff'),
                                textShadow: isVacant
                                  ? '0 0 12px rgba(251,191,36,0.5)'
                                  : `0 0 12px ${member.name_color || 'rgba(255,255,255,0.15)'}`,
                              }}
                            >
                              {isVacant ? '— VACANT —' : member.name}
                              {!isVacant && member.country && (
                                <img
                                  src={`https://flagcdn.com/24x18/${member.country.toLowerCase()}.png`}
                                  alt={member.country}
                                  className="w-5 h-auto rounded-[2px] opacity-90 shadow-sm inline-block"
                                  title={`Country: ${member.country.toUpperCase()}`}
                                />
                              )}
                            </p>

                            {/* Description */}
                            {member.description && (
                              <p
                                className="text-xs leading-relaxed whitespace-pre-line"
                                style={{ color: 'rgba(203,213,225,0.65)' }}
                              >
                                {member.description}
                              </p>
                            )}

                            {/* Status indicator */}
                            {isVacant ? (
                              <div className="mt-3 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60 animate-pulse" />
                                <span className="text-[10px] text-yellow-400/60 uppercase tracking-widest font-bold">
                                  Position Open
                                </span>
                              </div>
                            ) : (
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
                    })
                  )}
                </div>
              </div>
            );
          })}

          {/* Footer */}
          {!loading && unifiedSections.length > 0 && (
            <div className="text-center pt-8 pb-4">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                <div
                  className="w-2 h-2 rotate-45 border border-emerald-400/50"
                  style={{ boxShadow: '0 0 8px rgba(52,211,153,0.4)' }}
                />
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
              </div>

              <p
                className="text-sm sm:text-base font-black tracking-[0.2em] uppercase"
                style={{
                  color: '#34d399',
                  textShadow: '0 0 30px rgba(52,211,153,0.5)',
                  letterSpacing: '0.2em',
                }}
              >
                "Serving the Community. Every Day."
              </p>

              <div className="flex items-center gap-4 mt-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                <div
                  className="w-2 h-2 rotate-45 border border-emerald-400/50"
                  style={{ boxShadow: '0 0 8px rgba(52,211,153,0.4)' }}
                />
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelperRoster;
