const { v4: uuidv4 } = require('uuid');
const { AppError } = require('../utils/errors');
const inviteRepository = require('../repositories/InviteRepository');

class InviteService {
    constructor() {
        this.inviteRepository = inviteRepository;
    }

    async createInvite(email, householdId) {
        try {
            const normalizedEmail = this.normalizeEmail(email);

            const existingInvite = await this.inviteRepository.findPendingInvite(normalizedEmail, householdId);
            if (existingInvite) {
                throw new AppError('Invite already exists', 409);
            }

            const inviteData = {
                email: normalizedEmail,
                household_id: householdId,
                token: this.generateInviteToken(),
                status: 'pending',
                expires_at: this.calculateExpiryDate()
            };

            const invite = await this.inviteRepository.create(inviteData);
            return {
                id: invite.id,
                email: invite.email,
                token: invite.token,
                householdId: invite.household_id,
                status: invite.status,
                expiresAt: invite.expires_at
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(`Failed to create invite: ${error.message}`, 500);
        }
    }

    async validateInvite(token) {
        try {
            const invite = await this.inviteRepository.findByToken(token);
            if (!invite) {
                throw new AppError('Invalid invite token', 400);
            }

            if (invite.status !== 'pending') {
                throw new AppError('Invite has already been used', 400);
            }

            if (new Date(invite.expires_at) < new Date()) {
                throw new AppError('Invite has expired', 400);
            }

            return {
                id: invite.id,
                email: invite.email,
                token: invite.token,
                householdId: invite.household_id,
                status: invite.status,
                expiresAt: invite.expires_at
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(`Failed to validate invite: ${error.message}`, 500);
        }
    }

    normalizeEmail(email) {
        return email.toLowerCase().trim();
    }

    generateInviteToken() {
        return uuidv4();
    }

    calculateExpiryDate() {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7); // 7 days expiry
        return expiryDate;
    }
}

module.exports = new InviteService(); 