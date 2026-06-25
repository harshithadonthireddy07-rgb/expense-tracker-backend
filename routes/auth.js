const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ==================
// REGISTER ROUTE
// POST /api/auth/register
// ==================
router.post('/register', async (req, res) => {
    try {
        // Get data sent by user
        const { name, email, password } = req.body;

        // Check if all fields are filled
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Encrypt the password before saving
        // 10 = how strong the encryption is
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user in database
        const user = new User({
            name,
            email,
            password: hashedPassword  // save encrypted password, never plain text!
        });

        await user.save();

        // Create a JWT token so user stays logged in
        const token = jwt.sign(
            { userId: user._id },        // what we store in token
            process.env.JWT_SECRET,       // secret key to sign token
            { expiresIn: '7d' }          // token expires in 7 days
        );

        res.status(201).json({
            message: 'Registration successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================
// LOGIN ROUTE
// POST /api/auth/login
// ==================
router.post('/login', async (req, res) => {
    try {
        // Get data sent by user
        const { email, password } = req.body;

        // Check if all fields are filled
        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare password with encrypted password in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;