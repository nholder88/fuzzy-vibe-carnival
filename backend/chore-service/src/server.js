const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { initCronJobs } = require('./cron');
const { initializeDatabase } = require('./config/init-db');
const { connectProducer, disconnectProducer } = require('./services/kafkaService');
const { logger, stream } = require('./utils/logger');

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

// Setup request logging
app.use(morgan('combined', { stream }));

// Log all routes on startup
app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        logger.info(`Route: ${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
    }
});

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
    logger.error('Unhandled error:', {
        error: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query
    });

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
        logger.info('Database initialized successfully');

        // Initialize cron jobs for recurring chores
        if (process.env.DISABLE_CRON !== 'true') {
            initCronJobs();
            logger.info('Cron jobs initialized');
        }

        // Start the server
        app.listen(PORT, async () => {
            logger.info(`Chore service running on port ${PORT}`);

            // Connect to Kafka
            await connectProducer();
            logger.info('Kafka producer connected successfully');
        });
    } catch (error) {
        logger.error('Failed to start server:', { error: error.message, stack: error.stack });
        process.exit(1);
    }
};

// Handle shutdown
process.on('SIGINT', async () => {
    logger.info('Shutting down server...');

    // Disconnect from Kafka
    await disconnectProducer();
    logger.info('Kafka producer disconnected');

    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.info('Shutting down server...');

    // Disconnect from Kafka
    await disconnectProducer();
    logger.info('Kafka producer disconnected');

    process.exit(0);
});

// Start the server
startServer();

module.exports = app; 