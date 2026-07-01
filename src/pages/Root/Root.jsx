import React from 'react';
import { Outlet } from 'react-router';
import { Toaster } from 'react-hot-toast';
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
        <Toaster toastOptions={{ style: { background: '#0d1117', color: '#fff', border: '1px solid #1e293b' } }} />
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