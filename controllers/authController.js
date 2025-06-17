const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Ensure environment variables are loaded
require('dotenv').config();

const registerUser = async (req,res) => {
    try {

        const { username, email, password, role } = req.body;
        console.log(req.body);

        
        // if (!username || !email || !password || !role) {
        //     return res.status(400).json({ message: 'Missing required fields' });
        // }

        

        const existingUser = await User.findOne({ $or: [{username}, {email}] });

        if (existingUser){
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            passwordHash: hashedPassword,
            role
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Debug: Check if JWT_SECRET is loaded
        const jwtSecret = process.env.JWT_SECRET || 'fallback_jwt_secret_key_for_development';
        console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);

        const token = jwt.sign(
            { userId: user._id },
            jwtSecret,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
    registerUser,
    loginUser
}