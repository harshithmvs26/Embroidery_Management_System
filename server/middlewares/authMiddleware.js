const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers['x-access-token'];
    
    if (!token) {
        return res.status(403).render('login', { message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).render('login', { message: 'Invalid token' });
    }
};

const verifyOwner = (req, res, next) => {
    if (req.user.role !== 'owner') {
        return res.status(403).render('error', { message: 'Access denied. Owner only.' });
    }
    next();
};

const verifyEmployee = (req, res, next) => {
    if (req.user.role !== 'employee') {
        return res.status(403).render('error', { message: 'Access denied. Employee only.' });
    }
    next();
};

const verifyCustomer = (req, res, next) => {
    if (req.user.role !== 'customer') {
        return res.status(403).render('error', { message: 'Access denied. Customer only.' });
    }
    next();
};

module.exports = {
    verifyToken,
    verifyOwner,
    verifyEmployee,
    verifyCustomer
}; 