import React, { useState, useEffect, useRef } from 'react';
import { 
  FiDollarSign, FiBox, FiCrosshair, FiClock, 
  FiShield, FiUser, FiTruck, FiTool, FiZap, FiSearch,
  FiBriefcase, FiGrid, FiCompass, FiActivity, FiUsers, FiTrendingUp
} from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const categoriesList = [
  {
    group: 'Players',
    items: [
      { id: 'wealth', label: 'Money', icon: FiDollarSign, unit: '$' },
      { id: 'materials', label: 'Materials', icon: FiBox, unit: 'Mats' },
      { id: 'kills', label: 'Top Kills', icon: FiCrosshair, unit: 'Kills' },
      { id: 'hours', label: 'Playing Hours', icon: FiClock, unit: 'Hrs' },
      { id: 'arrests', label: 'Crime & Arrests', icon: FiShield, unit: 'Arrests' },
    ]
  },

  {
    group: 'Factions & Gangs',
    items: [
      { id: 'factions-roster', label: 'Most Members', icon: FiUsers, unit: 'Members' },
      { id: 'factions-wealth', label: 'Most Wealth', icon: FiTrendingUp, unit: '$' },
    ]
  },
  {
    group: 'Jobs',
    items: [
      { id: 'detective', label: 'Detective', icon: FiSearch, unit: '' },
      { id: 'lawyer', label: 'Lawyer', icon: FiBriefcase, unit: '' },
      { id: 'prostitute', label: 'Whore', icon: FiActivity, unit: 'Times' },
      { id: 'drugs', label: 'Drug Dealer', icon: FiZap, unit: '' },
      { id: 'smuggler', label: 'Drug Smuggler', icon: FiCompass, unit: '' },
      { id: 'arms', label: 'Arms Dealer', icon: FiCrosshair, unit: '' },
      { id: 'mechanic', label: 'Mechanic', icon: FiTool, unit: '' },
      { id: 'boxing', label: 'Boxing', icon: FiZap, unit: '' },
      { id: 'fishing', label: 'Fishing', icon: FiActivity, unit: '' },
      { id: 'trucker', label: 'Trucker', icon: FiTruck, unit: '' },
      { id: 'carjacker', label: 'Carjacker', icon: FiGrid, unit: '' },
    ]
  }
];

const Highscores = () => {
  const getInitialCategory = () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const catUrl = urlParams.get('category');
      if (catUrl) return catUrl;
      const catStorage = localStorage.getItem('highscores_active_category');
      if (catStorage) return catStorage;
    } catch (e) {
      console.error(e);
    }
    return 'wealth';
  };

  const [activeCategory, setActiveCategory] = useState(getInitialCategory);
  const [highscores, setHighscores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('category', catId);
      window.history.pushState({}, '', url.toString());
      localStorage.setItem('highscores_active_category', catId);
    } catch (e) {
      console.error(e);
    }
  };

  const activeCategoryObj = categoriesList
    .flatMap(g => g.items)
    .find(c => c.id === activeCategory) || categoriesList[0].items[0];

  const HeaderIcon = activeCategoryObj?.icon || FiDollarSign;

  const cacheRef = useRef({});

  useEffect(() => {
    // If cached in memory and non-empty, display immediately
    if (cacheRef.current[activeCategory] && cacheRef.current[activeCategory].length > 0) {
      setHighscores(cacheRef.current[activeCategory]);
      setLoading(false);
    } else {
      setLoading(true);
    }

    const fetchHighscores = async () => {
      try {
        setErrorMsg('');
        const res = await fetch(`${API_BASE_URL}/api/highscores?category=${activeCategory}`);
        if (res.ok) {
          const data = await res.json();
          if (data.highscores && data.highscores.length > 0) {
            cacheRef.current[activeCategory] = data.highscores;
          }
          setHighscores(data.highscores || []);
        } else {
          if (!cacheRef.current[activeCategory]) {
            setHighscores([]);
            setErrorMsg('Failed to retrieve rankings from server.');
          }
        }
      } catch (err) {
        console.error("Failed to load highscores:", err);
        if (!cacheRef.current[activeCategory]) {
          setHighscores([]);
          setErrorMsg('Server or Database connection issue.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHighscores();

    const interval = setInterval(() => {
      fetchHighscores();
    }, 300000);

    return () => clearInterval(interval);
  }, [activeCategory]);

  const filteredHighscores = highscores.filter(item => {
    const name = item.username || item.name || '';
    const lower = name.toLowerCase();
    if (lower.includes('hitman') || lower === 'brian_gutierrez') return false;
    return lower.includes(searchTerm.toLowerCase());
  });

  const formatVal = (val, unit) => {
    if (typeof val !== 'number') return val;
    if (unit === '$') {
      return `$${val.toLocaleString()}`;
    }
    if (!unit || unit === 'Level') {
      return val.toLocaleString();
    }
    return `${val.toLocaleString()} ${unit}`;
  };

  return (
    <div className="min-h-screen bg-[#070b0e] text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-cyan-500 selection:text-black">
      
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-2/3 right-10 w-[500px] h-[300px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-10">

        {/* ── Page Header ── */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-mono">
            PARAISO GAMING <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">HIGHSCORES</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono leading-relaxed">
            Welcome to <span className="text-cyan-400 font-bold">Paraiso Roleplay</span> Highscores page. Live player statistics gathered directly from our SA-MP server (<span className="text-slate-300 font-bold">samp.pgaming.net:7777</span>). Statistics are updated automatically every 5 minutes.
          </p>
        </div>

        {/* ── Main Layout: Sidebar & Content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Category Navigation Drawer */}
          <div className="lg:col-span-4 bg-[#0d131a]/90 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
              <span className="text-xs font-black uppercase text-cyan-400 font-mono tracking-wider">Categories</span>
              <span className="text-[11px] text-slate-500 font-mono">Select Category</span>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
              {categoriesList.map((group, gIdx) => (
                <div key={gIdx} className="space-y-2">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest font-mono px-3">
                    {group.group}
                  </h3>
                  <div className="space-y-1">
                    {group.items.map(item => {
                      const IconComp = item.icon;
                      const isSelected = activeCategory === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleCategorySelect(item.id)}
                          className={`w-full cursor-pointer flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                            isSelected
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 scale-[1.01]'
                              : 'text-slate-400 hover:text-white hover:bg-[#121922]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <IconComp className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-cyan-400'}`} />
                            <span>{item.label}</span>
                          </div>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${isSelected ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'}`}>
                            {item.unit}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Leaderboard Display */}
          <div className="lg:col-span-8">

            {/* ── Single Merged Card Container ── */}
            <div className="bg-[#0d131a]/90 border border-slate-800 rounded-3xl shadow-xl overflow-hidden backdrop-blur-xl">
              
              {/* Category Title Header */}
              <div className="p-5 sm:p-6 border-b border-slate-800/80 bg-[#0b1016]/60">
                <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2 font-mono">
                  <HeaderIcon className="w-5 h-5 text-cyan-400" />
                  <span>{activeCategoryObj.label} Leaderboard</span>
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  Top 20 rankings sorted by {activeCategoryObj.label}
                </p>
              </div>

              {loading ? (
                <div className="py-20 text-center">
                  <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : filteredHighscores.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0b1016] text-slate-400 uppercase text-[10px] tracking-wider font-extrabold border-b border-slate-800">
                      <tr>
                        <th className="py-4 px-6">Rank</th>
                        <th className="py-4 px-6">
                          {activeCategory === 'crimes' ? 'Crime' : activeCategory === 'cars' ? 'Model' : activeCategory === 'factions-roster' || activeCategory === 'factions-wealth' ? 'Gang / Faction' : activeCategory === 'kills' || activeCategory === 'arrests' || activeCategory === 'lawyer' || activeCategory === 'detective' || activeCategory === 'arms' || activeCategory === 'mechanic' || activeCategory === 'boxing' || activeCategory === 'fishing' || activeCategory === 'trucker' || activeCategory === 'carjacker' || activeCategory === 'hours' || activeCategory === 'wealth' || activeCategory === 'materials' ? 'Username' : 'Player / Model'}
                        </th>
                        {activeCategory === 'arrests' ? (
                          <>
                            <th className="py-4 px-6 text-center">Crimes</th>
                            <th className="py-4 px-6 text-center">Arrests</th>
                          </>
                        ) : (
                          <th className="py-4 px-6 text-right">
                            {activeCategory === 'wealth' ? 'Total Wealth' : activeCategory === 'materials' ? 'Materials' : activeCategory === 'hours' ? 'Playing Hours' : activeCategory === 'crimes' || activeCategory === 'cars' ? 'Amount' : activeCategory === 'factions-roster' ? 'Number' : activeCategory === 'kills' ? 'Kills' : activeCategory === 'lawyer' ? 'Freed' : activeCategory === 'detective' ? 'Found' : activeCategory === 'arms' ? 'Guns Made' : activeCategory === 'mechanic' ? 'Repaired' : activeCategory === 'boxing' ? 'Fights Won' : activeCategory === 'fishing' ? 'Fishes Caught' : activeCategory === 'trucker' ? 'Delivered' : activeCategory === 'carjacker' ? 'Car Sold' : 'Score / Value'}
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {filteredHighscores.map((item, idx) => {
                        const rank = idx + 1;
                        const name = item.username || item.name || 'Unknown';
                        return (
                          <tr key={item.id || idx} className="hover:bg-slate-800/40 transition-colors">
                            {/* Rank */}
                            <td className="py-4 px-6 font-mono font-black text-sm">
                              {rank === 1 ? (
                                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">#1</span>
                              ) : rank === 2 ? (
                                <span className="px-2.5 py-1 rounded-lg bg-slate-300/20 text-slate-200 border border-slate-400/40">#2</span>
                              ) : rank === 3 ? (
                                <span className="px-2.5 py-1 rounded-lg bg-amber-700/20 text-amber-500 border border-amber-700/40">#3</span>
                              ) : (
                                <span className="text-slate-500">#{rank}</span>
                              )}
                            </td>

                            {/* Player / Model / Charge Name */}
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className={`${item.modelId ? 'w-16 h-10' : 'w-10 h-10'} rounded-xl bg-[#121922] border border-slate-800 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs flex-shrink-0 overflow-hidden`}>
                                  {activeCategory === 'crimes' ? (
                                    <FiShield className="w-5 h-5 text-amber-400" />
                                  ) : activeCategory === 'factions-roster' || activeCategory === 'factions-wealth' ? (
                                    <FiUsers className="w-5 h-5 text-cyan-400" />
                                  ) : item.modelId ? (
                                    <img
                                      src={`https://assets.open.mp/assets/images/vehicle/Vehicle_${item.modelId}.png`}
                                      alt="vehicle"
                                      className="w-full h-full object-contain p-1"
                                      onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                  ) : (item.skin !== undefined && item.skin !== null) || (item.skinId !== undefined && item.skinId !== null) ? (
                                    <img
                                      src={`https://assets.open.mp/assets/images/skins/${item.skin ?? item.skinId}.png`}
                                      alt="skin"
                                      className="w-full h-full object-contain p-0.5 rounded-lg"
                                      onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                  ) : (
                                    name.charAt(0).toUpperCase()
                                  )}
                                </div>
                                <div>
                                  <div className="font-extrabold text-white text-sm">{name}</div>
                                  {activeCategory === 'hours' ? (
                                    <div className="text-[10px] text-cyan-400 font-mono font-bold">Level {item.level || 1}</div>
                                  ) : activeCategory === 'crimes' ? null : item.crimeName ? (
                                    <div className="text-[10px] text-amber-400 font-mono font-bold">Charge: {item.crimeName}</div>
                                  ) : item.modelId ? (
                                    <div className="text-[10px] text-cyan-400 font-mono font-bold">{item.modelName || `Model #${item.modelId}`}</div>
                                  ) : null}
                                </div>
                              </div>
                            </td>

                            {/* Value / Score / Crimes & Arrests */}
                            {activeCategory === 'arrests' ? (
                              <>
                                <td className="py-4 px-6 text-center font-mono font-black text-sm text-cyan-400">
                                  {formatVal(item.crimes ?? item.value ?? 0, '')}
                                </td>
                                <td className="py-4 px-6 text-center font-mono font-black text-sm text-blue-400">
                                  {formatVal(item.arrests ?? 0, '')}
                                </td>
                              </>
                            ) : (
                              <td className="py-4 px-6 text-right font-mono font-black text-sm text-cyan-400">
                                {formatVal(item.value, item.unit || activeCategoryObj.unit)}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-16 text-center space-y-2 text-slate-500 font-mono">
                  <p className="text-sm">{errorMsg || 'No records found for this category.'}</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Highscores;
