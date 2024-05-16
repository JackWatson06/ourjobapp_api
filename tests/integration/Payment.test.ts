/**
 * We did have payment tests here originally. See the GitHub history.
 */

import {close}      from "db/MongoDb";

afterAll(async () => {
    close();
})

test("To Implement", () => {
    expect(1).toBe(1);
});



