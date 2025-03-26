const express = require('express');
const router = express.Router();
const householdMemberController = require('../controllers/householdMemberController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all members of a household
router.get('/household/:id', authMiddleware.authenticate, householdMemberController.getHouseholdMembers);

// Add a member to a household
router.post('/household/:id/user', authMiddleware.authenticate, authMiddleware.isHouseholdAdmin, householdMemberController.addHouseholdMember);

// Update a member's role in a household
router.put('/household/:householdId/user/:userId', authMiddleware.authenticate, authMiddleware.isHouseholdAdmin, householdMemberController.updateMemberRole);

// Remove a member from a household
router.delete('/household/:householdId/user/:userId', authMiddleware.authenticate, authMiddleware.isHouseholdAdmin, householdMemberController.removeMember);

module.exports = router; 