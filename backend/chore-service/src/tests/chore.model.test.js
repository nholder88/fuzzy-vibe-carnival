const Chore = require('../models/Chore');
const db = require('../config/database');

// Mock the database module
jest.mock('../config/database');

describe('Chore Model', () => {
    // Clear all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('cloneForRecurrence', () => {
        test('should clone a chore with the next due date', async () => {
            // Sample chore to clone
            const sampleChore = {
                id: 'chore1',
                title: 'Daily Chore',
                description: 'A daily recurring chore',
                assigned_to: 'user1',
                household_id: 'household1',
                status: 'completed',
                due_date: '2023-12-01T10:00:00.000Z',
                priority: 'medium',
                recurring: 'daily',
                completed_at: '2023-12-01T15:00:00.000Z',
                created_by: 'user1'
            };

            // Expected new chore data
            const expectedNewChore = {
                id: 'new-chore1',
                title: 'Daily Chore',
                description: 'A daily recurring chore',
                assigned_to: 'user1',
                household_id: 'household1',
                status: 'pending',
                due_date: '2023-12-02T10:00:00.000Z',
                priority: 'medium',
                recurring: 'daily',
                created_by: 'user1'
            };

            // Mock the create method
            Chore.create = jest.fn().mockResolvedValue(expectedNewChore);

            // Mock the calculateNextDueDate method
            const originalCalculateNextDueDate = Chore.calculateNextDueDate;
            Chore.calculateNextDueDate = jest.fn().mockReturnValue('2023-12-02T10:00:00.000Z');

            // Call the method
            const result = await Chore.cloneForRecurrence(sampleChore);

            // Assertions
            expect(Chore.calculateNextDueDate).toHaveBeenCalledWith(
                '2023-12-01T10:00:00.000Z',
                'daily'
            );

            expect(Chore.create).toHaveBeenCalledWith({
                title: 'Daily Chore',
                description: 'A daily recurring chore',
                assigned_to: 'user1',
                household_id: 'household1',
                status: 'pending',
                due_date: '2023-12-02T10:00:00.000Z',
                priority: 'medium',
                recurring: 'daily',
                created_by: 'user1'
            });

            expect(result).toEqual(expectedNewChore);

            // Restore original method
            Chore.calculateNextDueDate = originalCalculateNextDueDate;
        });
    });

    describe('findDueRecurringChores', () => {
        test('should find all completed recurring chores', async () => {
            // Sample chores to be returned
            const mockChores = [
                {
                    id: 'chore1',
                    title: 'Daily Chore',
                    recurring: 'daily',
                    status: 'completed',
                    completed_at: '2023-12-01T15:00:00.000Z'
                },
                {
                    id: 'chore2',
                    title: 'Weekly Chore',
                    recurring: 'weekly',
                    status: 'completed',
                    completed_at: '2023-12-01T15:00:00.000Z'
                }
            ];

            // Mock database query
            db.query.mockResolvedValue({ rows: mockChores });

            // Call the method
            const result = await Chore.findDueRecurringChores();

            // Assertions
            expect(db.query).toHaveBeenCalledWith(`
      SELECT * FROM chores 
      WHERE recurring != 'none' 
      AND status = 'completed' 
      AND completed_at IS NOT NULL
    `);

            expect(result).toEqual(mockChores);
        });

        test('should handle database errors', async () => {
            // Mock database error
            db.query.mockRejectedValue(new Error('Database connection error'));

            // Assertions for the rejected promise
            await expect(Chore.findDueRecurringChores()).rejects.toThrow('Database connection error');

            expect(db.query).toHaveBeenCalledTimes(1);
        });
    });

    describe('calculateNextDueDate', () => {
        test('should calculate the next day for daily recurrence', () => {
            const baseDate = '2023-12-01T10:00:00.000Z';
            const expectedDate = new Date(baseDate);
            expectedDate.setDate(expectedDate.getDate() + 1);

            const result = Chore.calculateNextDueDate(baseDate, 'daily');

            expect(new Date(result)).toEqual(expectedDate);
        });

        test('should calculate the next week for weekly recurrence', () => {
            const baseDate = '2023-12-01T10:00:00.000Z';
            const expectedDate = new Date(baseDate);
            expectedDate.setDate(expectedDate.getDate() + 7);

            const result = Chore.calculateNextDueDate(baseDate, 'weekly');

            expect(new Date(result)).toEqual(expectedDate);
        });

        test('should calculate the next month for monthly recurrence', () => {
            const baseDate = '2023-12-01T10:00:00.000Z';
            const expectedDate = new Date(baseDate);
            expectedDate.setMonth(expectedDate.getMonth() + 1);

            const result = Chore.calculateNextDueDate(baseDate, 'monthly');

            expect(new Date(result)).toEqual(expectedDate);
        });

        test('should handle month boundaries correctly', () => {
            // Test with January 31 to ensure it goes to February correctly
            const baseDate = '2023-01-31T10:00:00.000Z';
            const result = Chore.calculateNextDueDate(baseDate, 'monthly');

            const expectedDate = new Date(baseDate);
            expectedDate.setMonth(expectedDate.getMonth() + 1);

            expect(new Date(result)).toEqual(expectedDate);
        });

        test('should handle year boundaries correctly', () => {
            // Test with December 31 to ensure it goes to next year correctly
            const baseDate = '2023-12-31T10:00:00.000Z';
            const result = Chore.calculateNextDueDate(baseDate, 'monthly');

            const expectedDate = new Date(baseDate);
            expectedDate.setMonth(expectedDate.getMonth() + 1);

            expect(new Date(result)).toEqual(expectedDate);
        });
    });
}); 