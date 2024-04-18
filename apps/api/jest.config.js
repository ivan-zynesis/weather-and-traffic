const baseConfig = require('../../jest.config');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    ...baseConfig,
    testMatch: [
        "**/unit.ts",
        '**/*.unit.ts',
        '**/spec.ts',
        '**/*.spec.ts',
        '**/*.i9n.ts'
    ]
};
