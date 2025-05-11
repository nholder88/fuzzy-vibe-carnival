const BaseRepository = require('./BaseRepository');
const Invite = require('../models/Invite');
const { Op } = require('sequelize');

class InviteRepository extends BaseRepository {
    constructor() {
        super(Invite);
    }

    async findByToken(token) {
        return this.findOne({ where: { token } });
    }

    async findByEmail(email) {
        return this.findOne({ where: { email } });
    }

    async findByHouseholdId(householdId) {
        return this.findAll({ where: { householdId } });
    }

    async findPendingInvites() {
        return this.findAll({ where: { status: 'pending' } });
    }

    async findExpiredInvites() {
        return this.findAll({
            where: {
                status: 'pending',
                expiresAt: {
                    [Op.lt]: new Date()
                }
            }
        });
    }

    async findPendingInvite(email, householdId) {
        return this.findOne({
            where: {
                email,
                household_id: householdId,
                status: 'pending'
            }
        });
    }
}

module.exports = new InviteRepository(); 