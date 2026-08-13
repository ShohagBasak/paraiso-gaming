import { Link } from 'react-router';
import { FaDiscord, FaExternalLinkAlt } from 'react-icons/fa';
import { HiChevronRight } from 'react-icons/hi';
import { SITE } from '../config/site';

const Footer = () => {
  const quickLinks = [
    { name: 'Home',             path: '/' },
    { name: 'Highscores',       path: '/highscores' },
    { name: 'General Rules',    path: '/rules' },
    { name: 'Server Offenses',  path: '/rules/offenses' },
    { name: 'Staff',            path: '/staff' },
  ];

  const externalLinks = [
    { name: 'Forums',             path: 'https://forums.pgaming.net/index.php' },
    { name: 'Faction Apply',      path: 'https://forums.pgaming.net/index.php#factions.8' },
    { name: 'Gangs Apply',        path: 'https://forums.pgaming.net/index.php#gangs' },
  ];

  return (
    <footer className="relative bg-slate-900 border-t-2 border-cyan-500/40 text-gray-400 overflow-hidden">

      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 pb-10 border-b border-slate-700/60">

          {/* Brand — spans 2 cols on lg */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-5 pr-0 lg:pr-8">
            {/* Logo + name */}
            <Link to="/" className="flex items-center gap-3 w-fit group">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-cyan-500/30 group-hover:border-cyan-400 transition-colors flex-shrink-0 shadow-md shadow-cyan-500/10">
                <img src="./logonobg.png" alt="Paraiso Roleplay logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-cyan-400 font-bold text-xl leading-none">Paraiso</span>
                <span className="text-white font-bold text-xl leading-none ml-1.5">Gaming</span>
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              {SITE.description}
            </p>

            {/* Discord CTA */}
            <a
              href={SITE.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-900 font-bold text-sm rounded-full transition-all duration-200 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:scale-105 w-full sm:w-fit justify-center sm:justify-start"
            >
              <FaDiscord size={16} />
              Join Our Discord
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h6 className="text-xs font-bold tracking-[0.15em] uppercase text-cyan-400 mb-5">
              Quick Links
            </h6>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-200 group"
                  >
                    <HiChevronRight className="text-xs text-cyan-500/50 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h6 className="text-xs font-bold tracking-[0.15em] uppercase text-cyan-400 mb-5">
              Community
            </h6>
            <ul className="space-y-3">
              {externalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-200 group"
                  >
                    <HiChevronRight className="text-xs text-cyan-500/50 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all duration-200" />
                    {link.name}
                    <FaExternalLinkAlt className="text-[9px] opacity-0 group-hover:opacity-60 transition-opacity ml-auto" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            © {new Date().getFullYear()}{' '}
            <span className="text-gray-300">Paraiso Gaming. All Rights Reserved.</span>
          </p>
          <p className="text-[11px] font-mono text-gray-600 tracking-widest uppercase">
            SA-MP · Roleplay
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;