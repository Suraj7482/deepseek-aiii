import jwt from 'jsonwebtoken';
import jwtConfig from '../controller/jwt.js';

export const verifyToken = (req, res, next) => {
    // Check for the token in the cookies OR the Authorization header
    const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1]; 

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, jwtConfig.JWT_SECRET);
        req.user = decoded; // Attaches the { id: user._id } payload to req.user
        next();
    } catch (error) {
        return res.status(403).json({ message: "Unauthorized: Invalid token" });
    }
};