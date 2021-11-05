const common = require("./jest.config.js");

module.exports = {
    ...common,
    testPathIgnorePatterns: [ ...common.testPathIgnorePatterns, "tests/unit"]
};