const { sequelize } = require('../config/database');
const { Model } = require('sequelize');

// Create a base mock model class that extends Sequelize Model
class MockModel extends Model { }
MockModel.init({}, { sequelize });

// Mock the models
jest.mock('../models/Invite', () => {
    const mockModel = class extends MockModel { };
    Object.defineProperty(mockModel, 'name', { value: 'Invite' });
    mockModel.create = jest.fn();
    mockModel.findOne = jest.fn();
    mockModel.findByPk = jest.fn();
    mockModel.findAll = jest.fn();
    mockModel.update = jest.fn();
    mockModel.destroy = jest.fn();
    return mockModel;
});

// Mock the Household model
jest.mock('../models/household', () => {
    const mockModel = class extends MockModel { };
    Object.defineProperty(mockModel, 'name', { value: 'Household' });
    mockModel.create = jest.fn();
    mockModel.findOne = jest.fn();
    mockModel.findByPk = jest.fn();
    mockModel.findAll = jest.fn();
    mockModel.update = jest.fn();
    mockModel.destroy = jest.fn();
    return mockModel;
});

// Mock the HouseholdMember model
jest.mock('../models/householdMember', () => {
    const mockModel = class extends MockModel { };
    Object.defineProperty(mockModel, 'name', { value: 'HouseholdMember' });
    mockModel.create = jest.fn();
    mockModel.findOne = jest.fn();
    mockModel.findByPk = jest.fn();
    mockModel.findAll = jest.fn();
    mockModel.update = jest.fn();
    mockModel.destroy = jest.fn();
    return mockModel;
});

// Test utilities
const testUtils = {
    mockSuccess: (data) => jest.fn().mockResolvedValue(data),
    mockError: (error) => jest.fn().mockRejectedValue(error),
    mockNotFound: () => jest.fn().mockResolvedValue(null),
    createMockData: (model, data) => ({
        ...data,
        toJSON: () => data,
        update: jest.fn().mockResolvedValue({ ...data, ...data }),
        destroy: jest.fn().mockResolvedValue(true)
    })
};

global.testUtils = testUtils;

const isMocked = process.env.NODE_ENV === 'test' || process.env.USE_MOCKS === 'true';

beforeAll(async () => {
    if (!isMocked) {
        await sequelize.sync({ force: true });
    }
});

afterAll(async () => {
    if (!isMocked) {
        await sequelize.close();
    }
});

afterEach(async () => {
    if (!isMocked) {
        await sequelize.truncate({ cascade: true });
    }
}); 