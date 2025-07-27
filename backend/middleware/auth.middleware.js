import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware to verify JWT token
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
        
        // Find user
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid token. User not found."
            });
        }

        // Add user info to request object
        req.userId = user._id;
        req.userRole = user.role;
        req.user = user;

        next();
    } catch (error) {
        // Only log detailed errors in development
        if (process.env.NODE_ENV === 'development') {
            console.error("Error in verifyToken middleware:", {
                error: error.message,
                type: error.name,
                path: req.path,
                method: req.method
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired"
            });
        }

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Middleware to check if user is admin
export const requireAdmin = (req, res, next) => {
    // First verify token
    verifyToken(req, res, (err) => {
        if (err) {
            return; // verifyToken already sent response
        }

        console.log(req)

        // Check if user is admin
        if (req.userRole !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        next();
    });
};

// Optional auth middleware (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return next();
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
        
        // Find user
        const user = await User.findById(decoded.userId);
        if (user) {
            req.userId = user._id;
            req.userRole = user.role;
            req.user = user;
        }

        next();
    } catch (error) {
        // If token is invalid, just continue without auth
        next();
    }
};
