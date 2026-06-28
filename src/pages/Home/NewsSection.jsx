import React from 'react';

const NewsSection = () => {
  const newsData = [
    {
      id: 1,
      date: "June 24, 2024",
      title: "New Summer Season Launched!",
      description: "Featuring new jobs, events, and exclusive rewards for all players.",
      image: "🎉"
    },
    {
      id: 2,
      date: "June 20, 2024",
      title: "Drag Racing Championship Started",
      description: "Win up to 1 million cash prizes every week. Join the competition now!",
      image: "🏎️"
    },
    {
      id: 3,
      date: "June 18, 2024",
      title: "New Staff Members Recruited",
      description: "5 new moderators and 10 helpers have joined our team to serve you better.",
      image: "👥"
    }
  ];

  return (
    <section className="py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-cyan-400 mb-12 text-center">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsData.map((news) => (
            <div 
              key={news.id} 
              className="bg-slate-800/80 backdrop-blur border border-cyan-500 rounded-lg overflow-hidden hover:border-cyan-400 transition-colors cursor-pointer"
            >
              <div className="text-5xl text-center py-6 bg-slate-700/50">
                {news.image}
              </div>
              <div className="p-6">
                <p className="text-cyan-400 text-sm mb-2">{news.date}</p>
                <h3 className="text-xl font-bold text-gray-100 mb-3">{news.title}</h3>
                <p className="text-gray-300">{news.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;