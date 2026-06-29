import { Link } from 'react-router';
import { FaDiscord } from 'react-icons/fa';
import { SITE } from '../config/site';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rules', path: '/rules' },
    { name: 'Community', path: '/community' },
    { name: 'Staff', path: '/staff' },
    { name: 'Apply', path: '/apply' },
  ];

  return (
    <footer className="bg-[#08090c] border-t border-[rgba(232,166,53,0.06)] text-[var(--pg-muted)]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm overflow-hidden border border-[rgba(232,166,53,0.1)]">
                <img src="/logo.png" alt={SITE.brandName + ' logo'} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-cyan-400 font-bold text-xl hidden sm:inline">Paraiso <span className='text-base-100'>Roleplay</span></span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-base-200 max-w-xs">
              {SITE.description}
            </p>
            <a
              href={SITE.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-2xl text-[#0c0e12] font-display font-bold text-xs tracking-wider uppercase transition-all duration-200 w-fit"
            >
              <FaDiscord size={13} />
              Join Discord
            </a>
          </div>

          {/* Quick links */}
          <div>
            <h6 className="font-display font-bold text-xs tracking-[0.15em] uppercase text-cyan-400 mb-4">
              Quick Links
            </h6>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Status */}
          <div>
            <h6 className="font-display font-bold text-xs tracking-[0.15em] uppercase text-cyan-400 mb-4">
              City Status
            </h6>
            <div className="space-y-2.5">
              {[
                { label: 'Server Launch', value: 'Preparing' },
                { label: 'Community', value: 'Open' },
                { label: 'Applications', value: 'Coming Soon' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-white">{item.label}</span>
                  <span className="font-mono text-xs text-amber-200">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-[rgba(232,166,53,0.04)] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-gray-300">
          <p>
            © {new Date().getFullYear()} Paraíso Gaming — Developed by{' '}
            <span className="text-cyan-400">Shohag</span>
          </p>
          <p className="font-mono tracking-wider uppercase">SA-MP Roleplay · Preparing for Launch</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;