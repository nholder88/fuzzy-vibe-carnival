const { v4: uuidv4 } = require('uuid');
// We'll add a database model later, but for now we'll use a simple in-memory array
let chores = [];

// GET all chores
const getAllChores = (req, res) => {
    // Add filtering by household_id if provided in query params
    const householdId = req.query.household_id;

    if (householdId) {
        const filteredChores = chores.filter(chore => chore.household_id === householdId);
        return res.status(200).json(filteredChores);
    }

    res.status(200).json(chores);
};

// GET a chore by ID
const getChoreById = (req, res) => {
    const chore = chores.find(c => c.id === req.params.id);

    if (!chore) {
        return res.status(404).json({ message: 'Chore not found' });
    }

    res.status(200).json(chore);
};

// POST a new chore
const createChore = (req, res) => {
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

    const newChore = {
        id: uuidv4(),
        title,
        description: description || '',
        assigned_to: assigned_to || null,
        household_id,
        status: status || 'pending',
        due_date: due_date || null,
        priority: priority || 'medium',
        recurring: recurring || 'none',
        completed_at: null,
        created_by: req.user ? req.user.id : null, // Assuming authentication middleware sets user
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    chores.push(newChore);

    // In a real implementation, we would publish an event to Kafka here
    // Example: await publishEvent('chore.created', newChore);

    res.status(201).json(newChore);
};

// PUT (update) a chore
const updateChore = (req, res) => {
    const choreIndex = chores.findIndex(c => c.id === req.params.id);

    if (choreIndex === -1) {
        return res.status(404).json({ message: 'Chore not found' });
    }

    const updatedChore = {
        ...chores[choreIndex],
        ...req.body,
        updated_at: new Date().toISOString()
    };

    // If status changed to completed, update completed_at timestamp
    if (req.body.status === 'completed' && chores[choreIndex].status !== 'completed') {
        updatedChore.completed_at = new Date().toISOString();
    }

    chores[choreIndex] = updatedChore;

    // In a real implementation, we would publish an event to Kafka here
    // Example: await publishEvent('chore.updated', updatedChore);

    res.status(200).json(updatedChore);
};

// DELETE a chore
const deleteChore = (req, res) => {
    const choreIndex = chores.findIndex(c => c.id === req.params.id);

    if (choreIndex === -1) {
        return res.status(404).json({ message: 'Chore not found' });
    }

    const deletedChore = chores[choreIndex];
    chores = chores.filter(c => c.id !== req.params.id);

    // In a real implementation, we would publish an event to Kafka here
    // Example: await publishEvent('chore.deleted', deletedChore);

    res.status(200).json({ message: 'Chore deleted successfully' });
};

module.exports = {
    getAllChores,
    getChoreById,
    createChore,
    updateChore,
    deleteChore
}; 