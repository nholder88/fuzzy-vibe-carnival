const { sequelize } = require('../config/database');

// Mock the models
jest.mock('../models/Invite', () => {
    const mockModel = {
        create: jest.fn(),
        findOne: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
    };
    return mockModel;
});

// Mock the Household model
jest.mock('../models/household', () => {
    const mockModel = {
        create: jest.fn(),
        findOne: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
    };
    return mockModel;
});

// Mock the HouseholdMember model
jest.mock('../models/householdMember', () => {
    const mockModel = {
        create: jest.fn(),
        findOne: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
    };
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

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

afterEach(async () => {
    await sequelize.truncate({ cascade: true });
}); 