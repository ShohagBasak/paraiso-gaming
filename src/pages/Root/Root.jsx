import React from 'react';
import { Outlet } from 'react-router';
import { Toaster } from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Root = () => {
  return (
    <div 
      className="flex flex-col min-h-screen bg-[#070a13] overflow-x-hidden"
    >
      
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