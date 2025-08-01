const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: Date },
    gender: { type: String },
    photos: [{ type: String }], 
    
    // --- NEW FIELDS ---
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Stores IDs of users they liked
    passes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Stores IDs of users they passed on
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Stores IDs of mutual matches

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