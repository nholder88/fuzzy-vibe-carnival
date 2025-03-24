// Increase Jest timeout for Puppeteer tests
jest.setTimeout(60000);

// Set up some global variables for tests
process.env.TEST_BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

// Console customization for test output
const originalConsoleError = console.error;
console.error = (...args) => {
    // Ignore specific errors that might occur during Puppeteer tests
    if (
        args[0]?.includes('browser has disconnected') ||
        args[0]?.includes('Protocol error') ||
        args[0]?.includes('Target closed')
    ) {
        return;
    }
    originalConsoleError(...args);
};

// Add custom matchers if needed
expect.extend({
    // Example custom matcher
    toBeValidChoreStatus(received) {
        const validStatuses = ['pending', 'in_progress', 'completed'];
        const pass = validStatuses.includes(received);
        if (pass) {
            return {
                message: () => `expected ${received} not to be a valid chore status`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${received} to be a valid chore status (${validStatuses.join(', ')})`,
                pass: false,
            };
        }
    },
}); 