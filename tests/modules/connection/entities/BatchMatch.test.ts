import BatchMatch from "modules/matching/entities/BatchMatch";
import Match from "modules/matching/entities/Match";

test("can add multiple employee score", () => {
    const batch: BatchMatch = new BatchMatch("RANDOM", "RANDOM");

    const match: Match = new Match("1", 10, "123");
    const matchTwo: Match = new Match("2", 5, "123");
    const matchThree: Match = new Match("3", 2, "123");
    
    batch.integrateMatch(match);
    batch.integrateMatch(matchTwo);
    batch.integrateMatch(matchThree);

    expect(batch.getMatches()).toEqual([match, matchTwo, matchThree]);
});

test("can insert if better score", () => {
    const batch: BatchMatch = new BatchMatch("RANDOM", "RANDOM");

    const match: Match = new Match("1", 10, "123");
    const matchTwo: Match = new Match("2", 5, "123");
    const matchThree: Match = new Match("3", 8, "123");
    
    batch.integrateMatch(match);
    batch.integrateMatch(matchTwo);
    batch.integrateMatch(matchThree);

    expect(batch.getMatches()).toEqual([match, matchThree, matchTwo]);
});


test("does not excede max limit", () => {
    const batch: BatchMatch = new BatchMatch("RANDOM", "RANDOM");
    const limit: number = 100;

    for(let i = 0; i < limit + 50; i++)
    {
        batch.integrateMatch(new Match(i.toString(), i, "123") );
    }

    expect(batch.getMatches().length).toEqual(limit);
});


test("inserting highest score", () => {
    const batch: BatchMatch = new BatchMatch("RANDOM", "RANDOM");

    const match: Match      = new Match("1", 10, "123");
    const matchTwo: Match   = new Match("2", 5, "123");
    const matchThree: Match = new Match("3", 15, "123");
    
    batch.integrateMatch(match);
    batch.integrateMatch(matchTwo);
    batch.integrateMatch(matchThree);

    expect(batch.getMatches()).toEqual([matchThree, match, matchTwo]);
});
