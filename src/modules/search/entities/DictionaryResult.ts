/**
 * Original Author: Jack Watson
 * Created Date: 10/7/2021
 * Purpose: The purpose of this class is to encapuslate the idea of a search against a general dicitonary somewhere. The
 * dictionary is simply defined as a name, and a identifier. Anything can be stored in this dictionary, a job, a job group,
 * or a major. Does not matter. You might be able to call this a domain entity although I don't think our business domain
 * deals with dictionaries in the literal sense... it reduces code so who cares.
 */

export default class DictionaryResult
{
    private id: string;
    private name: string;

    constructor(id: string, name: string)
    {
        this.id = id;
        this.name = name;
    }


    public getId(): string
    {
        return this.id;
    }

    public getName(): string
    {
        return this.name;
    }

}
