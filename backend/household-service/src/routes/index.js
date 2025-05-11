const express = require('express');
const router = express.Router();

const householdRoutes = require('./householdRoutes');
const householdMemberRoutes = require('./householdMemberRoutes');
const inviteRoutes = require('./inviteRoutes');

router.use('/households', householdRoutes);
router.use('/household-members', householdMemberRoutes);
router.use('/invites', inviteRoutes);

module.exports = router; 