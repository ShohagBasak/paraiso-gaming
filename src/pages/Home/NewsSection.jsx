import React, { useState, useEffect } from 'react';
import { FaCopy, FaCheck, FaDiscord, FaServer } from 'react-icons/fa';
import { BASE_URL } from '../../config/api';

const NewsSection = () => {
  // IP Copy korar state control
  const [copied, setCopied] = useState(false);
  const [serverIP, setServerIP] = useState("Coming Soon...");

  useEffect(() => {
    fetch(`${BASE_URL}/server-info?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.server_ip) setServerIP(data.server_ip);
      })
      .catch(() => {});
  }, []);

  const handleCopyIP = () => {
    navigator.clipboard.writeText(serverIP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); 
  };

  const newsData = [
    {
      id: 1,
      date: "July 24, 2026",
      title: "New Summer Season Launched!",
      description: "Featuring new jobs, events, and exclusive rewards for all players.",
      image: "🎉"
    },
    {
      id: 2,
      date: "July 20, 2026",
      title: "Drag Racing Championship Started",
      description: "Win up to 1 million cash prizes every week. Join the competition now!",
      image: "🏎️"
    },
    {
      id: 3,
      date: "July 18, 2026",
      title: "New Staff Members Recruited",
      description: "5 new moderators and 10 helpers have joined our team to serve you better.",
      image: "👥"
    },
    {
      id: 4,
      date: "July 15, 2026",
      title: "Server Opening Date Announced",
      description: "Paraiso Roleplay is preparing to open its doors. Stay tuned for the official launch date and founding citizen perks.",
      image: "🚀"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-cyan-400 mb-12 text-center">Latest News</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* News Cards Section */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
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

        </div>
      </div>
    </section>
  );
};

export default NewsSection;