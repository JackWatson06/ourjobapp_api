/**
 * Original Author: Jack Watson
 * Created Date: 11/28/2021
 * Purpose: This interface defines a contract in both the abstract and literal sense in our codebase. A contract has the
 * ability to be rendered and that is it.
 */

import { ITemplate } from "template/ITemplate";

export interface Contractable
{
    render(template: ITemplate): Promise<string>;
}
