/**
 * Original Author: Jack Watson
 * Created Date: 11/28/2021
 * Purpose: This class handles the idea of a generic signup for a non specific entity. Right now some examples of a couple
 * signups we have are a affiliate, employer, and employee. The base requirement for a signupable entity would include
 * the ability to be verified. Everything else such as payment, and contracting are supplemental
 */
import { Verifiable } from "./signups/Verifiable";
import { Contractable } from "./signups/Contractable";
import { DocumentUpload } from "./DocumentUpload";
import { LocalDocument } from "./LocalDocument";
import { Purpose } from "./Purpose";
import { Token } from "./Token";

import { INotification } from "notify/INotification";
import { ITemplate } from "template/ITemplate";

export class Signup
{
    private entity: Verifiable;
    private token: Token;

    private uploadedDocuments: Array<DocumentUpload>;
    private localDocuments: Array<LocalDocument>;
    private renderedContract: string|null;

    constructor(entity: Verifiable, token: Token)
    {
        this.entity = entity;
        this.token  = token;
        this.uploadedDocuments = [];
        this.localDocuments    = [];
    }

    /**
     * Add a new document that was uploaded into the system to the signup. This could be something such as a resume.
     * @param document Add a new document to the signup.
     */
    public uploadDocument(document: DocumentUpload): void
    {
        this.uploadedDocuments.push(document);
    }

    /**
     * Add a new document that would be local to this domain system. We use this method for rehydrating this object. Albeit it
     * does not follow the ddd rules exactly since we are technically loading in a different state. I think its fine.
     * @param document The local document we are adding to this signup
     */
    public addDocument(document: LocalDocument): void
    {
        this.localDocuments.push(document);
    }

    /**
     * Add a new contract to our singup. We do this dynamically since not ALL signups will have a contract.
     * @param contract Contract template we want to use.
     * @param template The templating service that we are using to actually handle the rendering.
     */
    public async addContract(entity: Contractable, template: ITemplate): Promise<void>
    {
        this.renderedContract = await entity.render(template);
    }

    /**
     * Give the client the ability to view the contract if they are permissed to view it.
     */
    public getContractPath(): string|null
    {
        if(!this.token.active())
        {
            return null;
        }

        for(const document of this.localDocuments)
        {
            if(document.getPurpose() === Purpose.CONTRACT)
            {
                return document.getPath();
            }
        }

        return null;
    }

    /**
     * Send a verification message to the user.
     * @param notification The notification service that we are using.
     * @param template The templating service that we are using.
     */
    public async sendVerification(notification: INotification, template: ITemplate): Promise<boolean>
    {
        // We can use this if statement for resending the verification.
        if(this.token.active())
        {
            return await this.entity.verify(this.token, notification, template)
        }

        return false;
    }

    // === GETTERS ===
    public getEntity(): Verifiable
    {
        return this.entity;
    }

    public getUploadedDocuments(): Array<DocumentUpload>
    {
        return this.uploadedDocuments;
    }

    public getRenderedContract(): string|null
    {
        return this.renderedContract;
    }

    public getToken(): Token
    {
        return this.token;
    }
}
