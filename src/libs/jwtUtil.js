const jwt = require("jsonwebtoken");

class JwtUtil {
    static generateAccessToken(user) {
        const payload = { id: user._id, email: user.email, name: user.name };
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    }

    static generateRefreshToken(user) {
        const payload = { id: user._id, email: user.email, name: user.name };
        return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    }

    static verifyAccessToken(token) {
        try {
            return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            return null;
        }
    }

    static verifyRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        } catch (error) {
            return null;
        }
    }
}

module.exports = JwtUtil;
