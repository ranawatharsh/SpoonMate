import React, { useState, useEffect } from 'react';
import BottomNav from '../Components/BottomNav';
import ProfilePage from './ProfilePage';
import ChatsPage from './ChatsPage';
import ChatScreen from './ChatScreen';

// --- Sub-components for DashboardPage ---

const DislikeIcon = () => <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const LikeIcon = () => <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>;
const InfoIcon = () => <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;

const MatchNotification = ({ matchedUser, onContinue }) => (
    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-50 p-4">
        <h2 className="text-5xl font-bold text-white mb-4 animate-pulse">It's a Match!</h2>
        <p className="text-white text-xl mb-6">You and {matchedUser.name} liked each other.</p>
        <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden">
                <img src="https://placehold.co/200x200/cccccc/ffffff?text=You" alt="Your profile" className="w-full h-full object-cover" />
            </div>
            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden">
                <img src={matchedUser.photos?.[0] || `https://placehold.co/200x200/FFC0CB/4A4A4A?text=${matchedUser.name}`} alt={matchedUser.name} className="w-full h-full object-cover" />
            </div>
        </div>
        <button 
            onClick={onContinue}
            className="mt-8 bg-[#FF6B6B] text-white font-bold py-3 px-8 rounded-full text-lg transform hover:scale-105 transition-transform"
        >
            Keep Swiping
        </button>
    </div>
);

const ProfileCard = ({ user }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [showDetails, setShowDetails] = useState(false);

    if (!user) {
        return (
            <div className="relative w-full h-full rounded-2xl bg-white shadow-xl flex items-center justify-center p-8 text-center">
                <p className="text-xl text-gray-500">No more matches for now. Check back later!</p>
            </div>
        );
    }

    const { name, dob, photos, bio, profile } = user;
    const age = dob ? new Date().getFullYear() - new Date(dob).getFullYear() : '';
    const photoUrls = photos && photos.length > 0 ? photos : [`https://placehold.co/600x800/dddddd/4A4A4A?text=${name}`];

    const nextPhoto = (e) => {
        e.stopPropagation();
        setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photoUrls.length);
    };

    const prevPhoto = (e) => {
        e.stopPropagation();
        setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photoUrls.length) % photoUrls.length);
    };

    return (
        <div className="relative w-full h-full rounded-2xl bg-gray-200 shadow-xl overflow-hidden cursor-pointer" onClick={() => setShowDetails(!showDetails)}>
            <img src={photoUrls[currentPhotoIndex]} alt={`Profile of ${name}`} className="w-full h-full object-cover" />
            <div className="absolute top-0 left-0 h-full w-1/2" onClick={prevPhoto}></div>
            <div className="absolute top-0 right-0 h-full w-1/2" onClick={nextPhoto}></div>
            <div className="absolute top-2 left-0 right-0 flex justify-center gap-2 px-2">
                {photoUrls.map((_, index) => (
                    <div key={index} className={`h-1.5 flex-1 rounded-full ${index === currentPhotoIndex ? 'bg-white/90' : 'bg-white/40'}`}></div>
                ))}
            </div>
            <div className={`absolute bottom-0 left-0 right-0 p-4 pt-12 bg-gradient-to-t from-black/80 to-transparent transition-all duration-300 ${showDetails ? 'h-full bg-black/80' : 'h-auto'}`}>
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-white text-3xl font-bold">{name}{age && `, ${age}`}</h2>
                        <p className="text-white">{profile?.favoriteCuisines?.[0] ? `Loves ${profile.favoriteCuisines[0]}` : ''}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }} className="flex-shrink-0"><InfoIcon /></button>
                </div>
                {showDetails && (
                    <div className="mt-4 text-white text-sm overflow-y-auto" style={{maxHeight: 'calc(100% - 80px)'}}>
                        <p className="font-bold">Bio</p>
                        <p className="mb-4">{bio || "No bio yet."}</p>
                        <p className="font-bold">Top Cuisines</p>
                        <p className="mb-4">{profile?.favoriteCuisines?.join(', ') || 'Not specified'}</p>
                        <p className="font-bold">Vibe</p>
                        <p>{profile?.spiceLevel && `${profile.spiceLevel} Spice`} &bull; {profile?.adventurousness || 'Not specified'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const HomePage = ({ userInfo }) => {
    const [matches, setMatches] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMatch, setIsMatch] = useState(false);

    useEffect(() => {
        const fetchMatches = async () => {
            if (!userInfo || !userInfo.token) return;
            try {
                setLoading(true);
                const response = await fetch('https://spoonmate.onrender.com/api/users/matches', {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` },
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Could not fetch matches');
                setMatches(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, [userInfo]);

    const handleAction = async (targetUserId, action) => {
        try {
            const response = await fetch('https://spoonmate.onrender.com/api/users/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userInfo.token}` },
                body: JSON.stringify({ targetUserId, action }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Action failed');
            if (data.isMatch) {
                setIsMatch(true);
            } else {
                setCurrentIndex(prev => prev + 1);
            }
        } catch (err) {
            console.error(err);
        }
    };
    
    const closeMatchNotification = () => {
        setIsMatch(false);
        setCurrentIndex(prev => prev + 1);
    };

    if (loading) return <div className="flex-grow flex items-center justify-center"><p>Finding matches...</p></div>;
    if (error) return <div className="flex-grow flex items-center justify-center"><p className="text-red-500">{error}</p></div>;

    const currentMatch = matches[currentIndex];

    return (
        <div className="flex-grow w-full flex flex-col items-center justify-center p-4 pb-24">
            <div className="w-full max-w-sm h-[70vh] relative">
                <ProfileCard user={currentMatch} />
                {isMatch && <MatchNotification matchedUser={currentMatch} onContinue={closeMatchNotification} />}
            </div>
            {currentMatch && !isMatch && (
                <div className="flex justify-center items-center gap-8 mt-4">
                    <button onClick={() => handleAction(currentMatch._id, 'pass')} className="bg-white rounded-full p-4 shadow-lg transform hover:scale-110 transition-transform"><DislikeIcon /></button>
                    <button onClick={() => handleAction(currentMatch._id, 'like')} className="bg-white rounded-full p-6 shadow-lg transform hover:scale-110 transition-transform"><LikeIcon /></button>
                </div>
            )}
        </div>
    );
};

// --- Main DashboardPage Component ---

const DashboardPage = ({ userInfo, onLogout }) => {
    const [activeTab, setActiveTab] = useState('home');
    const [activeConversation, setActiveConversation] = useState(null);

    if (activeConversation) {
        return (
            <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center">
                <ChatScreen 
                    userInfo={userInfo} 
                    conversation={activeConversation} 
                    onBack={() => setActiveConversation(null)} 
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center">
            <header className="w-full p-4 flex justify-between items-center">
                 <img src="/SpoonM.png" alt="SpoonMate Logo" className="h-10" />
                 <button onClick={onLogout} className="text-sm font-semibold text-gray-500 hover:text-gray-800">Logout</button>
            </header>

            {activeTab === 'home' && <HomePage userInfo={userInfo} />}
            {activeTab === 'profile' && <ProfilePage userInfo={userInfo} />}
            {activeTab === 'chats' && <ChatsPage userInfo={userInfo} onConversationSelect={setActiveConversation} />}

            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    );
};

export default DashboardPage;