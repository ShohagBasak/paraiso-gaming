import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import "swiper/css";

const FeaturesSlider = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);

  const featuresData = [
    {
      id: 1,
      title: "WELCOME TO PARAISO",
      description: "Paraiso Gaming is being built with one goal in mind: to create a serious, active, and player-focused roleplay community where members are respected, heard, and rewarded for their dedication...",
      imageUrl: "/lgTwo.png",
      link: "https://forums.pgaming.net/index.php?threads/the-beginning-of-something-bigger-welcome-to-paraiso-gaming.16/" 
    },
    {
      id: 2,
      title: "The United States of Paraiso",
      description: "This is not just a game server—it is a living, breathing nation. The United States of Paraiso is a player-driven roleplay experience built to mirror the structure, responsibility...",
      imageUrl: "/HtmefD7.png",
      link: "https://forums.pgaming.net/index.php?threads/another-thread-example.20/" // এখানে আপনার দ্বিতীয় পোস্টের লিঙ্ক বসান
    }
  ];

  return (
    <div className="w-full py-10 px-4">
      <div className="flex justify-between items-end mb-8 max-w-6xl mx-auto">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-wider">
            Server <span className="text-cyan-500">Announcement</span>
          </h2>
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <div onClick={() => swiperInstance?.slidePrev()} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 border border-cyan-500/30 text-cyan-400 cursor-pointer hover:bg-cyan-500 hover:text-black transition-all">
            <FaChevronLeft />
          </div>
          <div onClick={() => swiperInstance?.slideNext()} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 border border-cyan-500/30 text-cyan-400 cursor-pointer hover:bg-cyan-500 hover:text-black transition-all">
            <FaChevronRight />
          </div>
        </div>
      </div>

      <Swiper
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        slidesPerView={1.2}
        spaceBetween={24}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        modules={[Autoplay]}
        breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 2 } }}
        className="max-w-6xl mx-auto"
      >
        {featuresData.map((feature) => (
          <SwiperSlide key={feature.id}>
            <div className="bg-[#0f151d] rounded-2xl border border-[#1e293b] overflow-hidden group h-full flex flex-col">
              {feature.imageUrl && (
                <div className="h-48 w-full overflow-hidden bg-black">
                  <img src={feature.imageUrl} alt={feature.title} className="w-full h-full object-contain opacity-80 bg-[#0f151d] p-2" />
                </div>
              )}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-cyan-400 font-bold uppercase mb-3">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
                <a 
                  href={feature.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-6 text-cyan-500 text-xs font-bold uppercase hover:text-white transition-colors"
                >
                  See More →
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturesSlider;