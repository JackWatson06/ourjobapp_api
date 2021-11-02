import BatchMatch from "modules/connection/entities/BatchMatch";

test("can add multiple employee score", () => {
    const batch: BatchMatch = new BatchMatch("RANDOM", "RANDOM");

    batch.integrateEmployeeId("1", 10);
    batch.integrateEmployeeId("2", 5);
    batch.integrateEmployeeId("3", 2);

    expect(batch.getEmployees()).toEqual(["1", "2", "3"]);
    expect(batch.getScores()).toEqual([10, 5, 2]);
});

test("can insert if better score", () => {
    const batch: BatchMatch = new BatchMatch("RANDOM", "RANDOM");

    batch.integrateEmployeeId("1", 10);
    batch.integrateEmployeeId("2", 5);
    batch.integrateEmployeeId("3", 8);

    expect(batch.getEmployees()).toEqual(["1", "3", "2"]);
    expect(batch.getScores()).toEqual([10, 8, 5]);
});


test("does not excede max limit", () => {
    const batch: BatchMatch = new BatchMatch("RANDOM", "RANDOM");
    const limit: number = 100;

    for(let i = 0; i < limit; i++)
    {
        batch.integrateEmployeeId(i.toString(), i);
    }

    expect(batch.getEmployees().length).toEqual(limit);
    expect(batch.getScores().length).toEqual(limit);
});


test("inserting highest score", () => {
    const batch: BatchMatch = new BatchMatch("RANDOM", "RANDOM");

    batch.integrateEmployeeId("1", 10);
    batch.integrateEmployeeId("2", 5);
    batch.integrateEmployeeId("3", 15);

    expect(batch.getEmployees()).toEqual(["3", "1", "2"]);
    expect(batch.getScores()).toEqual([15, 10, 5]);
});
