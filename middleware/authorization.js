import jwt from 'jsonwebtoken';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']; //Bearer TOKEN
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({ message: 'Null Token' });
    jwt.verify(token, process.env.ACCESS_TOCKEN_SECRET, (error, user) => {
        if (error) res.status(403).json({ message: error.message });
        req.user = user;
        next();
    })
}

export { authenticateToken };