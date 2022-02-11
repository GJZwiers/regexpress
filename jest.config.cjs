module.exports = {
    roots: [
        '<rootDir>'
    ],
    transform: {
        "^.+\\.ts$": "ts-jest"
    },
    testMatch: ['<rootDir>/tests/**/*.ts'],
    moduleFileExtensions: ['ts', 'js']
};