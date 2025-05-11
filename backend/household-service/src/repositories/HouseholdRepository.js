const BaseRepository = require('./BaseRepository');
const Household = require('../models/household');
const { Op } = require('sequelize');
const { AppError } = require('../utils/errors');

class HouseholdRepository extends BaseRepository {
    constructor() {
        super(Household);
    }

    async findByName(name) {
        try {
            return await this.findOne({ where: { name } });
        } catch (error) {
            throw new AppError(`Failed to find household by name: ${error.message}`, 500);
        }
    }

    async findByNameLike(name) {
        try {
            return await this.findAll({
                where: {
                    name: {
                        [Op.iLike]: `%${name}%`
                    }
                }
            });
        } catch (error) {
            throw new AppError(`Failed to find households by name pattern: ${error.message}`, 500);
        }
    }

    async findActiveHouseholds() {
        try {
            return await this.findAll({ where: { status: 'active' } });
        } catch (error) {
            throw new AppError(`Failed to find active households: ${error.message}`, 500);
        }
    }

    async findHouseholdsByOwnerId(ownerId) {
        try {
            return await this.findAll({ where: { ownerId } });
        } catch (error) {
            throw new AppError(`Failed to find households by owner: ${error.message}`, 500);
        }
    }

    async findHouseholdsWithMembers() {
        try {
            return await this.findAll({
                include: [{
                    model: require('../models/householdMember'),
                    as: 'members'
                }]
            });
        } catch (error) {
            throw new AppError(`Failed to find households with members: ${error.message}`, 500);
        }
    }
}

module.exports = new HouseholdRepository(); 