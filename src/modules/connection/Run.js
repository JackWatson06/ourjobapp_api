import * as Match from "./Matching";

export default async function exec()
{
    const matches = Match.singleMatch();
    
    console.log(matches);
}
