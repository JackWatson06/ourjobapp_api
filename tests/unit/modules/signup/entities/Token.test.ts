/**
 * Original Author: Jack Watson
 * Created Date: 11/29/2021
 * Purpose: This file tests the token entity. The token entity is pretty simple luckily and does not have any
 * dependencies on other areas of the code.
 */

import { Token } from "modules/signup/entities/Token";

test("we generate a UUID for the secret.", () => {

    const token: Token = new Token();

    expect(token.getSecret().length).toEqual(36);
});

test("we generate a six digit code for the phone code.", () => {
    const token: Token = new Token();

    token.addCode();

    expect(token.getCode() ?? 0 / 10000).toBeLessThan(10);
});

test("token can be valid.", () => {

    const token: Token = new Token();

    expect(token.valid()).toEqual(true);

});

test("token can be invalid if expired.", () => {
    const token: Token = new Token("123", undefined, Date.now(), false);
    expect(token.valid()).toEqual(false);
});

test("token can be invalid if already consumed.", () => {
    const token: Token = new Token("123", undefined, Date.now() + 86400000, true);
    expect(token.valid()).toEqual(false);
});
