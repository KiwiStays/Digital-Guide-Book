import jwt from 'jsonwebtoken';
const secretKey = process.env.JWT_SECRET || 'your-default-secret-key';

// Middleware for Auth
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, secretKey);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Session expired, please log in again' });
    }
};

export default authenticate;
