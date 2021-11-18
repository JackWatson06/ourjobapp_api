import Handlebars from "handlebars";
import htmlPdf from "html-pdf";
import fs from "infa/FileSystemAdaptor";

export type ContractLocator = {
    name: string,
    path: string
}

export type Placement = "placement"
export type Sharer = "sharer"

interface PlacementBinds {
    VAR_DATE_OF_AGREEMENT      : string;
    VAR_PARTNER_COMPANY_NAME   : string;
    VAR_PARTNER_OFFICE_ADDRESS : string;
    VAR_DESIGNATED_PARTY_NAME  : string;
    VAR_DESIGNATED_PARTY_EMAIL : string;
}

interface SharerBinds {
    VAR_EFFECTIVE_DATE   : string;
    VAR_TERMINATION_DATE : string;
    VAR_PARTNER_NAME     : string;
    VAR_SHARED_NAME      : string;
    VAR_SHARED_PHONE     : string;
}

type ContractTypes = Placement|Sharer;
interface Contracts  {
    "placement" : PlacementBinds,
    "sharer"    : SharerBinds,
}

const options: htmlPdf.CreateOptions = {
    format: "A4",
    header: {
      height: "10mm",
    },
    footer: {
      height: "10mm",
      contents: {
        default: '<span style="color: #444;float:right;">{{page}}</span><span></span>'
      }
    },
    border: {
      top: "1in",
      right: "0.5in",
      bottom: "0.5in",
      left: "0.5in"
    }
  };

/**
 * Generate a new contract. Return the saved contracts full path so we can save that in the datbase.
 * @param {object} context Parameters to set in dynamically
 */
export async function generate<T extends ContractTypes>(contract: T, binds: Contracts[T]): Promise<ContractLocator>
{
    const contractName = `${contract}_${Math.floor(new Date().getTime() / 1000)}.pdf`;

    const templateFile: string                      = await fs.read( fs.TEMPLATE, `contracts/${contract}.hbs`);
    const compiled: HandlebarsTemplateDelegate<any> = Handlebars.compile(templateFile);
    const html                                      = compiled(binds);

    // Generate the contract from the buffer.
    const buffer: Buffer = await new Promise((resolve, reject) => {
        htmlPdf.create(html, options).toBuffer(function(err, buffer){
            if(err)
            {
                reject(err);
            }
            
            resolve(buffer);
        });
    });

    // Write the contract in the file system.
    await fs.write(fs.DOCUMENT, buffer, `contracts/${contractName}`);
    
    return {
        name: contractName,
        path: fs.absolutePath(fs.DOCUMENT, `contracts/${contractName}`)
    }
  };