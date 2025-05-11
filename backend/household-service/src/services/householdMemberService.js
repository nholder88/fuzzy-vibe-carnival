const { HouseholdMember } = require('../models');

class HouseholdMemberService {
    async updateMemberRole(userId, householdId, newRole) {
        const member = await HouseholdMember.findOne({
            where: {
                user_id: userId,
                household_id: householdId
            }
        });

        if (!member) {
            throw new Error('Member not found');
        }

        if (!['admin', 'member'].includes(newRole)) {
            throw new Error('Invalid role');
        }

        await member.update({ role: newRole });
        return member;
    }

    async isAdmin(userId, householdId) {
        const member = await HouseholdMember.findOne({
            where: {
                user_id: userId,
                household_id: householdId
            }
        });

        return !!member && member.role === 'admin';
    }
}

module.exports = new HouseholdMemberService(); 