import Industry from "./Industry";
import Location from "./Location";

export default class Employer
{
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public salary: number,
        public where: number,
        public authorized : boolean,
        public location: Location,
        public experience: Array<number>,
        public industry: Array<Industry>,
    ){}
}