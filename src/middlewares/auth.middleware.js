const JwtUtil = require('../libs/jwt.util');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Access token required" });

        const user = JwtUtil.verifyAccessToken(token);
        req.user = user;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;
