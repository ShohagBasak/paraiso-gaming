import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdCampaign } from 'react-icons/md';
import "swiper/css";

const FeaturesSlider = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [featuresData, setFeaturesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/announcements', { credentials: 'include' })
      .then(r => r.json())
      .then(data => setFeaturesData(Array.isArray(data) ? data : []))
      .catch(() => setFeaturesData([]))
      .finally(() => setLoading(false));
  }, []);

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

      {loading ? (
        <div className="flex items-center gap-3 text-slate-400 max-w-6xl mx-auto py-8">
          <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          Loading announcements...
        </div>
      ) : featuresData.length === 0 ? (
        <div className="max-w-6xl mx-auto bg-[#0f151d] border border-dashed border-slate-700 rounded-2xl p-10 text-center">
          <MdCampaign className="text-slate-600 mx-auto mb-3" size={40} />
          <p className="text-slate-500 text-sm">No announcements yet.</p>
        </div>
      ) : (
        <Swiper
          onSwiper={(swiper) => setSwiperInstance(swiper)}
          slidesPerView={1.2}
          spaceBetween={24}
          loop={featuresData.length > 1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          modules={[Autoplay]}
          breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 2 } }}
          className="max-w-6xl mx-auto"
        >
          {featuresData.map((feature) => (
            <SwiperSlide key={feature.id}>
              <div className="bg-[#0f151d] rounded-2xl border border-[#1e293b] overflow-hidden group h-full flex flex-col">
                {feature.image_url && (
                  <div className="h-48 w-full overflow-hidden bg-black">
                    <img src={feature.image_url} alt={feature.title} className="w-full h-full object-contain opacity-80 bg-[#0f151d] p-2" />
                  </div>
                )}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 
                      style={{ color: feature.title_color || '#22d3ee' }} 
                      className={`font-bold uppercase mb-3 ${feature.title_size || 'text-lg md:text-xl'}`}
                    >
                      {feature.title}
                    </h3>
                    <p 
                      style={{ color: feature.description_color || '#94a3b8' }} 
                      className={`leading-relaxed ${feature.description_size || 'text-sm'}`}
                    >
                      {feature.description}
                    </p>
                  </div>
                  {feature.link && (
                    <a
                      href={feature.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-6 text-cyan-500 text-xs font-bold uppercase hover:text-white transition-colors"
                    >
                      See More →
                    </a>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default FeaturesSlider;