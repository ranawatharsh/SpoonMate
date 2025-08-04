const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: Date },
    gender: { type: String },
    photos: [{ type: String }], 
    
    // --- NEW FIELD ---
    bio: { type: String, maxLength: 150 }, // Added bio with a character limit

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    passes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    profile: {
        diet: { type: String },
        favoriteCuisines: [{ type: String }],
        spiceLevel: { type: String },
        adventurousness: { type: String },
        dateStyle: { type: String },
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
