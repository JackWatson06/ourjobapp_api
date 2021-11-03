import * as MongoDb from "infa/MongoDb";
import * as Collections from "Collections";

export async function forEach(callback: (a: Collections.Employee) => void): Promise<void>
{
    const db: MongoDb.MDb = MongoDb.db();
    const employeeCursor = db.collection("employees").find<Collections.Employee>({});

    while(await employeeCursor.hasNext()) {
        const employeeRow: Collections.Employee|null = await employeeCursor.next();
        if(employeeRow != null)
        {
            await callback(employeeRow)    
        }
    }
}
