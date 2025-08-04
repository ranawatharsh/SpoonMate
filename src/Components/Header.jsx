import React from 'react';
const Header = ({ onLoginClick }) => {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                {/* Make sure your logo is in the `public` folder */}
                <img src="\SpoonM.png" alt="SpoonMate Logo" className="h-24" />
                <button 
                    onClick={onLoginClick} 
                    className="bg-[#FF6B6B] text-white font-semibold py-2 px-5 rounded-full hover:opacity-90 transition-opacity">
                    Log In
                </button>
            </div>
        </header>
    );
};

export default Header;