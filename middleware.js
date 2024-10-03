const jwt = require('jsonwebtoken');
const JWT_SECRET = require("./config");

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ msg: "You are not authorized to access" });
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        }
    } catch (err) {
        return res.status(403).json({});
    }
}

module.exports = authMiddleware;
