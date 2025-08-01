import React, { useState, useEffect } from 'react';

// A reusable component for displaying a piece of profile info
const InfoPill = ({ text }) => (
    <div className="bg-gray-200 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">
        {text}
    </div>
);

const ProfilePage = ({ userInfo }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userInfo || !userInfo.token) {
                setLoading(false);
                setError("Not authorized.");
                return;
            }

            try {
                setLoading(true);
                const response = await fetch('http://127.0.0.1:5000/api/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${userInfo.token}`,
                    },
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Could not fetch profile');
                }
                setUserProfile(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userInfo]);

    if (loading) {
        return <div className="flex-grow flex items-center justify-center"><p>Loading Profile...</p></div>;
    }

    if (error || !userProfile) {
        return <div className="flex-grow flex items-center justify-center"><p className="text-red-500">{error || "Could not load profile."}</p></div>;
    }
    
    // Calculate age from Date of Birth
    const age = new Date().getFullYear() - new Date(userProfile.dob).getFullYear();

    return (
        <div className="w-full max-w-md mx-auto p-4 pb-20">
            {/* Photo Grid */}
            <div className="grid grid-cols-2 grid-rows-2 gap-2 h-64">
                <div className="col-span-1 row-span-2 bg-gray-200 rounded-lg overflow-hidden">
                    <img src={userProfile.photos[0] || 'https://placehold.co/600x600/cccccc/ffffff?text=Photo+1'} alt="Profile 1" className="w-full h-full object-cover" />
                </div>
                <div className="col-span-1 row-span-1 bg-gray-200 rounded-lg overflow-hidden">
                     <img src={userProfile.photos[1] || 'https://placehold.co/300x300/cccccc/ffffff?text=Photo+2'} alt="Profile 2" className="w-full h-full object-cover" />
                </div>
                <div className="col-span-1 row-span-1 bg-gray-200 rounded-lg overflow-hidden">
                     <img src={userProfile.photos[2] || 'https://placehold.co/300x300/cccccc/ffffff?text=Photo+3'} alt="Profile 3" className="w-full h-full object-cover" />
                </div>
            </div>

            {/* Name and Edit Button */}
            <div className="flex justify-between items-center mt-4">
                <h1 className="text-3xl font-bold text-gray-800">{userProfile.name}, {age}</h1>
                <button className="bg-[#FF6B6B] text-white font-semibold py-2 px-5 rounded-full hover:opacity-90 transition-opacity">
                    Edit Profile
                </button>
            </div>
            
            <p className="text-gray-600 mt-2">{userProfile.bio || "No bio yet."}</p>

            {/* Details Section */}
            <div className="mt-6">
                <h2 className="text-lg font-bold text-gray-700 mb-2">My Tastes</h2>
                <div className="flex flex-wrap gap-2">
                    {userProfile.profile?.diet && <InfoPill text={userProfile.profile.diet} />}
                    {userProfile.profile?.spiceLevel && <InfoPill text={`${userProfile.profile.spiceLevel} Spice`} />}
                    {userProfile.profile?.adventurousness && <InfoPill text={userProfile.profile.adventurousness} />}
                </div>
            </div>

             <div className="mt-6">
                <h2 className="text-lg font-bold text-gray-700 mb-2">Favorite Cuisines</h2>
                <div className="flex flex-wrap gap-2">
                    {userProfile.profile?.favoriteCuisines?.map(cuisine => <InfoPill key={cuisine} text={cuisine} />)}
                </div>
            </div>

             <div className="mt-6">
                <h2 className="text-lg font-bold text-gray-700 mb-2">Ideal First Date</h2>
                <div className="flex flex-wrap gap-2">
                    {userProfile.profile?.dateStyle && <InfoPill text={userProfile.profile.dateStyle} />}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;