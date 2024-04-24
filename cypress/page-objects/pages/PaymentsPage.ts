import { getNewUserData, getSepaSymbol } from '../../data/client-data'
import { Iban } from '../../enums/Payments.enum'
import BasePage from '../BasePage'

export class PaymentsPage extends BasePage {
  selectors = {
    title: 'h1',
    subTitle: 'formly-field.h3',
    headers: 'formly-field.section-label.h3',
    label: '.form-check-label',
    checkbox: '.form-check-input',
    button: 'button',
    input: '.formly-custom-validation',
    message: 'div.invalid-feedback',
    primaryBtn: '.btn-primary',
    dangerBtn: 'button.btn-link.text-danger',
    editBtn: 'button.btn.btn-secondary',
    dropdownItem: 'button.dropdown-item',
  }

  getTitle() {
    return cy.get(this.selectors.title)
  }

  getSubTitle() {
    return cy.get(this.selectors.subTitle)
  }

  getHeaders() {
    return cy.get(this.selectors.headers)
  }

  getLabel() {
    return cy.get(this.selectors.label)
  }

  getCheckbox() {
    return cy.get(this.selectors.checkbox)
  }

  getBtn() {
    return cy.get(this.selectors.button)
  }

  getInput() {
    return cy.get(this.selectors.input)
  }

  getMsg() {
    return cy.get(this.selectors.message)
  }

  getPrimaryBtn() {
    return cy.get(this.selectors.primaryBtn)
  }

  getDangerBtn() {
    return cy.get(this.selectors.dangerBtn)
  }

  getEditBtn() {
    return cy.get(this.selectors.editBtn)
  }

  getDropdownItem() {
    return cy.get(this.selectors.dropdownItem)
  }

  public emptyInputs() {
    cy.get('formly-group input[type="text"]').each(($input) => {
      cy.wrap($input).should('have.value', '')
    })
  }

  public referenceSymbols() {
    cy.getLabelInput('Variabilný symbol').clear()
    cy.getLabelInput('Špecifický symbol').clear()
    cy.getLabelInput('Konštantný symbol').clear()

    cy.getLabelInput('Variabilný symbol').type('12345').should('have.value', '12345')
    // cy.getLabelInput('Variabilný symbol').type('abc').should('have.value', '12345')
    cy.cancelInput()

    cy.getLabelInput('Špecifický symbol').type('12345').should('have.value', '12345')
    cy.getLabelInput('Špecifický symbol').type('abc').should('have.value', '12345')
    cy.cancelInput()
    // cy.getLabelInput('Špecifický symbol').clear().type(getSepaSymbol.symbol1)

    cy.getLabelInput('Konštantný symbol').type('123').should('have.value', '123')
    cy.getLabelInput('Konštantný symbol').type('abc').should('have.value', '123')
    cy.cancelInput()
    // cy.getLabelInput('Konštantný symbol').clear().type(getSepaSymbol.symbol2)
  }

  public cancelSepa() {
    this.getPrimaryBtn().click()
    cy.get('h3').should('include.text', 'Skontrolujte si platbu')
    this.getDangerBtn().click() // cancel
    cy.checkModal('Zrušiť platbu', 'Chcete naozaj zrušiť platbu?', 'Nie', 'Áno')
    cy.get('.modal-footer button.btn').eq(0).click() // continue btn
    this.getDangerBtn().click() // cancel
    cy.checkModal('Zrušiť platbu', 'Chcete naozaj zrušiť platbu?', 'Nie', 'Áno')
    cy.get('.modal-footer button.btn').eq(1).click() // continue btn
  }

  public payWithoutSaveContact() {
    // happy flow
    cy.getLabelInput('Meno príjemcu').clear().type(getNewUserData.newName).blur()
    cy.getLabelInput('IBAN číslo').clear().type(getNewUserData.newIban).blur()
    cy.getLabelInput('Suma').clear().type('1').blur()
    this.getDescriptionType1('Poznámka k platbe')

    // make payment without saving contact
    this.getPrimaryBtn().click()
    this.getPrimaryBtn().click()

    // todo - momentalne hlada element a failne test ked ho nenajde, MOJ PLAN: ak je vytvoreny kontakt, hodi log
    // cy.get('body').then((body) => {
    //   if (body.find('.desktop > .contact-list > .mb-3 > .py-3').length > 0) {
    //     cy.log('EXIST')
    //   } else {
    //     cy.log('not EXIST')
    //   }
    // })
  }
  public getDescriptionType1(labelText: string) {
    cy.contains('label', labelText).parent().find('textarea').clear().type('1').blur()
  }

  // updated for textarea instead of input from commands
  public validateInput(labelText: string, inputText: string, expectedText?: string) {
    cy.contains('label', labelText).parent().find('textarea').clear().type(inputText).blur()
    cy.getInvalidLabel().should('have.text', expectedText)
  }

  public getRandomIBAN() {
    const ibanValues = Object.values(Iban)
    const randomIndex = Math.floor(Math.random() * ibanValues.length)
    return ibanValues[randomIndex]
  }

  // updated for symbols instead of input from commands
  public validateReviewScreen(labelText: string, expectedText: string) {
    cy.get('label').contains(labelText).parent().find('p').should('have.text', expectedText)
  }

  // payment reference symbols on review payment screen
  public symbolValues() {
    this.getPrimaryBtn().click()
    cy.get('h3').contains('Skontrolujte si platbu')
    this.validateReviewScreen('Variabilný symbol', getSepaSymbol.symbol1)
    this.validateReviewScreen('Špecifický symbol', getSepaSymbol.symbol1)
    this.validateReviewScreen('Konštantný symbol', getSepaSymbol.symbol2)
    this.getEditBtn().click()
  }
}

export const paymentsPage = new PaymentsPage()
