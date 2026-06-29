import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaDiscord } from 'react-icons/fa';
import { NAV_LINKS, SITE } from '../config/site';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0c0e12]/95 backdrop-blur-md border-b border-[rgba(232,166,53,0.12)] shadow-[0_4px_24px_rgba(0,0,0,0.3)]'
          : 'bg-[#0c0e12]/80 backdrop-blur-sm border-b border-[rgba(232,166,53,0.06)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 py-2">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-sm flex items-center justify-center overflow-hidden border border-[rgba(232,166,53,0.15)] group-hover:border-[rgba(232,166,53,0.4)] transition-all duration-300">
              <img src="/logo.png" alt={SITE.brandName + ' logo'} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-base text-[var(--pg-amber)] tracking-wide leading-tight">
                Paraíso
              </span>
              <span className="font-display text-[10px] text-[var(--pg-dim)] tracking-[0.2em] uppercase leading-tight">
                Gaming
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-display font-medium text-sm tracking-wide transition-all duration-200 pb-0.5 ${
                  isActive(link.path)
                    ? 'text-[var(--pg-amber)] border-b border-[var(--pg-amber)]'
                    : 'text-[var(--pg-muted)] hover:text-[var(--pg-text)] border-b border-transparent hover:border-[rgba(232,166,53,0.3)]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center">
            <a
              href={SITE.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[var(--pg-amber)] hover:bg-[#d4952e] text-[#0c0e12] font-display font-bold text-xs tracking-wider uppercase transition-all duration-200 hover:shadow-[0_0_16px_rgba(232,166,53,0.3)]"
            >
              <FaDiscord size={14} />
              Join Discord
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-[var(--pg-amber)] p-1 rounded transition-colors hover:bg-[rgba(232,166,53,0.08)]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <HiX size={22} /> : <HiMenu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-[rgba(232,166,53,0.08)] py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2.5 px-3 rounded-sm font-display font-medium text-sm tracking-wide transition-colors ${
                  isActive(link.path)
                    ? 'text-[var(--pg-amber)] bg-[rgba(232,166,53,0.06)]'
                    : 'text-[var(--pg-muted)] hover:text-[var(--pg-text)] hover:bg-[rgba(255,255,255,0.03)]'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-[rgba(232,166,53,0.06)]">
              <a
                href={SITE.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[var(--pg-amber)] hover:bg-[#d4952e] text-[#0c0e12] font-display font-bold text-sm tracking-wider uppercase transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FaDiscord size={14} />
                Join Discord
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;