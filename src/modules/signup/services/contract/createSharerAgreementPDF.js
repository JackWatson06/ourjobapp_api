'use strict'

const nunjucks = require('nunjucks')
const htmlPdf = require('html-pdf')

/**
 * 
 * @param {object} context Parameters to set in dynamically
 */
const createSharerAgreementPDF = async (context) => {
  /**
   * e.g. context should have below keys:
   * VAR_EFFECTIVE_DATE (e.g. 26th day of July, 2021)
   * VAR_PARTNER_NAME (e.g. Lehigh Construction Group Inc)
   * VAR_TERMINATION_DATE (e.g. 26th day of July, 2021)
   * VAR_SHARED_NAME (e.g. Mike Lehigh)
   * VAR_SHARED_EMAIL (e.g. Mike@lehigh.com)
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
  const pdfFilename = __dirname + `/output/SHARER_AGREEMENT_${Math.floor(new Date().getTime() / 1000)}.pdf`
  const htmlContent = await nunjucks.render('./assets/sharer_agreement.html', context)
  await htmlPdf.create(htmlContent, options).toFile(pdfFilename, () => {
    console.info('File Stored Successfully! ', pdfFilename)
  })
  return { data: true }
};

(async () => {
  await createSharerAgreementPDF({
    VAR_EFFECTIVE_DATE: '26th day of July, 2021',
    VAR_TERMINATION_DATE: '26th day of July, 2021',
    VAR_PARTNER_NAME: 'Lehigh Construction Group Inc',
    VAR_SHARED_NAME: 'Mike Lehigh',
    VAR_SHARED_EMAIL: 'Mike@lehigh.com'
  })
})();