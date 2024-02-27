/**
 * Original Author: Jack Watson
 * Created Date: 11/28/2021
 * Purpose: We use the handlbars library to interpret, and render our templates. So this class here represents that adaptor
 * pattern for the handlebars library.
 */

import { ITemplate } from "./ITemplate";

import fs from "infra/FileSystemAdaptor";
import Handlebars from "handlebars";

export class HandlebarsAdaptor implements ITemplate
{
    public async render(template: string, binds: {}): Promise<string>
    {
        const templateFile: string                      = await fs.read( fs.TEMPLATE, `${template}.hbs`);
        const compiled: HandlebarsTemplateDelegate<any> = Handlebars.compile(templateFile);
        return compiled(binds);
    }
}
