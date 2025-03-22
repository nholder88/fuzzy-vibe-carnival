const { v4: uuidv4 } = require('uuid');
const Chore = require('../models/Chore');
const { publishEvent } = require('../services/kafkaService');
const { validateStatusTransition, prepareStatusUpdateData } = require('../services/choreStatusService');

// GET all chores
const getAllChores = async (req, res) => {
    try {
        // Add filtering by household_id if provided in query params
        const householdId = req.query.household_id;
        const chores = await Chore.findAll(householdId);
        res.status(200).json(chores);
    } catch (error) {
        console.error('Error fetching chores:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET a chore by ID
const getChoreById = async (req, res) => {
    try {
        const chore = await Chore.findById(req.params.id);

        if (!chore) {
            return res.status(404).json({ message: 'Chore not found' });
        }

        res.status(200).json(chore);
    } catch (error) {
        console.error(`Error fetching chore ${req.params.id}:`, error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// POST a new chore
const createChore = async (req, res) => {
    try {
        const {
            title,
            description,
            assigned_to,
            household_id,
            status,
            due_date,
            priority,
            recurring
        } = req.body;

        const choreData = {
            title,
            description,
            assigned_to,
            household_id,
            status,
            due_date,
            priority,
            recurring,
            created_by: req.user ? req.user.id : null // Assuming authentication middleware sets user
        };

        const newChore = await Chore.create(choreData);

        // In a real implementation, we would publish an event to Kafka here
        // Example: await publishEvent('chore.created', newChore);

        res.status(201).json(newChore);
    } catch (error) {
        console.error('Error creating chore:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// PUT (update) a chore
const updateChore = async (req, res) => {
    try {
        const updatedChore = await Chore.update(req.params.id, req.body);

        // In a real implementation, we would publish an event to Kafka here
        // Example: await publishEvent('chore.updated', updatedChore);

        res.status(200).json(updatedChore);
    } catch (error) {
        if (error.message === 'Chore not found') {
            return res.status(404).json({ message: 'Chore not found' });
        }
        console.error(`Error updating chore ${req.params.id}:`, error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// PATCH (update) a chore's status
const updateChoreStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const choreId = req.params.id;

        // First get the current chore to validate transition
        const currentChore = await Chore.findById(choreId);

        if (!currentChore) {
            return res.status(404).json({ message: 'Chore not found' });
        }

        // Validate the status transition
        const validationResult = validateStatusTransition(currentChore.status, status);
        if (!validationResult.valid) {
            return res.status(400).json({ message: validationResult.message });
        }

        // Prepare the update data with proper completed_at handling
        const updateData = prepareStatusUpdateData(currentChore, status);

        // Update the chore in the database
        const updatedChore = await Chore.update(choreId, updateData);

        // Publish event to Kafka for WebSocket subscribers
        await publishEvent('chores.status.updated', {
            id: updatedChore.id,
            type: 'status_updated',
            chore: updatedChore,
            previousStatus: currentChore.status,
            newStatus: updatedChore.status,
            timestamp: new Date().toISOString()
        });

        res.status(200).json(updatedChore);
    } catch (error) {
        console.error(`Error updating chore status ${req.params.id}:`, error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// DELETE a chore
const deleteChore = async (req, res) => {
    try {
        const deletedChore = await Chore.delete(req.params.id);

        if (!deletedChore) {
            return res.status(404).json({ message: 'Chore not found' });
        }

        // In a real implementation, we would publish an event to Kafka here
        // Example: await publishEvent('chore.deleted', deletedChore);

        res.status(200).json({ message: 'Chore deleted successfully' });
    } catch (error) {
        console.error(`Error deleting chore ${req.params.id}:`, error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getAllChores,
    getChoreById,
    createChore,
    updateChore,
    updateChoreStatus,
    deleteChore
}; 