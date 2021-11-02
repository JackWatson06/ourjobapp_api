module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
        '^modules/(.*)$':  '<rootDir>/src/modules/$1', 
    }
};