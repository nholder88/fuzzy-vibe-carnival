const createMockData = (model, data) => ({
    ...data,
    toJSON: () => data,
    update: jest.fn().mockResolvedValue({ ...data, ...data }),
    destroy: jest.fn().mockResolvedValue(true)
});

const createMockError = (message) => new Error(message);

const createMockResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
});

const createMockRequest = (data = {}) => ({
    ...data
});

const createMockNext = () => jest.fn();

const expectSuccess = (result, expected) => {
    expect(result).toEqual(expected);
};

const expectError = async (promise, errorMessage) => {
    await expect(promise).rejects.toThrow(errorMessage);
};

const expectNotFound = async (promise, entityName) => {
    await expect(promise).rejects.toThrow(`${entityName} not found`);
};

const expectDatabaseError = async (promise, entityName) => {
    await expect(promise).rejects.toThrow(`Error creating ${entityName}: Database error`);
};

module.exports = {
    createMockData,
    createMockError,
    createMockResponse,
    createMockRequest,
    createMockNext,
    expectSuccess,
    expectError,
    expectNotFound,
    expectDatabaseError
}; 