import { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import * as FaIcons from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const hexToRgba = (hexStr, alpha) => {
  if (!hexStr) return `rgba(34, 211, 238, ${alpha})`;
  const cleanHex = hexStr.replace('#', '');
  if (cleanHex.length !== 6) return `rgba(34, 211, 238, ${alpha})`;
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffRes, rolesRes] = await Promise.all([
          fetch(`${BASE_URL}/staff`, { credentials: 'include' }),
          fetch(`${BASE_URL}/staff-roles`, { credentials: 'include' })
        ]);
        const staffData = await staffRes.json();
        const rolesData = await rolesRes.json();

        setStaffList(Array.isArray(staffData) ? staffData : []);
        setRoles(Array.isArray(rolesData) ? rolesData : []);
      } catch (err) {
        console.error("Failed to load staff roster data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Render the selected React Icon from FontAwesome dynamically or raw emoji/character
  const renderRoleIcon = (iconName, color) => {
    if (FaIcons[iconName]) {
      const IconComponent = FaIcons[iconName];
      return <IconComponent style={{ color }} />;
    }
    return <span style={{ color }} className="font-sans text-2xl select-none">{iconName}</span>;
  };

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: 'linear-gradient(160deg, #050811 0%, #030b18 40%, #020710 100%)',
        fontFamily: "'Rajdhani', 'Orbitron', sans-serif",
      }}
    >
      {/* ── HERO HEADER ── */}
      <div
        className="w-full flex flex-col items-center justify-center pt-20 pb-8 px-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #030b18 0%, #051430 60%, #020710 100%)',
          borderBottom: '1px solid rgba(6,182,212,0.12)',
        }}
      >
        {/* Background glow orb */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Icon / Emblem */}
        <div
          className="w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center mb-6 relative"
          style={{
            background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(3,115,142,0.08) 100%)',
            border: '2px solid rgba(6,182,212,0.3)',
            boxShadow: '0 0 60px rgba(6,182,212,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <span className="text-5xl sm:text-6xl select-none text-cyan-400">🛡️</span>
          {/* Ring pulse */}
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              border: '1px solid rgba(6,182,212,0.15)',
              animationDuration: '3s',
            }}
          />
        </div>

        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-black tracking-widest uppercase text-center mb-2"
          style={{ color: '#06b6d4', letterSpacing: '0.15em', textShadow: '0 0 40px rgba(6,182,212,0.4)' }}
        >
          ADMINISTRATIVE ROSTER
        </h1>
        <div
          className="h-px w-32 my-3"
          style={{ background: 'linear-gradient(90deg, transparent, #06b6d4, transparent)' }}
        />
        <p className="text-sm sm:text-base tracking-wide text-center max-w-md" style={{ color: '#67e8f9' }}>
          Meet the official Paraiso Roleplay Staff Team.
        </p>

        {/* Corner brackets */}
        <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 hidden sm:block" style={{ borderColor: 'rgba(6,182,212,0.4)' }} />
        <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 hidden sm:block" style={{ borderColor: 'rgba(6,182,212,0.4)' }} />
        <div className="absolute bottom-0 left-8 w-8 h-8 border-b-2 border-l-2 hidden sm:block" style={{ borderColor: 'rgba(6,182,212,0.4)' }} />
        <div className="absolute bottom-0 right-8 w-8 h-8 border-b-2 border-r-2 hidden sm:block" style={{ borderColor: 'rgba(6,182,212,0.4)' }} />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(6,182,212,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.025) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 py-8 space-y-10">

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
               <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-sm font-semibold tracking-wider uppercase">Loading administrative roster...</p>
            </div>
          ) : roles.length === 0 ? (
            <div className="bg-[#121820]/50 border border-slate-800 border-dashed rounded-xl p-10 text-center">
              <p className="text-slate-500 italic text-sm">No departments or staff members are currently listed.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              {roles.map((role) => {
                const members = staffList.filter(member => member.category === role.name);
                const roleColor = role.color || '#22d3ee';
                const glowColor = hexToRgba(roleColor, 0.25);
                const borderColor = hexToRgba(roleColor, 0.4);

                return (
                  <div key={role.id}>
                    {/* Section Header */}
                    <div className="relative mb-6">
                      <div
                        className="h-px w-full mb-6 opacity-70"
                        style={{ background: `linear-gradient(90deg, transparent, ${roleColor}, transparent)` }}
                      />
                      <div className="flex items-center justify-center gap-4">
                        <div
                          className="hidden sm:block w-6 h-6 border-t-2 border-l-2 flex-shrink-0"
                          style={{ borderColor: roleColor }}
                        />
                        <div className="text-center">
                          <span className="text-lg mr-2 inline-block translate-y-[2px]">
                            {renderRoleIcon(role.icon_name, roleColor)}
                          </span>
                          <span
                            className="text-sm sm:text-base font-black tracking-[0.25em] uppercase"
                            style={{ color: roleColor, textShadow: `0 0 20px ${glowColor}` }}
                          >
                            {role.name}
                          </span>
                        </div>
                        <div
                          className="hidden sm:block w-6 h-6 border-t-2 border-r-2 flex-shrink-0"
                          style={{ borderColor: roleColor }}
                        />
                      </div>
                      <div
                        className="h-px w-full mt-6 opacity-70"
                        style={{ background: `linear-gradient(90deg, transparent, ${roleColor}, transparent)` }}
                      />
                    </div>

                    {/* Members Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {members.length === 0 ? (
                        <div
                          className="col-span-full py-8 text-center border border-dashed rounded-xl bg-slate-950/20"
                          style={{ borderColor: `${roleColor}44` }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full mx-auto mb-2 animate-pulse" style={{ backgroundColor: roleColor }} />
                          <p className="text-slate-500 text-xs uppercase tracking-widest font-black">
                            — NO ACTIVE STAFF ASSIGNED —
                          </p>
                          <p className="text-[10px] text-slate-600 mt-1 uppercase font-medium">
                            Status: Vacant
                          </p>
                        </div>
                      ) : (
                        members.map((staffMember, index) => {
                          const memberColor = staffMember.color || roleColor;
                          const memberGlow = hexToRgba(memberColor, 0.25);
                          const memberBorder = hexToRgba(memberColor, 0.4);

                          return (
                            <div
                              key={index}
                              className="relative group rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                              style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.2) 100%)',
                                border: `1px solid ${memberBorder}`,
                                boxShadow: `0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.04)`,
                              }}
                            >
                              {/* Glow on hover */}
                              <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
                                style={{ boxShadow: `inset 0 0 30px ${memberGlow}` }}
                              />

                              {/* Top accent bar */}
                              <div
                                className="h-[2px] w-full"
                                style={{ background: `linear-gradient(90deg, transparent, ${memberColor}, transparent)` }}
                              />

                              <div className="p-5 relative flex gap-4 items-center">
                                {/* Optional Avatar integration in HUD UI */}
                                {staffMember.image_url && (
                                  <div 
                                    className="w-14 h-14 rounded-full overflow-hidden border flex-shrink-0"
                                    style={{ borderColor: `${memberColor}40`, backgroundColor: '#0a0f14' }}
                                  >
                                    <img 
                                      src={staffMember.image_url} 
                                      alt={staffMember.name} 
                                      className="w-full h-full object-cover" 
                                    />
                                  </div>
                                )}

                                <div className="flex-1 min-w-0">
                                  {/* Title badge */}
                                  {staffMember.role && (
                                    <div
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-black uppercase tracking-[0.2em] mb-2.5"
                                      style={{
                                        color: memberColor,
                                        borderColor: `${memberColor}55`,
                                        backgroundColor: `${memberColor}11`,
                                        boxShadow: `0 0 10px ${memberColor}22`
                                      }}
                                    >
                                      {staffMember.role}
                                    </div>
                                  )}

                                  {/* Name */}
                                  <p
                                    className="text-base font-black tracking-wide mb-1 flex items-center gap-2"
                                    style={{
                                      color: staffMember.name_color || '#ffffff',
                                      textShadow: `0 0 12px ${staffMember.name_color ? `${staffMember.name_color}44` : 'rgba(255,255,255,0.15)'}`
                                    }}
                                  >
                                    {staffMember.name}
                                    {staffMember.country && (
                                      <img
                                        src={`https://flagcdn.com/24x18/${staffMember.country.toLowerCase()}.png`}
                                        alt={staffMember.country}
                                        className="w-5 h-auto rounded-[2px] opacity-90 shadow-sm inline-block"
                                        title={`Country: ${staffMember.country.toUpperCase()}`}
                                      />
                                    )}
                                  </p>

                                  {/* Active status */}
                                  <div className="mt-2.5 flex items-center gap-2">
                                    <div
                                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                                      style={{ backgroundColor: memberColor, boxShadow: `0 0 6px ${memberColor}` }}
                                    />
                                    <span
                                      className="text-[10px] uppercase tracking-widest font-bold"
                                      style={{ color: `${memberColor}99` }}
                                    >
                                      Active
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Bottom corner highlight */}
                              <div
                                className="absolute bottom-0 right-0 w-4 h-4 border-b border-r opacity-40"
                                style={{ borderColor: memberColor }}
                              />
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-24 text-center pt-8 pb-4">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
              <div
                className="w-2 h-2 rotate-45 border border-cyan-400/50"
                style={{ boxShadow: '0 0 8px rgba(6,182,212,0.4)' }}
              />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            </div>

            <p className="text-cyan-400 font-black uppercase tracking-[0.2em] text-xs sm:text-sm">
              This roster is maintained by the Management Team and is updated whenever staff changes occur.
            </p>

            <div className="flex items-center gap-4 mt-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
              <div
                className="w-2 h-2 rotate-45 border border-cyan-400/50"
                style={{ boxShadow: '0 0 8px rgba(6,182,212,0.4)' }}
              />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Staff;