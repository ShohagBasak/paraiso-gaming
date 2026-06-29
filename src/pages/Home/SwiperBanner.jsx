import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const SwiperBanner = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);

  return (
    <div className="w-full max-w-7xl mx-auto  sm:px-6 lg:px-2 my-6 md:my-10 relative overflow-hidden">
      
      <Swiper
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        spaceBetween={0}
        effect={'fade'}
        loop={true}
        grabCursor={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[Autoplay, EffectFade, Pagination]}
        className="w-full h-[500px] sm:h-[580px] md:h-[650px] lg:h-[750px] premium-swiper relative rounded-2xl md:rounded-3xl border border-blue-500 shadow-2xl cursor-grab active:cursor-grabbing overflow-hidden"
      >
        
        {/* Slide 1 */}
        <SwiperSlide>
          <div className="w-full h-full relative flex items-center justify-center bg-[#0a0f14]">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-25"></div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center justify-center">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-3 md:mb-5 leading-tight drop-shadow-xl">
                <span className='text-2xl sm:text-4xl md:text-5xl text-base-100 block sm:inline sm:mr-3 mb-1 sm:mb-0'>
                  Welcome to
                </span> 
                PARAISO ROLEPLAY
              </h1>
              <p className="text-base sm:text-xl md:text-2xl text-gray-200 mb-3 md:mb-5 font-medium max-w-md sm:max-w-xl md:max-w-2xl drop-shadow-md">
                The Ultimate San Andreas Multiplayer Experience
              </p>
              <p className="text-xs sm:text-sm md:text-lg text-gray-400 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto mb-6 md:mb-10 drop-shadow-sm leading-relaxed">
                Join thousands of players in the most immersive multiplayer server
              </p>
              <button className="relative z-50 btn btn-md sm:btn-lg bg-blue-500 hover:bg-blue-600 border-none text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300 uppercase tracking-widest text-xs sm:text-sm px-6 sm:px-10">
                Connect Now
              </button>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="w-full h-full relative flex items-center justify-center bg-[#0a0f14]">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-25"></div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center justify-center">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-3 md:mb-5 leading-tight drop-shadow-xl">
                <span className='text-2xl sm:text-4xl md:text-5xl text-base-100 block sm:inline sm:mr-3 mb-1 sm:mb-0'>
                  Explore
                </span> 
                NEW FEATURES
              </h1>
              <p className="text-base sm:text-xl md:text-2xl text-gray-200 mb-6 md:mb-10 font-medium drop-shadow-md">
                Custom Economy, Vehicles & Advanced Jobs
              </p>
              <button className="relative z-50 btn btn-md sm:btn-lg bg-purple-500 hover:bg-purple-600 border-none text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300 uppercase tracking-widest text-xs sm:text-sm px-6 sm:px-10">
                View Changelog
              </button>
            </div>
          </div>
        </SwiperSlide>

        {/* Custom Arrows */}
        <div 
          onClick={() => swiperInstance?.slidePrev()} 
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-50 w-14 h-14 bg-black/30 backdrop-blur-md border border-cyan-500/30 rounded-full items-center justify-center text-cyan-400 cursor-pointer hover:bg-cyan-500 hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] hover:scale-110"
        >
          <FaChevronLeft className="text-xl mr-1" />
        </div>

        <div 
          onClick={() => swiperInstance?.slideNext()} 
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-50 w-14 h-14 bg-black/30 backdrop-blur-md border border-cyan-500/30 rounded-full items-center justify-center text-cyan-400 cursor-pointer hover:bg-cyan-500 hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] hover:scale-110"
        >
          <FaChevronRight className="text-xl ml-1" />
        </div>

      </Swiper>
    </div>
  );
};

export default SwiperBanner;