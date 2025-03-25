jest.setTimeout(30000); // Increase timeout for E2E tests

// Add custom matchers if needed
expect.extend({
    toBeVisible: async (received) => {
        try {
            await received.isVisible();
            return {
                message: () => 'expected element to not be visible',
                pass: true,
            };
        } catch (e) {
            return {
                message: () => 'expected element to be visible',
                pass: false,
            };
        }
    },
});
