const mockSequelize = {
    sync: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true),
    authenticate: jest.fn().mockResolvedValue(true),
    transaction: jest.fn().mockImplementation(callback => callback()),
    define: jest.fn().mockReturnValue({
        sync: jest.fn().mockResolvedValue(true),
        create: jest.fn(),
        findOne: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
    })
};

const initializeDatabase = jest.fn().mockResolvedValue(mockSequelize);

module.exports = {
    sequelize: mockSequelize,
    initializeDatabase
}; 