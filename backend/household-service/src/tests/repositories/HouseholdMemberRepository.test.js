const HouseholdMemberRepository = require('../../repositories/HouseholdMemberRepository');
const HouseholdMember = require('../../models/householdMember');
const {
    createMockData,
    createMockError,
    expectSuccess,
    expectError,
    expectNotFound,
    expectDatabaseError
} = require('../utils/testHelpers');

describe('HouseholdMemberRepository', () => {
    const mockMember = createMockData(HouseholdMember, {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        householdId: '123e4567-e89b-12d3-a456-426614174002',
        role: 'member',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should successfully create a new household member', async () => {
            HouseholdMember.create.mockResolvedValue(mockMember);
            const result = await HouseholdMemberRepository.create(mockMember);
            expectSuccess(result, mockMember);
            expect(HouseholdMember.create).toHaveBeenCalledWith(mockMember);
        });

        it('should handle database errors when creating a household member', async () => {
            HouseholdMember.create.mockRejectedValue(createMockError('Database error'));
            await expectDatabaseError(
                HouseholdMemberRepository.create(mockMember),
                'HouseholdMember'
            );
        });
    });

    describe('findByUserId', () => {
        it('should successfully find members by user ID', async () => {
            HouseholdMember.findAll.mockResolvedValue([mockMember]);
            const result = await HouseholdMemberRepository.findByUserId(mockMember.userId);
            expectSuccess(result, [mockMember]);
            expect(HouseholdMember.findAll).toHaveBeenCalledWith({ where: { userId: mockMember.userId } });
        });
    });

    describe('findByHouseholdId', () => {
        it('should successfully find members by household ID', async () => {
            HouseholdMember.findAll.mockResolvedValue([mockMember]);
            const result = await HouseholdMemberRepository.findByHouseholdId(mockMember.householdId);
            expectSuccess(result, [mockMember]);
            expect(HouseholdMember.findAll).toHaveBeenCalledWith({ where: { householdId: mockMember.householdId } });
        });
    });

    describe('findActiveMembers', () => {
        it('should successfully find all active members', async () => {
            HouseholdMember.findAll.mockResolvedValue([mockMember]);
            const result = await HouseholdMemberRepository.findActiveMembers();
            expectSuccess(result, [mockMember]);
            expect(HouseholdMember.findAll).toHaveBeenCalledWith({ where: { status: 'active' } });
        });
    });

    describe('findMembersByRole', () => {
        it('should successfully find members by role', async () => {
            HouseholdMember.findAll.mockResolvedValue([mockMember]);
            const result = await HouseholdMemberRepository.findMembersByRole('member');
            expectSuccess(result, [mockMember]);
            expect(HouseholdMember.findAll).toHaveBeenCalledWith({ where: { role: 'member' } });
        });
    });

    describe('findMemberByUserIdAndHouseholdId', () => {
        it('should successfully find a member by user ID and household ID', async () => {
            HouseholdMember.findOne.mockResolvedValue(mockMember);
            const result = await HouseholdMemberRepository.findMemberByUserIdAndHouseholdId(
                mockMember.userId,
                mockMember.householdId
            );
            expectSuccess(result, mockMember);
            expect(HouseholdMember.findOne).toHaveBeenCalledWith({
                where: {
                    userId: mockMember.userId,
                    householdId: mockMember.householdId
                }
            });
        });
    });

    describe('update', () => {
        it('should successfully update a household member', async () => {
            const updatedMember = { ...mockMember, role: 'admin' };
            HouseholdMember.findByPk.mockResolvedValue(mockMember);
            mockMember.update.mockResolvedValue(updatedMember);

            const result = await HouseholdMemberRepository.update(mockMember.id, { role: 'admin' });
            expectSuccess(result, updatedMember);
            expect(HouseholdMember.findByPk).toHaveBeenCalledWith(mockMember.id);
            expect(mockMember.update).toHaveBeenCalledWith({ role: 'admin' });
        });

        it('should handle not found error when updating a household member', async () => {
            HouseholdMember.findByPk.mockResolvedValue(null);
            await expectNotFound(
                HouseholdMemberRepository.update(mockMember.id, { role: 'admin' }),
                'HouseholdMember'
            );
        });
    });

    describe('delete', () => {
        it('should successfully delete a household member', async () => {
            HouseholdMember.findByPk.mockResolvedValue(mockMember);
            const result = await HouseholdMemberRepository.delete(mockMember.id);
            expectSuccess(result, true);
            expect(HouseholdMember.findByPk).toHaveBeenCalledWith(mockMember.id);
            expect(mockMember.destroy).toHaveBeenCalled();
        });

        it('should handle not found error when deleting a household member', async () => {
            HouseholdMember.findByPk.mockResolvedValue(null);
            await expectNotFound(
                HouseholdMemberRepository.delete(mockMember.id),
                'HouseholdMember'
            );
        });
    });
}); 