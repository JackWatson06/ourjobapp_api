
import ContractAccess from "modules/signup/entities/ContractAccess";

test("we can not access the contract if we are a verified user", () => {

    // === Setup ===
    const contractAccess: ContractAccess = new ContractAccess("file.pdf", true, Date.now() + 86_400_000 );

    // === Execute/Assert ===
    expect(contractAccess.canView()).toBe(false);
});

test("we can not access the contract if the token is expired", () => {

    // === Setup ===
    const contractAccess: ContractAccess = new ContractAccess("file.pdf", false, Date.now() );

    // === Execute/Assert ===
    expect(contractAccess.canView()).toBe(false);
});

test("we can access the contract", () => {
    // === Setup ===
    const contractAccess: ContractAccess = new ContractAccess("file.pdf", false, Date.now() + 86_400_000 );

    // === Execute/Assert ===
    expect(contractAccess.canView()).toBe(true);
});
