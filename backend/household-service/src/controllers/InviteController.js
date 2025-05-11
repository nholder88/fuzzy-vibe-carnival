const inviteService = require('../services/InviteService');
const { BadRequestError } = require('../utils/errors');

class InviteController {
    async inviteMember(req, res, next) {
        try {
            const { email } = req.body;
            const { householdId } = req.params;

            if (!email) {
                throw new BadRequestError('Email is required');
            }

            const invite = await inviteService.createInvite(email, householdId);

            res.status(201).json({
                success: true,
                data: {
                    inviteId: invite.id,
                    email: invite.email,
                    expiresAt: invite.expiresAt
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new InviteController(); 