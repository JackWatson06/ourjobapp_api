module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
        '^modules/(.*)$'   : '<rootDir>/src/modules/$1',
        '^infa/(.*)$'      : '<rootDir>/src/core/infa/$1',
        '^notify/(.*)$'      : '<rootDir>/src/core/notify/$1',
        '^bootstrap/(.*)$' : '<rootDir>/src/bootstrap/$1',
    },
    testPathIgnorePatterns: ["tests/data"]
};