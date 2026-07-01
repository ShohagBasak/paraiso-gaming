import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SwiperBanner = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/banners`, { credentials: 'include' })
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch');
        return r.json();
      })
      .then(data => {
        // console.log("Fetched banners:", data);
        setSlides(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Banners fetch error:", err);
        setSlides([]);
      });
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#1e293b]">
      <Swiper
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        spaceBetween={0}
        effect={'fade'}
        loop={slides.length > 1}
        grabCursor={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[Autoplay, EffectFade, Pagination]}
        className="w-full h-[300px] sm:h-[400px] md:h-[450px]"
      >
        {slides.length === 0 ? (
          /* Default slide when no banners in DB */
          <SwiperSlide>
            <div className="w-full h-full relative flex items-center justify-center bg-[#0a0f14]">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-25"></div>
              <div className="relative z-10 text-center px-4">
                <h1 style={{ fontFamily: "'Rajdhani', sans-serif" }} className="text-4xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
                  PARAISO ROLEPLAY
                </h1>
                <p className="text-gray-300 text-lg">The Ultimate San Andreas Multiplayer Experience</p>
              </div>
            </div>
          </SwiperSlide>
        ) : (
          slides.map(slide => (
            <SwiperSlide key={slide.id}>
              <div className="w-full h-full relative flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${slide.image_url}')` }}
                />
                {/* Subtle text shadow overlay to ensure text readability on light backgrounds */}
                <div className="absolute inset-0 bg-black/20"></div>
                
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
                  {slide.title && (
                    <h1 
                      style={{ 
                        fontFamily: "'Rajdhani', sans-serif",
                        color: slide.title_color || '#ffffff'
                      }} 
                      className={`font-bold mb-3 tracking-wide drop-shadow-lg ${slide.title_size || 'text-3xl sm:text-5xl md:text-6xl'}`}
                    >
                      {slide.title}
                    </h1>
                  )}
                  {slide.subtitle && (
                    <p 
                      style={{ 
                        fontFamily: "'Rajdhani', sans-serif",
                        color: slide.subtitle_color || '#cbd5e1'
                      }} 
                      className={`font-semibold tracking-wide drop-shadow-md ${slide.subtitle_size || 'text-base sm:text-xl md:text-2xl'}`}
                    >
                      {slide.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))
        )}

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