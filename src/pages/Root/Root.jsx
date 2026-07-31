import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { HiArrowUp } from 'react-icons/hi';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Root = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div 
      className="flex flex-col min-h-screen bg-[#050811] overflow-x-hidden"
    >
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Toaster position="top-right" toastOptions={{ style: { background: '#0d1117', color: '#fff', border: '1px solid #1e293b' } }} />
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer></Footer>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 bg-cyan-500/10 backdrop-blur-md border border-cyan-500/30 text-cyan-400 rounded-full hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:scale-110 active:scale-95 cursor-pointer transition-all duration-300 ${
          showScrollTop ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-4 invisible pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <HiArrowUp className="text-xl" />
      </button>
    </div>
  );
};

export default Root;