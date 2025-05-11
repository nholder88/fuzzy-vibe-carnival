const { AppError, errorHandler } = require('../../middleware/errorHandler');
const {
    createMockRequest,
    createMockResponse,
    createMockNext,
    expectSuccess
} = require('../utils/testHelpers');

describe('Error Handler', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = createMockRequest();
        mockRes = createMockResponse();
        mockNext = createMockNext();
    });

    describe('AppError', () => {
        it('should successfully create an operational error with correct properties', () => {
            const error = new AppError('Test error', 400);
            expect(error.message).toBe('Test error');
            expect(error.statusCode).toBe(400);
            expect(error.status).toBe('fail');
            expect(error.isOperational).toBe(true);
        });

        it('should successfully set status to error for 5xx status codes', () => {
            const error = new AppError('Server error', 500);
            expect(error.status).toBe('error');
        });
    });

    describe('errorHandler', () => {
        it('should successfully handle operational errors in development', () => {
            process.env.NODE_ENV = 'development';
            const error = new AppError('Test error', 400);

            errorHandler(error, mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'fail',
                error: error,
                message: 'Test error',
                stack: error.stack
            });
        });

        it('should successfully handle operational errors in production', () => {
            process.env.NODE_ENV = 'production';
            const error = new AppError('Test error', 400);

            errorHandler(error, mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'Test error'
            });
        });

        it('should successfully handle programming errors in production', () => {
            process.env.NODE_ENV = 'production';
            const error = new Error('Programming error');
            error.isOperational = false;

            errorHandler(error, mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Something went wrong'
            });
        });

        it('should successfully use default status code if not provided', () => {
            process.env.NODE_ENV = 'development';
            const error = new Error('Test error');

            errorHandler(error, mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(500);
        });
    });
}); 