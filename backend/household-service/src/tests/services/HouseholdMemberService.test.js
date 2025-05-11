const householdMemberService = require('../../services/householdMemberService');
const householdMemberRepository = require('../../repositories/HouseholdMemberRepository');
const {
    createMockData,
    createMockError,
    expectSuccess,
    expectError,
    expectNotFound
} = require('../utils/testHelpers');

// Mock the repository
jest.mock('../../repositories/HouseholdMemberRepository', () => ({
    findMemberByUserIdAndHouseholdId: jest.fn(),
    update: jest.fn()
}));

describe('HouseholdMemberService', () => {
    let mockMember;

    beforeEach(() => {
        mockMember = {
            id: 1,
            user_id: 1,
            household_id: 1,
            role: 'member'
        };

        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    describe('updateMemberRole', () => {
        it('should successfully update member role to admin', async () => {
            householdMemberRepository.findMemberByUserIdAndHouseholdId.mockResolvedValue(mockMember);
            householdMemberRepository.update.mockResolvedValue({
                ...mockMember,
                role: 'admin'
            });

            const result = await householdMemberService.updateMemberRole(1, 1, 'admin');

            expect(householdMemberRepository.findMemberByUserIdAndHouseholdId)
                .toHaveBeenCalledWith(1, 1);
            expect(householdMemberRepository.update)
                .toHaveBeenCalledWith(1, { role: 'admin' });
            expect(result.role).toBe('admin');
        });

        it('should successfully update member role to member', async () => {
            householdMemberRepository.findMemberByUserIdAndHouseholdId.mockResolvedValue({
                ...mockMember,
                role: 'admin'
            });
            householdMemberRepository.update.mockResolvedValue(mockMember);

            const result = await householdMemberService.updateMemberRole(1, 1, 'member');

            expect(householdMemberRepository.findMemberByUserIdAndHouseholdId)
                .toHaveBeenCalledWith(1, 1);
            expect(householdMemberRepository.update)
                .toHaveBeenCalledWith(1, { role: 'member' });
            expect(result.role).toBe('member');
        });

        it('should handle non-existent member', async () => {
            householdMemberRepository.findMemberByUserIdAndHouseholdId.mockResolvedValue(null);

            await expect(householdMemberService.updateMemberRole(1, 1, 'admin'))
                .rejects
                .toThrow('Member not found');
        });

        it('should handle invalid role', async () => {
            householdMemberRepository.findMemberByUserIdAndHouseholdId.mockResolvedValue(mockMember);

            await expect(householdMemberService.updateMemberRole(1, 1, 'invalid-role'))
                .rejects
                .toThrow('Invalid role');
        });
    });

    describe('isAdmin', () => {
        it('should return true for admin member', async () => {
            householdMemberRepository.findMemberByUserIdAndHouseholdId.mockResolvedValue({
                ...mockMember,
                role: 'admin'
            });

            const result = await householdMemberService.isAdmin(1, 1);

            expect(householdMemberRepository.findMemberByUserIdAndHouseholdId)
                .toHaveBeenCalledWith(1, 1);
            expect(result).toBe(true);
        });

        it('should return false for non-admin member', async () => {
            householdMemberRepository.findMemberByUserIdAndHouseholdId.mockResolvedValue(mockMember);

            const result = await householdMemberService.isAdmin(1, 1);

            expect(householdMemberRepository.findMemberByUserIdAndHouseholdId)
                .toHaveBeenCalledWith(1, 1);
            expect(result).toBe(false);
        });

        it('should return false for non-existent member', async () => {
            householdMemberRepository.findMemberByUserIdAndHouseholdId.mockResolvedValue(null);

            const result = await householdMemberService.isAdmin(1, 1);

            expect(householdMemberRepository.findMemberByUserIdAndHouseholdId)
                .toHaveBeenCalledWith(1, 1);
            expect(result).toBe(false);
        });
    });
}); 