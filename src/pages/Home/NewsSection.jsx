import React, { useState } from 'react';
// Icon gulo import kora hoyeche UI sundor korar jonno
import { FaCopy, FaCheck, FaDiscord, FaServer, FaUsers } from 'react-icons/fa';

const NewsSection = () => {
  // IP Copy korar state control
  const [copied, setCopied] = useState(false);
  // Apnar server er IP ekhane boshaben
  const serverIP = "play.paraiso-rp.com:7777"; 

  const handleCopyIP = () => {
    navigator.clipboard.writeText(serverIP);
    setCopied(true);
    // 2 second por abar 'Copy' icon e fire jabe
    setTimeout(() => setCopied(false), 2000); 
  };

  const newsData = [
    {
      id: 1,
      date: "June 24, 2026",
      title: "New Summer Season Launched!",
      description: "Featuring new jobs, events, and exclusive rewards for all players.",
      image: "🎉"
    },
    {
      id: 2,
      date: "June 20, 2026",
      title: "Drag Racing Championship Started",
      description: "Win up to 1 million cash prizes every week. Join the competition now!",
      image: "🏎️"
    },
    {
      id: 3,
      date: "June 18, 2026",
      title: "New Staff Members Recruited",
      description: "5 new moderators and 10 helpers have joined our team to serve you better.",
      image: "👥"
    },
    {
      id: 4,
      date: "June 18, 2026",
      title: "New Staff Members Recruited",
      description: "5 new moderators and 10 helpers have joined our team to serve you better.",
      image: "👥"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-8 ">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-cyan-400 mb-12 text-center">Latest News</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* News Cards Section */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsData.map((news) => (
              <div 
                key={news.id} 
                className="bg-slate-800/80 backdrop-blur border border-cyan-500 rounded-2xl overflow-hidden hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="text-5xl text-center py-6 bg-slate-700/50">
                  {news.image}
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-cyan-400 text-sm mb-2 font-mono">{news.date}</p>
                    <h3 className="text-xl font-bold text-gray-100 mb-3">{news.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{news.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Status & Widget Section */}
          <div className="lg:col-span-4 w-full flex flex-col gap-6 sticky top-6">
            
            {/* Server Status & IP Card */}
            <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-cyan-900/10">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <FaServer className="text-cyan-500" />
                <span className='text-cyan-500'>Paraiso</span> Gaming Server
              </h3>

              {/* Click to Copy IP Block */}
              <div 
                onClick={handleCopyIP}
                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-300 border mb-5 group ${
                  copied 
                    ? 'bg-green-500/10 border-green-500 text-green-400' 
                    : 'bg-[#0a0f14] border-cyan-500/30 text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                }`}
              >
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase font-bold tracking-wider">
                    {copied ? 'IP Copied!' : 'Click to Copy IP'}
                  </p>
                  <p className="font-mono font-bold tracking-wider text-sm sm:text-base">
                    {serverIP}
                  </p>
                </div>
                <div className="text-xl">
                  {copied ? <FaCheck /> : <FaCopy className="opacity-50 group-hover:opacity-100 transition-opacity" />}
                </div>
              </div>

              {/* Discord Invite Hyperlink Button */}
              <a 
                href="https://discord.gg/7AsJaG3KSV" 
                target="_blank" 
                rel="noreferrer"
                className="btn w-full bg-[#5865F2] hover:bg-[#4752C4] border-none text-white shadow-[0_0_15px_rgba(88,101,242,0.3)] transition-all flex items-center gap-2 text-sm uppercase tracking-widest font-bold"
              >
                <FaDiscord className="text-2xl" />
                Join Community
              </a>
            </div>

            {/* 2. ORIGINAL: Discord Widget Box */}
            <div className="w-full overflow-hidden p-2 shadow-2xl shadow-indigo-900/10">
              <iframe 
                src="https://discord.com/widget?id=1519328496898408519&theme=dark" 
                width="100%" 
                height="450" 
                allowtransparency="true" 
                frameBorder="0" 
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                className="rounded-xl w-full"
                title="Discord Server Widget"
              ></iframe>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default NewsSection;