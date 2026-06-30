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
    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#1e293b]">
      <Swiper
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        spaceBetween={0}
        effect={'fade'}
        loop={true}
        grabCursor={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[Autoplay, EffectFade, Pagination]}
        className="w-full h-[300px] sm:h-[400px] md:h-[450px]"
      >
         {/* Slide 1 */}
        <SwiperSlide>
          <div className="w-full h-full relative flex items-center justify-center bg-[#0a0f14]">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-25"></div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center justify-center">
              <h1 style={{ fontFamily: "'Rajdhani', sans-serif" }} className="text-3xl sm:text-5xl md:text-6xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-3 md:mb-5 leading-tight drop-shadow-xl tracking-wide">
                <span style={{ fontFamily: "'Rajdhani', sans-serif" }} className='text-2xl sm:text-4xl md:text-5xl text-base-100 block sm:inline sm:mr-3 mb-1 sm:mb-0 font-semibold'>
                  Welcome to
                </span>{' '}
                PARAISO ROLEPLAY
              </h1>
              <p style={{ fontFamily: "'Rajdhani', sans-serif" }} className="text-base sm:text-xl md:text-2xl text-gray-200 mb-3 md:mb-5 font-semibold max-w-md sm:max-w-xl md:max-w-2xl drop-shadow-md tracking-wide">
                The Ultimate San Andreas Multiplayer Experience
              </p>
              <p style={{ fontFamily: "'Rajdhani', sans-serif" }} className="text-xs sm:text-sm md:text-lg text-gray-400 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto mb-6 md:mb-10 drop-shadow-sm leading-relaxed">
                Join thousands of players in the most immersive multiplayer server
              </p>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="w-full h-full relative flex items-center justify-center bg-[#0a0f14]">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-25"></div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center justify-center">
              <h1 style={{ fontFamily: "'Rajdhani', sans-serif" }} className="text-3xl sm:text-5xl md:text-6xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-3 md:mb-5 leading-tight drop-shadow-xl tracking-wide">
                <span style={{ fontFamily: "'Rajdhani', sans-serif" }} className='text-xl sm:text-2xl md:text-3xl text-base-100 block sm:inline sm:mr-3 mb-1 sm:mb-0 font-semibold'>
                  Explore
                </span>{' '}
                NEW FEATURES
              </h1>
              <p style={{ fontFamily: "'Rajdhani', sans-serif" }} className="text-base sm:text-xl md:text-2xl text-gray-200 mb-6 md:mb-10 font-semibold drop-shadow-md tracking-wide">
                Custom Economy, Vehicles &amp; Advanced Jobs
              </p>
            </div>
          </div>
        </SwiperSlide>

        {/* slide 3 */}
        <SwiperSlide>
            <div className='w-full h-full'>
                <img className='w-full h-full' src="/invitation.png" alt="" />
            </div>
        </SwiperSlide>
        {/* slide 4 */}
        <SwiperSlide>
            <div className='w-full h-full'>
                <img className='w-full h-full' src="/invitationdiscord.png" alt="" />
            </div>
        </SwiperSlide>
        {/* slide 5 */}
        <SwiperSlide>
            <div className='w-full h-full'>
                <img className='w-full h-full' src="/banner 3.jpg" alt="" />
            </div>
        </SwiperSlide>
        <SwiperSlide>
            <div className='w-full h-full'>
                <img className='w-full h-full' src="/banner 4.jpg" alt="" />
            </div>
        </SwiperSlide>

        {/* Custom Arrows */}
        <div 
          onClick={() => swiperInstance?.slidePrev()} 
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full items-center justify-center text-cyan-400 cursor-pointer hover:bg-cyan-500 hover:text-black transition-all"
        >
          <FaChevronLeft />
        </div>
        <div 
          onClick={() => swiperInstance?.slideNext()} 
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full items-center justify-center text-cyan-400 cursor-pointer hover:bg-cyan-500 hover:text-black transition-all"
        >
          <FaChevronRight />
        </div>
      </Swiper>
    </div>
  );
};

export default SwiperBanner;