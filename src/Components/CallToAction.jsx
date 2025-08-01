import React from 'react';

const CallToAction = ({ onJoinClick }) => {
    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-6 text-center">
                <h3 className="text-3xl md:text-4xl font-extrabold text-[#4A4A4A]">Ready to Bite?</h3>
                <p className="mt-3 text-lg text-[#4A4A4A] max-w-xl mx-auto">Your next favorite person and your next favorite meal are waiting.</p>
                <div className="mt-8">
                    <button 
                        onClick={onJoinClick}
                        className="bg-[#FF6B6B] text-white font-bold py-4 px-8 rounded-full text-lg transform hover:scale-105 transition-transform">
                        Find Your Match
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;