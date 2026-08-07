import React, { useState, useEffect } from 'react';
import SwiperBanner from './SwiperBanner';
import FeaturesSlider from './FeaturesSlider';
import { FaServer } from 'react-icons/fa';
import { BASE_URL } from '../../config/api';

const HomeTwo = () => {
  const [copied, setCopied] = useState(false);
  const [serverInfo, setServerInfo] = useState({
    server_ip: 'Coming Soon...',
    discord_url: 'https://discord.gg/7AsJaG3KSV',
    status: 'online'
  });

  useEffect(() => {
    fetch(`${BASE_URL}/server-info?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.server_ip) {
          setServerInfo(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleCopyIP = () => {
    const ipToCopy = serverInfo.server_ip || 'Coming Soon...';
    navigator.clipboard.writeText(ipToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'online':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Online
          </span>
        );
      case 'offline':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 border border-red-500/30 text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Offline
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Maintenance
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div id="home-two" className="w-full px-4 sm:px-6 lg:px-8 my-4 md:my-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Image Grid Grid Split Layout Setup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT AREA: Both Sliders mapped dynamically (Takes 8 Columns) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <SwiperBanner />
            <FeaturesSlider />
          </div>

          {/* RIGHT AREA: Sticky Sidebar widgets (Takes 4 Columns) */}
          <div className="lg:col-span-4 w-full flex flex-col gap-6 sticky top-24">
            
            {/* Status Card */}
            <div className="w-full bg-[#0d1219] border border-[#1e293b] rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FaServer className="text-cyan-500" />
                  <span className='text-cyan-500'>SAMP</span> SERVER
                </h3>
                {getStatusBadge(serverInfo.status || 'online')}
              </div>

              <div onClick={handleCopyIP} className="flex items-center justify-between bg-black/40 p-4 rounded-lg cursor-pointer border border-[#1e293b] hover:border-cyan-500/50 transition-colors group">
                <div>
                  <p className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">
                    {copied ? 'IP Copied!' : 'Click to Copy IP'}
                  </p>
                  <p className={`font-mono font-bold text-sm ${copied ? 'text-green-400' : 'text-cyan-400'}`}>
                    {serverInfo.server_ip || 'Coming Soon...'}
                  </p>
                </div>
              </div>
            </div>

            {/* Discord Widget */}
            <div className="w-full bg-[#0d1219] rounded-2xl overflow-hidden shadow-xl border border-[#1e293b]">
              <iframe src="https://discord.com/widget?id=1519328496898408519&theme=dark" width="100%" height="480" allowTransparency="true" frameBorder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts" title="Discord Server Widget"></iframe>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default HomeTwo;