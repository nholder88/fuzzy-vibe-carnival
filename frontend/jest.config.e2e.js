const nextJest = require('next/jest');

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
    testEnvironment: 'node',
    testMatch: ['**/tests/e2e/**/*.test.{js,jsx,ts,tsx}'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.e2e.js'],
    testTimeout: 30000, // Increase timeout for e2e tests
    moduleNameMapper: {
        // Handle module aliases
        '^@/(.*)$': '<rootDir>/$1',
    },
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig); 