/**
 * Original Author: Jack Watson
 * Created Date: This class takes in the name, and parameters of the contract then it will return 
 */

type Contract = {
    date: string
}

export interface AffiliateContract extends Contract {
    template: "affiliate-contract";
    date: string;
}

export interface EmployerContract extends Contract {
    template: "employer-contract";
    date: string;
}

/**
 * Generate a new contract with the given binds. Then return the name of the contract generate so we can store it locally.
 * @param binds The binds that are accepted into the contract type chosen.
 */
export function generateContract(binds: Contract): string
{

    // Generate it



    return "fdjsakfjsda;df";
}


