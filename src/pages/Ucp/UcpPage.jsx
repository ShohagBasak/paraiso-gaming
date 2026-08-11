import React from 'react';
import { useUcp } from '../../context/UcpContext';
import UcpLogin from './UcpLogin';
import UcpDashboard from './UcpDashboard';

const UcpPage = () => {
  const { ucpPlayer, loading } = useUcp();

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-[#070a0f] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-neutral-400 text-sm animate-pulse">Initializing Control Panel...</p>
        </div>
      </div>
    );
  }

  return ucpPlayer ? <UcpDashboard /> : <UcpLogin />;
};

export default UcpPage;
