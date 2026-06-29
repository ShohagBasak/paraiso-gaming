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
    <section className="py-16 px-4 sm:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-wider mb-2">
              Server <span className="text-cyan-500">Update</span>
            </h2>
            <p className="text-slate-400 text-sm">Watch the real-time gameplay action and trailers.</p>
          </div>

          {/* ==============================================
              BANNER STYLE GLOWING BUTTONS (Desktop Only)
          ================================================== */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Left Button */}
            <div 
              onClick={() => swiperInstance?.slidePrev()}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-cyan-500/30 text-cyan-400 cursor-pointer hover:bg-cyan-500 hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] hover:scale-110 group"
            >
              <FaChevronLeft className="text-xl mr-1" />
            </div>
            
            {/* Right Button */}
            <div 
              onClick={() => swiperInstance?.slideNext()}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-cyan-500/30 text-cyan-400 cursor-pointer hover:bg-cyan-500 hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] hover:scale-110 group"
            >
              <FaChevronRight className="text-xl ml-1" />
            </div>

          </div>
        </div>

        {/* Swiper Slider */}
        <Swiper
          onSwiper={(swiper) => setSwiperInstance(swiper)}
          slidesPerView={1.2}
          spaceBetween={20}
          loop={true}
          grabCursor={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={800}
          modules={[Autoplay]}
          breakpoints={{
            640: { slidesPerView: 1.5, spaceBetween: 24 },
            1024: { slidesPerView: 2, spaceBetween: 30 }, 
          }}
          className="w-full pb-5"
        >
          {featuresData.map((feature) => (
            <SwiperSlide key={feature.id}>
              <div className="bg-[#121820] rounded-3xl overflow-hidden group border border-slate-800 hover:border-cyan-500/50 transition-colors duration-300">
                
                {/* Media Section */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-black pointer-events-none">
                  <video 
                    src={feature.mediaUrl}
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  
                 
                </div>

                {/* Bottom Content Section */}
                <div className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="sm:w-1/2">
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight leading-none text-cyan-400 group-hover:text-cyan-300 transition-colors uppercase font-oswald">
                      {feature.title}
                    </h3>
                  </div>
                  <div className="sm:w-1/2 flex flex-col justify-center">
                    <p className="font-bold text-sm mb-1 uppercase tracking-wider text-red-500 animate-pulse">
                      {feature.date}
                    </p>
                    <p className="text-slate-400 text-sm leading-snug">
                      {feature.description}
                    </p>
                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
};

export default FeaturesSlider;