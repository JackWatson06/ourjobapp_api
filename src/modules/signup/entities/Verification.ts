/**
 * Original Author: Jack Watson
 * Created Date: 11/29/2021
 * Purpose: This domain entity handles the verification of a entity when they try to verify themselves by passing in the correct
 * code.
 */
import { Proof } from "./Proof";
import { Form } from "./forms/Form";


export class Verification
{
    private form: Form;
    private documentIds: Array<string>;
    private proof: Proof;

    constructor(form: Form, documentIds: Array<string>, proof: Proof )
    {
        this.form = form;
        this.documentIds = documentIds;
        this.proof = proof;
    }

    /**
    * Authorzie the account by proven we passed in the correct secret and the correct code.
    * @param secret The secret to be validated properly.
    * @param code Optional code that we may need to pass in.
    */
    public authorized(secret?: string, code ?: number): boolean
    {
        return this.proof.prove(secret, code);
    }


    // === Getters === 
    public getFormData(): Form
    {
        return this.form;
    }

    public getDocumentIds(): Array<string>
    {
        return this.documentIds;
    }

    public getProof(): Proof
    {
        return this.proof;
    }

}
