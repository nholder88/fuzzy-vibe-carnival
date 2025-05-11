const InviteRepository = require('../../repositories/InviteRepository');
const Invite = require('../../models/Invite');

describe('InviteRepository', () => {
    const mockInvite = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        token: 'test-token',
        householdId: '123e4567-e89b-12d3-a456-426614174001',
        status: 'pending',
        expiresAt: new Date()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new invite', async () => {
            Invite.create.mockResolvedValue(mockInvite);
            const result = await InviteRepository.create(mockInvite);
            expect(result).toEqual(mockInvite);
            expect(Invite.create).toHaveBeenCalledWith(mockInvite);
        });

        it('should handle errors when creating an invite', async () => {
            const error = new Error('Database error');
            Invite.create.mockRejectedValue(error);
            await expect(InviteRepository.create(mockInvite)).rejects.toThrow('Error creating Invite: Database error');
        });
    });

    describe('findByToken', () => {
        it('should find an invite by token', async () => {
            Invite.findOne.mockResolvedValue(mockInvite);
            const result = await InviteRepository.findByToken('test-token');
            expect(result).toEqual(mockInvite);
            expect(Invite.findOne).toHaveBeenCalledWith({ where: { token: 'test-token' } });
        });
    });

    describe('findByEmail', () => {
        it('should find an invite by email', async () => {
            Invite.findOne.mockResolvedValue(mockInvite);
            const result = await InviteRepository.findByEmail('test@example.com');
            expect(result).toEqual(mockInvite);
            expect(Invite.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
        });
    });

    describe('findByHouseholdId', () => {
        it('should find invites by household ID', async () => {
            Invite.findAll.mockResolvedValue([mockInvite]);
            const result = await InviteRepository.findByHouseholdId(mockInvite.householdId);
            expect(result).toEqual([mockInvite]);
            expect(Invite.findAll).toHaveBeenCalledWith({ where: { householdId: mockInvite.householdId } });
        });
    });

    describe('findPendingInvites', () => {
        it('should find all pending invites', async () => {
            Invite.findAll.mockResolvedValue([mockInvite]);
            const result = await InviteRepository.findPendingInvites();
            expect(result).toEqual([mockInvite]);
            expect(Invite.findAll).toHaveBeenCalledWith({ where: { status: 'pending' } });
        });
    });

    describe('update', () => {
        it('should update an invite', async () => {
            const updatedInvite = { ...mockInvite, status: 'accepted' };
            Invite.findByPk.mockResolvedValue(mockInvite);
            mockInvite.update = jest.fn().mockResolvedValue(updatedInvite);

            const result = await InviteRepository.update(mockInvite.id, { status: 'accepted' });
            expect(result).toEqual(updatedInvite);
            expect(Invite.findByPk).toHaveBeenCalledWith(mockInvite.id);
            expect(mockInvite.update).toHaveBeenCalledWith({ status: 'accepted' });
        });

        it('should throw error when invite not found', async () => {
            Invite.findByPk.mockResolvedValue(null);
            await expect(InviteRepository.update(mockInvite.id, { status: 'accepted' }))
                .rejects.toThrow('Invite not found');
        });
    });

    describe('delete', () => {
        it('should delete an invite', async () => {
            Invite.findByPk.mockResolvedValue(mockInvite);
            mockInvite.destroy = jest.fn().mockResolvedValue(true);

            const result = await InviteRepository.delete(mockInvite.id);
            expect(result).toBe(true);
            expect(Invite.findByPk).toHaveBeenCalledWith(mockInvite.id);
            expect(mockInvite.destroy).toHaveBeenCalled();
        });

        it('should throw error when invite not found', async () => {
            Invite.findByPk.mockResolvedValue(null);
            await expect(InviteRepository.delete(mockInvite.id))
                .rejects.toThrow('Invite not found');
        });
    });
}); 