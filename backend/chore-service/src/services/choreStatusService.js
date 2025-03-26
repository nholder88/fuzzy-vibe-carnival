// Valid chore statuses
const VALID_STATUSES = ['pending', 'in_progress', 'completed'];

// Define valid status transitions
const VALID_TRANSITIONS = {
    pending: ['in_progress', 'completed'],
    in_progress: ['pending', 'completed'],
    completed: ['pending', 'in_progress']
};

/**
 * Validates if a status transition is allowed
 * @param {string} currentStatus - The current status of the chore
 * @param {string} newStatus - The requested new status
 * @returns {Object} - { valid: boolean, message: string }
 */
function validateStatusTransition(currentStatus, newStatus) {
    // If status isn't changing, it's valid
    if (currentStatus === newStatus) {
        return { valid: true, message: 'Status unchanged' };
    }

    // Check if new status is a valid status
    if (!VALID_STATUSES.includes(newStatus)) {
        return {
            valid: false,
            message: `Invalid status: ${newStatus}. Status must be one of: ${VALID_STATUSES.join(', ')}`
        };
    }

    // Check if the transition is allowed
    if (!VALID_TRANSITIONS[currentStatus]?.includes(newStatus)) {
        return {
            valid: false,
            message: `Invalid status transition from '${currentStatus}' to '${newStatus}'`
        };
    }

    return { valid: true, message: 'Status transition is valid' };
}

/**
 * Prepares the update data for a status change
 * @param {Object} chore - The current chore object
 * @param {string} newStatus - The new status
 * @returns {Object} - The update data with appropriate fields
 */
function prepareStatusUpdateData(chore, newStatus) {
    const updateData = { status: newStatus };

    // Set completed_at timestamp when transitioning to completed
    if (newStatus === 'completed' && chore.status !== 'completed') {
        updateData.completed_at = new Date().toISOString();
    }
    // Clear completed_at when moving from completed to another status
    else if (chore.status === 'completed' && newStatus !== 'completed') {
        updateData.completed_at = null;
    }

    return updateData;
}

module.exports = {
    VALID_STATUSES,
    VALID_TRANSITIONS,
    validateStatusTransition,
    prepareStatusUpdateData
}; 