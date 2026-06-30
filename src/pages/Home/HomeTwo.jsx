import React, { useState } from 'react';
// Sliders individual file theke import kora holo (path check kore niben)
import SwiperBanner from './SwiperBanner';
import FeaturesSlider from './FeaturesSlider';
import { FaServer, FaDiscord } from 'react-icons/fa';

const HomeTwo = () => {
  const [copied, setCopied] = useState(false);
  const serverIP = "Coming Soon";

  const handleCopyIP = () => {
    navigator.clipboard.writeText(serverIP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 my-6 md:my-10 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Image Grid Grid Split Layout Setup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT AREA: Both Sliders mapped dynamically (Takes 8 Columns) */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            <SwiperBanner />
            <FeaturesSlider />
          </div>

          {/* RIGHT AREA: Sticky Sidebar widgets (Takes 4 Columns) */}
          <div className="lg:col-span-4 w-full flex flex-col gap-6 sticky top-24">
            
            {/* Status Card */}
            <div className="w-full bg-[#0d1219] border border-[#1e293b] rounded-2xl p-5 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FaServer className="text-cyan-500" />
                <span className='text-cyan-500'>Paraiso</span> Gaming Server
              </h3>

              <div onClick={handleCopyIP} className="flex items-center justify-between bg-black/40 p-4 rounded-lg cursor-pointer border border-[#1e293b] hover:border-cyan-500/50 transition-colors mb-4 group">
                <div>
                  <p className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">
                    {copied ? 'IP Copied!' : 'Click to Copy IP'}
                  </p>
                  <p className={`font-mono font-bold text-sm ${copied ? 'text-green-400' : 'text-cyan-400'}`}>
                    Coming Soon...
                  </p>
                </div>
              </div>

              <a href="https://discord.gg/7AsJaG3KSV" target="_blank" rel="noreferrer" className="w-full py-3 bg-[#5865F2] hover:bg-[#4752C4] rounded-lg text-white transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest font-bold">
                <FaDiscord className="text-xl" /> Join Community
              </a>
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