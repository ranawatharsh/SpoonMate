import React from 'react';

const HowItWorks = () => {
    return (
        <section className="bg-white py-16 md:py-20">
            <div className="container mx-auto px-6">
                <h3 className="text-3xl font-bold text-center text-[#4A4A4A] mb-12">How It Works</h3>
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 text-center">
                    {/* Step 1 */}
                    <div className="flex-1">
                        <div className="bg-[#FF6B6B] inline-flex items-center justify-center w-16 h-16 rounded-full text-white font-bold text-2xl mb-4">1</div>
                        <h4 className="text-xl font-semibold text-[#4A4A4A] mb-2">Build Your Food Profile</h4>
                        <p className="text-[#4A4A4A]">Share your favorite cuisines, spice tolerance, and dietary preferences.</p>
                    </div>
                    {/* Step 2 */}
                    <div className="flex-1">
                        <div className="bg-[#FF6B6B] inline-flex items-center justify-center w-16 h-16 rounded-full text-white font-bold text-2xl mb-4">2</div>
                        <h4 className="text-xl font-semibold text-[#4A4A4A] mb-2">Get Delicious Matches</h4>
                        <p className="text-[#4A4A4A]">Our algorithm serves you a daily menu of profiles that match your palate.</p>
                    </div>
                    {/* Step 3 */}
                    <div className="flex-1">
                        <div className="bg-[#FF6B6B] inline-flex items-center justify-center w-16 h-16 rounded-full text-white font-bold text-2xl mb-4">3</div>
                        <h4 className="text-xl font-semibold text-[#4A4A4A] mb-2">Connect & Plan a Date</h4>
                        <p className="text-[#4A4A4A]">Chat with your matches and plan the perfect food-focused first date.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;