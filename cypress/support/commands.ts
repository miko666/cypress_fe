/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(username: string, password: any): Chainable<Element>
    getToastAndClose(text: string): Chainable<Element>
    getLabelInput(locator: string): Chainable<Element>
    getInvalidLabel(): Chainable<Element>
    validateInput(inputSelector: any, inputText: string, expectedText?: string): Chainable<Element>
    checkModal(
      headerText: string,
      bodyText: string,
      button1Text: string,
      button2Text: string,
    ): Chainable<Element>
    cancelInput(): Chainable<Element>
  }
}

/*
 * login
 */
Cypress.Commands.add('login', (username, password) => {
  cy.session(username, () => {
    cy.get('input[name=username]').type(username)
    cy.get('input[name=password]').type(`${password}{enter}`, { log: false })
  })
})

/*
 * check toast and close
 */
Cypress.Commands.add('getToastAndClose', (text: string) => {
  cy.get('.toast-body', { timeout: 15000 })
    .should('be.visible')
    .within(() => {
      cy.get('.content')
        .invoke('text')
        .then((actualText) => {
          expect(actualText.trim()).to.eq(text)
        })
      cy.get('ib365-icon[svgicon="close"]').click()
    })
})

/*
 * get next input of label name
 */
Cypress.Commands.add('getLabelInput', (labelText) => {
  cy.contains('label', labelText).parent().find('input')
})

/*
 * get invalid msg
 */
Cypress.Commands.add('getInvalidLabel', () => {
  cy.get('.invalid-feedback').eq(0)
})

/*
 * label + input + error msg
 */
Cypress.Commands.add('validateInput', (inputSelector, inputText, expectedText) => {
  cy.getLabelInput(inputSelector).clear().type(inputText).blur()
  cy.getInvalidLabel().should('have.text', expectedText)
})

/*
 * check modal window
 */
Cypress.Commands.add(
  'checkModal',
  (headerText: string, bodyText: string, button1Text: string, button2Text: string) => {
    cy.get('.modal-header h2').should('have.text', headerText)
    cy.get('.modal-body p').should('have.text', bodyText)
    cy.get('.modal-footer button.btn').should('have.length', 2)
    cy.get('.modal-footer button.btn').eq(0).should('have.text', button1Text)
    cy.get('.modal-footer button.btn').eq(1).should('have.text', button2Text)
  },
)

/*
 * input cancel/clear text button
 */
Cypress.Commands.add('cancelInput', () => {
  cy.get('ib365-icon[svgicon="cancel-input"]').last().should('be.visible').click()
  cy.get('body').click()
})
