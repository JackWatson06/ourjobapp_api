/**
 * Original Author: Jack Watson
 * Created Date: 11/29/2021
 * Purpose: This file holds a simple value object for the data for the form that we just uploaded.
 */

import { Form } from "./Form";
import { NewEmployer } from "../../validators/NewEmployerValidator";

export class Employer implements Form
{
    private data: NewEmployer

    constructor(data: NewEmployer)
    {
        this.data = data;
    }

    public getData(): NewEmployer
    {
        return this.data;
    }
}
