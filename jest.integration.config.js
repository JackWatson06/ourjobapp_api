const common = require("./jest.config.js");

module.exports = {
    ...common,
    setupFilesAfterEnv: ["<rootDir>/tests/global/IntegrationBeforeAll.ts"],
    testPathIgnorePatterns: [ ...common.testPathIgnorePatterns, "tests/unit"]
};