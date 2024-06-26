/**
 * We need to load up the employee as an in memory object to reduce database dependencies which we D0 NOT need right
 * now seeing as how we are growing to become bigger. This is a good thing.
 */

import Job from "./Job";
import CountryCode from "./CountryCode";
import Location from "./Location";

export default class Employee
{
    constructor(
        public id     : string,
        public name   : string,
        public phone  : string,
        public email  : string,

        // Enums
        public education: number,
        public experience: number,
        public hourlyRate: number,
        public where: number,
        public distance: number,

        public jobs       : Array<Job>,
        public authorized : Array<CountryCode>,
        public info       ?: string,
        public national   ?: Array<CountryCode>,
        public location   ?: Location,
    ){}
}
