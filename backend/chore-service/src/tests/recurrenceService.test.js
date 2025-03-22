const Chore = require('../models/Chore');
const RecurrenceService = require('../services/recurrenceService');

// Mock the Chore model
jest.mock('../models/Chore');

describe('RecurrenceService', () => {
    // Clear all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('processRecurringChores', () => {
        test('should process recurring chores and create new ones', async () => {
            // Mock data
            const mockCompletedChores = [
                {
                    id: 'chore1',
                    title: 'Daily Chore',
                    description: 'A daily chore',
                    household_id: 'household1',
                    status: 'completed',
                    due_date: '2023-12-01T10:00:00.000Z',
                    recurring: 'daily',
                    completed_at: '2023-12-01T15:00:00.000Z'
                },
                {
                    id: 'chore2',
                    title: 'Weekly Chore',
                    description: 'A weekly chore',
                    household_id: 'household1',
                    status: 'completed',
                    due_date: '2023-12-01T10:00:00.000Z',
                    recurring: 'weekly',
                    completed_at: '2023-12-01T15:00:00.000Z'
                }
            ];

            const mockNewChores = [
                {
                    id: 'new-chore1',
                    title: 'Daily Chore',
                    status: 'pending',
                    due_date: '2023-12-02T10:00:00.000Z'
                },
                {
                    id: 'new-chore2',
                    title: 'Weekly Chore',
                    status: 'pending',
                    due_date: '2023-12-08T10:00:00.000Z'
                }
            ];

            // Set up mocks
            Chore.findDueRecurringChores.mockResolvedValue(mockCompletedChores);
            Chore.cloneForRecurrence
                .mockResolvedValueOnce(mockNewChores[0])
                .mockResolvedValueOnce(mockNewChores[1]);
            Chore.update.mockResolvedValue({});

            // Call the method
            const result = await RecurrenceService.processRecurringChores();

            // Assertions
            expect(Chore.findDueRecurringChores).toHaveBeenCalledTimes(1);
            expect(Chore.cloneForRecurrence).toHaveBeenCalledTimes(2);
            expect(Chore.cloneForRecurrence).toHaveBeenCalledWith(mockCompletedChores[0]);
            expect(Chore.cloneForRecurrence).toHaveBeenCalledWith(mockCompletedChores[1]);

            // Check that original chores were updated to prevent reprocessing
            expect(Chore.update).toHaveBeenCalledTimes(2);
            expect(Chore.update).toHaveBeenCalledWith('chore1', { recurring: 'none' });
            expect(Chore.update).toHaveBeenCalledWith('chore2', { recurring: 'none' });

            // Check the returned new chores
            expect(result).toEqual(mockNewChores);
        });

        test('should handle errors during processing of individual chores', async () => {
            // Mock data
            const mockCompletedChores = [
                {
                    id: 'chore1',
                    title: 'Daily Chore',
                    recurring: 'daily',
                    due_date: '2023-12-01T10:00:00.000Z'
                },
                {
                    id: 'chore2',
                    title: 'Weekly Chore',
                    recurring: 'weekly',
                    due_date: '2023-12-01T10:00:00.000Z'
                }
            ];

            // Set up mocks
            Chore.findDueRecurringChores.mockResolvedValue(mockCompletedChores);
            Chore.cloneForRecurrence
                .mockResolvedValueOnce({ id: 'new-chore1' })
                .mockRejectedValueOnce(new Error('Failed to clone chore'));
            Chore.update.mockResolvedValue({});

            // Call the method
            const result = await RecurrenceService.processRecurringChores();

            // Assertions
            expect(Chore.findDueRecurringChores).toHaveBeenCalledTimes(1);
            expect(Chore.cloneForRecurrence).toHaveBeenCalledTimes(2);

            // Should still return the successful clone
            expect(result).toEqual([{ id: 'new-chore1' }]);
        });

        test('should handle errors during the overall process', async () => {
            // Set up mocks
            Chore.findDueRecurringChores.mockRejectedValue(new Error('Database error'));

            // Assertions for the rejected promise
            await expect(RecurrenceService.processRecurringChores()).rejects.toThrow('Database error');
            expect(Chore.findDueRecurringChores).toHaveBeenCalledTimes(1);
            expect(Chore.cloneForRecurrence).not.toHaveBeenCalled();
        });
    });
}); 