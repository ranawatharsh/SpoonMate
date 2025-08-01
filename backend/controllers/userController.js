const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const Conversation = require('../models/Conversation');
// @desc    Register a new user
// @route   POST /api/users/signup
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });
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

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
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

// @desc    Update user profile after onboarding
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.dob = req.body.dob || user.dob;
        user.gender = req.body.gender || user.gender;
        user.photos = req.body.photos || user.photos;
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

// @desc    Get potential matches for the logged-in user
// @route   GET /api/users/matches
// @access  Private
const getMatches = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        const targetGender = currentUser.gender === 'Man' ? 'Woman' : 'Man';

        // Create a list of IDs to exclude (users already seen)
        const excludedIds = [...currentUser.likes, ...currentUser.passes, currentUser._id];

        const matches = await User.find({ 
            gender: targetGender,
            _id: { $nin: excludedIds } // $nin means "not in"
        }).limit(10).select('-password');

        res.json(matches);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching matches' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    // req.user is attached by the 'protect' middleware
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
        } else {
            return res.status(400).json({ message: 'Invalid action.' });
        }

        let isMatch = false;
        if (action === 'like') {
            const targetUser = await User.findById(targetUserId);
            if (targetUser && targetUser.likes.includes(currentUserId)) {
                isMatch = true;
                // It's a match! Add each other to the matches list.
                await User.findByIdAndUpdate(currentUserId, { $addToSet: { matches: targetUserId } });
                await User.findByIdAndUpdate(targetUserId, { $addToSet: { matches: currentUserId } });

                // --- NEW: Create a conversation when a match occurs ---
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
        console.error(error);
        res.status(500).json({ message: 'Server error while recording action' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    updateUserProfile,
    getMatches,
    getUserProfile,
    recordAction // Export the new function
};
