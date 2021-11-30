
import { Proof } from "modules/signup/entities/Proof";

test("regular secret can be verified.", () => {

    const proof: Proof = new Proof("123", undefined, Date.now() + 8_400_000, false);
    expect(proof.prove("123")).toEqual(true);

});

test("secret with code can be verified.", () => {

    const proof: Proof = new Proof("123", 123, Date.now() + 8_400_000, false);
    expect(proof.prove("123", 123)).toEqual(true);

});

test("secret can not be verified unless we also pass code.", () => {

    const proof: Proof = new Proof("123", 123, Date.now() + 8_400_000, false);
    expect(proof.prove("123")).toEqual(false);

});

test("we can not be verified if token already consumed.", () => {

    const proof: Proof = new Proof("123", 123, Date.now() + 8_400_000, true);
    expect(proof.prove("123")).toEqual(false);

});

test("we can not be verified if the token has been expired.", () => {

    const proof: Proof = new Proof("123", 123, Date.now(), false);
    expect(proof.prove("123")).toEqual(false);

});
