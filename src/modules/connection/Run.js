import * as Match from "./Matching";

console.log("Testing the matching service!");

console.log();
const matches = Match.singleMatch();

console.log(JSON.stringify(matches));