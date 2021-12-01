/**
 * Original Author: Jack Watson
 * Created Date: 11/29/2021
 * Purpose: This mapper handles mappping from our persistance layer to our domain model.
 */

import { collections, now, ObjectId, toObjectId, toObjectIds } from "db/MongoDb";
import { Schema }       from "db/DatabaseSchema";
import { Constants } from "db/Constants";

import { Form }      from "../entities/forms/Form";
import { Affiliate } from "../entities/forms/Affiliate";
import { Employee }  from "../entities/forms/Employee";
import { Employer }  from "../entities/forms/Employer";
import { Verification } from "../entities/Verification";
import { Proof }        from "../entities/Proof";
import { NewAffiliate } from "../validators/NewAffiliateValidator";
import { NewEmployee } from "../validators/NewEmployeeValidator";
import { NewEmployer } from "../validators/NewEmployerValidator";

/**
 * Find the correct verification process by using the secret that we pass in.
 * @param secret that we use to find the correct verification. If this is not found we return null
 */
export async function find(secret: string): Promise<Verification|null>
{
    const tokenRow: Schema.Token|null = await collections.tokens.findOne({ secret: secret });
    const signupRow: Schema.Signup|null = await collections.signups.findOne({ _id: tokenRow?.signup_id });

    if(tokenRow === null || signupRow === null)
    {
        return null;
    }

    const formData: Form = findTypeMapper(signupRow);
    const documentIds: Array<string> = await collections.documents.find({ 
        resource: Constants.Resource.SIGNUP,
        resource_id: signupRow._id
    }).map<string>( (documents) => documents._id?.toString() ?? "" ).toArray();
    
    const proof: Proof = new Proof(tokenRow.secret, tokenRow.expired_at, tokenRow.verified, tokenRow?.code);


    return new Verification(formData, documentIds, proof);
}

/**
 * Find the specific form that we want to use as we map our signup from single inheritance to an OO version of it.
 * @param signupRow Signup row we are currently looking at.
 */
function findTypeMapper(signupRow: Schema.Signup): Form
{
    if(signupRow.type === Constants.Resource.AFFILIATE)
    {
        return new Affiliate(signupRow.data as NewAffiliate);
    }
    else if(signupRow.type === Constants.Resource.EMPLOYEE)
    {
        return new Employee(signupRow.data as NewEmployee);
    }
    else if(signupRow.type === Constants.Resource.EMPLOYER)
    {
        return new Employer(signupRow.data as NewEmployer);
    }

    throw new Error("Could not find mapper for requested type.");
}


/**
 * Map the update verification into our system. If we have a brand new verified resource then load it into it's corresponding table
 * by once again for the millionth time using a map.... we have a toal of FOUR maps that we now have to maintain... sick. Could we 
 * get that down to one please?
 * @param secret Identifier for the object mapped to persistance
 * @param signup Existing Signup
 */
export async function update(secret: string, verification: Verification): Promise<boolean>
{
    const tokenRow: Schema.Token|null = await collections.tokens.findOne({ secret: secret });
    if(tokenRow === null)
    {
        return false;
    }

    // Map the entity that was just verified.
    await updateTypeMapper(verification, tokenRow.signup_id);

    // Mark the token as already consumed.
    return (await collections.tokens.updateOne({ _id: tokenRow?._id }, {
        $set: {
            verified     : verification.getProof().getVerified(),
            verified_at  : verification.getProof().getVerifiedAt(),
        },
    })).acknowledged;
}

/**
 * Insert into the correct tables once fully authenticated.
 * @param verification Verification domain model
 * @param signupId The identifier for signing up the user.
 */
async function updateTypeMapper(verification: Verification, signupId: ObjectId): Promise<ObjectId>
{
    const formData: Form = verification.getFormData();

    console.log(typeof formData);
    console.log(formData);
    
    

    // Affiliate
    if(formData instanceof Affiliate)
    {
        const data: NewAffiliate = formData.getData();

        const id: ObjectId = (await collections.affiliates.insertOne({ 
            ...data,
            charity_id   : toObjectId(data.charity_id),
            affiliate_id : data.affiliate_id ? toObjectId(data.affiliate_id): undefined,
            signup_id    : signupId,
            created_at   : now()
        })).insertedId;

        mapDocuments(id, Constants.Resource.AFFILIATE, verification);
        return id;
    }
    else if(formData instanceof Employee)
    {
        const data: NewEmployee = formData.getData();

        const id: ObjectId = (await collections.employees.insertOne({ 
            ...data,
            authorized   : data.authorized.map((authorized: string) => toObjectId(authorized)),
            job_id       : data.job_id.map((job_id: string) => toObjectId(job_id)),
            nations      : data.nations      ? data.nations.map((nation: string) => toObjectId(nation)) : undefined,
            major        : data.major        ? data.major.map((major: string) => toObjectId(major)) : undefined,
            affiliate_id : data.affiliate_id ? toObjectId(data.affiliate_id) : undefined, 
            signup_id    : signupId,
            created_at   : now()
        })).insertedId;

        mapDocuments(id, Constants.Resource.EMPLOYEE, verification);
        return id;
    }
    else if(formData instanceof Employer)
    {
        const data: NewEmployer = formData.getData();

        const id: ObjectId = (await collections.employers.insertOne({ 
            ...data,
            industry     : toObjectIds(data.industry),
            affiliate_id : data.affiliate_id ? toObjectId(data.affiliate_id) : undefined,
            signup_id    : signupId,
            created_at   : now()
        })).insertedId;

        mapDocuments(id, Constants.Resource.EMPLOYER, verification);
        return id;
    }

    throw new Error("Could not find mapper for requested type.");
}

/**
 * The documents right now are pointing to the signup since the user was not yet vlaidated. Now that we are validated
 * we will want to change the state of the documents so they point towrads the validated user. 
 * @param verification The verificaiton domain model
 * @param type The current type of resource we just uploaded.
 * @param id The identifier for the resource we just uploaded.
 */
async function mapDocuments(id: ObjectId, type: Constants.Resource, verification: Verification): Promise<void>
{
    // Map the documents.
    for(const documentId of verification.getDocumentIds())
    {
        await collections.documents.updateOne({ _id: toObjectId(documentId) }, {
            $set: {
                resource     : type,
                resource_id  : id
            },
        });
    }
}