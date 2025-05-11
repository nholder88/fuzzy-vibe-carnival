const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Mock the models
jest.mock('../models', () => {
    const mockSequelize = {
        sync: jest.fn(),
        close: jest.fn()
    };
    return {
        Household: {
            create: jest.fn(),
            destroy: jest.fn(),
            sequelize: mockSequelize
        },
        HouseholdMember: {
            create: jest.fn(),
            findOne: jest.fn(),
            destroy: jest.fn(),
            sequelize: mockSequelize
        },
        sequelize: mockSequelize
    };
});

const { Household, HouseholdMember } = require('../models');

// Set test JWT secret if not already set
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';

describe('Household Member Role Update', () => {
    let adminToken;
    let memberToken;
    let householdId;
    let memberId;
    let adminId;

    beforeAll(async () => {
        // Mock database sync
        Household.sequelize.sync.mockResolvedValue();

        // Create test data
        householdId = '123e4567-e89b-12d3-a456-426614174000';
        adminId = '123e4567-e89b-12d3-a456-426614174001';
        memberId = '123e4567-e89b-12d3-a456-426614174002';

        // Mock household creation
        Household.create.mockResolvedValue({
            id: householdId,
            name: 'Test Household',
            created_by: adminId
        });

        // Create tokens
        adminToken = jwt.sign({ id: adminId }, process.env.JWT_SECRET);
        memberToken = jwt.sign({ id: memberId }, process.env.JWT_SECRET);

        // Mock household member creation
        HouseholdMember.create.mockResolvedValue({
            household_id: householdId,
            user_id: adminId,
            role: 'admin'
        });

        HouseholdMember.create.mockResolvedValue({
            household_id: householdId,
            user_id: memberId,
            role: 'member'
        });
    });

    afterAll(async () => {
        // Mock cleanup
        HouseholdMember.destroy.mockResolvedValue();
        Household.destroy.mockResolvedValue();
        Household.sequelize.close.mockResolvedValue();
    });

    it('should update member role when requested by admin', async () => {
        // Mock the isAdmin check to return true for the admin check, and mock update for the member update
        const memberMock = {
            role: 'member',
            update: jest.fn(function (updateObj) {
                this.role = updateObj.role;
                return Promise.resolve(this);
            })
        };
        HouseholdMember.findOne.mockImplementationOnce(() => Promise.resolve({ role: 'admin' }))
            .mockImplementationOnce(() => Promise.resolve(memberMock));

        const response = await request(app)
            .patch(`/api/households/members/${memberId}/role`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                householdId,
                role: 'admin'
            });

        expect(response.status).toBe(200);
        expect(response.body.role).toBe('admin');
    });

    it('should reject role update when requested by non-admin', async () => {
        // Mock the isAdmin check to return false
        HouseholdMember.findOne.mockResolvedValue({ role: 'member' });

        const response = await request(app)
            .patch(`/api/households/members/${memberId}/role`)
            .set('Authorization', `Bearer ${memberToken}`)
            .send({
                householdId,
                role: 'admin'
            });

        expect(response.status).toBe(403);
    });

    it('should reject invalid role values', async () => {
        // Mock the isAdmin check to return true for the admin check, and mock update for the member update
        HouseholdMember.findOne.mockImplementationOnce(() => Promise.resolve({ role: 'admin' }))
            .mockImplementationOnce(() => Promise.resolve({
                role: 'member',
                update: jest.fn().mockRejectedValue(new Error('Invalid role'))
            }));

        const response = await request(app)
            .patch(`/api/households/members/${memberId}/role`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                householdId,
                role: 'invalid_role'
            });

        expect(response.status).toBe(400);
    });

    it('should reject update for non-existent member', async () => {
        // Mock the isAdmin check to return true for the admin check, and mock member not found for the update
        HouseholdMember.findOne.mockImplementationOnce(() => Promise.resolve({ role: 'admin' }))
            .mockImplementationOnce(() => Promise.resolve(null));

        const nonExistentMemberId = '123e4567-e89b-12d3-a456-426614174999';
        const response = await request(app)
            .patch(`/api/households/members/${nonExistentMemberId}/role`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                householdId,
                role: 'admin'
            });

        expect(response.status).toBe(404);
    });
}); 