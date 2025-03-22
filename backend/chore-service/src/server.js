const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const dotenv = require('dotenv');
const { initCronJobs } = require('./cron');
const { initializeDatabase } = require('./config/init-db');
const { connectProducer, disconnectProducer } = require('./services/kafkaService');

// Load environment variables
dotenv.config();

// Import routes
const choreRoutes = require('./routes/chores');

// Create Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use('/api/chores', choreRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'An unexpected error occurred',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 3001;

// Initialize database and then start the server
const startServer = async () => {
    try {
        // Initialize the database
        await initializeDatabase();

        // Initialize cron jobs for recurring chores
        if (process.env.DISABLE_CRON !== 'true') {
            initCronJobs();
        }

        // Start the server
        app.listen(PORT, async () => {
            console.log(`Chore service running on port ${PORT}`);

            // Connect to Kafka
            await connectProducer();
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');

    // Disconnect from Kafka
    await disconnectProducer();

    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Shutting down server...');

    // Disconnect from Kafka
    await disconnectProducer();

    process.exit(0);
});

// Start the server
startServer();

module.exports = app; 