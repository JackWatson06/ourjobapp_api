

import nunjucks from "nunjucks";
import htmlPdf from "html-pdf";

/**
 * 
 * @param {object} context Parameters to set in dynamically
 */
const createPlacementContractPDF = async (context) => {




 /**
   * e.g. context should have below keys:
   * VAR_DATE_OF_AGREEMENT (e.g. 26th day of July, 2021)
   * VAR_PARTNER_COMPANY_NAME (e.g. Lehigh Construction Group Inc)
   * VAR_PARTNER_OFFICE_ADDRESS (e.g. 4327 S Taylor Road, Orchard Park, NY 14127)
   * VAR_DESIGNATED_PARTY_NAME (e.g. Mike Lehigh)
   * VAR_DESIGNATED_PARTY_EMAIL (e.g. Mike@lehigh.com)
   */
  const options = {
    format: 'A4',
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
  }
  const pdfFilename = __dirname + `/output/PLACEMENT_CONTRACT_${Math.floor(new Date().getTime() / 1000)}.pdf`
  const htmlContent = await nunjucks.render('./assets/placement_contract.html', context)
  await htmlPdf.create(htmlContent, options).toFile(pdfFilename, () => {
    console.info('File Stored Successfully! ', pdfFilename)
  })
  return { data: true }
};

(async () => {
  await createPlacementContractPDF({
    VAR_DATE_OF_AGREEMENT: '28th day of Nov, 2021',
    VAR_PARTNER_COMPANY_NAME: 'Lehigh Construction Group Inc',
    VAR_PARTNER_OFFICE_ADDRESS: '4327 S Taylor Road, Orchard Park, NY 14127',
    VAR_DESIGNATED_PARTY_NAME: 'Mike Lehigh',
    VAR_DESIGNATED_PARTY_EMAIL: 'Mike@lehigh.com'
  })
})();