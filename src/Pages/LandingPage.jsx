import React from 'react';
import Header from '../Components/Header';
import Hero from '../Components/Hero';
import HowItWorks from '../Components/HowItWorks';
import Features from '../Components/Features';
import CallToAction from '../Components/CallToAction';
import Footer from '../Components/Footer';

const LandingPage = ({ onJoinClick, onLoginClick }) => {
    return (
        <>
            <Header onLoginClick={onLoginClick} />
            <Hero onJoinClick={onJoinClick} />
            <HowItWorks />
            <Features />
            <CallToAction onJoinClick={onJoinClick} />
            <Footer />
        </>
    );
};

export default LandingPage;