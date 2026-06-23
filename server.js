// Import all libraries we installed
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Create our express app
const app = express();

// Middleware — these run before every request
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Allow reading JSON data from requests

// Routes — these handle different URLs
app.use('/api/auth', require('./routes/auth'));         // Login/Register routes
app.use('/api/expenses', require('./routes/expenses')); // Expense routes

// Test route — visit http://localhost:5000 to check if server is running
app.get('/', (req, res) => {
    res.json({ message: 'Expense Tracker API is running!' });
});

// Connect to MongoDB database
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    family: 4  // Force IPv4
})
    .then(() => {
        console.log('✅ Connected to MongoDB!');
        // Start server only after database connects
        app.listen(5000, () => {
            console.log('✅ Server running on http://localhost:5000');
        });
    })
    .catch((error) => {
        console.log('❌ Database connection failed:', error);
    });