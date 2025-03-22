const Chore = require('../models/Chore');

/**
 * Service to handle recurring chores
 */
class RecurrenceService {
    /**
     * Process all completed recurring chores and create new instances
     */
    static async processRecurringChores() {
        try {
            console.log('Processing recurring chores...');

            // Find all completed recurring chores
            const completedRecurringChores = await Chore.findDueRecurringChores();

            console.log(`Found ${completedRecurringChores.length} completed recurring chores to process`);

            // Clone each completed recurring chore
            const newChores = [];
            for (const chore of completedRecurringChores) {
                try {
                    const newChore = await Chore.cloneForRecurrence(chore);
                    newChores.push(newChore);

                    // After cloning, update the original chore to have a recurring status of 'none'
                    // This prevents it from being processed again
                    await Chore.update(chore.id, { recurring: 'none' });
                } catch (err) {
                    console.error(`Error processing recurring chore ${chore.id}:`, err);
                }
            }

            console.log(`Successfully created ${newChores.length} new recurring chores`);
            return newChores;
        } catch (error) {
            console.error('Error processing recurring chores:', error);
            throw error;
        }
    }
}

module.exports = RecurrenceService; 