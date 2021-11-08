import BatchMatch from "modules/matching/entities/BatchMatch";
import Match from "modules/matching/entities/Match";

import Employee    from "modules/matching/entities/Employee";
import Employer    from "modules/matching/entities/Employer";
import Job         from "modules/matching/entities/Job";
import CountryCode from "modules/matching/entities/CountryCode";
import Industry    from "modules/matching/entities/Industry";
import Location    from "modules/matching/entities/Location";

/**
 * === Global Implementations === 
 */
const newChemist = new Job("EFEFefefEFEFefefEFEFefef", "Chemist", new Industry( "Chemical Engineers" ));

const newEmployee = new Employee(
    "EFEFefefEFEFefefEFEFefef",
    "Joe Schmoe",
    "000-000-0000",
    "joe@gmail.com",
    1, 1, 50, 1, 1,
    [ newChemist ],
    [ new CountryCode("US") ]
);

const newEmployer = new Employer(
    "EFEFefefEFEFefefEFEFefef",
    "Joe Schmoe",
    "joe@gmail.com",
    50, 1, false,
    new Location(0, 0, "102 Roycroft Circle", new CountryCode("US")),
    [ 1, 1 ],
    [ new Industry("Chemical Engineers") ]
);
// ==============================


test("can add multiple employee score", () => {
    const batch: BatchMatch = new BatchMatch(newEmployer, "RANDOM");

    const match: Match      = new Match(newEmployee, newChemist, 10);
    const matchTwo: Match   = new Match(newEmployee, newChemist, 5);
    const matchThree: Match = new Match(newEmployee, newChemist, 2);
    
    batch.integrateMatch(match);
    batch.integrateMatch(matchTwo);
    batch.integrateMatch(matchThree);

    expect(batch.getMatches()).toEqual([match, matchTwo, matchThree]);
});

test("can insert if better score", () => {
    const batch: BatchMatch = new BatchMatch(newEmployer, "RANDOM");

    const match: Match      = new Match(newEmployee, newChemist, 10);
    const matchTwo: Match   = new Match(newEmployee, newChemist, 5);
    const matchThree: Match = new Match(newEmployee, newChemist, 8);

    
    batch.integrateMatch(match);
    batch.integrateMatch(matchTwo);
    batch.integrateMatch(matchThree);

    expect(batch.getMatches()).toEqual([match, matchThree, matchTwo]);
});


test("does not excede max limit", () => {
    const batch: BatchMatch = new BatchMatch(newEmployer, "RANDOM");
    const limit: number     = 100;

    for(let i = 0; i < limit + 50; i++)
    {
        batch.integrateMatch(new Match(newEmployee, newChemist, i) );
    }

    expect(batch.getMatches().length).toEqual(limit);
});


test("inserting highest score", () => {
    const batch: BatchMatch = new BatchMatch(newEmployer, "RANDOM");

    const match: Match      = new Match(newEmployee, newChemist, 10);
    const matchTwo: Match   = new Match(newEmployee, newChemist, 5);
    const matchThree: Match = new Match(newEmployee, newChemist, 15);

    
    batch.integrateMatch(match);
    batch.integrateMatch(matchTwo);
    batch.integrateMatch(matchThree);

    expect(batch.getMatches()).toEqual([matchThree, match, matchTwo]);
});
