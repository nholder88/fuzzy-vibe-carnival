const inviteController = require('../../controllers/InviteController');
const inviteService = require('../../services/InviteService');

// Mock the service
jest.mock('../../services/InviteService', () => ({
    createInvite: jest.fn(),
    validateInvite: jest.fn()
}));

describe('InviteController', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            body: {},
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();

        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    describe('inviteMember', () => {
        it('should successfully create an invite', async () => {
            const mockInvite = {
                id: 1,
                email: 'test@example.com',
                token: 'test-token',
                householdId: 1,
                status: 'pending',
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            };

            req.body = {
                email: 'test@example.com',
                householdId: 1
            };
            inviteService.createInvite.mockResolvedValue(mockInvite);

            await inviteController.inviteMember(req, res, next);

            expect(inviteService.createInvite).toHaveBeenCalledWith('test@example.com', 1);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: mockInvite
            });
        });

        it('should handle missing email', async () => {
            req.body = {
                householdId: 1
            };

            await inviteController.inviteMember(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 400,
                message: 'Email is required'
            }));
        });

        it('should handle service errors', async () => {
            req.body = {
                email: 'test@example.com',
                householdId: 1
            };
            const error = new Error('Service error');
            inviteService.createInvite.mockRejectedValue(error);

            await inviteController.inviteMember(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
}); 