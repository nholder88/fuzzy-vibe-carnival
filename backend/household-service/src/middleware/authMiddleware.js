const jwt = require('jsonwebtoken');
const { HouseholdMember } = require('../models');

// Authenticate user via JWT token
exports.authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Authentication token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        console.error('Authentication error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Check if user is admin of the household
exports.isHouseholdAdmin = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const householdId = req.params.id || req.params.householdId || req.body.household_id;

        if (!householdId) {
            return res.status(400).json({ message: 'Household ID is required' });
        }

        const member = await HouseholdMember.findOne({
            where: { household_id: householdId, user_id: userId }
        });

        if (!member) {
            return res.status(403).json({ message: 'Access denied: Not a member of this household' });
        }

        if (member.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admin privileges required' });
        }

        next();
    } catch (error) {
        console.error('Authorization error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}; 