const common = require("./jest.config.js");

module.exports = {
    ...common,
    testPathIgnorePatterns: [ "tests/integration"],
};