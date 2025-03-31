
const User = require('../models/user.model');
const PasswordUtil = require('../libs/passwordUtil');
const JwtUtil = require('../libs/jwtUtil');
const { validationResult } = require('express-validator');

const generateTokenResponse = (user) => {
    const accessToken = JwtUtil.generateAccessToken(user);
    const refreshToken = JwtUtil.generateRefreshToken(user);

    return { accessToken, refreshToken };
};

// Helper function for handling validation errors
const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array().map(err => ({ field: err.param, message: err.msg }))
        });
    }
    return null;
};

exports.register = async (req, res) => {
    try {
        // Check for validation errors
        const validationError = handleValidationErrors(req, res);
        if (validationError) return;

        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // Create and save new user
        const user = new User({ name, email, password });
        await user.save();
        // Generate tokens
        const { accessToken, refreshToken } = generateTokenResponse(user);

        // Set refresh token cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });

        // Send response
        res.status(201).json({
            message: 'User registered successfully',
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);

        // Handle specific database errors
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // Handle validation errors from Mongoose
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));
            return res.status(400).json({ message: 'Validation failed', errors });
        }

        res.status(500).json({ message: 'Server error during registration' });
    }
};

exports.login = async (req, res) => {
    try {
        // Check for validation errors
        const validationError = handleValidationErrors(req, res);
        if (validationError) return;

        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isPasswordValid = await PasswordUtil.comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect Password' });
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokenResponse(user);

        // Set refresh token cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });

        // Send response
        res.json({
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

exports.refreshToken = (req, res) => {
    try {
        const refreshToken = req.headers.cookie
            ? req.headers.cookie.split('; ').find(row => row.startsWith('refreshToken=')).split('=')[1]
            : req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token not found' });
        }

        // Verify refresh token
        let user = JwtUtil.verifyRefreshToken(refreshToken);
        
        user = {
            ...user,
            _id: user.id,
        }


        if (!user) {
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }


        const { accessToken: newAccessToken } = generateTokenResponse(user);

        // Send response
        res.json({
            accessToken: newAccessToken,
            user
        });
    } catch (error) {
        console.error('Token refresh error:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Refresh token has expired' });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        res.status(500).json({ message: 'Server error during token refresh' });
    }
};

exports.logout = (req, res) => {
    try {
        // Clear refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error during logout' });
    }
};
