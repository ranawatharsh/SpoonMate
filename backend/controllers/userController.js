const User = require('../models/User');
const Conversation = require('../models/Conversation');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// --- Helper function for dietary compatibility ---
const areDietsCompatible = (diet1, diet2) => {
    if (!diet1 || !diet2) return true; // If data is missing, assume compatible for now
    if (diet1 === 'Anything' || diet2 === 'Anything') return true;
    if (diet1 === 'Non-Vegetarian' && (diet2 === 'Jain' || diet2 === 'Vegan')) return false;
    if (diet2 === 'Non-Vegetarian' && (diet1 === 'Jain' || diet1 === 'Vegan')) return false;
    return true;
};


// @desc    Get potential matches for the logged-in user using a scoring algorithm
// @route   GET /api/users/matches
// @access  Private
const getMatches = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (!currentUser || !currentUser.profile) {
            return res.json([]); // Return empty if the user's profile is incomplete
        }

        const targetGender = currentUser.gender === 'Man' ? 'Woman' : 'Man';
        const excludedIds = [...currentUser.likes, ...currentUser.passes, currentUser._id];

        // 1. Fetch all potential candidates
        const candidates = await User.find({ 
            gender: targetGender,
            _id: { $nin: excludedIds } 
        }).select('-password');

        // 2. Calculate a compatibility score for each candidate
        const scoredCandidates = candidates.map(candidate => {
            let score = 0;
            const userProfile = currentUser.profile;
            const candidateProfile = candidate.profile;

            if (!candidateProfile) return { ...candidate.toObject(), score: 0 };

            // A) Dietary Compatibility (Hard Filter)
            if (!areDietsCompatible(userProfile.diet, candidateProfile.diet)) {
                return { ...candidate.toObject(), score: 0 }; // Incompatible, score is 0
            }
            if (userProfile.diet === candidateProfile.diet) {
                score += 20; // High score for same diet
            }

            // B) Common Cuisines (10 points per match)
            const commonCuisines = userProfile.favoriteCuisines.filter(c => 
                candidateProfile.favoriteCuisines.includes(c)
            );
            score += commonCuisines.length * 10;

            // C) Spice Level (Max 15 points)
            if (userProfile.spiceLevel === candidateProfile.spiceLevel) {
                score += 15;
            }

            // D) Adventurousness (10 points for same vibe)
            if (userProfile.adventurousness === candidateProfile.adventurousness) {
                score += 10;
            }

            // E) Ideal Date Style (10 points for same style)
            if (userProfile.dateStyle === candidateProfile.dateStyle) {
                score += 10;
            }

            return { ...candidate.toObject(), score };
        });

        // 3. Filter out anyone with a score of 0 and sort by score (highest first)
        const sortedMatches = scoredCandidates
            .filter(candidate => candidate.score > 0)
            .sort((a, b) => b.score - a.score);

        res.json(sortedMatches);

    } catch (error) {
        console.error('Error in getMatches:', error);
        res.status(500).json({ message: 'Server error while fetching matches' });
    }
};


// --- Other controller functions (registerUser, loginUser, etc.) ---
// These remain the same. I am including them in full as requested.

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({ name, email, password: hashedPassword });
        const createdUser = await user.save();
        res.status(201).json({
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            token: generateToken(createdUser._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.dob = req.body.dob || user.dob;
        user.gender = req.body.gender || user.gender;
        user.photos = req.body.photos || user.photos;
        
        // --- NEW FIELD ---
        user.bio = req.body.bio || user.bio; // Add the bio field

        user.profile.diet = req.body.diet || user.profile.diet;
        user.profile.favoriteCuisines = req.body.favoriteCuisines || user.profile.favoriteCuisines;
        user.profile.spiceLevel = req.body.spiceLevel || user.profile.spiceLevel;
        user.profile.adventurousness = req.body.adventurousness || user.profile.adventurousness;
        user.profile.dateStyle = req.body.dateStyle || user.profile.dateStyle;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            dob: user.dob,
            gender: user.gender,
            photos: user.photos,
            profile: user.profile,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const recordAction = async (req, res) => {
    const { targetUserId, action } = req.body;
    const currentUserId = req.user._id;
    if (!targetUserId || !action) {
        return res.status(400).json({ message: 'Target user ID and action are required.' });
    }
    try {
        if (action === 'like') {
            await User.findByIdAndUpdate(currentUserId, { $addToSet: { likes: targetUserId } });
        } else if (action === 'pass') {
            await User.findByIdAndUpdate(currentUserId, { $addToSet: { passes: targetUserId } });
        }
        let isMatch = false;
        if (action === 'like') {
            const targetUser = await User.findById(targetUserId);
            if (targetUser && targetUser.likes.includes(currentUserId)) {
                isMatch = true;
                await User.findByIdAndUpdate(currentUserId, { $addToSet: { matches: targetUserId } });
                await User.findByIdAndUpdate(targetUserId, { $addToSet: { matches: currentUserId } });
                const existingConversation = await Conversation.findOne({
                    participants: { $all: [currentUserId, targetUserId] }
                });
                if (!existingConversation) {
                    const newConversation = new Conversation({
                        participants: [currentUserId, targetUserId],
                    });
                    await newConversation.save();
                }
            }
        }
        res.json({ message: 'Action recorded successfully', isMatch });
    } catch (error) {
        res.status(500).json({ message: 'Server error while recording action' });
    }
};

module.exports = { registerUser, loginUser, updateUserProfile, getUserProfile, getMatches, recordAction, updateUserProfile };
