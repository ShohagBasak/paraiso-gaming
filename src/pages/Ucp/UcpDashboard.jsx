import React, { useState, useEffect } from 'react';
import { useUcp } from '../../context/UcpContext';
import { 
  FiLogOut, FiBriefcase, FiHeart, FiDollarSign, FiAward, FiZap,
  FiClock, FiShield, FiHome, FiTruck, FiUser, FiGrid, 
  FiList, FiLock, FiCheckCircle, FiAlertTriangle, FiMenu, 
  FiX, FiCrosshair, FiSmartphone, FiMonitor, FiGlobe, 
  FiPower, FiTrash2, FiHelpCircle, FiExternalLink, FiLifeBuoy, 
  FiMessageSquare, FiCheck, FiKey, FiUserPlus, FiUserMinus, 
  FiEdit3, FiUnlock, FiRefreshCw
} from 'react-icons/fi';
import { FaDiscord } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const UcpDashboard = () => {
  const { ucpPlayer, ucpStats, loading, fetchUcpStats, logoutUcp } = useUcp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('ucp_active_tab');
    if (saved && saved.startsWith('admin')) return 'overview';
    return saved || 'overview';
  });
  const [rosterViewMode, setRosterViewMode] = useState('grid');
  const [isRevoking, setIsRevoking] = useState(false);
  const [securityMessage, setSecurityMessage] = useState('');

  const handleRevokeOtherSessions = async () => {
    try {
      setIsRevoking(true);
      setSecurityMessage('');
      const token = localStorage.getItem('ucp_token');
      const res = await fetch(`${API_BASE_URL}/api/ucp/sessions/revoke-others`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (res.ok) {
        setSecurityMessage('Successfully logged out from all other devices!');
        fetchTabModuleData('security');
        if (fetchUcpStats) fetchUcpStats();
      } else {
        setSecurityMessage(data.message || 'Failed to terminate other sessions.');
      }
    } catch (err) {
      setSecurityMessage('Connection error. Please try again.');
    } finally {
      setIsRevoking(false);
    }
  };

  const handleRevokeSingleSession = async (sessionId) => {
    try {
      setSecurityMessage('');
      const token = localStorage.getItem('ucp_token');
      const res = await fetch(`${API_BASE_URL}/api/ucp/sessions/revoke-one`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId })
      });
      const data = await res.json();
      if (res.ok) {
        setSecurityMessage('Device session removed successfully!');
        fetchTabModuleData('security');
        if (fetchUcpStats) fetchUcpStats();
      } else {
        setSecurityMessage(data.message || 'Failed to remove device.');
      }
    } catch (err) {
      setSecurityMessage('Connection error. Please try again.');
    }
  };

  // Modular On-Demand Module State
  const [vehicles, setVehicles] = useState([]);
  const [houses, setHouses] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [factionMembers, setFactionMembers] = useState([]);
  const [gangMembers, setGangMembers] = useState([]);
  const [inventoryData, setInventoryData] = useState(null);
  const [skillsData, setSkillsData] = useState(null);
  const [financeData, setFinanceData] = useState(null);
  const [sessionsData, setSessionsData] = useState([]);
  const [isModuleLoading, setIsModuleLoading] = useState(false);

  const igAdminLevel = Number(ucpStats?.AdminLevel || ucpStats?.Admin || ucpPlayer?.adminLevel || 0);
  const isIgAdmin = igAdminLevel > 0 || ucpPlayer?.role === 'master' || ucpPlayer?.role === 'admin';



  const fetchTabModuleData = async (tab) => {
    const token = localStorage.getItem('ucp_token');
    if (!token) return;
    try {
      setIsModuleLoading(true);
      if (tab === 'vehicles') {
        const res = await fetch(`${API_BASE_URL}/api/ucp/vehicles`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setVehicles(data.vehicles || []);
        }
      } else if (tab === 'properties') {
        const res = await fetch(`${API_BASE_URL}/api/ucp/properties`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setHouses(data.houses || []);
          setBusinesses(data.businesses || []);
        }
      } else if (tab === 'faction') {
        const res = await fetch(`${API_BASE_URL}/api/ucp/faction-roster`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFactionMembers(data.factionMembers || []);
        }
      } else if (tab === 'gang') {
        const res = await fetch(`${API_BASE_URL}/api/ucp/gang-roster`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setGangMembers(data.gangMembers || []);
        }
      } else if (tab === 'inventory') {
        const res = await fetch(`${API_BASE_URL}/api/ucp/inventory`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setInventoryData(data);
        }
      } else if (tab === 'skills') {
        const res = await fetch(`${API_BASE_URL}/api/ucp/skills`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSkillsData(data.skills || {});
        }
      } else if (tab === 'finance') {
        const res = await fetch(`${API_BASE_URL}/api/ucp/finances`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFinanceData(data.finances || {});
        }
      } else if (tab === 'security') {
        const res = await fetch(`${API_BASE_URL}/api/ucp/sessions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSessionsData(data.activeSessions || []);
        }
      }
    } catch (err) {
      console.error('Error fetching modular tab data:', err);
    } finally {
      setIsModuleLoading(false);
    }
  };

  useEffect(() => {
    if (fetchUcpStats) fetchUcpStats();
    if (activeTab && ['vehicles', 'properties', 'faction', 'gang', 'inventory', 'skills', 'finance', 'security'].includes(activeTab)) {
      fetchTabModuleData(activeTab);
    }

    let pollInterval = null;
    if (activeTab === 'security') {
      pollInterval = setInterval(() => {
        fetchTabModuleData(activeTab);
      }, 300000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('ucp_active_tab', tab);
    setIsSidebarOpen(false);
  };

  // Unified fallback arrays
  const vehiclesList = vehicles.length > 0 ? vehicles : (ucpStats?.vehicles || []);
  const housesList = houses.length > 0 ? houses : (ucpStats?.houses || []);
  const businessesList = businesses.length > 0 ? businesses : (ucpStats?.businesses || []);
  const factionMembersList = factionMembers.length > 0 ? factionMembers : (ucpStats?.factionMembers || []);
  const gangMembersList = gangMembers.length > 0 ? gangMembers : (ucpStats?.gangMembers || []);
  const activeSessionsList = sessionsData.length > 0 ? sessionsData : (ucpStats?.activeSessions || []);

  // Real In-Game Faction Colors and Meta
  const factionMeta = {
    1: { name: 'Paraiso Police Department', short: 'PPD', color: '#3b82f6' },
    2: { name: 'Federal Bureau of Investigation', short: 'FBI', color: '#6366f1' },
    3: { name: 'Paraiso Fire & Medic Department', short: 'PFMD', color: '#ef4444' },
    4: { name: 'Hitman Agency', short: 'Hitman', color: '#eab308' },
    5: { name: 'Paraiso National Guard', short: 'PNG', color: '#22c55e' },
    6: { name: 'LCN Mafia', short: 'LCN', color: '#a855f7' },
    7: { name: 'Yakuza Mafia', short: 'Yakuza', color: '#ec4899' },
    8: { name: 'Street Gang', short: 'Gang', color: '#f97316' },
    9: { name: 'Paraiso San Andreas News', short: 'SAN', color: '#10b981' }
  };

  if (loading || !ucpStats) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center bg-[#070b0e] text-white space-y-6">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_25px_rgba(6,182,212,0.5)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FiZap className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-lg font-black tracking-wide uppercase text-white">Authenticating UCP Session</h3>
          <p className="text-xs text-slate-400 font-medium tracking-wider animate-pulse">
            Syncing Live Character Statistics & In-Game Database...
          </p>
        </div>
      </div>
    );
  }

  const skinId = Number(ucpStats.Skin || 0);
  const skinImgUrl = `https://assets.open.mp/assets/images/skins/${skinId}.png`;
  const fallbackSkinUrl = `https://raw.githubusercontent.com/uSAMP/samp-skins/master/skins/${skinId}.png`;

  // Calculate formatted total wealth
  const cash = Number(ucpStats.Cash || 0);
  const bank = Number(ucpStats.Bank || 0);
  const paycheck = Number(ucpStats.Paycheck || 0);
  const totalWealth = cash + bank;
  const formattedWealth = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalWealth);

  // Level & XP Progress
  const currentLevel = Number(ucpStats.Level || 1);
  const respect = Number(ucpStats.Respect || 0);
  const reqRespect = currentLevel * 4;
  const levelProgress = Math.min(100, Math.round((respect / reqRespect) * 100));

  // Job formatting safely matching MySQL 'dynamic_job_salary' table
  const getJobName = (jobId) => {
    if (jobId === undefined || jobId === null || Number(jobId) === 0) return 'None';
    const jId = Number(jobId);
    const jobs = {
      1: 'Detective',
      2: 'Lawyer',
      3: 'Whore',
      4: 'Drug Dealer',
      5: 'Car Jacker',
      6: 'News Reporter',
      7: 'Mechanic',
      8: 'Bodyguard',
      9: 'Arms Dealer',
      10: 'Trucker',
      11: 'Smuggler',
      12: 'Boxer',
      13: 'Taxi Driver',
      14: 'Drug Smuggler',
      20: 'Trucker',
      22: 'Miner',
      23: 'Lumberjack',
      24: 'Garbage Man'
    };
    return jobs[jId] || `Job #${jId}`;
  };

  const getJobSkillLevel = (jobId, stats, isSecondary = false) => {
    if (!jobId || Number(jobId) === 0 || !stats) return null;
    const jId = Number(jobId);

    // Check specific skill columns first if present in MySQL DB
    let skillPoints = 0;
    if (jId === 9 && (stats.ArmsSkill !== undefined || stats.pArmsSkill !== undefined)) {
      skillPoints = Number(stats.ArmsSkill || stats.pArmsSkill || 0);
    } else if (jId === 2 && (stats.LawyerSkill !== undefined || stats.pLawyerSkill !== undefined)) {
      skillPoints = Number(stats.LawyerSkill || stats.pLawyerSkill || 0);
    } else if (jId === 7 && (stats.MechSkill !== undefined || stats.pMechSkill !== undefined)) {
      skillPoints = Number(stats.MechSkill || stats.pMechSkill || 0);
    } else if ((jId === 10 || jId === 20) && (stats.TruckSkill !== undefined || stats.pTruckSkill !== undefined)) {
      skillPoints = Number(stats.TruckSkill || stats.pTruckSkill || 0);
    } else if (jId === 1 && (stats.DetSkill !== undefined || stats.DetectiveSkill !== undefined)) {
      skillPoints = Number(stats.DetSkill || stats.DetectiveSkill || 0);
    } else {
      // Fallback to generic JobSkill / Job2Skill
      skillPoints = Number((isSecondary ? stats.Job2Skill : stats.JobSkill) || (isSecondary ? stats.Job2Level : stats.JobLevel) || stats.JobSkill || 0);
    }

    // Convert raw skill points or direct level number
    if (skillPoints >= 1 && skillPoints <= 5) {
      return `Level ${skillPoints}`;
    }
    
    if (skillPoints === 0) return 'Level 1';

    // Godfather / SA-MP Skill Point brackets to Skill Level
    if (skillPoints < 50) return `Level 1 (${skillPoints} pts)`;
    if (skillPoints < 100) return `Level 2 (${skillPoints} pts)`;
    if (skillPoints < 200) return `Level 3 (${skillPoints} pts)`;
    if (skillPoints < 400) return `Level 4 (${skillPoints} pts)`;
    return `Level 5 Master (${skillPoints} pts)`;
  };

  const getDonatorRank = (donatorVal) => {
    const lvl = Number(donatorVal || 0);
    const donatorRanks = {
      1: { name: 'Ruby Donator', color: '#f87171', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
      2: { name: 'Sapphire Donator', color: '#60a5fa', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
      3: { name: 'Diamond Donator', color: '#22d3ee', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' }
    };
    return donatorRanks[lvl] || null;
  };

  const getDonatorExpiryText = (stats) => {
    if (!stats || !stats.Donator || Number(stats.Donator) === 0) {
      return 'Expired / None';
    }

    const expTime = stats.DonatorTime ?? stats.DonatorDate ?? stats.DonatorExp ?? stats.DonatorExpire ?? stats.DonatorExpiration ?? stats.VIPTime ?? stats.VIPDate ?? stats.VIPExp ?? stats.VIPExpire ?? stats.DTime ?? stats.DDate ?? stats.DonationDate ?? stats.DonationTime ?? stats.DonationExp;

    if (expTime === undefined || expTime === null || expTime === '' || String(expTime).toLowerCase() === 'permanent' || String(expTime) === '9999999999') {
      return 'Permanent';
    }

    let expiryDate = null;
    const numExp = Number(expTime);

    if (!isNaN(numExp)) {
      if (numExp === 0) {
        return 'Permanent';
      }
      if (numExp < 0) {
        return 'Expired';
      }
      if (numExp > 1000000000) {
        // Unix timestamp in seconds
        expiryDate = new Date(numExp * 1000);
      } else if (numExp > 1000000) {
        // Timestamp in milliseconds
        expiryDate = new Date(numExp);
      } else if (numExp <= 3650) {
        return `${numExp} Days Left`;
      }
    } else if (typeof expTime === 'string') {
      expiryDate = new Date(expTime);
    }

    if (expiryDate && !isNaN(expiryDate.getTime())) {
      const now = new Date();
      if (expiryDate < now) {
        return `Expired (${expiryDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })})`;
      }
      return expiryDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    return String(expTime);
  };

  // Faction formatting
  const getFactionName = (stats) => {
    if (!stats) return 'Civilian';
    const memberId = typeof stats === 'object' ? Number(stats.Member || 0) : 0;
    const leaderId = typeof stats === 'object' ? Number(stats.Leader || 0) : 0;
    const rawFactionId = typeof stats === 'object' ? Number(stats.Faction || 0) : Number(stats || 0);
    const fId = memberId || leaderId || rawFactionId;

    if (!fId || fId === 0) return 'Civilian';

    const meta = factionMeta[fId];
    const name = meta ? `${meta.short} (${meta.name})` : `Faction #${fId}`;
    if (leaderId > 0 && leaderId === fId) {
      return `${name} (Leader)`;
    }
    return name;
  };

  const getSAMPWeaponName = (weaponId) => {
    const wid = Number(weaponId || 0);
    const weapons = {
      1: 'Brass Knuckles', 2: 'Golf Club', 3: 'Nitestick', 4: 'Knife', 5: 'Baseball Bat',
      6: 'Shovel', 7: 'Pool Cue', 8: 'Katana', 9: 'Chainsaw', 10: 'Purple Dildo',
      11: 'Small White Dildo', 12: 'Large White Dildo', 13: 'Silver Vibrator', 14: 'Flowers', 15: 'Cane',
      16: 'Grenade', 17: 'Tear Gas', 18: 'Molotov Cocktail',
      22: 'Colt 45 (9mm)', 23: 'Silenced 9mm', 24: 'Desert Eagle', 25: 'Shotgun',
      26: 'Sawnoff Shotgun', 27: 'Combat Shotgun', 28: 'Micro UZI', 29: 'MP5',
      30: 'AK-47', 31: 'M4 Rifle', 32: 'Tec-9', 33: 'Country Rifle', 34: 'Sniper Rifle',
      35: 'RPG', 36: 'HS Rocket', 37: 'Flamethrower', 38: 'Minigun', 39: 'Satchel Charge',
      40: 'Detonator', 41: 'Spraycan', 42: 'Fire Extinguisher', 43: 'Camera',
      44: 'Night Vision', 45: 'Thermal Vision', 46: 'Parachute'
    };
    return weapons[wid] || `Weapon #${wid}`;
  };

  const getPlayerWeapons = (stats) => {
    if (!stats) return [];
    if (Array.isArray(stats.weapons)) {
      return stats.weapons.map(w => ({
        slot: w.slot,
        id: w.id,
        name: getSAMPWeaponName(w.id),
        ammo: w.ammo
      }));
    }
    const list = [];
    for (let i = 0; i <= 13; i++) {
      const gunId = Number(stats[`Gun${i}`] ?? stats[`pGun${i}`] ?? stats[`Weapon${i}`] ?? stats[`pWeapon${i}`] ?? 0);
      const ammo = Number(stats[`Ammo${i}`] ?? stats[`pAmmo${i}`] ?? stats[`GunAmmo${i}`] ?? 0);
      if (gunId > 0) {
        list.push({
          slot: i,
          id: gunId,
          name: getSAMPWeaponName(gunId),
          ammo: ammo
        });
      }
    }
    return list;
  };

  const getHouseWeapons = (house) => {
    if (!house) return [];
    const list = [];
    for (let i = 1; i <= 5; i++) {
      const gunId = Number(house[`gun${i}`] ?? house[`Gun${i}`] ?? house[`weapon${i}`] ?? house[`Weapon${i}`] ?? 0);
      const ammo = Number(house[`ammo${i}`] ?? house[`Ammo${i}`] ?? 0);
      if (gunId > 0) {
        list.push({
          slot: i,
          id: gunId,
          name: getSAMPWeaponName(gunId),
          ammo: ammo
        });
      }
    }
    return list;
  };

  const parseAnyDate = (dateVal, timeVal) => {
    if (!dateVal || dateVal === '0' || dateVal === 0 || dateVal === '' || dateVal === 'N/A' || dateVal === 'null') {
      return null;
    }

    const strVal = String(dateVal).trim();

    // Ignore small integers (like ConnectTime = 21 minutes played)
    if (!isNaN(Number(strVal)) && Number(strVal) < 100000000) {
      return null;
    }

    let year = null;
    let month = null; // 0-indexed
    let day = null;
    let hours = 0;
    let minutes = 0;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Time string from timeVal parameter
    if (timeVal && typeof timeVal === 'string' && timeVal.trim() !== '') {
      const timeMatch = timeVal.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?/i);
      if (timeMatch) {
        let h = parseInt(timeMatch[1], 10);
        const m = parseInt(timeMatch[2], 10);
        const ampm = timeMatch[4];
        if (ampm) {
          if (ampm.toUpperCase() === 'PM' && h < 12) h += 12;
          if (ampm.toUpperCase() === 'AM' && h === 12) h = 0;
        }
        hours = h;
        minutes = m;
      }
    }

    // Case A: Unix Timestamp
    if (!isNaN(Number(strVal))) {
      const num = Number(strVal);
      const dateObj = new Date(num > 10000000000 ? num : num * 1000);
      if (!isNaN(dateObj.getTime())) {
        day = dateObj.getDate();
        month = dateObj.getMonth();
        year = dateObj.getFullYear();
        hours = dateObj.getHours();
        minutes = dateObj.getMinutes();
      }
    } else {
      // Case B: String date like "09/08/2026 15:30" or "2026-08-09"
      const inlineTimeMatch = strVal.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?/i);
      if (inlineTimeMatch && (!timeVal || typeof timeVal !== 'string')) {
        let h = parseInt(inlineTimeMatch[1], 10);
        const m = parseInt(inlineTimeMatch[2], 10);
        const ampm = inlineTimeMatch[4];
        if (ampm) {
          if (ampm.toUpperCase() === 'PM' && h < 12) h += 12;
          if (ampm.toUpperCase() === 'AM' && h === 12) h = 0;
        }
        hours = h;
        minutes = m;
      }

      const dateOnlyStr = strVal.replace(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?/gi, '').trim();

      const parts = dateOnlyStr.split(/[\/\-\.\s,]+/);
      if (parts.length >= 3) {
        if (parts[0].length === 4) {
          // YYYY-MM-DD
          year = parseInt(parts[0], 10);
          month = parseInt(parts[1], 10) - 1;
          day = parseInt(parts[2], 10);
        } else if (parts[2].length === 4) {
          // DD/MM/YYYY
          year = parseInt(parts[2], 10);
          const p0 = parseInt(parts[0], 10);
          const p1 = parseInt(parts[1], 10);
          day = p0;
          month = p1 - 1;
        }
      }

      if (!day || !year) {
        const parsed = Date.parse(strVal);
        if (!isNaN(parsed)) {
          const dateObj = new Date(parsed);
          day = dateObj.getDate();
          month = dateObj.getMonth();
          year = dateObj.getFullYear();
          hours = dateObj.getHours();
          minutes = dateObj.getMinutes();
        }
      }
    }

    if (!day || !year || month === null || month < 0 || month > 11) {
      return strVal;
    }

    const formattedDay = String(day).padStart(2, '0');
    const monthStr = monthNames[month];
    const ampmStr = hours >= 12 ? 'PM' : 'AM';
    let h12 = hours % 12;
    h12 = h12 ? h12 : 12;
    const formattedHours = String(h12).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedDay} ${monthStr} ${year}, ${formattedHours}:${formattedMinutes} ${ampmStr}`;
  };

  const formatLastLogin = (stats) => {
    if (!stats) return 'N/A';
    const dateVal = stats.LastLogin ?? stats.LastLoginDate ?? stats.LastConnected ?? stats.LastConnect ?? stats.LastOn ?? stats.LastSeen ?? stats.LoginTime ?? stats.LastDate ?? stats.LastTime;
    const timeVal = stats.LastLoginTime ?? stats.LoginTimeStr ?? stats.ConnectTimeStr;
    const formatted = parseAnyDate(dateVal, timeVal);
    return formatted || 'Recently Online';
  };

  const formatRegDate = (stats) => {
    if (!stats) return 'N/A';
    const dateVal = stats.RegDate ?? stats.Reg_Date ?? stats.RegisterDate ?? stats.RegistrationDate ?? stats.RegisteredDate ?? stats.DateRegistered ?? stats.Registered ?? stats.AccountCreated ?? stats.CreateDate ?? stats.CreationDate ?? stats.Created ?? stats.JoinDate ?? stats.JoinedDate ?? stats.pRegDate ?? stats.pRegisterDate;
    const timeVal = stats.RegTime ?? stats.RegisterTime ?? stats.Reg_Time ?? stats.RegTimeStr ?? stats.CreationTime;
    const formatted = parseAnyDate(dateVal, timeVal);
    return formatted || 'N/A';
  };

  const getVehicleName = (modelId) => {
    const id = Number(modelId);
    const vehicleModels = {
      400: 'Landstalker', 401: 'Bravura', 402: 'Buffalo', 403: 'Linerunner', 404: 'Perennial', 405: 'Sentinel',
      406: 'Dumper', 407: 'Firetruck', 408: 'Trashmaster', 409: 'Stretch', 410: 'Manana', 411: 'Infernus',
      412: 'Voodoo', 413: 'Pony', 414: 'Mule', 415: 'Cheetah', 416: 'Ambulance', 417: 'Leviathan', 418: 'Moonbeam',
      419: 'Esperanto', 420: 'Taxi', 421: 'Washington', 422: 'Bobcat', 423: 'Mr. Whoopee', 424: 'BF Injection',
      425: 'Hunter', 426: 'Premier', 427: 'Enforcer', 428: 'Securicar', 429: 'Banshee', 430: 'Predator', 431: 'Bus',
      432: 'Rhino', 433: 'Barracks', 434: 'Hotknife', 435: 'Trailer', 436: 'Previon', 437: 'Coach', 438: 'Cabbie',
      439: 'Stallion', 440: 'Rumpo', 441: 'RC Bandit', 442: 'Romero', 443: 'Packer', 444: 'Monster', 445: 'Admiral',
      446: 'Squalo', 447: 'Seasparrow', 448: 'Pizzaboy', 449: 'Tram', 451: 'Turismo', 452: 'Speeder', 453: 'Reefer',
      454: 'Tropic', 455: 'Flatbed', 456: 'Yankee', 457: 'Caddy', 458: 'Solair', 459: 'Berkley Van', 460: 'Skimmer',
      461: 'PCJ-600', 462: 'Faggio', 463: 'Freeway', 464: 'RC Baron', 465: 'RC Raider', 466: 'Glendale', 467: 'Oceanic',
      468: 'Sanchez', 469: 'Sparrow', 470: 'Patriot', 471: 'Quadbike', 472: 'Coastguard', 473: 'Dinghy', 474: 'Hermes',
      475: 'Sabre', 476: 'Rustler', 477: 'ZR-350', 478: 'Walton', 479: 'Regina', 480: 'Comet', 481: 'BMX', 482: 'Burrito',
      483: 'Camper', 484: 'Marquis', 485: 'Baggage', 486: 'Dozer', 487: 'Maverick', 488: 'SAN News Maverick', 489: 'Rancher',
      490: 'FBI Rancher', 491: 'Virgo', 492: 'Greenwood', 493: 'Jetmax', 494: 'Hotring Racer', 495: 'Sandking', 496: 'Blista Compact',
      497: 'Police Maverick', 498: 'Boxville', 499: 'Benson', 500: 'Mesa', 502: 'Hotring Racer A', 503: 'Hotring Racer B',
      504: 'Bloodring Banger', 505: 'Rancher', 506: 'Super GT', 507: 'Elegant', 508: 'Journey', 509: 'Bike', 510: 'Mountain Bike',
      511: 'Beagle', 512: 'Cropduster', 513: 'Stuntplane', 514: 'Tanker', 515: 'Roadtrain', 516: 'Nebula', 517: 'Majestic',
      518: 'Buccaneer', 519: 'Shamal', 520: 'Hydra', 521: 'FCR-900', 522: 'NRG-500', 523: 'HPV1000', 524: 'Cement Truck',
      525: 'Towtruck', 526: 'Fortune', 527: 'Cadrona', 528: 'FBI Truck', 529: 'Willard', 530: 'Forklift', 531: 'Tractor',
      532: 'Combine Harvester', 533: 'Feltzer', 534: 'Remington', 535: 'Slamvan', 536: 'Blade', 537: 'Freight Train',
      538: 'Brownstreak Train', 539: 'Vortex', 540: 'Vincent', 541: 'Bullet', 542: 'Clover', 543: 'Sadler', 544: 'Firetruck Ladder',
      545: 'Hustler', 546: 'Intruder', 547: 'Primo', 548: 'Cargobob', 549: 'Tampa', 550: 'Sunrise', 551: 'Merit',
      552: 'Utility Van', 553: 'Nevada', 554: 'Yosemite', 555: 'Windsor', 556: 'Monster A', 557: 'Monster B', 558: 'Uranus',
      559: 'Jester', 560: 'Sultan', 561: 'Stratum', 562: 'Elegy', 563: 'Raindance', 564: 'RC Tiger', 565: 'Flash',
      566: 'Tahoma', 567: 'Savanna', 568: 'Bandito', 569: 'Freight Flat Trailer', 570: 'Streak Trailer', 571: 'Kart',
      572: 'Mower', 573: 'Dune', 574: 'Sweeper', 575: 'Broadway', 576: 'Tornado', 577: 'AT-400', 578: 'DFT-30',
      579: 'Huntley', 580: 'Stafford', 581: 'BF-400', 582: 'Newsvan', 583: 'Tug', 584: 'Petrol Trailer', 585: 'Emperor',
      586: 'Wayfarer', 587: 'Euros', 588: 'Hotdog', 589: 'Club', 590: 'Freight Box Trailer', 591: 'Article Trailer 3',
      592: 'Andromada', 593: 'Dodo', 594: 'RC Cam', 595: 'Launch', 596: 'Police Car (LSPD)', 597: 'Police Car (SFPD)',
      598: 'Police Car (LVPD)', 599: 'Police Ranger', 600: 'Picador', 601: 'S.W.A.T.', 602: 'Alpha', 603: 'Phoenix',
      604: 'Glendale Shit', 605: 'Sadler Shit', 606: 'Baggage Trailer A', 607: 'Baggage Trailer B', 608: 'Tug Stairs Trailer',
      609: 'Boxville', 610: 'Farm Trailer', 611: 'Utility Trailer'
    };
    return vehicleModels[id] || `Vehicle #${id}`;
  };

  const getVehicleLocation = (x, y, z) => {
    const px = Number(x || 0);
    const py = Number(y || 0);

    if (px === 0 && py === 0) return 'Stored / Garage';

    // Comprehensive GTA San Andreas Neighborhood Bounding Boxes
    const zones = [
      { name: 'Pershing Square', minX: 1400, maxX: 1650, minY: -1750, maxY: -1550 },
      { name: 'Commerce', minX: 1300, maxX: 1800, minY: -1800, maxY: -1450 },
      { name: 'Idlewood', minX: 1750, maxX: 2150, minY: -1950, maxY: -1450 },
      { name: 'Ganton', minX: 2150, maxX: 2600, minY: -1950, maxY: -1550 },
      { name: 'El Corona', minX: 1600, maxX: 2250, minY: -2700, maxY: -1950 },
      { name: 'Willowfield', minX: 2150, maxX: 2800, minY: -2500, maxY: -1950 },
      { name: 'Ocean Docks', minX: 2100, maxX: 3000, minY: -3000, maxY: -2500 },
      { name: 'LS International Airport', minX: 1200, maxX: 2100, minY: -2700, maxY: -2250 },
      { name: 'Market', minX: 750, maxX: 1300, minY: -1800, maxY: -1200 },
      { name: 'Downtown Los Santos', minX: 1300, maxX: 1850, minY: -1450, maxY: -850 },
      { name: 'East Los Santos', minX: 2200, maxX: 2750, minY: -1550, maxY: -1050 },
      { name: 'Glen Park', minX: 1850, maxX: 2200, minY: -1450, maxY: -1100 },
      { name: 'Jefferson', minX: 2150, maxX: 2450, minY: -1300, maxY: -900 },
      { name: 'Las Colinas', minX: 2150, maxX: 2850, minY: -1100, maxY: -750 },
      { name: 'Verona Beach', minX: 750, maxX: 1300, minY: -2250, maxY: -1750 },
      { name: 'Santa Maria Beach', minX: -100, maxX: 750, minY: -2250, maxY: -1750 },
      { name: 'Rodeo', minX: 350, maxX: 950, minY: -1750, maxY: -1150 },
      { name: 'Richman', minX: 200, maxX: 950, minY: -1250, maxY: -750 },
      { name: 'Marina', minX: 650, maxX: 1000, minY: -1600, maxY: -1250 },
      { name: 'Vinewood', minX: 600, maxX: 1750, minY: -1250, maxY: -600 },
      { name: 'Mulholland', minX: 600, maxX: 1800, minY: -600, maxY: -100 },
      // San Fierro Zones
      { name: 'Downtown San Fierro', minX: -2200, maxX: -1600, minY: 750, maxY: 1400 },
      { name: 'Doherty', minX: -2200, maxX: -1700, minY: -300, maxY: 400 },
      { name: 'Easter Basin (SF Airport)', minX: -1600, maxX: -1000, minY: -500, maxY: 500 },
      { name: 'Chinatown', minX: -2400, maxX: -2000, minY: 500, maxY: 900 },
      { name: 'Garcia', minX: -2500, maxX: -2000, minY: -200, maxY: 400 },
      { name: 'Queens', minX: -2700, maxX: -2200, minY: 400, maxY: 1000 },
      // Las Venturas Zones
      { name: 'The Strip (Las Venturas)', minX: 1800, maxX: 2300, minY: 1100, maxY: 2400 },
      { name: 'Redsands', minX: 1300, maxX: 2300, minY: 2000, maxY: 2600 },
      { name: 'LV International Airport', minX: 1200, maxX: 1800, minY: 1100, maxY: 2000 },
      { name: 'Prickle Pine', minX: 1400, maxX: 2100, minY: 2600, maxY: 3000 },
      { name: 'Rockshore', minX: 2000, maxX: 2800, minY: 700, maxY: 1200 },
      // Regional City Fallbacks
      { name: 'Los Santos', minX: 100, maxX: 3000, minY: -3000, maxY: -100 },
      { name: 'San Fierro', minX: -3000, maxX: -1000, minY: -1000, maxY: 1600 },
      { name: 'Las Venturas', minX: 800, maxX: 3000, minY: 600, maxY: 3000 }
    ];

    for (const z of zones) {
      if (px >= z.minX && px <= z.maxX && py >= z.minY && py <= z.maxY) {
        return z.name;
      }
    }

    return 'San Andreas';
  };

  const generateGTARandomPlate = (vehId) => {
    const id = Number(vehId || 1);
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    let s1 = (id * 9301 + 49297) % 233280;
    let s2 = (id * 49297 + 9301) % 233280;
    let s3 = (id * 12345 + 67890) % 233280;
    let s4 = (id * 23456 + 78901) % 233280;
    let s5 = (id * 34567 + 89012) % 233280;
    
    const l1 = letters[s1 % 26];
    const l2 = letters[s2 % 26];
    const l3 = letters[s3 % 26];
    const l4 = letters[s4 % 26];
    const l5 = letters[s5 % 26];
    
    const num = (id * 137 + 419) % 900 + 100;

    return `${l1}${l2}${l3}${l4}${l5}${num}`;
  };

  const cleanLicensePlate = (numPlate, vehId) => {
    if (!numPlate || typeof numPlate !== 'string' || numPlate.trim() === '') {
      return generateGTARandomPlate(vehId);
    }
    const cleaned = numPlate.replace(/\{[0-[#a-fA-F0-9]{6}\}/gi, '').trim();
    return cleaned || generateGTARandomPlate(vehId);
  };

  // Official Factions vs Families & Gangs Classification
  const officialFactionIds = [1, 2, 3, 4, 5, 9];
  const familyGangIds = [6, 7, 8, 10, 11, 12, 13];

  const getOfficialFactionName = (stats) => {
    if (!stats) return 'None';
    const memberId = typeof stats === 'object' ? Number(stats.Member || 0) : 0;
    const leaderId = typeof stats === 'object' ? Number(stats.Leader || 0) : 0;
    const rawFactionId = typeof stats === 'object' ? Number(stats.Faction || 0) : Number(stats || 0);
    const fId = memberId || leaderId || rawFactionId;

    if (officialFactionIds.includes(fId)) {
      const meta = factionMeta[fId];
      return meta ? `${meta.short} (${meta.name})` : `Faction #${fId}`;
    }

    return 'None';
  };

  const isOfficialFactionLeader = (stats) => {
    if (!stats || typeof stats !== 'object') return false;
    const memberId = Number(stats.Member || 0);
    const leaderId = Number(stats.Leader || 0);
    const rawFactionId = Number(stats.Faction || 0);
    const fId = memberId || leaderId || rawFactionId;
    return leaderId > 0 && officialFactionIds.includes(fId);
  };

  const getOfficialFactionColor = (stats) => {
    if (!stats) return '#38bdf8';
    const memberId = typeof stats === 'object' ? Number(stats.Member || 0) : 0;
    const leaderId = typeof stats === 'object' ? Number(stats.Leader || 0) : 0;
    const rawFactionId = typeof stats === 'object' ? Number(stats.Faction || 0) : Number(stats || 0);
    const fId = memberId || leaderId || rawFactionId;
    return factionMeta[fId]?.color || '#38bdf8';
  };

  const isFactionLeader = isOfficialFactionLeader;
  const getFactionNameClean = getOfficialFactionName;
  const getFactionColor = getOfficialFactionColor;

  const getOfficialFactionRank = (stats) => {
    if (!stats) return 'No Rank';
    const rankNum = Number(stats.Rank || 0);
    const memberId = Number(stats.Member || stats.Leader || stats.Faction || 0);

    if (!memberId || !officialFactionIds.includes(memberId)) return 'No Rank';
    const groupRanks = {
      1: { 0: 'Rookie', 1: 'Officer', 2: 'Senior Officer', 3: 'Corporal', 4: 'Sergeant', 5: 'Lieutenant', 6: 'Captain', 7: 'Deputy Chief', 8: 'Chief of Police', 9: 'Chief of Police' },
      2: { 0: 'Intern', 1: 'Agent', 2: 'Special Agent', 3: 'Senior Agent', 4: 'Supervisory Agent', 5: 'Chief of Staff', 6: 'Asst. Director', 7: 'Director' },
      3: { 0: 'Paramedic', 1: 'Firefighter', 2: 'Senior Paramedic', 3: 'Lead Paramedic', 4: 'Lieutenant', 5: 'Captain', 6: 'Assistant Commissioner', 7: 'Deputy Commissioner', 8: 'Commissioner', 9: 'Chief' },
      4: { 0: 'Intern', 1: 'Reporter', 2: 'Senior Reporter', 3: 'Broadcaster', 4: 'Broadcast Editor', 5: 'Manager', 6: 'Producer' },
      5: { 0: 'Private', 1: 'Private First Class', 2: 'Corporal', 3: 'Sergeant', 4: 'Staff Sergeant', 5: 'Master Sergeant', 6: 'Lieutenant', 7: 'Captain', 8: 'Major', 9: 'Colonel' },
      9: { 0: 'Intern', 1: 'Freelancer', 2: 'Markman', 3: 'Agent', 4: 'Special Agent', 5: 'Vice Director', 6: 'Director' }
    };
    return groupRanks[memberId]?.[rankNum] || `Rank #${rankNum}`;
  };

  const getFamilyGangName = (stats) => {
    if (!stats) return 'None';
    const memberId = Number(stats.Member || 0);
    const leaderId = Number(stats.Leader || 0);
    const rawFactionId = Number(stats.Faction || 0);
    const gangColId = Number(stats.Gang || 0);
    const fId = memberId || leaderId || rawFactionId;

    if (officialFactionIds.includes(fId)) return 'None';

    if (familyGangIds.includes(fId)) {
      const familyNames = {
        6: 'Grove Street Families',
        7: 'Biker MC',
        8: 'La Cosa Nostra',
        10: 'Syndicate Cartel',
        11: 'Vagos Gang',
        12: 'Underground Group',
        13: 'Revolutionary Army'
      };
      return familyNames[fId] || `Family #${fId}`;
    }

    if (gangColId > 0 && gangColId !== 255) {
      const familyNames = {
        1: 'Grove Street Families',
        2: '18th Street Pacris Fraternity',
        3: 'La Cosa Nostra',
        6: 'Street Gang',
        7: 'Biker MC',
        8: 'La Cosa Nostra',
        10: 'Syndicate Cartel',
        11: 'Vagos Gang',
        13: 'Revolutionary Army'
      };
      return familyNames[gangColId] || `Gang #${gangColId}`;
    }

    return 'None';
  };

  const getFamilyRankTitle = (stats) => {
    if (!stats) return 'No Rank';
    const rankNum = Number(stats.Rank || 0);
    const memberId = Number(stats.Member || stats.Leader || stats.Faction || 0);
    const gangColId = Number(stats.Gang || 0);
    if (!memberId || officialFactionIds.includes(memberId)) return 'No Rank';
    const fId = familyGangIds.includes(memberId) ? memberId : (gangColId && gangColId !== 255 ? gangColId : 6);

    const groupRanks = {
      6: { 1: 'Young G', 2: 'Soldier', 3: 'Big Homie', 4: 'O.G.', 5: 'Shot Caller', 6: 'Kingpin', 7: 'Kingpin' },
      7: { 0: 'Enforcer', 1: 'Original', 2: 'Tail Gunner', 3: 'Sergeant-Arms', 4: 'Road-Captain', 5: 'Vice-President', 6: 'President' },
      8: { 0: 'Worker', 1: 'Outsider', 2: 'Associate', 3: 'Soldato', 4: 'Caporegime', 5: 'Consigliere', 6: 'The Don' },
      10: { 1: 'Outcast', 2: 'Dealer', 3: 'Enforcer', 4: 'Shot Caller', 5: 'Under Boss', 6: 'Kingpin', 7: 'Head' },
      11: { 1: 'Cholo', 2: 'Hood Rat', 3: 'Vato Loco', 4: 'The Assesino', 5: 'The Sicario', 6: 'Emperador', 7: "The Founder's" },
      12: { 0: 'Rank 0', 1: 'Rank 1', 2: 'Rank 2', 3: 'Rank 3', 4: 'Rank 4', 5: 'Rank 5', 6: 'Rank 6' },
      13: { 0: 'Matrunner', 1: 'Peasant', 2: 'Worker', 3: 'Militant', 4: 'Revolutionist', 5: 'Admiral', 6: 'Emperor' }
    };

    return groupRanks[fId]?.[rankNum] || `Rank #${rankNum}`;
  };

  const playerName = ucpStats.Username || ucpPlayer?.username || 'Character';
  const playerId = ucpStats.ID || ucpPlayer?.id || 0;

  const getAffiliationDetails = (stats) => {
    if (!stats) return { label: 'Affiliation / Faction', value: 'Civilian', isLeader: false, color: '#38bdf8', badgeText: 'Leader' };

    const memberId = Number(stats.Member || 0);
    const leaderId = Number(stats.Leader || 0);
    const rawFactionId = Number(stats.Faction || 0);
    const gangColId = Number(stats.Gang || 0);
    const fId = memberId || leaderId || rawFactionId;

    if (fId > 0 && officialFactionIds.includes(fId)) {
      const meta = factionMeta[fId];
      const name = meta ? `${meta.short} (${meta.name})` : `Faction #${fId}`;
      const isLeader = leaderId > 0 && leaderId === fId;
      return {
        label: 'Affiliation / Faction',
        value: name,
        isLeader,
        badgeText: 'Leader',
        color: meta?.color || '#38bdf8'
      };
    }

    if (fId === 6 || gangColId === 1) {
      const isLeader = leaderId === 6 || Number(stats.GangLeader || 0) === 1;
      return {
        label: 'Affiliation / Family',
        value: 'Grove Street Families',
        isLeader,
        badgeText: 'Gang Leader',
        color: '#10b981'
      };
    }

    if (gangColId === 2) {
      const isLeader = Number(stats.GangLeader || 0) === 1;
      return {
        label: 'Affiliation / Family',
        value: '18th Street Pacris Fraternity',
        isLeader,
        badgeText: 'Gang Leader',
        color: '#f97316'
      };
    }

    if (fId === 8 || gangColId === 3) {
      const isLeader = leaderId === 8 || Number(stats.GangLeader || 0) === 1;
      return {
        label: 'Affiliation / Family',
        value: 'La Cosa Nostra',
        isLeader,
        badgeText: 'Family Leader',
        color: '#ef4444'
      };
    }

    return { label: 'Affiliation / Faction', value: 'Civilian', isLeader: false, color: '#38bdf8', badgeText: 'Leader' };
  };

  const aff = getAffiliationDetails(ucpStats);

  return (
    <div className="h-auto my-10 pt-20 pb-0 bg-[#070b0e] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-0">
        
        {/* Mobile UCP Control Header Bar */}
        <div className="lg:hidden mb-4 flex items-center justify-between p-4 bg-[#0d131a]/95 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center filter drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
              <img
                src="/logonobg.png"
                alt="Paraiso Roleplay"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">Paraiso Roleplay</h4>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono">USER CONTROL PANEL</p>
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2.5 rounded-xl bg-[#121922] border border-slate-800 text-cyan-400 hover:text-white hover:border-cyan-500/50 transition-all active:scale-95 flex items-center gap-2"
          >
            <span className="text-xs font-extrabold uppercase tracking-wider hidden sm:inline">Menu</span>
            {isSidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>

        {/* Dashboard Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Sidebar Navigation */}
          <aside className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block lg:col-span-3 bg-[#0d131a]/90 border border-slate-800/80 rounded-2xl p-5 shadow-2xl backdrop-blur-xl space-y-6`}>
            
            {/* Server Branding Header - Edge-to-Edge Full Width */}
            <div className="-mx-5 -mt-5 px-5 py-4 bg-[#121922] border-b border-slate-800 rounded-t-2xl flex items-center gap-3.5">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center filter drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                <img
                  src="/logonobg.png"
                  alt="Paraiso Roleplay"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-black text-white truncate tracking-tight leading-tight">
                  Paraiso Roleplay
                </h3>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono mt-0.5">
                  USER CONTROL PANEL
                </p>
              </div>
            </div>

            {/* Navigation Tabs - Full Width Edge-to-Edge */}
            <nav className="-mx-5 space-y-1">
              <button
                onClick={() => handleTabChange('overview')}
                className={`w-full cursor-pointer flex items-center gap-3.5 px-6 py-3.5 font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-[#121922]'
                }`}
              >
                <FiGrid className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => handleTabChange('finance')}
                className={`w-full cursor-pointer flex items-center gap-3.5 px-6 py-3.5 font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                  activeTab === 'finance'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-[#121922]'
                }`}
              >
                <FiDollarSign className="w-4 h-4" />
                <span>Wealth & Finance</span>
              </button>

              <button
                onClick={() => handleTabChange('faction')}
                className={`w-full cursor-pointer flex items-center gap-3.5 px-6 py-3.5 font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                  activeTab === 'faction' || activeTab === 'families'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-[#121922]'
                }`}
              >
                <FiBriefcase className="w-4 h-4" />
                <span>Faction & Gangs</span>
              </button>

              <button
                onClick={() => handleTabChange('vehicles')}
                className={`w-full cursor-pointer flex items-center gap-3.5 px-6 py-3.5 font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                  activeTab === 'vehicles'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-[#121922]'
                }`}
              >
                <FiTruck className="w-4 h-4" />
                <span>Vehicles & Garage</span>
              </button>

              <button
                onClick={() => handleTabChange('properties')}
                className={`w-full cursor-pointer flex items-center gap-3.5 px-6 py-3.5 font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                  activeTab === 'properties'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-[#121922]'
                }`}
              >
                <FiHome className="w-4 h-4" />
                <span>Houses & Properties</span>
              </button>

              <button
                onClick={() => handleTabChange('inventory')}
                className={`w-full cursor-pointer flex items-center gap-3.5 px-6 py-3.5 font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                  activeTab === 'inventory'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-[#121922]'
                }`}
              >
                <FiList className="w-4 h-4" />
                <span>Inventory & Assets</span>
              </button>

              <button
                onClick={() => handleTabChange('skills')}
                className={`w-full cursor-pointer flex items-center gap-3.5 px-6 py-3.5 font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                  activeTab === 'skills'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-[#121922]'
                }`}
              >
                <FiAward className="w-4 h-4" />
                <span>Character Skills</span>
              </button>

              <button
                onClick={() => handleTabChange('security')}
                className={`w-full cursor-pointer flex items-center gap-3.5 px-6 py-3.5 font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                  activeTab === 'security'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-[#121922]'
                }`}
              >
                <FiShield className="w-4 h-4 text-emerald-400" />
                <span>Active Devices</span>
              </button>

              <button
                onClick={() => handleTabChange('support')}
                className={`w-full cursor-pointer flex items-center gap-3.5 px-6 py-3.5 font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                  activeTab === 'support'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-[#121922]'
                }`}
              >
                <FiHelpCircle className="w-4 h-4 text-indigo-400" />
                <span>Support & Help</span>
              </button>
            </nav>



            {/* Logout Action */}
            <button
              onClick={logoutUcp}
              className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-xs uppercase tracking-wider transition-all active:scale-95"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Logout Control Panel</span>
            </button>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9 space-y-6">

            {/* Top Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Character Level */}
              <div className="bg-[#0d131a]/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center gap-4 relative overflow-hidden group hover:border-cyan-500/50 transition-all duration-300">
                <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
                  <FiZap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Level & Progress</p>
                  <p className="text-xl font-black text-white mt-0.5">Level {currentLevel}</p>
                </div>
              </div>

              {/* Playing Hours */}
              <div className="bg-[#0d131a]/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center gap-4 relative overflow-hidden group hover:border-indigo-500/50 transition-all duration-300">
                <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
                  <FiClock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Playing Hours</p>
                  <p className="text-xl font-black text-white mt-0.5 font-mono">{ucpStats.ConnectTime || 0} hrs</p>
                </div>
              </div>

              {/* Donator Status */}
              <div className="bg-[#0d131a]/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center gap-4 relative overflow-hidden group hover:border-amber-500/50 transition-all duration-300">
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                  <FiAward className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Donator Status</p>
                  <p className="text-xl font-black mt-0.5" style={{ color: getDonatorRank(ucpStats.Donator)?.color || '#ffffff' }}>
                    {getDonatorRank(ucpStats.Donator)?.name || 'None'}
                  </p>
                  {ucpStats.Donator && Number(ucpStats.Donator) !== 0 && (
                    <p className="text-[11px] font-bold text-amber-400 mt-0.5 font-mono">
                      Expires: {getDonatorExpiryText(ucpStats)}
                    </p>
                  )}
                </div>
              </div>

            </div>

            {/* TAB CONTENT: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Character Detail Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Skin Avatar Preview */}
                  <div className="lg:col-span-4 bg-[#0d131a]/90 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl">
                    <div className="w-44 h-64 relative flex items-center justify-center bg-[#060a0d] rounded-2xl border border-slate-800/80 p-3 shadow-inner mb-4 group overflow-hidden">
                      <img
                        src={skinImgUrl}
                        alt={`Skin #${skinId}`}
                        className="h-full object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          if (e.target.src !== fallbackSkinUrl) {
                            e.target.src = fallbackSkinUrl;
                          } else {
                            e.target.onerror = null;
                            e.target.src = 'https://assets.open.mp/assets/images/skins/0.png';
                          }
                        }}
                      />
                      <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700 text-[10px] text-cyan-400 font-mono font-bold">
                        Skin ID #{skinId}
                      </span>
                    </div>

                    <h2 className="text-2xl font-black text-white tracking-tight">{playerName}</h2>
                    {getDonatorRank(ucpStats.Donator) && (
                      <span className={`mt-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 ${getDonatorRank(ucpStats.Donator).bg} ${getDonatorRank(ucpStats.Donator).border} ${getDonatorRank(ucpStats.Donator).text}`}>
                        <FiAward className="w-3.5 h-3.5" />
                        <span>{getDonatorRank(ucpStats.Donator).name}</span>
                      </span>
                    )}

                    {/* Level Progress */}
                    <div className="w-full mt-6 space-y-2">
                      <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                        <span>XP Progress</span>
                        <span className="font-mono text-white">{respect} / {reqRespect} XP</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#060a0d] rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] rounded-full transition-all duration-500"
                          style={{ width: `${levelProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Character Overview Attributes Table */}
                  <div className="lg:col-span-8 bg-[#0d131a]/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                    <div className="border-b border-slate-800 pb-4">
                      <h3 className="text-xl font-black text-white tracking-wide uppercase">Character Overview</h3>
                      <p className="text-xs text-slate-400 mt-0.5">In-Game Identity & Personal Records</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                      {/* Health Status */}
                      <div className="bg-[#121922] border border-slate-800/80 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <FiHeart className="w-3.5 h-3.5 text-rose-400" />
                            <span>Health Status</span>
                          </span>
                          <span className="text-xs font-mono font-extrabold text-rose-400">
                            {Math.min(100, Math.max(0, Math.round(Number(ucpStats.Health || 100))))}% HP
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-500 rounded-full"
                            style={{ width: `${Math.min(100, Math.max(0, Math.round(Number(ucpStats.Health || 100))))}%` }}
                          />
                        </div>
                      </div>

                      {/* Armor Protection */}
                      <div className="bg-[#121922] border border-slate-800/80 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <FiShield className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Armor Protection</span>
                          </span>
                          <span className="text-xs font-mono font-extrabold text-cyan-400">
                            {Math.min(100, Math.max(0, Math.round(Number(ucpStats.Armor || ucpStats.Armour || ucpStats.SpawnArmor || ucpStats.pArmor || ucpStats.pArmour || 0))))}% AP
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 rounded-full"
                            style={{ width: `${Math.min(100, Math.max(0, Math.round(Number(ucpStats.Armor || ucpStats.Armour || ucpStats.SpawnArmor || ucpStats.pArmor || ucpStats.pArmour || 0))))}%` }}
                          />
                        </div>
                      </div>

                      <div className="bg-[#121922] border border-slate-800/80 rounded-xl p-4">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Phone Number</p>
                        <p className="text-base font-extrabold text-white mt-1 font-mono">
                          {ucpStats.PhoneNumber && Number(ucpStats.PhoneNumber) !== 0 ? ucpStats.PhoneNumber : 'N/A'}
                        </p>
                      </div>

                      <div className="bg-[#121922] border border-slate-800/80 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{aff.label}</p>
                          {aff.isLeader && (
                            <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[9px] font-black uppercase tracking-wider font-mono">
                              {aff.badgeText || 'Leader'}
                            </span>
                          )}
                        </div>
                        <p className="text-base font-extrabold mt-1 leading-tight" style={{ color: aff.color }}>
                          {aff.value}
                        </p>
                      </div>

                      <div className="bg-[#121922] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Primary Job</p>
                          <p className="text-base font-extrabold text-white mt-1">
                            {getJobName(ucpStats.Job)}
                          </p>
                        </div>
                        {getJobSkillLevel(ucpStats.Job, ucpStats, false) && (
                          <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-slate-500 uppercase">Skill Level</span>
                            <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono font-bold">
                              {getJobSkillLevel(ucpStats.Job, ucpStats, false)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="bg-[#121922] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Secondary Job</p>
                          <p className="text-base font-extrabold text-white mt-1">
                            {getJobName(ucpStats.Job2)}
                          </p>
                        </div>
                        {getJobSkillLevel(ucpStats.Job2, ucpStats, true) && (
                          <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-slate-500 uppercase">Skill Level</span>
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-mono font-bold">
                              {getJobSkillLevel(ucpStats.Job2, ucpStats, true)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="bg-[#121922] border border-slate-800/80 rounded-xl p-4 space-y-1">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <FiClock className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Last Login Date & Time</span>
                        </p>
                        <p className="text-sm font-extrabold text-white font-mono leading-tight">
                          {formatLastLogin(ucpStats)}
                        </p>
                      </div>

                      <div className="bg-[#121922] border border-slate-800/80 rounded-xl p-4">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Marital Status</p>
                        <p className="text-base font-extrabold text-white mt-1">
                          {ucpStats.MarriedTo && ucpStats.MarriedTo !== 'Nobody' ? `Married to ${ucpStats.MarriedTo}` : 'Single'}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB CONTENT: Finance */}
            {activeTab === 'finance' && (() => {
              const fin = financeData || ucpStats;
              const cashVal = Number(fin.Cash ?? fin.cash ?? fin.pMoney ?? fin.Money ?? 0);
              const bankVal = Number(fin.Bank ?? fin.bank ?? fin.pBank ?? 0);
              const totalNet = fin.TotalWealth !== undefined ? Number(fin.TotalWealth) : (cashVal + bankVal);

              return (
                <div className="bg-[#0d131a]/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-xl font-black text-white tracking-wide uppercase">Financial Overview</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Cash, Bank, and Total Net Wealth details</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#121922] border border-slate-800 p-6 rounded-2xl">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cash On Hand</p>
                      <p className="text-3xl font-black text-emerald-400 font-mono mt-2">${cashVal.toLocaleString()}</p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-6 rounded-2xl">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bank Balance</p>
                      <p className="text-3xl font-black text-cyan-400 font-mono mt-2">${bankVal.toLocaleString()}</p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-6 rounded-2xl">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Net Wealth</p>
                      <p className="text-3xl font-black text-amber-400 font-mono mt-2">${totalNet.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* TAB CONTENT: Faction, Families & Gangs (Combined View) */}
            {(activeTab === 'faction' || activeTab === 'families') && (
              <div className="space-y-6">
                {/* Official Faction Block */}
                <div className="bg-[#0d131a]/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-xl font-black text-white tracking-wide uppercase">Official Faction</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Government & Public Service Membership</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    <div className="bg-[#121922] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Official Faction</span>
                        {isOfficialFactionLeader(ucpStats) && (
                          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-wider font-mono">
                            Faction Leader
                          </span>
                        )}
                      </div>
                      <p className="text-xl sm:text-2xl font-black leading-tight" style={{ color: getOfficialFactionColor(ucpStats) }}>
                        {getOfficialFactionName(ucpStats)}
                      </p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faction Rank</span>
                      </div>
                      <p className="text-xl sm:text-2xl font-black text-white leading-tight">{getOfficialFactionRank(ucpStats)}</p>
                    </div>
                  </div>

                  {/* Faction Roster Members Section */}
                  {getOfficialFactionName(ucpStats) !== 'None' && (
                    <div className="mt-8 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-3 gap-3">
                        <h4 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                          <FiShield className="w-5 h-5 text-cyan-400" />
                          <span>Faction Roster ({(factionMembersList.length > 0 ? factionMembersList : [ucpStats]).length} Members)</span>
                        </h4>
                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <span className="text-xs font-bold text-cyan-400 font-mono">
                            Online: {(factionMembersList.length > 0 ? factionMembersList : [ucpStats]).filter(m => Number(m.Online) > 0).length} / {(factionMembersList.length > 0 ? factionMembersList : [ucpStats]).length}
                          </span>
                          <div className="flex items-center bg-[#121922] p-1 rounded-xl border border-slate-800 gap-1">
                            <button
                              onClick={() => setRosterViewMode('list')}
                              className={`p-1.5 rounded-lg text-xs transition-all ${rosterViewMode === 'list' ? 'bg-cyan-500 text-black font-extrabold shadow-md' : 'text-slate-400 hover:text-white'}`}
                              title="List View"
                            >
                              <FiList className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setRosterViewMode('grid')}
                              className={`p-1.5 rounded-lg text-xs transition-all ${rosterViewMode === 'grid' ? 'bg-cyan-500 text-black font-extrabold shadow-md' : 'text-slate-400 hover:text-white'}`}
                              title="Grid View"
                            >
                              <FiGrid className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {rosterViewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {(factionMembersList.length > 0 ? factionMembersList : [ucpStats]).map((m) => {
                            const isLeader = Number(m.Leader || 0) > 0;
                            const isOnline = Number(m.Online || 0) > 0;
                            const mName = m.Username || playerName;
                            return (
                              <div key={m.ID || mName} className={`bg-[#121922] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-cyan-500/40 transition-all shadow-lg ${mName === playerName ? 'ring-1 ring-cyan-500/50 bg-cyan-500/5' : ''}`}>
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-extrabold text-white text-sm truncate">{mName}</span>
                                      {mName === playerName && (
                                        <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono font-bold">YOU</span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                      {isLeader && (
                                        <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-extrabold uppercase font-mono">
                                          Leader
                                        </span>
                                      )}
                                      <span className="text-xs text-slate-300 font-semibold">{getOfficialFactionRank(m)}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs font-mono">
                                  <span className="text-slate-400">Level {m.Level || 1}</span>
                                  {isOnline ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                      ONLINE
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[9px] font-bold">
                                      OFFLINE
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-[#121922]">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-[#0b1016] text-slate-400 uppercase text-[10px] tracking-wider font-extrabold border-b border-slate-800">
                              <tr>
                                <th className="py-3 px-4">Member Name</th>
                                <th className="py-3 px-4">Rank Title</th>
                                <th className="py-3 px-4">Level</th>
                                <th className="py-3 px-4 text-right">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 font-medium">
                              {(factionMembersList.length > 0 ? factionMembersList : [ucpStats]).map((m) => {
                                const isLeader = Number(m.Leader || 0) > 0;
                                const isOnline = Number(m.Online || 0) > 0;
                                const mName = m.Username || playerName;
                                return (
                                  <tr key={m.ID || mName} className={`hover:bg-slate-800/40 transition-colors ${mName === playerName ? 'bg-cyan-500/10' : ''}`}>
                                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                                      <span>{mName}</span>
                                      {mName === playerName && (
                                        <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono font-bold">YOU</span>
                                      )}
                                    </td>
                                    <td className="py-3 px-4 text-slate-300 font-semibold">
                                      <div className="flex items-center gap-1.5">
                                        {isLeader && (
                                          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-extrabold uppercase font-mono">
                                            Leader
                                          </span>
                                        )}
                                        <span>{getOfficialFactionRank(m)}</span>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 text-slate-400 font-mono">Lvl {m.Level || 1}</td>
                                    <td className="py-3 px-4 text-right font-mono">
                                      {isOnline ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                          ONLINE
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                                          OFFLINE
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Families & Gangs Block */}
                <div className="bg-[#0d131a]/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-xl font-black text-white tracking-wide uppercase">Families & Gangs</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Street Gangs, Mafias & Underground Families</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    <div className="bg-[#121922] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Family / Gang</span>
                      <p className="text-xl sm:text-2xl font-black text-emerald-400 leading-tight">
                        {getFamilyGangName(ucpStats)}
                      </p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gang Rank</span>
                      <p className="text-xl sm:text-2xl font-black text-white leading-tight">
                        {getFamilyRankTitle(ucpStats)}
                      </p>
                    </div>
                  </div>

                  {/* Gang Roster Members Section */}
                  {getFamilyGangName(ucpStats) !== 'None' && (
                    <div className="mt-8 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-3 gap-3">
                        <h4 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                          <FiCrosshair className="w-5 h-5 text-emerald-400" />
                          <span>Gang Roster ({(gangMembersList.length > 0 ? gangMembersList : [ucpStats]).length} Members)</span>
                        </h4>
                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <span className="text-xs font-bold text-emerald-400 font-mono">
                            Online: {(gangMembersList.length > 0 ? gangMembersList : [ucpStats]).filter(m => Number(m.Online) > 0).length} / {(gangMembersList.length > 0 ? gangMembersList : [ucpStats]).length}
                          </span>
                          <div className="flex items-center bg-[#121922] p-1 rounded-xl border border-slate-800 gap-1">
                            <button
                              onClick={() => setRosterViewMode('list')}
                              className={`p-1.5 rounded-lg text-xs transition-all ${rosterViewMode === 'list' ? 'bg-emerald-500 text-black font-extrabold shadow-md' : 'text-slate-400 hover:text-white'}`}
                              title="List View"
                            >
                              <FiList className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setRosterViewMode('grid')}
                              className={`p-1.5 rounded-lg text-xs transition-all ${rosterViewMode === 'grid' ? 'bg-emerald-500 text-black font-extrabold shadow-md' : 'text-slate-400 hover:text-white'}`}
                              title="Grid View"
                            >
                              <FiGrid className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {rosterViewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {(gangMembersList.length > 0 ? gangMembersList : [ucpStats]).map((m) => {
                            const isLeader = Number(m.FLeader || 0) > 0 || Number(m.Leader || 0) > 0;
                            const isOnline = Number(m.Online || 0) > 0;
                            const mName = m.Username || playerName;
                            return (
                              <div key={m.ID || mName} className={`bg-[#121922] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-emerald-500/40 transition-all shadow-lg ${mName === playerName ? 'ring-1 ring-emerald-500/50 bg-emerald-500/5' : ''}`}>
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-extrabold text-white text-sm truncate">{mName}</span>
                                      {mName === playerName && (
                                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold">YOU</span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                      {isLeader && (
                                        <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-extrabold uppercase font-mono">
                                          Boss
                                        </span>
                                      )}
                                      <span className="text-xs text-slate-300 font-semibold">{getFamilyRankTitle(m)}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs font-mono">
                                  <span className="text-slate-400">Level {m.Level || 1}</span>
                                  {isOnline ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                      ONLINE
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[9px] font-bold">
                                      OFFLINE
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-[#121922]">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-[#0b1016] text-slate-400 uppercase text-[10px] tracking-wider font-extrabold border-b border-slate-800">
                              <tr>
                                <th className="py-3 px-4">Member Name</th>
                                <th className="py-3 px-4">Gang Rank</th>
                                <th className="py-3 px-4">Level</th>
                                <th className="py-3 px-4 text-right">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 font-medium">
                              {(gangMembersList.length > 0 ? gangMembersList : [ucpStats]).map((m) => {
                                const isLeader = Number(m.FLeader || 0) > 0 || Number(m.Leader || 0) > 0;
                                const isOnline = Number(m.Online || 0) > 0;
                                const mName = m.Username || playerName;
                                return (
                                  <tr key={m.ID || mName} className={`hover:bg-slate-800/40 transition-colors ${mName === playerName ? 'bg-emerald-500/10' : ''}`}>
                                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                                      <span>{mName}</span>
                                      {mName === playerName && (
                                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold">YOU</span>
                                      )}
                                    </td>
                                    <td className="py-3 px-4 text-slate-300 font-semibold">
                                      <div className="flex items-center gap-1.5">
                                        {isLeader && (
                                          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-extrabold uppercase font-mono">
                                            Boss
                                          </span>
                                        )}
                                        <span>{getFamilyRankTitle(m)}</span>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 text-slate-400 font-mono">Lvl {m.Level || 1}</td>
                                    <td className="py-3 px-4 text-right font-mono">
                                      {isOnline ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                          ONLINE
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                                          OFFLINE
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Vehicles & Garage */}
            {activeTab === 'vehicles' && (
              <div className="bg-[#0d131a]/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black text-white tracking-wide uppercase">Vehicles & Garage</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Owned Personal Vehicles & In-Game Garage Slots</p>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-wider flex items-center gap-2">
                    <FiTruck className="w-4 h-4" />
                    <span>Slots Used: {vehiclesList.length} / 12 Max</span>
                  </div>
                </div>

                {/* Vehicles Slots Usage Progress Bar */}
                <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider">
                    <span className="text-slate-400">Vehicle Slot Capacity</span>
                    <span className="text-cyan-400 font-mono">{vehiclesList.length} / 12</span>
                  </div>
                  <div className="w-full h-3 bg-[#070b0e] rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (vehiclesList.length / 12) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Vehicles Grid */}
                {vehiclesList.length === 0 ? (
                  <div className="bg-[#121922] border border-slate-800/80 rounded-2xl p-8 text-center space-y-3">
                    <FiTruck className="w-12 h-12 text-slate-600 mx-auto" />
                    <h4 className="text-base font-bold text-slate-300">No Vehicles Owned</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      You currently do not own any vehicles. You can purchase vehicles in-game at any Car Dealership or from other players!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vehiclesList.map((veh, idx) => (
                      <div key={veh.ID || idx} className="bg-[#121922] border border-slate-800 hover:border-cyan-500/50 p-5 rounded-2xl transition-all space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black">
                              <FiTruck className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-base font-black text-white">{getVehicleName(veh.ModelID || veh.Model || veh.model || 400)}</h4>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider font-mono border ${
                            veh.Impound === 1
                              ? 'bg-red-500/10 border-red-500/30 text-red-400'
                              : veh.Spawned === 1
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : 'bg-slate-500/10 border-slate-500/30 text-slate-400'
                          }`}>
                            {veh.Impound === 1 ? 'Impounded' : veh.Spawned === 1 ? 'Spawned' : 'Stored'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-xs">
                          <div>
                            <span className="text-[10px] font-extrabold text-slate-500 uppercase">Value / Price</span>
                            <p className="font-mono font-bold text-emerald-400 mt-0.5">${Number(veh.Price || 0).toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold text-slate-500 uppercase">Security Lock</span>
                            <p className="font-mono font-bold text-amber-400 mt-0.5">{veh.Locked === 1 ? 'Locked' : 'Unlocked'}</p>
                          </div>
                          <div className="col-span-2 pt-2 border-t border-slate-800/60">
                            <span className="text-[10px] font-extrabold text-slate-500 uppercase">Parked Location / Zone</span>
                            <p className="font-mono font-bold text-cyan-400 mt-0.5 text-xs">
                              {getVehicleLocation(veh.PosX, veh.PosY, veh.PosZ)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: Houses & Properties */}
            {activeTab === 'properties' && (
              <div className="bg-[#0d131a]/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-8">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-black text-white tracking-wide uppercase">Houses & Commercial Properties</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Real Estate Assets, Residential Houses & Businesses</p>
                </div>

                {/* Section 1: Houses */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <h4 className="text-base font-black text-white flex items-center gap-2">
                      <FiHome className="text-cyan-400" />
                      <span>Owned Houses ({housesList.length})</span>
                    </h4>
                  </div>

                  {housesList.length === 0 ? (
                    <div className="bg-[#121922] border border-slate-800/80 rounded-xl p-6 text-center text-slate-500 text-xs font-bold">
                      No residential houses currently owned.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {housesList.map((house, idx) => {
                        const houseGuns = getHouseWeapons(house);
                        const isRentable = Number(house.rentable || house.hRentable || 0) === 1;
                        const isLocked = Number(house.locked || house.Lock || house.hLocked || 0) === 1;
                        const houseIdVal = house.id || house.ID || house.houseid || idx;

                        return (
                          <div key={houseIdVal} className="bg-[#121922] border border-slate-800 hover:border-cyan-500/50 p-5 rounded-2xl transition-all space-y-4 shadow-xl">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 gap-2">
                              <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                                  <FiHome className="w-5 h-5" />
                                </div>
                                <div>
                                  <h5 className="text-sm font-black text-white font-mono">House #{houseIdVal}</h5>
                                  <span className="text-[10px] text-slate-400 font-mono font-bold">Level {house.level || house.hLevel || 1} Interior</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1.5">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-extrabold uppercase border ${
                                  isLocked ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                }`}>
                                  {isLocked ? 'Locked' : 'Unlocked'}
                                </span>

                                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-extrabold uppercase border ${
                                  isRentable ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                                }`}>
                                  {isRentable ? 'Rentable' : 'Private'}
                                </span>
                              </div>
                            </div>

                            {/* Property Details Grid */}
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="text-[10px] font-extrabold text-slate-500 uppercase">Property Value</span>
                                <p className="font-mono font-bold text-emerald-400 mt-0.5">${Number(house.price || house.hPrice || 0).toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-[10px] font-extrabold text-slate-500 uppercase">Rent Fee</span>
                                <p className="font-mono font-bold text-cyan-400 mt-0.5">${Number(house.rent_fee || house.rent || house.hRent || 0).toLocaleString()}/hr</p>
                              </div>
                              <div>
                                <span className="text-[10px] font-extrabold text-slate-500 uppercase">House Safe Cash</span>
                                <p className="font-mono font-bold text-amber-400 mt-0.5">${Number(house.safe_money || house.money || house.safe || 0).toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-[10px] font-extrabold text-slate-500 uppercase">Materials Vault</span>
                                <p className="font-mono font-bold text-purple-400 mt-0.5">{Number(house.materials || 0).toLocaleString()}</p>
                              </div>
                            </div>

                            {/* House Stored Guns */}
                            <div className="pt-3 border-t border-slate-800/80 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <FiCrosshair className="w-3.5 h-3.5 text-red-400" />
                                  <span>Stored Weapons</span>
                                </span>
                              </div>

                              {houseGuns.length === 0 ? (
                                <div className="bg-[#0b1016] border border-slate-800/60 rounded-xl p-2.5 text-center text-slate-500 text-[11px] font-bold">
                                  No firearms currently stored in house arsenal vault.
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {houseGuns.map((hg, hgIdx) => (
                                    <div key={hgIdx} className="bg-[#0b1016] border border-slate-800/80 p-2 rounded-xl flex items-center justify-between text-xs">
                                      <div className="flex items-center gap-2">
                                        <FiCrosshair className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                                        <span className="font-bold text-white text-xs truncate">{hg.name}</span>
                                      </div>
                                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-red-300 font-mono text-[10px] font-extrabold">
                                        {hg.ammo > 0 ? `${hg.ammo} Ammo` : 'Stored'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Section 2: Businesses */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <h4 className="text-base font-black text-white flex items-center gap-2">
                      <FiBriefcase className="text-cyan-400" />
                      <span>Owned Businesses ({businessesList.length})</span>
                    </h4>
                  </div>

                  {businessesList.length === 0 ? (
                    <div className="bg-[#121922] border border-slate-800/80 rounded-xl p-6 text-center text-slate-500 text-xs font-bold">
                      No commercial businesses currently owned.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {businessesList.map((biz, idx) => {
                        const bizIdVal = (biz.id !== undefined && biz.id !== null) ? biz.id : 
                                         ((biz.ID !== undefined && biz.ID !== null) ? biz.ID : 
                                         (biz.bizzid || biz.BizzID || biz.bID || biz.bizz_id || idx));
                        const isBizLocked = Number(biz.locked || biz.Lock || biz.bLocked || 0) === 1;
                        const currentSafeVal = Number(biz.safe || biz.Safe || biz.money || biz.Till || 0);

                        return (
                          <div key={bizIdVal} className="bg-[#121922] border border-slate-800 hover:border-cyan-500/50 p-5 rounded-2xl transition-all space-y-4 shadow-xl">
                            {/* Business Header */}
                            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 gap-2">
                              <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                                  <FiBriefcase className="w-5 h-5" />
                                </div>
                                <div>
                                  <h5 className="text-sm font-black text-white">{biz.bName || biz.bizz_name || biz.bizzName || biz.StoreName || biz.store_name || biz.bTitle || biz.Title || biz.name || biz.Name || biz.interior_text || `Business #${bizIdVal}`}</h5>
                                  <span className="text-[10px] text-slate-400 font-mono font-bold">Owner: {biz.owner || biz.Owner || playerName}</span>
                                </div>
                              </div>

                              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-extrabold uppercase border ${
                                isBizLocked ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              }`}>
                                {isBizLocked ? 'Closed' : 'Open'}
                              </span>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Price Value</span>
                                <p className="font-mono font-bold text-emerald-400 mt-0.5">${Number(biz.price || biz.Price || 0).toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Safe Till Vault</span>
                                <p className="font-mono font-bold text-cyan-400 mt-0.5">${currentSafeVal.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Stock Products</span>
                                <p className="font-mono font-bold text-amber-400 mt-0.5">{Number(biz.products || biz.Products || 0).toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Business Level</span>
                                <p className="font-mono font-bold text-purple-400 mt-0.5">Level {biz.level || biz.Level || 1}</p>
                              </div>
                            </div>

                            {/* Store Announcement Message */}
                            {biz.message || biz.Message ? (
                              <div className="bg-[#0b1016] border border-slate-800 p-2.5 rounded-xl text-xs">
                                <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Store Message</span>
                                <p className="text-slate-300 italic mt-0.5">"{biz.message || biz.Message}"</p>
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB CONTENT: Inventory & Assets */}
            {activeTab === 'inventory' && (() => {
              const inv = inventoryData?.inventory || ucpStats;
              const weaponsList = inventoryData?.weapons ? getPlayerWeapons(inventoryData) : getPlayerWeapons(ucpStats);

              return (
                <div className="bg-[#0d131a]/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-xl font-black text-white tracking-wide uppercase">Inventory & Personal Assets</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Carried Items, Tactical Gear & Electronics</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                    <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Rope</span>
                      <p className="text-lg font-black text-white font-mono mt-1">{inv.Rope ?? inv.rope ?? 0}</p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Cigars</span>
                      <p className="text-lg font-black text-white font-mono mt-1">{inv.Cigars ?? inv.Cigar ?? inv.cigars ?? 0}</p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Sprunk Can</span>
                      <p className="text-lg font-black text-white font-mono mt-1">{inv.Sprunk ?? inv.sprunk ?? 0}</p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Spray Can</span>
                      <p className="text-lg font-black text-white font-mono mt-1">{inv.Spraycan ?? inv.Spray ?? inv.spraycan ?? 0}</p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Seeds</span>
                      <p className="text-lg font-black text-white font-mono mt-1">{inv.Seeds ?? inv.Seed ?? inv.seeds ?? 0}</p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Screwdriver</span>
                      <p className="text-lg font-black text-white font-mono mt-1">{inv.Screwdriver ?? inv.screwdriver ?? 0}</p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Wristwatch</span>
                      <p className="text-lg font-black text-cyan-400 mt-1 font-mono">
                        {(inv.Wristwatch || inv.Watch || inv.wristwatch) ? 'Owned' : 'None'}
                      </p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Tires</span>
                      <p className="text-lg font-black text-white font-mono mt-1">{inv.Tire ?? inv.Tires ?? inv.tire ?? 0}</p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">First Aid Kit</span>
                      <p className="text-lg font-black text-emerald-400 font-mono mt-1">{inv.FirstAid ?? inv.Firstaid ?? inv.firstaid ?? 0}</p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">RC Cam</span>
                      <p className="text-lg font-black text-white font-mono mt-1">{inv.RCCam ?? inv.Rccam ?? inv.rccam ?? 0}</p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Receiver</span>
                      <p className="text-lg font-black text-white font-mono mt-1">{inv.Receiver ?? inv.receiver ?? 0}</p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">GPS Navigator</span>
                      <p className="text-lg font-black text-cyan-400 mt-1 font-mono">
                        {(inv.GPS || inv.Gps || inv.gps) ? 'Owned' : 'None'}
                      </p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Bug Sweep</span>
                      <p className="text-lg font-black text-white font-mono mt-1">{inv.BugSweep ?? inv.Bugsweep ?? inv.bugsweep ?? 0}</p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Lockpick</span>
                      <p className="text-lg font-black text-white font-mono mt-1">{inv.Lockpick ?? inv.Lockpicks ?? inv.lockpick ?? 0}</p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Rim Kit</span>
                      <p className="text-lg font-black text-white font-mono mt-1">{inv.RimKit ?? inv.Rimkit ?? inv.rimkit ?? 0}</p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Materials</span>
                      <p className="text-lg font-black text-purple-400 font-mono mt-1">{inv.Materials || 0}</p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Crack</span>
                      <p className="text-lg font-black text-amber-400 font-mono mt-1">{inv.Crack || 0}g</p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Pot</span>
                      <p className="text-lg font-black text-emerald-400 font-mono mt-1">{inv.Pot || 0}g</p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Weapon Crates</span>
                      <p className="text-lg font-black text-white font-mono mt-1">{inv.WeaponCrates || 0}</p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Double EXP Tokens</span>
                      <p className="text-lg font-black text-amber-400 font-mono mt-1">{inv.DoubleExpToken || 0}</p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Boombox</span>
                      <p className="text-lg font-black text-cyan-400 mt-1 font-mono">{inv.Boombox ? 'Owned' : 'None'}</p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">MP3 Player</span>
                      <p className="text-lg font-black text-cyan-400 mt-1 font-mono">{inv.Mp3 ? 'Owned' : 'None'}</p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Phonebook</span>
                      <p className="text-lg font-black text-cyan-400 mt-1 font-mono">{inv.Phonebook ? 'Owned' : 'None'}</p>
                    </div>
                  </div>

                  {/* Section: Carrying Guns & Firearms (/myguns) */}
                  <div className="pt-6 border-t border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-3 gap-2">
                      <h4 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <FiCrosshair className="w-5 h-5 text-red-400" />
                        <span>Equipped Weapons & Firearms</span>
                      </h4>
                    </div>

                    {weaponsList.length === 0 ? (
                      <div className="bg-[#121922] border border-slate-800/80 rounded-xl p-5 text-center text-slate-500 text-xs font-bold">
                        No weapons or firearms currently equipped in carried inventory slots.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {weaponsList.map((w, idx) => (
                          <div key={idx} className="bg-[#121922] border border-slate-800 hover:border-red-500/40 p-4 rounded-xl flex items-center justify-between transition-all shadow-lg">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                                <FiCrosshair className="w-5 h-5" />
                              </div>
                              <div>
                                <h5 className="text-sm font-black text-white">{w.name}</h5>
                                <span className="text-[10px] font-mono text-slate-400 font-semibold">Slot #{w.slot} • Weapon ID #{w.id}</span>
                              </div>
                            </div>
                            <div className="text-right font-mono">
                              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-red-300 text-xs font-extrabold border border-slate-700/60">
                                {w.ammo > 0 ? `${w.ammo.toLocaleString()} Ammo` : 'Equipped'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* TAB CONTENT: Skills */}
            {activeTab === 'skills' && (() => {
              const activeSkills = skillsData || ucpStats;
              const getSkillInfo = (skillVal) => {
                const points = Number(skillVal || 0);
                let level = 1;
                let req = 50;
                let remaining = 50;

                if (points < 50) {
                  level = 1;
                  req = 50;
                  remaining = 50 - points;
                } else if (points < 100) {
                  level = 2;
                  req = 100;
                  remaining = 100 - points;
                } else if (points < 200) {
                  level = 3;
                  req = 200;
                  remaining = 200 - points;
                } else if (points < 400) {
                  level = 4;
                  req = 400;
                  remaining = 400 - points;
                } else {
                  level = 5;
                  req = 400;
                  remaining = 0;
                }

                return {
                  level,
                  points,
                  req,
                  remaining,
                  isMax: level === 5,
                  percent: Math.min(100, Math.round((points / req) * 100))
                };
              };

              const skillList = [
                { name: 'Detective', dbKey: 'DetSkill' },
                { name: 'Lawyer', dbKey: 'LawSkill' },
                { name: 'Whore', dbKey: 'SexSkill' },
                { name: 'Drug Dealer', dbKey: 'DrugsSkill' },
                { name: 'Drug Smuggler', dbKey: 'SmugglerSkill' },
                { name: 'Arms Dealer', dbKey: 'ArmsSkill' },
                { name: 'Car Mechanic', dbKey: 'MechSkill' },
                { name: 'Boxer', dbKey: 'BoxSkill' },
                { name: 'Fishing', dbKey: 'FishSkill' },
                { name: 'Trucker', dbKey: 'TruckSkill' },
                { name: 'Car Jacker', dbKey: 'CarSkill' },
                { name: 'Farmer', dbKey: 'FarmerSkill' }
              ];

              return (
                <div className="bg-[#0d131a]/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-xl font-black text-white tracking-wide uppercase">{playerName}'s Skills</h3>
                      <p className="text-xs text-slate-400 mt-0.5">In-Game Skill Progression</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold font-mono">
                      12 Skills Tracked
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skillList.map((s) => {
                      const info = getSkillInfo(activeSkills[s.dbKey]);
                      return (
                        <div key={s.dbKey} className="bg-[#121922] border border-slate-800/90 hover:border-cyan-500/40 rounded-xl p-4 transition-all space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-extrabold text-white">
                              {s.name} Level: <span className="text-cyan-400 font-mono">{info.level}</span>
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-400">
                              {info.points} / {info.req} XP
                            </span>
                          </div>

                          <div className="text-xs font-mono font-semibold text-cyan-400">
                            {info.isMax ? 'MAX LEVEL REACHED' : `- (${info.remaining} more times to level up)`}
                          </div>

                          {/* Skill Level Progress Bar */}
                          <div className="w-full h-2 bg-[#060a0d] rounded-full overflow-hidden border border-slate-800/80 mt-1">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                              style={{ width: `${info.percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* TAB CONTENT: Active Devices & Security */}
            {activeTab === 'security' && (
              <div className="bg-[#0d131a]/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
                  <div>
                    <h3 className="text-xl font-black text-white tracking-wide uppercase flex items-center gap-2">
                      <FiShield className="w-6 h-6 text-emerald-400" />
                      <span>Active Devices & Logged-in Sessions</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Monitor all devices currently logged into your UCP account and terminate unknown logins.
                    </p>
                  </div>

                  <button
                    onClick={handleRevokeOtherSessions}
                    disabled={isRevoking}
                    className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 self-start md:self-auto active:scale-95 disabled:opacity-50"
                  >
                    <FiPower className="w-4 h-4" />
                    <span>{isRevoking ? 'Logging out...' : 'Log Out All Other Devices'}</span>
                  </button>
                </div>

                {securityMessage && (
                  <div className={`p-4 rounded-xl text-xs font-bold border ${securityMessage.includes('Successfully') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                    {securityMessage}
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FiMonitor className="w-4 h-4 text-cyan-400" />
                    <span>Currently Active Logged-in Devices ({activeSessionsList.length})</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeSessionsList.map((session, idx) => (
                      <div 
                        key={idx} 
                        className={`bg-[#121922] border rounded-xl p-5 transition-all space-y-3 relative overflow-hidden ${
                          session.isCurrent 
                            ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10' 
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl border ${session.isCurrent ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'}`}>
                              {session.deviceType === 'Mobile' ? (
                                <FiSmartphone className="w-6 h-6" />
                              ) : (
                                <FiMonitor className="w-6 h-6" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="text-sm font-black text-white">{session.os || 'Desktop OS'}</h5>
                                {session.isCurrent && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider font-mono">
                                    THIS DEVICE (ACTIVE)
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-semibold text-slate-400 mt-0.5">{session.browser || 'Web Browser'}</p>
                            </div>
                          </div>

                          {!session.isCurrent && (
                            <button
                              onClick={() => handleRevokeSingleSession(session.sessionId)}
                              className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-[11px] font-bold transition-all flex items-center gap-1.5 active:scale-95 flex-shrink-0"
                              title="Log out and remove this device"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>

                        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">IP Address</span>
                            <span className="text-slate-300 font-mono font-bold mt-0.5 flex items-center gap-1">
                              <FiGlobe className="w-3 h-3 text-slate-400" />
                              <span>{session.ip || '127.0.0.1'}</span>
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Login Time</span>
                            <span className="text-slate-300 font-mono font-bold mt-0.5 flex items-center gap-1">
                              <FiClock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{parseAnyDate(session.loginTime) || 'Recently'}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Support & Help */}
            {activeTab === 'support' && (
              <div className="bg-[#0d131a]/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                
                {/* Hero Header Card */}
                <div className="bg-gradient-to-r from-cyan-950/40 via-[#121922] to-blue-950/40 border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl">
                  <div className="space-y-2 max-w-2xl">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-extrabold uppercase tracking-widest font-mono inline-flex items-center gap-1.5">
                      <FiLifeBuoy className="w-3.5 h-3.5 text-cyan-400" />
                      Official Support Center
                    </span>
                    <h3 className="text-2xl font-black text-white tracking-wide uppercase">
                      Need Assistance or Support?
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      For account recovery, bug reporting, player reports, or staff inquiries, visit our official Community Forum Support & Tickets section or join our Discord server.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
                    <a
                      href="https://forums.pgaming.net/index.php"
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-95"
                    >
                      <FiMessageSquare className="w-4 h-4" />
                      <span>Official Forum Support & Tickets</span>
                      <FiExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>

                    <a
                      href="https://discord.gg/paraisogaming"
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-3 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2]/30 border border-[#5865F2]/40 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                    >
                      <FaDiscord className="w-4 h-4 text-[#5865F2]" />
                      <span>Discord Server</span>
                      <FiExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>
                  </div>
                </div>

                {/* Step-by-Step Ticket Creation Guide */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <FiMessageSquare className="w-4 h-4 text-cyan-400" />
                    <span>How to Submit a Support Ticket (Forum & Discord)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#121922] border border-slate-800 p-5 rounded-xl space-y-2 hover:border-cyan-500/40 transition-all">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-black flex items-center justify-center text-sm">
                        01
                      </div>
                      <h5 className="text-sm font-extrabold text-white">Visit Forum / Discord</h5>
                      <p className="text-xs text-slate-400 leading-normal">
                        Click <span className="text-cyan-400 font-mono font-bold">Official Forum Support</span> or join our Discord server.
                      </p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-5 rounded-xl space-y-2 hover:border-cyan-500/40 transition-all">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-black flex items-center justify-center text-sm">
                        02
                      </div>
                      <h5 className="text-sm font-extrabold text-white">Support & Tickets</h5>
                      <p className="text-xs text-slate-400 leading-normal">
                        Open the <span className="text-cyan-400 font-mono font-bold">Support & Tickets</span> section on Forum or Discord.
                      </p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-5 rounded-xl space-y-2 hover:border-cyan-500/40 transition-all">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-black flex items-center justify-center text-sm">
                        03
                      </div>
                      <h5 className="text-sm font-extrabold text-white">Submit Ticket</h5>
                      <p className="text-xs text-slate-400 leading-normal">
                        Create a new thread or ticket selecting your category (Account / Bug / Refund).
                      </p>
                    </div>

                    <div className="bg-[#121922] border border-slate-800 p-5 rounded-xl space-y-2 hover:border-cyan-500/40 transition-all">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-black flex items-center justify-center text-sm">
                        04
                      </div>
                      <h5 className="text-sm font-extrabold text-white">Staff Review</h5>
                      <p className="text-xs text-slate-400 leading-normal">
                        Provide details & screenshots. Our Admin Team will assist you promptly!
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
};

export default UcpDashboard;
