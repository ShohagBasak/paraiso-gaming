import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (!isHomePage) {
      setIsScrolled(false);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const isLarge = isHomePage && !isScrolled;

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Donate', path: '/donate' },
    {
      name: 'Rules',
      isDropdown: true,
      align: 'left',
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
    {
      name: 'Government',
      isDropdown: true,
      align: 'left',
      subLinks: [
        { name: 'Govt Roster', path: '/roster/government' },
        { name: 'Govt Chain of Command', path: '/roster/chain-of-command' },
      ]
    },
  ];

  const handleNavClick = (link) => {
    setIsOpen(false);

    if (link.isLogout) {
      logoutUser();
    } else if (link.isExternal && link.blank) {
      window.open(link.path, '_blank');
    } else if (link.isExternal) {
      window.location.href = link.path;
    } else {
      navigate(link.path);
    }
  };

  const getActionLinks = () => {
    const applySubLinks = [
      { name: 'Faction Apply', path: 'https://forums.pgaming.net/index.php#factions.8', isExternal: true, blank: true },
      { name: 'Gangs Apply', path: 'https://forums.pgaming.net/index.php#gangs', isExternal: true, blank: true },
    ];

    if (!user) {
      applySubLinks.push({ name: 'Webmaster Login', path: '/login' });
    } else {
      if (user.role === 'admin' || user.role === 'master') {
        applySubLinks.push({ name: 'Dashboard', path: '/dashboard' });
      }
      applySubLinks.push({ name: 'Logout', path: '#logout', isLogout: true });
    }

    return [
      {
        name: 'Staff',
        isDropdown: true,
        align: 'left',
        subLinks: [
          { name: 'Admin Roster', path: '/staff' },
          { name: 'Helper Roster', path: '/roster/helper' }
        ]
      },
      {
        name: 'Apply',
        isDropdown: true,
        align: 'right',
        subLinks: applySubLinks
      },
    ];
  };

  const actionLinks = getActionLinks();

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
                  className={`block w-full text-left py-2 px-2 rounded transition-colors text-sm bg-transparent border-none cursor-pointer ${subLink.isLogout
                      ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                      : 'text-gray-400 hover:text-cyan-400 hover:bg-slate-700'
                    }`}
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
            <div className={`absolute ${link.align === 'left' ? 'left-0' : 'right-0'} top-full mt-2 w-48 bg-slate-800 border border-cyan-500/50 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 z-50`}>
              {link.subLinks.map((subLink, subIndex) => (
                <button
                  key={subIndex}
                  onClick={() => handleNavClick(subLink)}
                  className={`text-left px-4 py-2.5 text-sm font-medium transition-colors bg-transparent border-0 cursor-pointer ${subLink.isLogout
                      ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                      : 'text-gray-300 hover:text-cyan-400 hover:bg-slate-700/50'
                    }`}
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

      if (link.isLogout) {
        const logoutClasses = isMobile
          ? `block w-full text-left py-2 px-2 rounded transition-colors mb-2 text-red-400 hover:bg-slate-700 bg-transparent`
          : `font-medium self-center underline-offset-4 decoration-red-500 transition-all duration-300 text-gray-300 hover:text-red-400 hover:underline`;
        return (
          <button
            key={index}
            onClick={() => {
              logoutUser();
              if (isMobile) setIsOpen(false);
            }}
            className={`${logoutClasses} border-none cursor-pointer bg-transparent`}
          >
            {link.name}
          </button>
        );
      }

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
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-in-out`}
      style={{
        backgroundColor: isLarge ? 'transparent' : 'rgba(15, 23, 42, 0.95)',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(6,182,212,0.15)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div
          className="flex justify-between items-center transition-all duration-500 ease-in-out"
          style={{ height: isLarge ? '120px' : '80px' }}
        >

          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0 transition-all duration-500 ease-in-out origin-left"
            style={{ transform: isLarge ? 'scale(1.6)' : 'scale(1)' }}
          >
            <div className="w-12 h-12  rounded-lg flex items-center justify-center hover:shadow-lg hover:shadow-cyan-400/50 transition-shadow">
              <span className="text-white font-bold text-lg"><img src='./logonobg.png' alt="logo" /></span>
            </div>
          </Link>

          {/* Desktop Navigation & Actions aligned to the right */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-8">
            {renderLinks(navLinks, false)}
            {renderLinks(actionLinks, false)}
          </div>

          <button className="lg:hidden text-cyan-400 bg-transparent border-none cursor-pointer" onClick={toggleMenu}>
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu — always mounted, animated via max-height + opacity */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${isOpen
              ? 'max-h-[80vh] opacity-100 overflow-y-auto'
              : 'max-h-0 opacity-0 pointer-events-none overflow-hidden'
            }`}
        >
          <div className="bg-slate-800 border-t border-cyan-500">
            <div className="px-4 pt-4 pb-12 space-y-3">
              {renderLinks(navLinks, true)}
              <div className="border-t border-cyan-500/30 pt-3 mt-3">
                {renderLinks(actionLinks, true)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;