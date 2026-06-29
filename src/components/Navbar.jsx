import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { HiMenu, HiX } from 'react-icons/hi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Donate', path: '/donate' },
    { name: 'Rules', path: '/rules' },
    { name: 'Forums', path: '/forums' },
  ];

  const actionLinks = [
    { name: 'Community', path: '/community' },
    { name: 'Staff', path: '/staff' },
    { name: 'Apply', path: '/apply' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900 border-b-2 border-cyan-500 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center hover:shadow-lg hover:shadow-cyan-400/50 transition-shadow">
              <span className="text-white font-bold text-lg"><img src='./logo.png'></img></span>
            </div>
            <span className="text-cyan-400 font-bold text-xl hidden sm:inline">Paraiso <span className='text-base-100'>Roleplay</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors font-medium pb-1 ${
                  isActive(link.path)
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-300 hover:text-cyan-400 border-b-2 border-transparent hover:border-cyan-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Action Links */}
          <div className="hidden lg:flex items-center gap-4">
            {actionLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors font-medium pb-1 ${
                  isActive(link.path)
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-300 hover:text-cyan-400 border-b-2 border-transparent hover:border-cyan-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              className="btn btn-sm btn-outline btn-success hover:btn-success"
            >
              Login / Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-cyan-400 bg-none border-none cursor-pointer"
            onClick={toggleMenu}
          >
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-slate-800 border-t border-cyan-500 animate-in slide-in-from-top-2">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-2 px-2 rounded transition-colors ${
                    isActive(link.path)
                      ? 'text-cyan-400 bg-slate-700 font-medium'
                      : 'text-gray-300 hover:text-cyan-400 hover:bg-slate-700'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-cyan-500 pt-3 mt-3">
                {actionLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-2 px-2 rounded transition-colors mb-2 ${
                      isActive(link.path)
                        ? 'text-cyan-400 bg-slate-700 font-medium'
                        : 'text-gray-300 hover:text-cyan-400 hover:bg-slate-700'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <Link
                to="/login"
                className="btn btn-sm btn-success w-full mt-2"
                onClick={() => setIsOpen(false)}
              >
                Login / Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;