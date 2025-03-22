const {
    validateStatusTransition,
    prepareStatusUpdateData,
    VALID_STATUSES,
    VALID_TRANSITIONS
} = require('../services/choreStatusService');

describe('Chore Status Service', () => {
    describe('validateStatusTransition', () => {
        test('should return valid when status is unchanged', () => {
            const result = validateStatusTransition('pending', 'pending');
            expect(result.valid).toBe(true);
            expect(result.message).toBe('Status unchanged');
        });

        test('should return valid for allowed transitions', () => {
            // Test all valid transitions
            for (const [fromStatus, toStatuses] of Object.entries(VALID_TRANSITIONS)) {
                for (const toStatus of toStatuses) {
                    const result = validateStatusTransition(fromStatus, toStatus);
                    expect(result.valid).toBe(true);
                    expect(result.message).toBe('Status transition is valid');
                }
            }
        });

        test('should return invalid for disallowed transitions', () => {
            // Create an invalid transition not in our rules
            const invalidTransition = {
                from: 'pending',
                to: 'unknown_status'
            };

            const result = validateStatusTransition(invalidTransition.from, invalidTransition.to);
            expect(result.valid).toBe(false);
            expect(result.message).toContain('Invalid status:');
        });

        test('should reject invalid status values', () => {
            const invalidStatus = 'invalid_status';
            const result = validateStatusTransition('pending', invalidStatus);

            expect(result.valid).toBe(false);
            expect(result.message).toContain(`Invalid status: ${invalidStatus}`);
            expect(result.message).toContain(VALID_STATUSES.join(', '));
        });
    });

    describe('prepareStatusUpdateData', () => {
        test('should set completed_at when status changes to completed', () => {
            const chore = {
                id: 'chore-1',
                status: 'in_progress',
                completed_at: null
            };

            const updateData = prepareStatusUpdateData(chore, 'completed');

            expect(updateData.status).toBe('completed');
            expect(updateData.completed_at).toBeDefined();

            // Verify it's a valid ISO date string
            expect(() => new Date(updateData.completed_at)).not.toThrow();
        });

        test('should reset completed_at when status changes from completed', () => {
            const chore = {
                id: 'chore-1',
                status: 'completed',
                completed_at: '2023-12-01T10:00:00.000Z'
            };

            const updateData = prepareStatusUpdateData(chore, 'pending');

            expect(updateData.status).toBe('pending');
            expect(updateData.completed_at).toBeNull();
        });

        test('should not change completed_at for other status transitions', () => {
            const chore = {
                id: 'chore-1',
                status: 'pending',
                completed_at: null
            };

            const updateData = prepareStatusUpdateData(chore, 'in_progress');

            expect(updateData.status).toBe('in_progress');
            expect(updateData.completed_at).toBeUndefined();
        });
    });
}); 