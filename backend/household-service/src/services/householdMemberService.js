const { AppError } = require('../utils/errors');
const HouseholdMemberRepository = require('../repositories/HouseholdMemberRepository');

class HouseholdMemberService {
    constructor() {
        this.householdMemberRepository = new HouseholdMemberRepository();
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

        return this.householdMemberRepository.update(member.id, { role });
    }

    async isAdmin(userId, householdId) {
        const member = await this.householdMemberRepository.findMemberByUserIdAndHouseholdId(
            userId,
            householdId
        );

        return member?.role === 'admin';
    }
}

module.exports = new HouseholdMemberService(); 