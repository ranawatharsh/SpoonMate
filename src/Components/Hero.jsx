import React from 'react';

const Hero = ({ onJoinClick }) => {
    return (
        <main className="bg-[#FFF8F0]">
            <div className="container mx-auto px-6 py-16 text-center">
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#4A4A4A] leading-tight">
                    Don't Just Date.
                    <br />
                    <span className="text-[#FF6B6B]">Find Your Flavor.</span>
                </h2>
                <p className="mt-4 text-lg md:text-xl text-[#4A4A4A] max-w-2xl mx-auto">
                    SpoonMate is the only dating app that matches you based on what truly matters: your love for food.
                </p>
                <div className="mt-8">
                    <button 
                        onClick={onJoinClick} 
                        className="bg-[#FF6B6B] text-white font-bold py-4 px-8 rounded-full text-lg transform hover:scale-105 transition-transform">
                        Join for Free
                    </button>
                </div>
            </div>
        </main>
    );
};

export default Hero;