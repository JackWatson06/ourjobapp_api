module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
        '^modules/(.*)$'   : '<rootDir>/src/modules/$1',
        '^db/(.*)$'        : '<rootDir>/src/core/db/$1',
        '^infra/(.*)$'     : '<rootDir>/src/core/infra/$1',
        '^notify/(.*)$'    : '<rootDir>/src/core/notify/$1',
        '^payment/(.*)$'   : '<rootDir>/src/core/payment/$1',
        '^template/(.*)$'  : '<rootDir>/src/core/template/$1',
        '^bootstrap/(.*)$' : '<rootDir>/src/bootstrap/$1',
    },
    testPathIgnorePatterns: ["tests/data"]
};