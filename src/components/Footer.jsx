import React from 'react';
import { FaDiscord, FaComments, FaTwitter, FaTwitch } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#0b131a] text-gray-400 p-10 font-sans border-t border-gray-800">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Columns: Site Map & Links */}
        <div className="md:col-span-4 grid grid-cols-2 gap-4">
          <div>
            <h6 className="text-white font-bold tracking-wider uppercase mb-3 text-sm">Site Map</h6>
            <ul className="space-y-2 text-sm">
              <li><a href="/site-map" className="hover:text-cyan-400 transition-colors">Site Map</a></li>
              <li><a href="/forum" className="hover:text-cyan-400 transition-colors">Forum</a></li>
              <li><a href="/community" className="hover:text-cyan-400 transition-colors">Community</a></li>
              <li><a href="/connect" className="hover:text-cyan-400 transition-colors">Connect</a></li>
            </ul>
          </div>
          <div>
            <h6 className="opacity-0 font-bold tracking-wider uppercase mb-3 text-sm hidden md:block">More Links</h6>
            <ul className="space-y-2 text-sm md:mt-8">
              <li><a href="/status" className="hover:text-cyan-400 transition-colors">Server Status</a></li>
              <li><a href="/samp" className="hover:text-cyan-400 transition-colors">SAMP SA:MP</a></li>
              <li><a href="/twitch" className="hover:text-cyan-400 transition-colors">Twitch</a></li>
            </ul>
          </div>
        </div>

        {/* Center Column: Newsletter Subscription */}
        <div className="md:col-span-5 flex flex-col space-y-3">
          <h6 className="text-cyan-400 font-extrabold tracking-wide uppercase text-base">
            Never Miss An Update!
          </h6>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
            Subscribe to our newsletter for exclusive news, event invites, and special offers.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex items-center w-full max-w-md mt-2">
            <input 
              type="email" 
              placeholder="Your Email Address..." 
              className="input input-bordered bg-[#0f1922] text-white border-gray-700 focus:border-cyan-500 focus:outline-none rounded-r-none w-full text-sm h-11"
              required
            />
            <button 
              type="submit" 
              className="btn bg-cyan-400 hover:bg-cyan-500 text-slate-900 border-none font-bold rounded-l-none px-6 h-11 min-h-0 uppercase text-xs tracking-wider"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Right Column: Social Media */}
        <div className="md:col-span-3 flex flex-col md:items-end space-y-3">
          <h6 className="text-white font-bold tracking-wider text-sm">
            Official Social Media
          </h6>
          <div className="flex gap-4 text-2xl text-white">
            <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
              <FaDiscord />
            </a>
            <a href="/forum" className="hover:text-cyan-400 transition-colors">
              <FaComments />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
              <FaTwitter />
            </a>
            <a href="https://twitch.tv" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
              <FaTwitch />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Section: Copyright */}
      <div className="border-t border-gray-900 mt-10 pt-6 text-center text-xs text-gray-500 max-w-7xl mx-auto">
        <p className='text-gray-400'>Copyright © From 2018 to {new Date().getFullYear()} - Developed by <span className='text-blue-400'>Shohag</span></p>
      </div>
    </footer>
  );
};

export default Footer;