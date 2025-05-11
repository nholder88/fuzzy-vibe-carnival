const HouseholdRepository = require('../../repositories/HouseholdRepository');
const Household = require('../../models/household');
const { Op } = require('sequelize');
const {
    createMockData,
    createMockError,
    expectSuccess,
    expectError,
    expectNotFound,
    expectDatabaseError
} = require('../utils/testHelpers');

describe('HouseholdRepository', () => {
    const mockHousehold = createMockData(Household, {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Household',
        ownerId: '123e4567-e89b-12d3-a456-426614174001',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should successfully create a new household', async () => {
            Household.create.mockResolvedValue(mockHousehold);
            const result = await HouseholdRepository.create(mockHousehold);
            expectSuccess(result, mockHousehold);
            expect(Household.create).toHaveBeenCalledWith(mockHousehold);
        });

        it('should handle database errors when creating a household', async () => {
            Household.create.mockRejectedValue(createMockError('Database error'));
            await expectDatabaseError(
                HouseholdRepository.create(mockHousehold),
                'Household'
            );
        });
    });

    describe('findByName', () => {
        it('should successfully find a household by name', async () => {
            Household.findOne.mockResolvedValue(mockHousehold);
            const result = await HouseholdRepository.findByName('Test Household');
            expectSuccess(result, mockHousehold);
            expect(Household.findOne).toHaveBeenCalledWith({ where: { name: 'Test Household' } });
        });
    });

    describe('findByNameLike', () => {
        it('should successfully find households by name pattern', async () => {
            Household.findAll.mockResolvedValue([mockHousehold]);
            const result = await HouseholdRepository.findByNameLike('Test');
            expectSuccess(result, [mockHousehold]);
            expect(Household.findAll).toHaveBeenCalledWith({
                where: {
                    name: {
                        [Op.iLike]: '%Test%'
                    }
                }
            });
        });
    });

    describe('findActiveHouseholds', () => {
        it('should successfully find all active households', async () => {
            Household.findAll.mockResolvedValue([mockHousehold]);
            const result = await HouseholdRepository.findActiveHouseholds();
            expectSuccess(result, [mockHousehold]);
            expect(Household.findAll).toHaveBeenCalledWith({ where: { status: 'active' } });
        });
    });

    describe('findHouseholdsByOwnerId', () => {
        it('should successfully find households by owner ID', async () => {
            Household.findAll.mockResolvedValue([mockHousehold]);
            const result = await HouseholdRepository.findHouseholdsByOwnerId(mockHousehold.ownerId);
            expectSuccess(result, [mockHousehold]);
            expect(Household.findAll).toHaveBeenCalledWith({ where: { ownerId: mockHousehold.ownerId } });
        });
    });

    describe('update', () => {
        it('should successfully update a household', async () => {
            const updatedHousehold = { ...mockHousehold, name: 'Updated Household' };
            Household.findByPk.mockResolvedValue(mockHousehold);
            mockHousehold.update.mockResolvedValue(updatedHousehold);

            const result = await HouseholdRepository.update(mockHousehold.id, { name: 'Updated Household' });
            expectSuccess(result, updatedHousehold);
            expect(Household.findByPk).toHaveBeenCalledWith(mockHousehold.id);
            expect(mockHousehold.update).toHaveBeenCalledWith({ name: 'Updated Household' });
        });

        it('should handle not found error when updating a household', async () => {
            Household.findByPk.mockResolvedValue(null);
            await expectNotFound(
                HouseholdRepository.update(mockHousehold.id, { name: 'Updated Household' }),
                'Household'
            );
        });
    });

    describe('delete', () => {
        it('should successfully delete a household', async () => {
            Household.findByPk.mockResolvedValue(mockHousehold);
            const result = await HouseholdRepository.delete(mockHousehold.id);
            expectSuccess(result, true);
            expect(Household.findByPk).toHaveBeenCalledWith(mockHousehold.id);
            expect(mockHousehold.destroy).toHaveBeenCalled();
        });

        it('should handle not found error when deleting a household', async () => {
            Household.findByPk.mockResolvedValue(null);
            await expectNotFound(
                HouseholdRepository.delete(mockHousehold.id),
                'Household'
            );
        });
    });
}); 