const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const householdMemberService = require('../services/householdMemberService');

// Mock the service
jest.mock('../services/householdMemberService', () => ({
    updateMemberRole: jest.fn(),
    isAdmin: jest.fn()
}));

describe('Household Member Role Update', () => {
    let app;
    let token;
    let mockMember;

    beforeEach(() => {
        // Create a new Express app for each test
        app = express();
        app.use(express.json());

        // Create a mock JWT token
        token = jwt.sign(
            { userId: 1 },
            process.env.JWT_SECRET || 'test-secret',
            { expiresIn: '1h' }
        );

        mockMember = {
            id: 1,
            user_id: 1,
            household_id: 1,
            role: 'member'
        };

        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    describe('PUT /api/households/:householdId/members/:userId/role', () => {
        it('should allow admin to update member role', async () => {
            householdMemberService.isAdmin.mockResolvedValue(true);
            householdMemberService.updateMemberRole.mockResolvedValue({
                ...mockMember,
                role: 'admin'
            });

            app.put('/api/households/:householdId/members/:userId/role', async (req, res, next) => {
                try {
                    const { householdId, userId } = req.params;
                    const { role } = req.body;

                    // Verify token
                    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
                    if (decoded.userId !== parseInt(userId)) {
                        return res.status(403).json({
                            status: 'error',
                            message: 'Not authorized to update this member'
                        });
                    }

                    // Check if user is admin
                    const isAdmin = await householdMemberService.isAdmin(decoded.userId, parseInt(householdId));
                    if (!isAdmin) {
                        return res.status(403).json({
                            status: 'error',
                            message: 'Only admins can update member roles'
                        });
                    }

                    // Update role
                    const updatedMember = await householdMemberService.updateMemberRole(
                        parseInt(userId),
                        parseInt(householdId),
                        role
                    );

                    res.status(200).json({
                        status: 'success',
                        data: updatedMember
                    });
                } catch (error) {
                    next(error);
                }
            });

            const response = await request(app)
                .put('/api/households/1/members/2/role')
                .set('Authorization', `Bearer ${token}`)
                .send({ role: 'admin' });

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.data.role).toBe('admin');
        });

        it('should reject non-admin role updates', async () => {
            householdMemberService.isAdmin.mockResolvedValue(false);

            app.put('/api/households/:householdId/members/:userId/role', async (req, res, next) => {
                try {
                    const { householdId, userId } = req.params;
                    const { role } = req.body;

                    // Verify token
                    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
                    if (decoded.userId !== parseInt(userId)) {
                        return res.status(403).json({
                            status: 'error',
                            message: 'Not authorized to update this member'
                        });
                    }

                    // Check if user is admin
                    const isAdmin = await householdMemberService.isAdmin(decoded.userId, parseInt(householdId));
                    if (!isAdmin) {
                        return res.status(403).json({
                            status: 'error',
                            message: 'Only admins can update member roles'
                        });
                    }

                    // Update role
                    const updatedMember = await householdMemberService.updateMemberRole(
                        parseInt(userId),
                        parseInt(householdId),
                        role
                    );

                    res.status(200).json({
                        status: 'success',
                        data: updatedMember
                    });
                } catch (error) {
                    next(error);
                }
            });

            const response = await request(app)
                .put('/api/households/1/members/2/role')
                .set('Authorization', `Bearer ${token}`)
                .send({ role: 'admin' });

            expect(response.status).toBe(403);
            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Only admins can update member roles');
        });

        it('should reject invalid role values', async () => {
            householdMemberService.isAdmin.mockResolvedValue(true);
            householdMemberService.updateMemberRole.mockRejectedValue(new Error('Invalid role'));

            app.put('/api/households/:householdId/members/:userId/role', async (req, res, next) => {
                try {
                    const { householdId, userId } = req.params;
                    const { role } = req.body;

                    // Verify token
                    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
                    if (decoded.userId !== parseInt(userId)) {
                        return res.status(403).json({
                            status: 'error',
                            message: 'Not authorized to update this member'
                        });
                    }

                    // Check if user is admin
                    const isAdmin = await householdMemberService.isAdmin(decoded.userId, parseInt(householdId));
                    if (!isAdmin) {
                        return res.status(403).json({
                            status: 'error',
                            message: 'Only admins can update member roles'
                        });
                    }

                    // Update role
                    const updatedMember = await householdMemberService.updateMemberRole(
                        parseInt(userId),
                        parseInt(householdId),
                        role
                    );

                    res.status(200).json({
                        status: 'success',
                        data: updatedMember
                    });
                } catch (error) {
                    next(error);
                }
            });

            const response = await request(app)
                .put('/api/households/1/members/2/role')
                .set('Authorization', `Bearer ${token}`)
                .send({ role: 'invalid-role' });

            expect(response.status).toBe(500);
            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Invalid role');
        });

        it('should reject updates for non-existent members', async () => {
            householdMemberService.isAdmin.mockResolvedValue(true);
            householdMemberService.updateMemberRole.mockRejectedValue(new Error('Member not found'));

            app.put('/api/households/:householdId/members/:userId/role', async (req, res, next) => {
                try {
                    const { householdId, userId } = req.params;
                    const { role } = req.body;

                    // Verify token
                    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
                    if (decoded.userId !== parseInt(userId)) {
                        return res.status(403).json({
                            status: 'error',
                            message: 'Not authorized to update this member'
                        });
                    }

                    // Check if user is admin
                    const isAdmin = await householdMemberService.isAdmin(decoded.userId, parseInt(householdId));
                    if (!isAdmin) {
                        return res.status(403).json({
                            status: 'error',
                            message: 'Only admins can update member roles'
                        });
                    }

                    // Update role
                    const updatedMember = await householdMemberService.updateMemberRole(
                        parseInt(userId),
                        parseInt(householdId),
                        role
                    );

                    res.status(200).json({
                        status: 'success',
                        data: updatedMember
                    });
                } catch (error) {
                    next(error);
                }
            });

            const response = await request(app)
                .put('/api/households/1/members/999/role')
                .set('Authorization', `Bearer ${token}`)
                .send({ role: 'admin' });

            expect(response.status).toBe(500);
            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Member not found');
        });
    });
}); 