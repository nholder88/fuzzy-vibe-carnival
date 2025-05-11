const { HouseholdMember, Household } = require('../models');
const householdMemberService = require('../services/householdMemberService');

// Get all members of a household
exports.getHouseholdMembers = async (req, res) => {
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

        const members = await HouseholdMember.findAll({
            where: { household_id: id }
        });

        res.status(200).json(members);
    } catch (error) {
        console.error('Error fetching household members:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Add a member to a household
exports.addHouseholdMember = async (req, res) => {
    try {
        const { household_id, user_id, role } = req.body;

        if (!household_id || !user_id || !role) {
            return res.status(400).json({ message: 'Household ID, user ID, and role are required' });
        }

        // Check if household exists
        const household = await Household.findByPk(household_id);
        if (!household) {
            return res.status(404).json({ message: 'Household not found' });
        }

        // Check if user is already a member
        const existingMember = await HouseholdMember.findOne({
            where: { household_id, user_id }
        });

        if (existingMember) {
            return res.status(400).json({ message: 'User is already a member of this household' });
        }

        // Validate role
        if (!['admin', 'member'].includes(role)) {
            return res.status(400).json({ message: "Role must be either 'admin' or 'member'" });
        }

        const member = await HouseholdMember.create({
            household_id,
            user_id,
            role
        });

        res.status(201).json(member);
    } catch (error) {
        console.error('Error adding household member:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a member's role in a household
exports.updateMemberRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role, householdId } = req.body;

        if (!householdId) {
            return res.status(400).json({ message: 'Household ID is required' });
        }

        if (!role) {
            return res.status(400).json({ message: 'Role is required' });
        }

        // Only allow admins to update roles (including their own)
        const isAdmin = await householdMemberService.isAdmin(req.user.id, householdId);
        console.log('DEBUG isAdmin:', isAdmin, 'user:', req.user.id, 'household:', householdId);
        if (!isAdmin) {
            return res.status(403).json({ message: 'Only household admins can update member roles' });
        }

        const updatedMember = await householdMemberService.updateMemberRole(userId, householdId, role);
        res.json(updatedMember);
    } catch (error) {
        if (error.message === 'Member not found') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'Invalid role') {
            return res.status(400).json({ message: error.message });
        }
        console.error('Error updating member role:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Remove a member from a household
exports.removeMember = async (req, res) => {
    try {
        const { householdId, userId } = req.params;

        const member = await HouseholdMember.findOne({
            where: { household_id: householdId, user_id: userId }
        });

        if (!member) {
            return res.status(404).json({ message: 'Household member not found' });
        }

        // Prevent removing the last admin
        if (member.role === 'admin') {
            const adminCount = await HouseholdMember.count({
                where: { household_id: householdId, role: 'admin' }
            });

            if (adminCount <= 1) {
                return res.status(400).json({
                    message: 'Cannot remove the last admin. Transfer admin role to another member first'
                });
            }
        }

        await member.destroy();

        res.status(200).json({ message: 'Member removed successfully' });
    } catch (error) {
        console.error('Error removing household member:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}; 