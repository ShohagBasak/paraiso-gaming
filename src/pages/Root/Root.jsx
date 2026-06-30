import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Root = () => {
  return (
    <div 
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: 'url(/sticky.png)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark navy overlay — same as Announcement section */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'rgba(25, 41, 85, 0.6)' }}></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default Root;