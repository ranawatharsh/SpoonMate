import React, { useState } from 'react';
import ProgressBar from '../Components/ProgressBar';

// --- Reusable Components ---
const ChoiceButton = ({ text, onClick, isSelected }) => (
    <button 
        onClick={onClick} 
        className={`p-4 w-full rounded-lg border-2 text-center font-semibold transition ${isSelected ? 'bg-[#FF6B6B] text-white border-[#FF6B6B]' : 'bg-gray-50 hover:border-gray-400'}`}
    >
        {text}
    </button>
);

const PlusIcon = () => (
    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
);

// --- Main Onboarding Page Component ---
const OnboardingPage = ({ userInfo, onOnboardingComplete }) => {
    const [step, setStep] = useState(1);
    const totalSteps = 6;

    const [profileData, setProfileData] = useState({
        gender: null, dob: '', 
        photos: [null, null, null],
        diet: null, favoriteCuisines: [], spiceLevel: null,
        adventurousness: null, dateStyle: null,
    });
    
    const [photoPreviews, setPhotoPreviews] = useState([null, null, null]);
    const [photoLoading, setPhotoLoading] = useState([false, false, false]);
    
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const updateProfile = (key, value) => setProfileData(prev => ({ ...prev, [key]: value }));

    const handlePhotoUpload = async (event, index) => {
        const file = event.target.files[0];
        if (!file) return;

        const newPhotoLoading = [...photoLoading];
        newPhotoLoading[index] = true;
        setPhotoLoading(newPhotoLoading);

        const newPhotoPreviews = [...photoPreviews];
        newPhotoPreviews[index] = URL.createObjectURL(file);
        setPhotoPreviews(newPhotoPreviews);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('http://127.0.0.1:5000/api/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${userInfo.token}` },
                body: formData,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Upload failed');

            const newPhotos = [...profileData.photos];
            newPhotos[index] = data.imageUrl;
            updateProfile('photos', newPhotos);

        } catch (err) {
            console.error(err);
            const revertedPreviews = [...photoPreviews];
            revertedPreviews[index] = null;
            setPhotoPreviews(revertedPreviews);
            setError('Image upload failed. Please try again.');
        } finally {
            const finalPhotoLoading = [...photoLoading];
            finalPhotoLoading[index] = false;
            setPhotoLoading(finalPhotoLoading);
        }
    };

    const handleCuisineToggle = (cuisine) => {
        updateProfile('favoriteCuisines', 
            profileData.favoriteCuisines.includes(cuisine)
                ? profileData.favoriteCuisines.filter(c => c !== cuisine)
                : [...profileData.favoriteCuisines, cuisine]
        );
    };

    const handleBack = () => setStep(s => s - 1);

    const handleNext = async () => {
        if (step < totalSteps) {
            setStep(s => s + 1);
        } else {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('http://127.0.0.1:5000/api/users/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userInfo.token}`,
                    },
                    body: JSON.stringify(profileData),
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Failed to update profile');
                onOnboardingComplete();
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const isNextDisabled = () => {
        switch(step) {
            case 1: return !profileData.gender || !profileData.dob;
            case 2: return profileData.photos.some(p => p === null) || photoLoading.some(l => l);
            case 3: return !profileData.diet;
            case 4: return profileData.favoriteCuisines.length === 0;
            case 5: return !profileData.spiceLevel || !profileData.adventurousness;
            case 6: return !profileData.dateStyle;
            default: return true;
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
                <ProgressBar currentStep={step} totalSteps={totalSteps} />
                
                {step === 1 && (
                    <div>
                        <h3 className="text-xl font-semibold text-center text-[#4A4A4A] mb-4">Let's start with the basics</h3>
                        <div className="mb-6">
                            <label className="font-semibold text-gray-700 block mb-2">Your Gender</label>
                            <div className="grid grid-cols-2 gap-4">
                                <ChoiceButton text="Man" onClick={() => updateProfile('gender', 'Man')} isSelected={profileData.gender === 'Man'} />
                                <ChoiceButton text="Woman" onClick={() => updateProfile('gender', 'Woman')} isSelected={profileData.gender === 'Woman'} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="dob" className="font-semibold text-gray-700 block mb-2">Date of Birth</label>
                            <input type="date" id="dob" value={profileData.dob} onChange={e => updateProfile('dob', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B6B] outline-none" />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h3 className="text-xl font-semibold text-center text-[#4A4A4A] mb-4">Add your best photos</h3>
                        <p className="text-center text-sm text-gray-500 mb-4">Please upload exactly 3 photos.</p>
                        <div className="grid grid-cols-3 gap-4">
                            {photoPreviews.map((preview, index) => (
                                <div key={index} className="aspect-w-1 aspect-h-1">
                                    <label htmlFor={`photo-upload-${index}`} className="cursor-pointer w-full h-full border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 relative">
                                        {preview ? (
                                            <img src={preview} alt={`preview ${index}`} className="w-full h-full object-cover rounded-lg"/>
                                        ) : (
                                            <PlusIcon />
                                        )}
                                        {photoLoading[index] && (
                                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                                <div className="w-6 h-6 border-4 border-t-[#FF6B6B] border-gray-200 rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </label>
                                    <input id={`photo-upload-${index}`} type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, index)} disabled={photoLoading[index]} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {step === 3 && (
                     <div>
                        <h3 className="text-xl font-semibold text-center text-[#4A4A4A] mb-4">What's your dietary preference?</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {["Vegetarian", "Eggetarian", "Non-Vegetarian", "Jain", "Vegan", "Anything"].map(option => (
                                <ChoiceButton key={option} text={option} onClick={() => updateProfile('diet', option)} isSelected={profileData.diet === option} />
                            ))}
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <h3 className="text-xl font-semibold text-center text-[#4A4A4A] mb-4">Which cuisines do you love?</h3>
                        <p className="text-center text-sm text-gray-500 mb-4">Pick as many as you like.</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {["North Indian", "South Indian", "Chinese", "Italian", "Mexican", "Japanese", "Thai", "Continental"].map(option => (
                                <ChoiceButton key={option} text={option} onClick={() => handleCuisineToggle(option)} isSelected={profileData.favoriteCuisines.includes(option)} />
                            ))}
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div>
                        <h3 className="text-xl font-semibold text-center text-[#4A4A4A] mb-4">What's your food vibe?</h3>
                         <div className="mb-6">
                            <label className="font-semibold text-gray-700 block mb-2">Spice Level</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {["Mild", "Medium", "Spicy", "Extra Spicy"].map(option => (
                                    <ChoiceButton key={option} text={option} onClick={() => updateProfile('spiceLevel', option)} isSelected={profileData.spiceLevel === option} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="font-semibold text-gray-700 block mb-2">How adventurous are you?</label>
                            <div className="grid grid-cols-2 gap-4">
                               <ChoiceButton text="I stick to my favorites" onClick={() => updateProfile('adventurousness', 'cautious')} isSelected={profileData.adventurousness === 'cautious'} />
                               <ChoiceButton text="I'll try anything once!" onClick={() => updateProfile('adventurousness', 'adventurous')} isSelected={profileData.adventurousness === 'adventurous'} />
                            </div>
                        </div>
                    </div>
                )}

                {step === 6 && (
                    <div>
                        <h3 className="text-xl font-semibold text-center text-[#4A4A4A] mb-4">What's your ideal first food date?</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {["Cozy Coffee & Pastry", "Fun Brunch", "Romantic Dinner", "Street Food Crawl", "Let's Cook Together"].map(option => (
                                <ChoiceButton key={option} text={option} onClick={() => updateProfile('dateStyle', option)} isSelected={profileData.dateStyle === option} />
                            ))}
                        </div>
                    </div>
                )}
                
                {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
                
                <div className="flex gap-4 mt-8">
                    {step > 1 && <button onClick={handleBack} className="w-1/3 bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-opacity">Back</button>}
                    <button onClick={handleNext} disabled={isNextDisabled() || loading} className="flex-grow bg-[#FF6B6B] text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {loading ? 'Saving...' : (step === totalSteps ? 'Finish & Find Matches' : 'Next')}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default OnboardingPage;