const { Kafka } = require('kafkajs');

// Initialize Kafka client
const kafka = new Kafka({
    clientId: 'chore-service',
    brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'],
    ssl: process.env.KAFKA_SSL === 'true',
});

// Create producer instance
const producer = kafka.producer();

// Connect to Kafka when the service starts
async function connectProducer() {
    try {
        await producer.connect();
        console.log('Successfully connected to Kafka');
    } catch (error) {
        console.error('Failed to connect to Kafka:', error);
        // Consider implementing a retry mechanism here
    }
}

// Disconnect from Kafka when the service shuts down
async function disconnectProducer() {
    try {
        await producer.disconnect();
        console.log('Successfully disconnected from Kafka');
    } catch (error) {
        console.error('Error disconnecting from Kafka:', error);
    }
}

// Publish event to Kafka
async function publishEvent(topic, event) {
    try {
        if (!producer || !producer.isConnected) {
            await connectProducer();
        }

        await producer.send({
            topic,
            messages: [
                {
                    key: event.id,
                    value: JSON.stringify(event),
                    headers: {
                        eventType: event.type || 'generic',
                        timestamp: Date.now().toString(),
                        service: 'chore-service'
                    }
                },
            ],
        });

        console.log(`Event published to Kafka topic: ${topic}`);
        return true;
    } catch (error) {
        console.error(`Error publishing event to Kafka topic ${topic}:`, error);
        return false;
    }
}

module.exports = {
    connectProducer,
    disconnectProducer,
    publishEvent,
}; 