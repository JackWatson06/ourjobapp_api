/**
 * Original Author: Jack Watson
 * Created Date: 11/29/2021
 * Purpose: This file holds a simple value object for the data for the form that we just uploaded.
 */

import { Form } from "./Form";
import { NewEmployee } from "../../validators/NewEmployeeValidator";

export class Employee implements Form
{
    private data: NewEmployee

    constructor(data: NewEmployee)
    {
        this.data = data;
    }

    public getData(): NewEmployee
    {
        return this.data;
    }
}
