const { Household, HouseholdMember } = require('../models');
const { v4: uuidv4 } = require('uuid');

// Get all households that the user is a member of
exports.getAllHouseholds = async (req, res) => {
    try {
        const userId = req.user.id;

        const householdMembers = await HouseholdMember.findAll({
            where: { user_id: userId },
            include: [{ model: Household }]
        });

        const households = householdMembers.map(member => member.household);

        res.status(200).json(households);
    } catch (error) {
        console.error('Error fetching households:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a specific household by ID
exports.getHouseholdById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check if user is a member of the household
        const membership = await HouseholdMember.findOne({
            where: { household_id: id, user_id: userId }
        });

        if (!membership) {
            return res.status(403).json({ message: 'Access denied: Not a member of this household' });
        }

        const household = await Household.findByPk(id);

        if (!household) {
            return res.status(404).json({ message: 'Household not found' });
        }

        res.status(200).json(household);
    } catch (error) {
        console.error('Error fetching household:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create a new household
exports.createHousehold = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;

        if (!name) {
            return res.status(400).json({ message: 'Household name is required' });
        }

        const household = await Household.create({
            id: uuidv4(),
            name,
            created_by: userId
        });

        // Add the creator as an admin of the household
        await HouseholdMember.create({
            household_id: household.id,
            user_id: userId,
            role: 'admin'
        });

        res.status(201).json(household);
    } catch (error) {
        console.error('Error creating household:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a household
exports.updateHousehold = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Household name is required' });
        }

        const household = await Household.findByPk(id);

        if (!household) {
            return res.status(404).json({ message: 'Household not found' });
        }

        household.name = name;
        household.updated_at = new Date();
        await household.save();

        res.status(200).json(household);
    } catch (error) {
        console.error('Error updating household:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a household
exports.deleteHousehold = async (req, res) => {
    try {
        const { id } = req.params;

        const household = await Household.findByPk(id);

        if (!household) {
            return res.status(404).json({ message: 'Household not found' });
        }

        await household.destroy();

        res.status(200).json({ message: 'Household deleted successfully' });
    } catch (error) {
        console.error('Error deleting household:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}; 