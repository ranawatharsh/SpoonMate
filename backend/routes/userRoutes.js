const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    updateUserProfile, 
    getMatches,
    getUserProfile,
    recordAction // Make sure this is imported
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', loginUser);

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.get('/matches', protect, getMatches);

// THIS IS THE MISSING ROUTE
router.post('/action', protect, recordAction);

module.exports = router;