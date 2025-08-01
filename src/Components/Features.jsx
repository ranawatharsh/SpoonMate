import React from 'react';

const Features = () => {
    return (
        <section className="py-16 md:py-20 bg-[#FFF8F0]">
            <div className="container mx-auto px-6">
                <h3 className="text-3xl font-bold text-center text-[#4A4A4A] mb-12">The Perfect Ingredients for a Match</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {/* Feature 1 */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <span className="text-5xl" role="img" aria-label="Chili Pepper">🌶️</span>
                        <h4 className="text-xl font-semibold text-[#4A4A4A] my-2">Spice Compatibility</h4>
                        <p className="text-[#4A4A4A]">Match with someone who can handle your heat level, from mild to "call the fire department".</p>
                    </div>
                    {/* Feature 2 */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <span className="text-5xl" role="img" aria-label="Leaf">🌿</span>
                        <h4 className="text-xl font-semibold text-[#4A4A4A] my-2">Dietary Filters</h4>
                        <p className="text-[#4A4A4A]">Easily filter by vegetarian, vegan, jain, gluten-free, and more.</p>
                    </div>
                    {/* Feature 3 */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <span className="text-5xl" role="img" aria-label="Map">🗺️</span>
                        <h4 className="text-xl font-semibold text-[#4A4A4A] my-2">Cuisine Connect</h4>
                        <p className="text-[#4A4A4A]">Love Japanese? Craving Mexican? Connect with people who share your passion.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
