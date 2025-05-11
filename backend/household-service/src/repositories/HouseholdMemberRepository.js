const BaseRepository = require('./BaseRepository');
const HouseholdMember = require('../models/householdMember');
const { Op } = require('sequelize');

class HouseholdMemberRepository extends BaseRepository {
    constructor() {
        super(HouseholdMember);
    }

    async findByUserId(userId) {
        return this.findAll({ where: { userId } });
    }

    async findByHouseholdId(householdId) {
        return this.findAll({ where: { householdId } });
    }

    async findActiveMembers() {
        return this.findAll({ where: { status: 'active' } });
    }

    async findMembersByRole(role) {
        return this.findAll({ where: { role } });
    }

    async findMemberByUserIdAndHouseholdId(userId, householdId) {
        return this.findOne({
            where: {
                userId,
                householdId
            }
        });
    }

    async findMembersWithHousehold() {
        return this.findAll({
            include: [{
                model: require('../models/household'),
                as: 'household'
            }]
        });
    }
}

module.exports = new HouseholdMemberRepository(); 