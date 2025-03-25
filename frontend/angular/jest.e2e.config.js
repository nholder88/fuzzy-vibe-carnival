module.exports = {
    preset: 'jest-puppeteer',
    testMatch: ['**/e2e/**/*.spec.ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest.e2e.setup.js'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.spec.json',
        },
    },
};
