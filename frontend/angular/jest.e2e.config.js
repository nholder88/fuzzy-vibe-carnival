module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['**/e2e/**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.spec.json'
    }]
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.e2e.setup.js'],
  verbose: true,
  testTimeout: 60000,
  maxWorkers: 1 // Run tests sequentially for e2e
};
