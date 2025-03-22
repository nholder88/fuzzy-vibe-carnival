const { Kafka } = require('kafkajs');

// Mock KafkaJS
jest.mock('kafkajs');

// Setup the mock producer
const mockProducer = {
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    send: jest.fn().mockResolvedValue(undefined),
    isConnected: true
};

// Setup the Kafka constructor mock
Kafka.mockImplementation(() => ({
    producer: jest.fn().mockReturnValue(mockProducer)
}));

// Now import the kafkaService after mocking
const { publishEvent } = require('../services/kafkaService');

describe('Kafka Service', () => {
    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
    });

    test('should publish event to Kafka topic', async () => {
        // Mock event data
        const testEvent = {
            id: 'test-event-id',
            type: 'test_event',
            data: { foo: 'bar' },
            timestamp: '2023-12-01T10:00:00.000Z'
        };

        // Call function
        const result = await publishEvent('test.topic', testEvent);

        // Verify producer.send was called correctly
        expect(mockProducer.send).toHaveBeenCalledWith({
            topic: 'test.topic',
            messages: [
                expect.objectContaining({
                    key: testEvent.id,
                    value: JSON.stringify(testEvent),
                    headers: expect.objectContaining({
                        eventType: testEvent.type,
                        service: 'chore-service'
                    })
                })
            ]
        });

        // Verify successful result
        expect(result).toBe(true);
    });

    test('should handle event publishing errors', async () => {
        // Setup producer.send to throw an error
        mockProducer.send.mockRejectedValue(new Error('Kafka error'));

        // Mock event data
        const testEvent = {
            id: 'test-event-id',
            type: 'test_event'
        };

        // Call function
        const result = await publishEvent('test.topic', testEvent);

        // Verify producer.send was called
        expect(mockProducer.send).toHaveBeenCalled();

        // Verify error result
        expect(result).toBe(false);
    });

    test('should attempt to connect if producer is not connected', async () => {
        // Set producer as not connected
        mockProducer.isConnected = false;

        // Mock event data
        const testEvent = {
            id: 'test-event-id',
            type: 'test_event'
        };

        // Call function
        await publishEvent('test.topic', testEvent);

        // Verify connect was called
        expect(mockProducer.connect).toHaveBeenCalled();

        // Verify send was still called
        expect(mockProducer.send).toHaveBeenCalled();
    });

    test('should use generic event type if not provided', async () => {
        // Mock event data without type
        const testEvent = {
            id: 'test-event-id',
            data: { foo: 'bar' }
        };

        // Call function
        await publishEvent('test.topic', testEvent);

        // Verify producer.send was called with generic event type
        expect(mockProducer.send).toHaveBeenCalledWith(
            expect.objectContaining({
                messages: [
                    expect.objectContaining({
                        headers: expect.objectContaining({
                            eventType: 'generic'
                        })
                    })
                ]
            })
        );
    });
}); 