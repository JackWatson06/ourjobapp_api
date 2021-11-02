import * as MongoDb from "infa/MongoDb";
import * as Collections from "Collections";

export async function forEach(callback: (a: Collections.Employer) => void): Promise<void>
{
    const db: MongoDb.MDb = MongoDb.db();
    const employerCursor = db.collection("employers").find<Collections.Employer>({});

    while(await employerCursor.hasNext()) {
        const employerRow: Collections.Employer|null = await employerCursor.next();
        if(employerRow != null)
        {
            await callback(employerRow)    
        }
    }
}

