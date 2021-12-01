
import { Proof } from "modules/signup/entities/Proof";

test("secret can be verified.", () => {
    const proof: Proof = new Proof(Date.now() + 8_400_000, false, "123");
    expect(proof.prove("123")).toEqual(true);
});

test("code can be verified.", () => {
    const proof: Proof = new Proof(Date.now() + 8_400_000, false, undefined, 123);
    expect(proof.prove(undefined, 123)).toEqual(true);
});

test("can not be verified if we have no verification checks.", () => {
    const proof: Proof = new Proof(Date.now() + 8_400_000, false, undefined, undefined);
    expect(proof.prove(undefined, 123)).toEqual(false);
});

test("we can not be verified if we require code, and don't pass in the correct code.", () => {
    const proof: Proof = new Proof(Date.now() + 8_400_000, false, undefined, 12345);
    expect(proof.prove(undefined, 23345)).toEqual(false);
});

test("we can not be verified if we require secret, and don't pass in the correct secret.", () => {
    const proof: Proof = new Proof(Date.now() + 8_400_000, false, "12345", undefined);
    expect(proof.prove("123")).toEqual(false);
});

test("we can not be verified if token already consumed.", () => {

    const proof: Proof = new Proof(Date.now() + 8_400_000, true, "123", 123);
    expect(proof.prove("123")).toEqual(false);

});

test("we can not be verified if the token has been expired.", () => {

    const proof: Proof = new Proof(Date.now(), false, "123", 123);
    expect(proof.prove("123")).toEqual(false);

});
