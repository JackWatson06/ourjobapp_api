/**
 * Original Author: Jack Watson
 * Created Date: 11/28/2021
 * Purpose: This file will map an active signup into the database.
 */
import { collections, now, ObjectId, toObjectId } from "db/MongoDb";
import { Constants } from "db/Constants";
import { Schema }    from "db/DatabaseSchema";

import { Signup }     from "../entities/Signup";
import { Verifiable } from "../entities/signups/Verifiable";
import { Affiliate }  from "../entities/signups/Affiliate";
import { Employee }   from "../entities/signups/Employee";
import { Employer }   from "../entities/signups/Employer";
import { Token }      from "../entities/Token";

import { create as createContract } from "./signup/ContractMapper";
import { create as createDocument } from "./signup/DocumentMapper";
import { find as findDocument } from "./signup/DocumentMapper";

import { AffiliateMapper } from "./signup/AffiliateMapper";
import { EmployeeMapper } from "./signup/EmployeeMapper";
import { EmployerMapper } from "./signup/EmployerMapper";


/**
 * Find the correct signup entity. Map the persistance layer to the domain layer.
 * @param id Identifier for the object mapped in the persistance layer.
 */
export async function find(id: string): Promise<Signup|null>
{
    const signupRow: Schema.Signup|null = await collections.signups.findOne({ _id: toObjectId(id) });
    const tokenRow: Schema.Token|null = await collections.tokens.findOne({ signup_id: toObjectId(id) });

    if(signupRow === null || tokenRow === null)
    {
        return null;
    }

    const token: Token = new Token(tokenRow.secret, tokenRow.code, tokenRow.expired_at, tokenRow.verified);
    const signup: Signup = new Signup(findTypeMapper(signupRow), token);

    (await findDocument(signupRow._id ?? new ObjectId())).map((document) => signup.addDocument(document));
    
    return signup;
}

/**
 * Map the signup type into the correct signup domain entity.
 * @param signupRow The current signup row we are mapping to the singup domain entity.
 * @param token The current token that the signup domain entity depends on.
 */
function findTypeMapper(signupRow: Schema.Signup): Verifiable {
    if(signupRow.type === Constants.Resource.AFFILIATE)
    {   
        return AffiliateMapper.find(signupRow);
    }
    else if(signupRow.type === Constants.Resource.EMPLOYEE)
    {
        return EmployeeMapper.find(signupRow);
    }
    else if(signupRow.type === Constants.Resource.EMPLOYER)
    {
        return EmployerMapper.find(signupRow);
    }

    throw new Error(`Type error. Please create a mapper for the signup type: ${signupRow.type}`);
}

/**
 * Create a new signup in the persistance layer that we will then be able to save the state of. note the if statement here
 * is actually quite necessary. At least the way we modeled the application makes it necessary.
 * @param signup New signup
 */
export async function create(signup: Signup): Promise<string>
{
    // === Signup Mapping ===
    const signupId: ObjectId = await createTypeMapper(signup);

    await collections.tokens.insertOne({
        signup_id   : signupId,
        code        : signup.getToken().getCode(),
        secret      : signup.getToken().getSecret(),
        verified    : signup.getToken().getVerified(),
        expired_at  : signup.getToken().getExpiredAt(),
        verified_at : 0,
        created_at  : now()
    });
 
    // === Contract/Document Mapping ====
    const contractString: string|null = signup.getRenderedContract();
    if(contractString != null)
    {
        await createContract(contractString, signupId);
    }

    for(const document of signup.getUploadedDocuments())
    {
        await createDocument(document, signupId);
    }

    return signupId.toString();
}

/**
 * Call the correct mapper based on the current signup type. This is required due to the fact that we have a one to many
 * relationship here. The mappers need to know how to create the correct type that we are trying to map.
 * @param signup The current signup entity
 * @param tokenId The object id for the token
 */
async function createTypeMapper(signup: Signup): Promise<ObjectId>
{
    const entity: Verifiable = signup.getEntity();

    if(entity instanceof Affiliate)
    {   
        return AffiliateMapper.create(entity);
    }
    else if(entity instanceof Employee)
    {
        return EmployeeMapper.create(entity);
    }
    else if(entity instanceof Employer)
    {
        return EmployerMapper.create(entity);
    }

    throw new Error(`Type error. Please create a mapper for the signup type: ${signup.getEntity().constructor.name}`);
}

/**
 * Update the state of an existing signup object in our system. Right now we are only going to put in the update for the
 * token since that is really all that changes state.
 * @param id Identifier for the object mapped to persistance
 * @param signup Existing Signup
 */
export async function update(id: string, signup: Signup): Promise<boolean>
{
    // If we have added any additional uploaded documents we will want to persist these.
    for(const document of signup.getUploadedDocuments())
    {
        await createDocument(document, toObjectId(id));
    }

    // Return the updated collection.
    return (await collections.tokens.updateOne({ signup_id: toObjectId(id)}, {
        $set: {
            code        : signup.getToken().getCode(),
            secret      : signup.getToken().getSecret(),
            verified    : signup.getToken().getVerified(),
            expired_at  : signup.getToken().getExpiredAt(),
        },
    })).acknowledged;
}
