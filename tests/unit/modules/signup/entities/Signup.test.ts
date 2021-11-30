/**
 * Original Author: Jack Watson
 * Created Date: 11/28/2021
 * Purpose: This test file tests our implementation of the signup entity in our signup system.
 */

import { Signup } from "modules/signup/entities/Signup";

import { Token }          from "modules/signup/entities/Token";
import { LocalDocument }  from "modules/signup/entities/LocalDocument";
import { Purpose }        from "modules/signup/entities/Purpose";
import { Verifiable }     from "modules/signup/entities/signups/Verifiable";
import { Contractable }   from "modules/signup/entities/signups/Contractable";
import { INotification }  from "notify/INotification";
import { ITemplate }      from "template/ITemplate";

// Set up mocks

// External adaptor interface mocks
const templateMock: jest.Mock<ITemplate> =  jest.fn<ITemplate, []>(() => ({
    render: jest.fn()
}));
const notificationMock: jest.Mock<INotification> =  jest.fn<INotification, []>(() => ({
    email: jest.fn(async () => true),
    text: jest.fn(async () => true)
}));

// Mock the verifiable interface. Since the file is an interface we need to supply our own implementation of the 
// method here.
const verifiableMock: jest.Mock<Verifiable> =  jest.fn<Verifiable, []>(() => ({
    verify: jest.fn(async () => true)
}));
const contractableMock: jest.Mock<Contractable> = jest.fn<Contractable, []>(() => ({
    render: jest.fn(async () => "MOCKED" )
}));

// Mock the concret implementation of domain entities
jest.mock("modules/signup/entities/Token");
const tokenMock: jest.Mock<Token> = Token as jest.Mock<Token>;


test("we can render a new contract on a signup.", async () => {
    const signup: Signup = new Signup(
        new verifiableMock, 
        new tokenMock
    );
    
    await signup.addContract(new contractableMock, new templateMock);
    
    expect(signup.getRenderedContract()).toEqual("MOCKED");
});


// Verification
test("we can send out a verification for a signup.", async () => {

    const token: Token = new tokenMock();
    jest.spyOn(token, "valid").mockImplementation(() => true);

    const signup: Signup = new Signup(
        new verifiableMock,
        token
    );

    expect(await signup.sendVerification(new notificationMock, new templateMock)).toEqual(true);
});

test("we cannot send a verification for a signup if token is not valid.", async () => {

    const token: Token = new tokenMock();
    jest.spyOn(token, "valid").mockImplementation(() => false);

    const signup: Signup = new Signup(
        new verifiableMock,
        token
    );

    expect(await signup.sendVerification(new notificationMock, new templateMock)).toEqual(false);

});

// Contracts
test("we can read contract if token is valid.", () => {
    const token: Token = new tokenMock();
    jest.spyOn(token, "valid").mockImplementation(() => true);

    const signup: Signup = new Signup(
        new verifiableMock,
        token
    );

    signup.addDocument(new LocalDocument(Purpose.CONTRACT, "FAKE"));

    expect(signup.getContractPath()).toEqual("FAKE");
});

test("we can not read contract if it does not exist on signup.", () => {
    const signup: Signup = new Signup(
        new verifiableMock,
        new tokenMock
    );

    expect(signup.getContractPath()).toEqual(null);
});

test("we can not read contract if token is invalid.", () => {

    const token: Token = new tokenMock();
    jest.spyOn(token, "valid").mockImplementation(() => false);

    const signup: Signup = new Signup(
        new verifiableMock,
        token
    );

    signup.addDocument(new LocalDocument(Purpose.CONTRACT, "FAKE"));

    expect(signup.getContractPath()).toEqual(null);
});

