/**
 * This file holds constants which we use in the database. Hence it's location in the database infastructure folder.
 */

export namespace Constants {
    export enum Commitment {
        FULL_TIME = 1,
        PART_TIME,
        BOTH
    }

    export enum Where {
        IN_PERSON = 1,
        REMOTE,
        BOTH 
    }

    export enum Distance {
        WORLDWIDE               = 1,
        NATIONWIDE              = 2,
        TWENTY_FIVE_MILES       = 25,
        FIFTY_MILES             = 50,
        ONE_HUNDRED_MILES       = 100,
        TWO_HUNDRED_FIFTY_MILES = 250
    }

    export enum Education {
        BELOW_HIGHSCHOOL = 1,
        HIGHSCHOOL,
        ASSOCIATES,
        BACHELORS,
        MASTERS,
        DOCTORATE
    }

    export enum Experience {
        ENTRY = 1,
        INTERMEDIATE,
        EXPERIENCED,
        INTERN       
    }

    export enum Resource {
        AFFILIATE,
        EMPLOYER,
        EMPLOYEE,
        SIGNUP
    }

    export enum Document {
        CONTRACT,
        RESUME
    }

    /**
     * Not the best function in terms of type safety although does the job nicely. Numeric Enumerations are a bitch in typescript
     * https://github.com/microsoft/TypeScript/issues/33200
     * @param enu Enumeration we are pulling the numbers out of
     */
    export function values(enu: {[s: string]: any}): Array<number>
    {
        const keys: Array<string> = Object.keys(enu).filter(k => typeof enu[k as any] === "number");
        return keys.map(k => enu[k as any]);
    }
}
