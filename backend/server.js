const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const uploadRoutes = require('./routes/uploadRoutes');
// Import routes
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes'); // Import the new chat routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
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
const MONGO_URI = process.env.MONGO_URI || "your_mongodb_connection_string_here";

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