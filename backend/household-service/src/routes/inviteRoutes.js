const express = require('express');
const router = express.Router();
const inviteController = require('../controllers/InviteController');
const { authenticate } = require('../middleware/auth');

router.post('/:householdId/invite', authenticate, inviteController.inviteMember);

module.exports = router; 