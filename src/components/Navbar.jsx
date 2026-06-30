import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', path: '/' },
    { 
      name: 'Rules', 
      isDropdown: true,
      subLinks: [
        { name: 'General Rules', path: '/rules' },
        { name: 'Server Offenses', path: '/rules/offenses' }
      ]
    },
    { 
      name: 'Forums', 
      path: 'https://forums.pgaming.net/index.php', 
      isExternal: true,
      blank: true
    },
  ];

  const handleNavClick = (link) => {
    setIsOpen(false);
    
    if (link.isExternal && link.blank) {
      window.open(link.path, '_blank');  
    } else if (link.isExternal) {
      window.location.href = link.path;
    } else {
      navigate(link.path);  
    }
  };

  const actionLinks = [
    { name: 'Staff', path: '/staff' },
    { 
      name: 'Apply', 
      isDropdown: true, 
      subLinks: [
        { name: 'Faction Apply', path: 'https://forums.pgaming.net/index.php#factions.8', isExternal: true, blank: true },
        { name: 'Gangs Apply', path: 'https://forums.pgaming.net/index.php#gangs', isExternal: true, blank: true }
      ]
    },
  ];

  const isActive = (path) => location.pathname === path;

  const renderLinks = (linksArray, isMobile = false) => {
    return linksArray.map((link, index) => {
      if (link.isDropdown) {
        return isMobile ? (
          <div key={index} className="mb-2">
            <div className="text-gray-500 py-2 px-2 font-bold uppercase text-xs tracking-widest flex items-center gap-1">
              {link.name} <HiChevronDown />
            </div>
            <div className="pl-4 border-l border-slate-700 ml-3 space-y-1 mt-1">
              {link.subLinks.map((subLink, subIndex) => (
                <button
                  key={subIndex}
                  onClick={() => handleNavClick(subLink)}
                  className="block w-full text-left py-2 px-2 rounded transition-colors text-sm text-gray-400 hover:text-cyan-400 hover:bg-slate-700 bg-transparent border-none cursor-pointer"
                >
                  {subLink.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div key={index} className="relative group flex items-center self-center">
            <button className="flex items-center gap-1 text-gray-300 hover:text-cyan-400 hover:underline hover:underline-offset-4 hover:decoration-cyan-400 transition-all duration-300 font-medium bg-transparent border-0 p-0 cursor-pointer">
              {link.name} <HiChevronDown className="text-sm group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute left-0 top-full mt-2 w-48 bg-slate-800 border border-cyan-500/50 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 z-50">
              {link.subLinks.map((subLink, subIndex) => (
                <button
                  key={subIndex}
                  onClick={() => handleNavClick(subLink)}
                  className="text-left px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-cyan-400 hover:bg-slate-700/50 transition-colors bg-transparent border-0 cursor-pointer"
                >
                  {subLink.name}
                </button>
              ))}
            </div>
          </div>
        );
      }

      const linkClasses = isMobile
        ? `block w-full text-left py-2 px-2 rounded transition-colors mb-2 ${isActive(link.path) ? 'text-cyan-400 bg-slate-700 font-medium' : 'text-gray-300 hover:text-cyan-400 hover:bg-slate-700 bg-transparent'}`
        : `font-medium self-center underline-offset-4 decoration-cyan-400 transition-all duration-300 ${isActive(link.path) ? 'text-cyan-400 underline' : 'text-gray-300 hover:text-cyan-400 hover:underline'}`;  

      if (link.isExternal) {
        return (
          <button key={index} onClick={() => handleNavClick(link)} className={`${linkClasses} border-none cursor-pointer bg-transparent`}>
            {link.name}
          </button>
        );
      }

      return (
        <Link key={index} to={link.path} className={linkClasses} onClick={() => isMobile && setIsOpen(false)}>
          {link.name}
        </Link>
      );
    });
  };

  return (
    <nav className="bg-slate-900 border-b-2 border-cyan-500 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center hover:shadow-lg hover:shadow-cyan-400/50 transition-shadow">
              <span className="text-white font-bold text-lg"><img src='./logo.png' alt="logo" /></span>
            </div>
            <span className="text-cyan-400 font-bold text-xl hidden sm:inline">Paraiso <span className='text-base-100'>Gaming</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {renderLinks(navLinks, false)}
          </div>

          {/* Desktop Action Links */}
          <div className="hidden lg:flex items-center gap-3">
            {renderLinks(actionLinks, false)}
            <a
              href="https://discord.com/invite/7AsJaG3KSV"
              target='_blank'
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2 bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-white text-sm font-bold rounded-full transition-all duration-200 shadow-lg shadow-cyan-500/40 hover:shadow-cyan-400/60 hover:scale-105 whitespace-nowrap ml-1"
            >
              Join Discord
            </a>
          </div>

          <button className="lg:hidden text-cyan-400 bg-transparent border-none cursor-pointer" onClick={toggleMenu}>
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu — always mounted, animated via max-height + opacity */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? 'max-h-[600px] opacity-100'
              : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="bg-slate-800 border-t border-cyan-500">
            <div className="px-4 py-4 space-y-3">
              {renderLinks(navLinks, true)}
              <div className="border-t border-cyan-500/30 pt-3 mt-3">
                {renderLinks(actionLinks, true)}
              </div>
              <a
                href="https://discord.com/invite/7AsJaG3KSV"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full py-2.5 mt-4 bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-900 text-sm font-bold rounded-full transition-all duration-200 shadow-lg shadow-cyan-500/40"
                onClick={() => setIsOpen(false)}
              >
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;