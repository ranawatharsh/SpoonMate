import React, { useState, useEffect } from 'react';
import LandingPage from './Pages/LandingPage';
import SignUpPage from './Pages/SignUpPage';
import LoginPage from './Pages/LoginPage';
import OnboardingPage from './Pages/OnboardingPage';
import DashboardPage from './Pages/DashboardPage';

export default function App() {
    const [userInfo, setUserInfo] = useState(null);
    const [page, setPage] = useState('landing'); 

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
            setPage('dashboard');
        }
    }, []);

    const showSignUp = () => setPage('signup');
    const showLogin = () => setPage('login');
    
    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
        setPage('landing');
    };
    
    const handleSignUpSuccess = (userData) => {
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUserInfo(userData);
        setPage('onboarding');
    };

    const handleLoginSuccess = (userData) => {
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUserInfo(userData);
        setPage('dashboard');
    };

    const handleOnboardingComplete = () => {
        setPage('dashboard');
    };

    switch (page) {
        case 'signup':
            return <SignUpPage onLoginClick={showLogin} onSignUpSuccess={handleSignUpSuccess} />;
        case 'login':
            return <LoginPage onSignUpClick={showSignUp} onLoginSuccess={handleLoginSuccess} />;
        case 'onboarding':
            return <OnboardingPage userInfo={userInfo} onOnboardingComplete={handleOnboardingComplete} />;
        case 'dashboard':
            return <DashboardPage userInfo={userInfo} onLogout={handleLogout} />;
        case 'landing':
        default:
            return <LandingPage onJoinClick={showSignUp} onLoginClick={showLogin} />;
    }
}
