const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- NEW: CORS Configuration ---
// Add your Netlify URL to this list of allowed origins.
const allowedOrigins = [
    'http://localhost:5173', // Your local frontend for testing
    'https://spoonmate.netlify.app' // Your live frontend URL
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
};

// --- UPDATED: Use the new CORS options ---
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/upload', uploadRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('SpoonMate API is running!');
});

// Connect to MongoDB and start the server
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });
