import dependencies from "../../src/bootstrap/dependencies";

jest.setTimeout(15000);

beforeAll(async () => {
    await dependencies();
})