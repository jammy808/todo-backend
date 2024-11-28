const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//SignUp Controller
exports.signup = async (req, res) => {
    const { username, password } = req.body;
    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        //password hashing.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Creating a new user.
        const user = await User.create({ username, password: hashedPassword });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

//Login Controller
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        //checking is password is correct ?
        const isCorrect = await bcrypt.compare(password, user.password);
        if (!isCorrect) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        //genrating JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 60 * 60 * 1000,
        });

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

//Logout Controller
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
}
