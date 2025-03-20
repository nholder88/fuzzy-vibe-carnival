const express = require('express');
const router = express.Router();
const householdController = require('../controllers/householdController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all households
router.get('/', authMiddleware.authenticate, householdController.getAllHouseholds);

// Get a household by ID
router.get('/:id', authMiddleware.authenticate, householdController.getHouseholdById);

// Create a new household
router.post('/', authMiddleware.authenticate, householdController.createHousehold);

// Update a household
router.put('/:id', authMiddleware.authenticate, authMiddleware.isHouseholdAdmin, householdController.updateHousehold);

// Delete a household
router.delete('/:id', authMiddleware.authenticate, authMiddleware.isHouseholdAdmin, householdController.deleteHousehold);

module.exports = router; 