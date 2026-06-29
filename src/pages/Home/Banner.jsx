import React from 'react';

const Banner = () => {
    return (
        <div>
            <div className="min-h-screen p-8">
                <div className="max-w-7xl mx-auto">
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