const cron = require('node-cron');
const RecurrenceService = require('./services/recurrenceService');

/**
 * Initialize cron jobs for the chore service
 */
function initCronJobs() {
    // Schedule to run daily at midnight
    cron.schedule('0 0 * * *', async () => {
        console.log('Running recurring chores scheduler...');
        try {
            await RecurrenceService.processRecurringChores();
        } catch (error) {
            console.error('Error in recurring chores scheduler:', error);
        }
    });

    console.log('Cron jobs for recurring chores initialized');
}

module.exports = { initCronJobs }; 