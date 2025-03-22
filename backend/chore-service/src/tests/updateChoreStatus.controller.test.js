const { updateChoreStatus } = require('../controllers/choresController');
const Chore = require('../models/Chore');
const { validateStatusTransition, prepareStatusUpdateData } = require('../services/choreStatusService');
const { publishEvent } = require('../services/kafkaService');

// Mock dependencies
jest.mock('../models/Chore');
jest.mock('../services/choreStatusService');
jest.mock('../services/kafkaService');

describe('Update Chore Status Controller', () => {
    // Setup mock request and response
    let req, res;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Setup mock request object
        req = {
            params: { id: 'test-chore-id' },
            body: { status: 'completed' }
        };

        // Setup mock response object
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    test('should update chore status and set completed_at when valid status transition', async () => {
        // Mock chore data
        const mockChore = {
            id: 'test-chore-id',
            title: 'Test Chore',
            status: 'in_progress',
            completed_at: null
        };

        const mockUpdatedChore = {
            ...mockChore,
            status: 'completed',
            completed_at: '2023-12-01T10:00:00.000Z',
            updated_at: '2023-12-01T10:00:00.000Z'
        };

        // Setup mocks
        Chore.findById.mockResolvedValue(mockChore);
        validateStatusTransition.mockReturnValue({ valid: true, message: 'Status transition is valid' });
        prepareStatusUpdateData.mockReturnValue({
            status: 'completed',
            completed_at: '2023-12-01T10:00:00.000Z'
        });
        Chore.update.mockResolvedValue(mockUpdatedChore);
        publishEvent.mockResolvedValue(true);

        // Call controller
        await updateChoreStatus(req, res);

        // Verify findById was called with correct ID
        expect(Chore.findById).toHaveBeenCalledWith(req.params.id);

        // Verify status transition was validated
        expect(validateStatusTransition).toHaveBeenCalledWith(mockChore.status, req.body.status);

        // Verify update data was prepared
        expect(prepareStatusUpdateData).toHaveBeenCalledWith(mockChore, req.body.status);

        // Verify chore was updated
        expect(Chore.update).toHaveBeenCalledWith(req.params.id, {
            status: 'completed',
            completed_at: '2023-12-01T10:00:00.000Z'
        });

        // Verify Kafka event was published
        expect(publishEvent).toHaveBeenCalledWith(
            'chores.status.updated',
            expect.objectContaining({
                id: mockUpdatedChore.id,
                type: 'status_updated',
                chore: mockUpdatedChore,
                previousStatus: mockChore.status,
                newStatus: mockUpdatedChore.status
            })
        );

        // Verify response
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUpdatedChore);
    });

    test('should return 404 when chore not found', async () => {
        // Setup mock to return null (chore not found)
        Chore.findById.mockResolvedValue(null);

        // Call controller
        await updateChoreStatus(req, res);

        // Verify response
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Chore not found' });

        // Verify other functions were not called
        expect(validateStatusTransition).not.toHaveBeenCalled();
        expect(prepareStatusUpdateData).not.toHaveBeenCalled();
        expect(Chore.update).not.toHaveBeenCalled();
        expect(publishEvent).not.toHaveBeenCalled();
    });

    test('should return 400 when status transition is invalid', async () => {
        // Mock chore data
        const mockChore = {
            id: 'test-chore-id',
            status: 'pending'
        };

        // Setup mocks
        Chore.findById.mockResolvedValue(mockChore);
        validateStatusTransition.mockReturnValue({
            valid: false,
            message: 'Invalid status transition'
        });

        // Call controller
        await updateChoreStatus(req, res);

        // Verify response
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid status transition' });

        // Verify update and Kafka functions were not called
        expect(prepareStatusUpdateData).not.toHaveBeenCalled();
        expect(Chore.update).not.toHaveBeenCalled();
        expect(publishEvent).not.toHaveBeenCalled();
    });

    test('should handle database errors gracefully', async () => {
        // Mock chore data
        const mockChore = {
            id: 'test-chore-id',
            status: 'in_progress'
        };

        // Setup mocks
        Chore.findById.mockResolvedValue(mockChore);
        validateStatusTransition.mockReturnValue({ valid: true, message: 'Status transition is valid' });
        prepareStatusUpdateData.mockReturnValue({ status: 'completed' });
        Chore.update.mockRejectedValue(new Error('Database error'));

        // Call controller
        await updateChoreStatus(req, res);

        // Verify response
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
}); 