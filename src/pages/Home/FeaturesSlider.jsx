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
      title: "OFFICIAL TRAILER 2026",
      date: "PLAYING NOW",
      description: "Experience the ultimate roleplay in our newly revamped Los Santos city.",
      mediaUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4" 
    },
    {
      id: 2,
      title: "LSPD & CRIMINALS ACTION",
      date: "LIVE ACTION",
      description: "Join the LSPD, EMS, or start your own underground criminal syndicate.",
      mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
      id: 3,
      title: "DRIFT & DRAG RACES",
      date: "HIGH SPEED",
      description: "Over 100+ fully tunable import cars added to the premium dealership.",
      mediaUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4"
    },
    {
      id: 4,
      title: "LOS SANTOS TURF WARS",
      date: "GANG WARFARE",
      description: "Fight for control over territories with your crew in real-time.",
      mediaUrl: "https://media.w3.org/2010/05/video/movie_300.mp4"
    },
    {
      id: 5,
      title: "BANK HEIST UPDATE",
      date: "NEW UPDATE",
      description: "Assemble your best crew and plan the ultimate Los Santos bank robbery.",
      mediaUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4"
    }
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-1">
            Server <span className="text-cyan-500">Update</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">Watch the real-time gameplay action and trailers.</p>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <div 
            onClick={() => swiperInstance?.slidePrev()}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-cyan-500/30 text-cyan-400 cursor-pointer hover:bg-cyan-500 hover:text-black transition-all"
          >
            <FaChevronLeft className="text-sm pr-0.5" />
          </div>
          <div 
            onClick={() => swiperInstance?.slideNext()}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-cyan-500/30 text-cyan-400 cursor-pointer hover:bg-cyan-500 hover:text-black transition-all"
          >
            <FaChevronRight className="text-sm pl-0.5" />
          </div>
        </div>
      </div>

      <Swiper
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        slidesPerView={1.2}
        spaceBetween={20}
        loop={true}
        grabCursor={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        speed={800}
        modules={[Autoplay]}
        breakpoints={{
          640: { slidesPerView: 1.5, spaceBetween: 24 },
          1024: { slidesPerView: 2, spaceBetween: 24 }, 
        }}
        className="w-full pb-2"
      >
        {featuresData.map((feature) => (
          <SwiperSlide key={feature.id}>
            <div className="bg-[#0f151d] rounded-2xl overflow-hidden border border-[#1e293b] group">
              <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-black pointer-events-none">
                <video src={feature.mediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-5 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-cyan-400 uppercase leading-tight w-1/2">{feature.title}</h3>
                  <div className="w-1/2 text-right">
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1">{feature.date}</p>
                    <p className="text-slate-400 text-xs leading-snug line-clamp-2">{feature.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturesSlider;