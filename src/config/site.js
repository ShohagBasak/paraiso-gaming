// ─── Paraíso Gaming — Site Config ────────────────────────────────────────────
// City Dispatch / Municipal Transmission direction.
// All static content. No backend. No CMS.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE = {
  brandName: 'Paraíso Gaming',
  tagline: 'San Andreas Multiplayer · Roleplay Server',
  description:
    'A community-driven SA-MP roleplay server preparing to open its borders. Join the dispatch frequency to become a founding citizen.',
  discordUrl: 'https://discord.gg/7AsJaG3KSV',
};

// ─── Navigation ──────────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Rules', path: '/rules' },
  { name: 'Community', path: '/community' },
  { name: 'Staff', path: '/staff' },
  { name: 'Apply', path: '/apply' },
];

// ─── Hero — Dispatch Notice ──────────────────────────────────────────────────

export const HERO = {
  label: 'CITY DISPATCH // PRE-LAUNCH TRANSMISSION',
  heading: 'A new city is being built.',
  body: 'Somewhere between the coastline and the interstate, a city is taking shape. The streets aren\'t finished. The factions are still forming. But the radio is already on.',
  ctaPrimary: 'Tune In',
  ctaSecondary: 'Read the Dossier',
  dispatch: {
    header: 'MUNICIPAL NOTICE NO. 001',
    title: 'Borders Open Soon',
    body: 'The City of Paraíso is preparing to accept founding residents. All citizen registration is handled through the official dispatch frequency. Early registrants will receive priority notification when the city opens.',
    cta: 'Join the Frequency',
  },
};

// ─── Status Ticker ───────────────────────────────────────────────────────────

export const TICKER_ITEMS = [
  { id: 'build',   label: 'SERVER BUILD',  status: 'IN PROGRESS', variant: 'progress' },
  { id: 'comm',    label: 'COMMUNITY',     status: 'OPEN',        variant: 'active' },
  { id: 'discord', label: 'DISCORD',       status: 'ACTIVE',      variant: 'active' },
  { id: 'apps',    label: 'APPLICATIONS',  status: 'SOON',        variant: 'pending' },
];

// ─── District Dossier (Features) ─────────────────────────────────────────────

export const DISTRICTS = [
  {
    id: 'commerce',
    dept: 'DEPT. OF COMMERCE',
    title: 'Roleplay Economy',
    body: 'A fully simulated economy with banks, properties, businesses, and a dynamic market. Earn your way up, invest wisely, or gamble it all.',
    tags: ['Banking', 'Properties', 'Market'],
    accentColor: 'amber',
    watermark: '$',
  },
  {
    id: 'employment',
    dept: 'BUREAU OF EMPLOYMENT',
    title: 'Jobs & Careers',
    body: 'Dozens of legal and illegal career paths — from cab driver to arms dealer. Progress through ranks and earn unique perks at every level.',
    tags: ['Legal', 'Illegal', 'Ranks'],
    accentColor: 'teal',
    watermark: 'B',
  },
  {
    id: 'enforcement',
    dept: 'DISTRICT ENFORCEMENT',
    title: 'Factions & Gangs',
    body: 'Join government agencies, criminal organizations, or start your own crew. Territory control, faction wars, and political power are all on the table.',
    tags: ['Territory', 'Law', 'Crime'],
    accentColor: 'red',
    watermark: 'F',
  },
  {
    id: 'motor',
    dept: 'MOTOR REGISTRY',
    title: 'Vehicles & Street Culture',
    body: 'Hundreds of vehicles with custom tuning, handling, and a realistic licensing system. Street races, car meets, and underground drag strips.',
    tags: ['Tuning', 'Racing', 'Licensing'],
    accentColor: 'amber',
    watermark: 'V',
  },
  {
    id: 'housing',
    dept: 'CITY HOUSING AUTHORITY',
    title: 'Properties & Businesses',
    body: 'Buy apartments, homes, or storefronts. Run your own business, hire staff, and build a legitimate or underground empire across the city.',
    tags: ['Apartments', 'Storefronts', 'Enterprise'],
    accentColor: 'teal',
    watermark: 'H',
  },
  {
    id: 'community',
    dept: 'OFFICE OF COMMUNITY AFFAIRS',
    title: 'Events & City Stories',
    body: 'Regular community-driven events, races, roleplay scenarios, and staff-hosted activities. There is always something happening in Paraíso.',
    tags: ['Events', 'Stories', 'Races'],
    accentColor: 'red',
    watermark: 'E',
  },
];

// ─── Founding Charter ────────────────────────────────────────────────────────

export const CHARTER = {
  header: 'FOUNDING CITIZEN CHARTER',
  subheader: 'PARAÍSO MUNICIPAL REGISTRY',
  directive: 'Directive PG-2026-001',
  cta: 'Register as Founding Citizen',
  sections: [
    {
      id: '01',
      title: 'Early Access',
      body: 'Citizens who register before city opening receive founding resident status. Your name will be on record from day one.',
    },
    {
      id: '02',
      title: 'Shape the City',
      body: 'Founding citizens may submit proposals for city infrastructure, economy balance, and governance. Your voice carries weight.',
    },
    {
      id: '03',
      title: 'Launch Notices',
      body: 'Receive the server IP, launch date, and every major update the moment it drops — straight to your dispatch frequency.',
    },
    {
      id: '04',
      title: 'Civil Service',
      body: 'Staff applications and whitelist positions open through the dispatch channel first. Founding citizens get the earliest opportunity.',
    },
  ],
};

// ─── Radio CTA ───────────────────────────────────────────────────────────────

export const RADIO = {
  frequency: '107.4 FM',
  heading: 'Radio Paraíso',
  intro: "You're listening to",
  body: '"The city is almost ready. The streets are being paved, the factions are forming, and we\'re looking for founding residents. If you can hear this, you\'re already closer than you think."',
  cta: 'Join the Frequency',
};
