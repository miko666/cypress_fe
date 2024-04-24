import { defineConfig } from 'cypress'
import { addXrayResultUpload, configureXrayPlugin } from 'cypress-xray-plugin/plugin'
import { readPdf } from './cypress/scripts/readPdf'

export default defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      // on('task', {
      //   readPdf,
      // })
      // await configureXrayPlugin({
      //   jira: {
      //     url: 'https://xray.cloud.getxray.app',
      //     projectKey: 'AWSAPPS', // just a placeholder,
      //     testPlanIssueKey: 'AWSAPPS-2398',
      //   },
      //   xray: {
      //     uploadResults: true,
      //   },
      // })
      // await addXrayResultUpload(on)
      // implement node event listeners here
    },
    testIsolation: false,
    chromeWebSecurity: false,
    baseUrl: 'https://app.tst.b365.live.backbaseservices.com/ib365/retail/sk',
  },
  // reporter: 'cypress-mochawesome-reporter/plugin',
  reporter: 'mochawesome',
  video: false,
  defaultCommandTimeout: 7000,
  watchForFileChanges: false,
  viewportWidth: 1280,
  viewportHeight: 800,

  scrollBehavior: false,
  /* ked je true tak vzdy sa dostanem na spodok stranky a robi to neplechu,
   * na druhej strane musim manualne skrolova pocas priebehu testu
   * if ix payments.cy.ts ?
   * RIESENIE(docasne?): cy.viewport(x,y) nastavit vacsi pri teste ktorom to pada
   */
})
