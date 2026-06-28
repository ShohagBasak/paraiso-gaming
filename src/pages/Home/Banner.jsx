import React from 'react';

const Banner = () => {
    return (
        <div>
            <div className="min-h-screen p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center py-20">
                        <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
                            <span className='text-5xl text-base-100'>Welcome to</span> PARAISO ROLEPLAY
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 mb-5">
                            The Ultimate San Andreas Multiplayer Experience
                        </p>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
                            Join thousands of players in the most immersive multiplayer server
                        </p>

                        <button className="btn btn-lg bg-blue-500 border-blue-500 text-base-100">
                            Connect Now
                        </button>
                    </div>

                    {/* Stats Section */}
                    <div className="py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-slate-800/80 backdrop-blur border border-cyan-500 rounded-lg p-8 text-center">
                            <h3 className="text-4xl font-bold text-cyan-400 mb-2">1000+</h3>
                            <p className="text-gray-300">Active Players</p>
                        </div>
                        <div className="bg-slate-800/80 backdrop-blur border border-cyan-500 rounded-lg p-8 text-center">
                            <h3 className="text-4xl font-bold text-cyan-400 mb-2">24/7</h3>
                            <p className="text-gray-300">Server Uptime</p>
                        </div>
                        <div className="bg-slate-800/80 backdrop-blur border border-cyan-500 rounded-lg p-8 text-center">
                            <h3 className="text-4xl font-bold text-cyan-400 mb-2">2026</h3>
                            <p className="text-gray-300">Latest Features</p>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="py-16">
                        <h2 className="text-4xl font-bold text-cyan-400 mb-12 text-center">Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-slate-800/80 backdrop-blur border border-cyan-500/50 rounded-lg p-6">
                                <h3 className="text-xl font-bold text-cyan-300 mb-3">Explore Events</h3>
                                <p className="text-gray-300">Compete in various events and build your legacy on our server</p>
                            </div>
                            <div className="bg-slate-800/80 backdrop-blur border border-cyan-500/50 rounded-lg p-6">
                                <h3 className="text-xl font-bold text-cyan-300 mb-3">Community</h3>
                                <p className="text-gray-300">Join a vibrant community of passionate multiplayer players</p>
                            </div>
                            <div className="bg-slate-800/80 backdrop-blur border border-cyan-500/50 rounded-lg p-6">
                                <h3 className="text-xl font-bold text-cyan-300 mb-3">Custom Content</h3>
                                <p className="text-gray-300">Experience custom scripts and unique gameplay mechanics</p>
                            </div>
                            <div className="bg-slate-800/80 backdrop-blur border border-cyan-500/50 rounded-lg p-6">
                                <h3 className="text-xl font-bold text-cyan-300 mb-3">Support</h3>
                                <p className="text-gray-300">24/7 support team ready to help you anytime</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;