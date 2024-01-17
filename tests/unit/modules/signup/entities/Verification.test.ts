/**
 * Original Author: Jack Watson
 * Created Date: 11/29/2021
 * Purpose: This file tests our implementation of the verification service. We want to make sure it matches our predicted
 * use case of the verification entity.
 */

import { Verification } from "modules/signup/entities/Verification";
import { Form } from "modules/signup/entities/forms/Form";
import { Proof } from "modules/signup/entities/Proof";

// Mock the form interface
const formMock: jest.Mock<Form> = jest.fn<Form, []>(() => ({
    getData: jest.fn()
}));

// Mock the concrete proof entity
jest.mock("modules/signup/entities/Proof");
const proofMock: jest.Mock<Proof> = Proof as jest.Mock<Proof>;

test("we can be authorzied with a secret.", () => {
    const proof: Proof = new proofMock();
    jest.spyOn(proof, "prove").mockImplementation(() => true);

    const verification: Verification = new Verification(new formMock, [], proof);

    expect(verification.authorized("123")).toBe(true);
});

test("we can be authorzied with a code.", () => {
    const proof: Proof = new proofMock();
    jest.spyOn(proof, "prove").mockImplementation(() => true);

    const verification: Verification = new Verification(new formMock, [], proof);

    expect(verification.authorized(undefined, 123)).toBe(true);
});

