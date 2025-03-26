const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');

// Import controllers
// For now we'll just use placeholder functions since we haven't created the controllers yet
const {
    getAllChores,
    getChoreById,
    createChore,
    updateChore,
    deleteChore,
    updateChoreStatus
} = require('../controllers/choresController');

// Middleware for validation errors
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// GET all chores
router.get('/', getAllChores);

// GET a chore by ID
router.get(
    '/:id',
    [param('id').isUUID().withMessage('Invalid chore ID')],
    validateRequest,
    getChoreById
);

// POST a new chore
router.post(
    '/',
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('household_id').isUUID().withMessage('Valid household ID is required'),
        body('status')
            .isIn(['pending', 'in_progress', 'completed'])
            .withMessage('Status must be pending, in_progress, or completed'),
        body('priority')
            .isIn(['low', 'medium', 'high'])
            .withMessage('Priority must be low, medium, or high'),
        body('recurring')
            .optional()
            .isIn(['none', 'daily', 'weekly', 'monthly'])
            .withMessage('Recurring must be none, daily, weekly, or monthly')
    ],
    validateRequest,
    createChore
);

// PUT (update) a chore
router.put(
    '/:id',
    [
        param('id').isUUID().withMessage('Invalid chore ID'),
        body('title').optional().notEmpty().withMessage('Title cannot be empty'),
        body('status')
            .optional()
            .isIn(['pending', 'in_progress', 'completed'])
            .withMessage('Status must be pending, in_progress, or completed'),
        body('priority')
            .optional()
            .isIn(['low', 'medium', 'high'])
            .withMessage('Priority must be low, medium, or high')
    ],
    validateRequest,
    updateChore
);

// PATCH a chore's status
router.patch(
    '/:id/status',
    [
        param('id').isUUID().withMessage('Invalid chore ID'),
        body('status')
            .isIn(['pending', 'in_progress', 'completed'])
            .withMessage('Status must be pending, in_progress, or completed')
    ],
    validateRequest,
    updateChoreStatus
);

// DELETE a chore
router.delete(
    '/:id',
    [param('id').isUUID().withMessage('Invalid chore ID')],
    validateRequest,
    deleteChore
);

module.exports = router; 