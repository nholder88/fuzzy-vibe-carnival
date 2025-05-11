const { Model } = require('sequelize');
const { AppError } = require('../utils/errors');

class BaseRepository {
    constructor(model) {
        if (!(model.prototype instanceof Model)) {
            throw new Error('Model must be a Sequelize model');
        }
        this.model = model;
    }

    async create(data) {
        try {
            return await this.model.create(data);
        } catch (error) {
            throw new AppError(`Error creating ${this.model.name}: ${error.message}`, 500);
        }
    }

    async findById(id) {
        try {
            return await this.model.findByPk(id);
        } catch (error) {
            throw new AppError(`Error finding ${this.model.name}: ${error.message}`, 500);
        }
    }

    async findAll(options = {}) {
        try {
            return await this.model.findAll(options);
        } catch (error) {
            throw new AppError(`Error finding all ${this.model.name}: ${error.message}`, 500);
        }
    }

    async update(id, data) {
        try {
            const instance = await this.findById(id);
            if (!instance) {
                throw new AppError(`${this.model.name} not found`, 404);
            }
            return await instance.update(data);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(`Error updating ${this.model.name}: ${error.message}`, 500);
        }
    }

    async delete(id) {
        try {
            const instance = await this.findById(id);
            if (!instance) {
                throw new AppError(`${this.model.name} not found`, 404);
            }
            await instance.destroy();
            return true;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(`Error deleting ${this.model.name}: ${error.message}`, 500);
        }
    }

    async findOne(options) {
        try {
            return await this.model.findOne(options);
        } catch (error) {
            throw new AppError(`Error finding one ${this.model.name}: ${error.message}`, 500);
        }
    }
}

module.exports = BaseRepository; 