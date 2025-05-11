const { AppError } = require('../utils/errors');
const householdMemberRepository = require('../repositories/HouseholdMemberRepository');

class HouseholdMemberService {
    constructor() {
        this.householdMemberRepository = householdMemberRepository;
        this.VALID_ROLES = ['admin', 'member'];
    }

    async updateMemberRole(userId, householdId, role) {
        if (!this.VALID_ROLES.includes(role)) {
            throw new AppError('Invalid role', 400);
        }

        const member = await this.householdMemberRepository.findMemberByUserIdAndHouseholdId(
            userId,
            householdId
        );

        if (!member) {
            throw new AppError('Member not found', 404);
        }

        try {
            return await this.householdMemberRepository.update(member.id, { role });
        } catch (error) {
            throw new AppError(`Failed to update member role: ${error.message}`, 500);
        }
    }

    async isAdmin(userId, householdId) {
        try {
            const member = await this.householdMemberRepository.findMemberByUserIdAndHouseholdId(
                userId,
                householdId
            );

            return member?.role === 'admin';
        } catch (error) {
            throw new AppError(`Failed to check admin status: ${error.message}`, 500);
        }
    }
}

module.exports = new HouseholdMemberService(); 