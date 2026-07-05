import { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ChainOfCommand = () => {
  const [categories, setCategories] = useState([]);
  const [cocList, setCocList] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultCategories = [
    { id: 1, name: 'Executive Leadership', sort_order: 0 },
    { id: 2, name: 'Executive Departments', sort_order: 1 }
  ];

  const defaultCards = [
    {
      id: 1,
      category_id: 1,
      layout: 'simple',
      title: 'President',
      description: 'The highest-ranking official within the Government of Paraiso. The President sets the overall vision of the community and has final authority over major decisions, appointments, and policies.',
      color: '#c9a84c'
    },
    {
      id: 2,
      category_id: 1,
      layout: 'simple',
      title: 'Vice President',
      description: 'The second-highest executive official. The Vice President assists the President with government operations and acts on behalf of the President when necessary.',
      color: '#94a3b8'
    },
    {
      id: 3,
      category_id: 2,
      layout: 'detailed',
      title: 'Secretary of Defense',
      subtitle: 'Oversees all law enforcement and emergency service departments.',
      reports: [
        {
          "group_title": "Admin Personnel",
          "items": ["Helper Management"]
        },
        {
          "group_title": "Faction Management",
          "items": ["Paraiso Police Department", "Federal Bureau of Investigation", "Paraiso Fire & Medical Department", "National Guard", "San Andreas News"]
        }
      ],
      footer: 'Admin Personnel assists the Secretary of Defense in keeping Government employees on the right track. This includes professionalism, honor & loyalty. Aswel as issuing any punishments if any Government employees break the rules and or laws. Faction Management assists faction leaders, monitors activity, reviews department performance, and reports directly to the Secretary of Defense.',
      color: '#22d3ee'
    },
    {
      id: 4,
      category_id: 2,
      layout: 'detailed',
      title: 'Secretary of State',
      subtitle: 'Oversees all civilian and criminal organizations operating throughout Paraiso.',
      reports: [
        {
          "group_title": "Gang Management",
          "items": ["All Official Criminal Organizations"]
        },
        {
          "group_title": "Civilian Management",
          "items": ["Paraiso News", "Taxi Services", "Future Civilian Organizations"]
        }
      ],
      footer: 'Gang Management works with gang leaders, their applications, and reports directly to the Secretary of State.',
      color: '#22d3ee'
    },
    {
      id: 5,
      category_id: 2,
      layout: 'detailed',
      title: 'Governor of Economic & Development',
      subtitle: 'Oversees the economic development of Paraiso, including businesses, commercial enterprises, and economic affairs.',
      reports: [
        {
          "group_title": "Business Management",
          "items": ["Business Applications", "Ownership Transfers", "Commercial Disputes", "Business Owner Support"]
        }
      ],
      footer: 'Business Management handles the daily business process while the Governor oversees the overall economy and commercial growth of Paraiso.',
      color: '#22d3ee'
    },
    {
      id: 6,
      category_id: 2,
      layout: 'detailed',
      title: 'Governor of City Relations',
      subtitle: 'Oversees the City relations of Paraiso, including complaints, appeals, and city helper organisations.',
      reports: [
        {
          "group_title": "Community Management",
          "items": ["Ban Appeals", "Warning Appeals", "Complaints"]
        },
        {
          "group_title": "Helper Management",
          "items": ["Helper Applications", "Helper Complaints"]
        }
      ],
      footer: 'Community Management handles the daily community issues and appeals. Helper Management handles the daily tasks and management of all Helper employees, while the Governor oversees the overall relations between the Government & Citizens.',
      color: '#22d3ee'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await fetch(`${BASE_URL}/chain-of-command/categories`);
        const cocRes = await fetch(`${BASE_URL}/chain-of-command`);

        if (catRes.ok && cocRes.ok) {
          const catData = await catRes.json();
          const cocData = await cocRes.json();

          if (Array.isArray(catData) && catData.length > 0) {
            setCategories(catData);
            const processedList = Array.isArray(cocData) ? cocData.map(item => {
              let parsedReports = null;
              if (item.reports) {
                try {
                  parsedReports = typeof item.reports === 'string' ? JSON.parse(item.reports) : item.reports;
                } catch (e) {
                  parsedReports = item.reports;
                }
              }
              return { ...item, reports: parsedReports };
            }) : [];
            setCocList(processedList);
            return;
          }
        }
      } catch (err) {
        console.error("Error fetching dynamic CoC, falling back to static defaults:", err);
      } finally {
        setLoading(false);
      }
      setCategories(defaultCategories);
      setCocList(defaultCards);
    };

    fetchData();
  }, []);

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

        {/* DYNAMIC CATEGORY SECTIONS */}
        {categories.map((category) => {
          const cards = cocList.filter(c => c.category_id === category.id);
          if (cards.length === 0) return null;

          const simpleCards = cards.filter(c => c.layout === 'simple');
          const detailedCards = cards.filter(c => c.layout === 'detailed');

          const isLeadership = category.name.toLowerCase().includes('leadership') || category.id === 1;
          const sectionThemeColor = isLeadership ? '#c9a84c' : '#22d3ee';
          const titleShadow = isLeadership ? 'rgba(201,168,76,0.2)' : 'rgba(34,211,238,0.2)';

          return (
            <div key={category.id} className="space-y-6">
              {/* Category Header */}
              <div className="relative flex items-center gap-4 py-2">
                <div 
                  className="h-px flex-1" 
                  style={{ background: `linear-gradient(to right, transparent, ${sectionThemeColor}33, ${sectionThemeColor}80)` }} 
                />
                <h3 
                  className="text-base sm:text-lg font-black uppercase tracking-[0.25em] whitespace-nowrap"
                  style={{ color: sectionThemeColor, textShadow: `0 0 12px ${titleShadow}` }}
                >
                  {category.name}
                </h3>
                <div 
                  className="h-px flex-1" 
                  style={{ background: `linear-gradient(to left, transparent, ${sectionThemeColor}33, ${sectionThemeColor}80)` }} 
                />
              </div>

              {/* Simple layout grid */}
              {simpleCards.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {simpleCards.map((card) => {
                    const cardColor = card.color || sectionThemeColor;
                    return (
                      <div 
                        key={card.id}
                        className="border rounded-2xl p-6 relative overflow-hidden"
                        style={{
                          borderColor: cardColor + '4d', // 30% opacity
                          background: '#0b0f15'
                        }}
                      >
                        <div className="absolute top-0 left-0 w-full h-[2px]" style={{ backgroundColor: cardColor, opacity: 0.6 }} />
                        <h4 className="text-base sm:text-lg font-black uppercase tracking-wider mb-3" style={{ color: cardColor }}>
                          {card.title}
                        </h4>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                          {card.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Detailed layout list */}
              {detailedCards.length > 0 && (
                <div className="space-y-8">
                  {detailedCards.map((card) => {
                    const cardColor = card.color || sectionThemeColor;
                    const reportsArray = Array.isArray(card.reports) ? card.reports : [];

                    return (
                      <div key={card.id} className="border border-slate-900 rounded-3xl p-6 sm:p-8 bg-[#0b0f15] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[2px]" style={{ backgroundColor: cardColor, opacity: 0.4 }} />
                        <h4 className="text-lg font-black uppercase tracking-wider mb-2" style={{ color: cardColor }}>
                          {card.title}
                        </h4>
                        {card.subtitle && (
                          <p className="text-slate-300 text-sm leading-relaxed mb-6 font-semibold">
                            {card.subtitle}
                          </p>
                        )}

                        {/* Reports Section */}
                        {reportsArray.length > 0 && (
                          <div className="bg-[#080d13] border border-slate-800/80 rounded-2xl p-5 space-y-4">
                            <p className="text-xs uppercase tracking-wider font-black border-b border-slate-800 pb-2" style={{ color: cardColor + 'd9' }}>
                              Reports Under {card.title}:
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {reportsArray.map((group, idx) => (
                                <div key={idx} className="space-y-2">
                                  <p className="text-slate-200 text-xs font-bold uppercase tracking-wider">
                                    {group.group_title}
                                  </p>
                                  <div className="space-y-2 pl-2">
                                    {Array.isArray(group.items) && group.items.map((item, itemIdx) => (
                                      <div key={itemIdx} className="flex items-start gap-2.5">
                                        <span 
                                          className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" 
                                          style={{ 
                                            backgroundColor: cardColor, 
                                            boxShadow: `0 0 8px ${cardColor}` 
                                          }} 
                                        />
                                        <span className="text-slate-300 text-xs sm:text-sm font-medium tracking-wide">
                                          {item}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {card.footer && (
                              <div className="pt-3 border-t border-slate-800/60 text-slate-400 text-xs leading-relaxed font-medium">
                                {card.footer}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* WHY THIS SYSTEM EXISTS */}
        <div className="space-y-4">
          <div className="relative flex items-center gap-4 py-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-cyan-500/50" />
            <h3 className="text-base sm:text-lg font-black uppercase tracking-[0.25em] text-[#c9a84c] whitespace-nowrap">
              Why This System Exists
            </h3>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-cyan-500/20 to-cyan-500/50" />
          </div>

          <div className="bg-[#0b0f15] border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-6">
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-semibold">
              Each executive position oversees a specific area of the server:
            </p>
            
            <div className="space-y-4">
              {/* President */}
              <div className="p-5 rounded-2xl bg-[#070b10] border border-slate-900/80">
                <p className="text-[#c9a84c] text-xs sm:text-sm font-black uppercase tracking-wider mb-1">President</p>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  <span className="text-slate-500 mr-1.5 font-bold">→</span>
                  The highest-ranking official within the Government of Paraiso. The President sets the overall vision of the community and has final authority over major decisions, appointments, and policies.
                </p>
              </div>

              {/* Vice President */}
              <div className="p-5 rounded-2xl bg-[#070b10] border border-slate-900/80">
                <p className="text-[#94a3b8] text-xs sm:text-sm font-black uppercase tracking-wider mb-1">Vice President</p>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  <span className="text-slate-500 mr-1.5 font-bold">→</span>
                  The second-highest executive official. The Vice President assists the President with government operations and acts on behalf of the President when necessary.
                </p>
              </div>

              {/* Secretary of Defense */}
              <div className="p-5 rounded-2xl bg-[#070b10] border border-slate-900/80">
                <p className="text-[#22d3ee] text-xs sm:text-sm font-black uppercase tracking-wider mb-1">Secretary of Defense</p>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  <span className="text-slate-500 mr-1.5 font-bold">→</span>
                  Government factions and emergency services.
                </p>
              </div>

              {/* Secretary of State */}
              <div className="p-5 rounded-2xl bg-[#070b10] border border-slate-900/80">
                <p className="text-[#fbbf24] text-xs sm:text-sm font-black uppercase tracking-wider mb-1">Secretary of State</p>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  <span className="text-slate-500 mr-1.5 font-bold">→</span>
                  All criminal organizations.
                </p>
              </div>

              {/* Governor */}
              <div className="p-5 rounded-2xl bg-[#070b10] border border-slate-900/80">
                <p className="text-[#10b981] text-xs sm:text-sm font-black uppercase tracking-wider mb-1">Governor</p>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  <span className="text-slate-500 mr-1.5 font-bold">→</span>
                  Businesses, economy, and commercial affairs.
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium pt-4 border-t border-slate-900/80">
              This allows every faction, gang, and business organizations to receive proper leadership without one person having to manage everything directly.
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
