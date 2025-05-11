const { Model } = require('sequelize');
const inviteService = require('../../services/InviteService');
const inviteRepository = require('../../repositories/InviteRepository');
const {
    createMockData,
    createMockError,
    expectSuccess,
    expectError,
    expectNotFound
} = require('../utils/testHelpers');

// Mock the repository
jest.mock('../../repositories/InviteRepository', () => ({
    findPendingInvite: jest.fn(),
    create: jest.fn(),
    findByToken: jest.fn()
}));

describe('InviteService', () => {
    let mockInvite;

    beforeEach(() => {
        mockInvite = {
            id: 1,
            email: 'test@example.com',
            token: 'test-token',
            household_id: 1,
            status: 'pending',
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
        };

        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    describe('createInvite', () => {
        it('should successfully create a new invite', async () => {
            inviteRepository.findPendingInvite.mockResolvedValue(null);
            inviteRepository.create.mockResolvedValue(mockInvite);

            const result = await inviteService.createInvite('test@example.com', 1);

            expect(inviteRepository.findPendingInvite).toHaveBeenCalledWith('test@example.com', 1);
            expect(inviteRepository.create).toHaveBeenCalled();
            expect(result).toEqual({
                id: mockInvite.id,
                email: mockInvite.email,
                token: mockInvite.token,
                householdId: mockInvite.household_id,
                status: mockInvite.status,
                expiresAt: mockInvite.expires_at
            });
        });

        it('should handle existing invite error', async () => {
            inviteRepository.findPendingInvite.mockResolvedValue(mockInvite);

            await expect(inviteService.createInvite('test@example.com', 1))
                .rejects
                .toThrow('An active invite already exists for this email');
        });

        it('should normalize email address', async () => {
            inviteRepository.findPendingInvite.mockResolvedValue(null);
            inviteRepository.create.mockResolvedValue(mockInvite);

            await inviteService.createInvite('Test@Example.com', 1);

            expect(inviteRepository.findPendingInvite).toHaveBeenCalledWith('test@example.com', 1);
            expect(inviteRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                email: 'test@example.com'
            }));
        });
    });

    describe('validateInvite', () => {
        it('should successfully validate a valid invite', async () => {
            inviteRepository.findByToken.mockResolvedValue(mockInvite);

            const result = await inviteService.validateInvite('test-token');

            expect(inviteRepository.findByToken).toHaveBeenCalledWith('test-token');
            expect(result).toEqual(mockInvite);
        });

        it('should handle invalid token', async () => {
            inviteRepository.findByToken.mockResolvedValue(null);

            await expect(inviteService.validateInvite('invalid-token'))
                .rejects
                .toThrow('Invalid invite token');
        });

        it('should handle expired invite', async () => {
            const expiredInvite = {
                ...mockInvite,
                expires_at: new Date(Date.now() - 24 * 60 * 60 * 1000)
            };
            inviteRepository.findByToken.mockResolvedValue(expiredInvite);

            await expect(inviteService.validateInvite('test-token'))
                .rejects
                .toThrow('Invite has expired');
        });

        it('should handle used invite', async () => {
            const usedInvite = {
                ...mockInvite,
                status: 'used'
            };
            inviteRepository.findByToken.mockResolvedValue(usedInvite);

            await expect(inviteService.validateInvite('test-token'))
                .rejects
                .toThrow('Invite has already been used');
        });
    });
}); 