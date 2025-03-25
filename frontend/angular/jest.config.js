module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/dist/',
        '<rootDir>/e2e/',
    ],
    moduleNameMapper: {
        '^@app/(.*)$': '<rootDir>/src/app/$1',
        '^@environments/(.*)$': '<rootDir>/src/environments/$1',
    },
    coverageDirectory: 'coverage',
    coverageReporters: ['html', 'lcov', 'text'],
    collectCoverageFrom: [
        'src/app/**/*.ts',
        '!src/app/**/*.module.ts',
        '!src/app/**/*.spec.ts',
        '!src/app/testing/**/*.ts',
    ],
};
