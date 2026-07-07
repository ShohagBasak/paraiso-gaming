import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdCampaign } from 'react-icons/md';
import "swiper/css";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const sanitizeHTML = (htmlString) => {
  if (!htmlString) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const allowedTags = ['B', 'STRONG', 'I', 'EM', 'U', 'S', 'STRIKE', 'DIV', 'P', 'SPAN', 'BR', 'UL', 'OL', 'LI'];
  
  const sanitizeNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) return;
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName;
      if (['SCRIPT', 'IFRAME', 'STYLE', 'OBJECT', 'EMBED'].includes(tagName)) {
        node.remove();
        return;
      }
      if (!allowedTags.includes(tagName)) {
        while (node.firstChild) {
          node.parentNode.insertBefore(node.firstChild, node);
        }
        node.remove();
        return;
      }
      const attrs = Array.from(node.attributes);
      for (const attr of attrs) {
        const name = attr.name.toLowerCase();
        if (name === 'style') {
          const styleValue = attr.value.toLowerCase();
          const isSafeStyle = styleValue.split(';').every(part => {
            const cleanPart = part.trim();
            if (!cleanPart) return true;
            return cleanPart.startsWith('text-align') || cleanPart.startsWith('text-decoration') || cleanPart.startsWith('display');
          });
          if (!isSafeStyle) {
            node.removeAttribute(attr.name);
          }
        } else if (name === 'align') {
          const alignVal = attr.value.toLowerCase();
          if (!['left', 'center', 'right', 'justify'].includes(alignVal)) {
            node.removeAttribute(attr.name);
          }
        } else {
          node.removeAttribute(attr.name);
        }
      }
      const children = Array.from(node.childNodes);
      children.forEach(sanitizeNode);
    }
  };
  
  Array.from(doc.body.childNodes).forEach(sanitizeNode);
  return doc.body.innerHTML;
};

const stripHTML = (htmlString) => {
  if (!htmlString) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  return doc.body.textContent || '';
};

const FeaturesSlider = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [featuresData, setFeaturesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/announcements`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setFeaturesData(Array.isArray(data) ? data : []))
      .catch(() => setFeaturesData([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full pt-2 pb-6 px-4">
      <div className="flex justify-between items-end mb-8 max-w-6xl mx-auto">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-wider">
            Server <span className="text-cyan-500">Announcement</span>
          </h2>
        </div>
        {featuresData.length > 1 && (
          <div className="hidden lg:flex items-center gap-3">
            <div onClick={() => swiperInstance?.slidePrev()} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 border border-cyan-500/30 text-cyan-400 cursor-pointer hover:bg-cyan-500 hover:text-black transition-all">
              <FaChevronLeft />
            </div>
            <div onClick={() => swiperInstance?.slideNext()} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 border border-cyan-500/30 text-cyan-400 cursor-pointer hover:bg-cyan-500 hover:text-black transition-all">
              <FaChevronRight />
            </div>
          </div>
        )}
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
          slidesPerView={1}
          spaceBetween={24}
          loop={featuresData.length > 1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          modules={[Autoplay]}
          breakpoints={{ 
            640: { slidesPerView: 1 }, 
            1024: { slidesPerView: 1 } 
          }}
          className="max-w-6xl mx-auto"
        >
          {featuresData.map((feature) => (
            <SwiperSlide key={feature.id}>
              <div className="bg-[#0f151d] rounded-2xl border border-[#1e293b] overflow-hidden group h-full flex flex-col">
                {feature.image_url && (
                  <div 
                    className={`w-full bg-[#0d121a]/85 flex items-center justify-center overflow-hidden ${
                      feature.image_shape === 'square' 
                        ? 'h-[280px] p-4' 
                        : feature.image_shape === 'natural' 
                        ? 'h-auto max-h-[384px]' 
                        : 'h-48 sm:h-64 md:h-72 lg:h-80'
                    }`}
                  >
                    <img 
                      src={feature.image_url} 
                      alt={stripHTML(feature.title)} 
                      className={`opacity-90 transition-all duration-300 ${
                        feature.image_shape === 'square' || feature.image_shape === 'natural'
                          ? 'w-auto h-auto max-w-full max-h-full object-contain'
                          : 'w-full h-full max-w-full max-h-full object-cover'
                      }`}
                    />
                  </div>
                )}
                <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 
                      style={{ color: feature.title_color || '#22d3ee' }} 
                      className={`font-bold uppercase mb-2 ${feature.title_size || 'text-lg md:text-xl'}`}
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(feature.title) }}
                    />
                    <div 
                      style={{ color: feature.description_color || '#94a3b8' }} 
                      className={`leading-relaxed ${feature.description_size || 'text-xs sm:text-sm'}`}
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(feature.description) }}
                    />
                  </div>
                  {feature.link && (
                    <a
                      href={feature.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-cyan-500 text-xs font-bold uppercase hover:text-white transition-colors"
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