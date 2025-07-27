import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
        expiresIn: "7d"
    });
};

// Set JWT Cookie
const setTokenCookie = (res, token) => {
   
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: None,
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        path: "/"
    });
    
    console.log("✅ Cookie set successfully"); 
};

// Signup Controller
export const signup = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide username, email, and password"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email or username already exists"
            });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password,
            role: role || "user"
        });

        await user.save();

        // Generate token and set cookie
        const token = generateToken(user._id);
        setTokenCookie(res, token);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Error in signup:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Login Controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        console.log(user)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Generate token and set cookie
        console.log(user._id)
        
        const token = generateToken(user._id);
        setTokenCookie(res, token);

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Error in login:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Logout Controller
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
        httpOnly: true,
        secure: true, // EXACT MATCH
        sameSite:None,
        path: "/" // EXACT MATCH
        });
        res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        console.error("Error in logout:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Get Current User Controller
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Error in getMe:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
