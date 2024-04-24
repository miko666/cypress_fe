import { getSepaSymbol } from '../data/client-data'
import { PaymentFormLabels } from '../enums/Payments.enum'
import { contactsPage } from '../page-objects/pages/ContactsPage'
import { paymentsPage } from '../page-objects/pages/PaymentsPage'
import * as faker from 'faker'
const randomName1 = faker.name.findName().toLowerCase()
const randomIBAN1 = paymentsPage.getRandomIBAN()

describe('Payments test', () => {
  beforeEach(() => {
    cy.visit('/transfers/sepa-payment/form')
  })

  it('should display the correct payment page', () => {
    // check headings
    paymentsPage.getTitle().should('have.text', 'Prehľad platby').should('be.visible')
    paymentsPage.getSubTitle().should('contain', 'Platobné údaje')
    paymentsPage.getHeaders().should('contain', 'Z').and('contain', 'Na')

    // check if labels are displayed correct
    Object.values(PaymentFormLabels).forEach((label) => {
      cy.contains(label).should('be.visible')
    })

    // check buttons
    paymentsPage
      .getBtn()
      .contains('Skontrolovať platbu')
      .should('be.visible')
      .next()
      .should('contain', 'Zmazať všetky polia')
      .should('be.visible')

    // check checkbox
    paymentsPage.getLabel().should('be.visible').contains('Uložiť do kontaktov')

    // all inputs should be empty
    paymentsPage.emptyInputs()
  })

  it('should validate SEPA without contact save', () => {
    cy.viewport(1100, 1100)

    paymentsPage.getPrimaryBtn().should('be.disabled')

    // 388 - contact validation
    cy.getLabelInput('Meno príjemcu').should(
      'have.attr',
      'placeholder',
      'Vybrať, alebo vytvoriť kontakt',
    )

    // 425 - no contact
    cy.getLabelInput('Meno príjemcu').parent().find('ib365-icon').click()

    // name
    cy.validateInput(
      'Meno príjemcu',
      '#',
      "Používajte iba tieto špeciálne znaky: / - ? : ( ). , ' +",
    )
    cy.validateInput('Meno príjemcu', '好', 'Používajte iba znaky latinskej abecedy a čísla.')
    cy.validateInput('Meno príjemcu', 'x'.repeat(101), 'Maximálna dĺžka je 70 znakov.')
    cy.validateInput('Meno príjemcu', ' ', 'Zadajte platné meno prijímateľa.')
    const randomName = faker.name.findName().toLowerCase()
    cy.getLabelInput('Meno príjemcu').clear().type(randomName).blur()
    cy.getLabelInput('Meno príjemcu').should('have.value', randomName)

    // 387 - IBAN validation
    cy.validateInput('IBAN číslo', ' ', 'Zadajte platné IBAN číslo.')

    cy.getLabelInput('IBAN číslo').clear().type('123')
    cy.cancelInput()
    cy.getInvalidLabel().should('have.text', 'Zadajte platné IBAN číslo.')

    cy.validateInput('IBAN číslo', 'CC48 3200 0000 1234 5864', 'Neplatný IBAN kód krajiny.')
    cy.validateInput('IBAN číslo', 'SK03 6500 0000 0036 5062 42', 'Zadajte platný IBAN, prosím.')
    const randomIBAN = paymentsPage.getRandomIBAN()
    cy.getLabelInput('IBAN číslo').clear().type(randomIBAN).blur()
    cy.getLabelInput('IBAN číslo').should('have.value', randomIBAN)

    paymentsPage.getCheckbox().check().should('be.checked')
    paymentsPage.getCheckbox().uncheck().should('not.be.checked')

    // price
    cy.getLabelInput('Suma').clear().type('15100').blur()

    // todo - low prio fix?
    // cy.get('.amount') // higher amount than account balance
    //   .invoke('text')
    //   .then((currentBalanceText) => {
    //     const currentBalance = parseFloat(currentBalanceText.replace(/[^0-9.-]+/g, ''))
    //     const higherNumber = currentBalance + 10 // Adding 10 as an example
    //     cy.getLabelInput('Suma').clear().type(higherNumber.toString()).blur()
    //     cy.getInvalidLabel().should('have.text', 'Na účte nemáte dostatok dostupných prostriedkov.')
    //   })

    cy.validateInput('Suma', ' ', 'Pridajte sumu pre túto platbu.')
    cy.validateInput('Suma', '0.00', 'Pridajte sumu pre túto platbu.')
    cy.getLabelInput('Suma').clear().type('1,23$').blur()
    cy.getLabelInput('Suma').clear().type('2').blur()

    // 145 - review screen (edit)
    paymentsPage.getPrimaryBtn().click()
    // TODO novak adam ? - paymentsPage.validateReviewScreenWithTitle('Z účtu', 'NAZOV_UCTU', 'IBAN')
    // paymentsPage.validateReviewScreen('Účet zadarmo', 'SK17 6500 0000 0030 0001 9637')
    paymentsPage.validateReviewScreen(randomName, randomIBAN)
    paymentsPage.validateReviewScreen('Suma', '2 €')
    paymentsPage.getEditBtn().click()

    // description
    paymentsPage.validateInput(
      'Poznámka k platbe',
      '#',
      "Používajte iba tieto špeciálne znaky: / - ? : ( ). , ' +",
    )
    paymentsPage.validateInput(
      'Poznámka k platbe',
      '好',
      'Používajte iba znaky latinskej abecedy a čísla.',
    )
    paymentsPage.getDescriptionType1('Poznámka k platbe')

    // 810 - payment reference symbols on review payment screen
    cy.getLabelInput('Variabilný symbol')
      .type(getSepaSymbol.symbol1)
      .should('have.value', getSepaSymbol.symbol1)
    cy.getLabelInput('Špecifický symbol')
      .type(getSepaSymbol.symbol1)
      .should('have.value', getSepaSymbol.symbol1)
    cy.getLabelInput('Konštantný symbol')
      .type(getSepaSymbol.symbol2)
      .should('have.value', getSepaSymbol.symbol2)

    paymentsPage.symbolValues()

    // 148 - payment reference symbols
    paymentsPage.referenceSymbols()
    // todo - after MR fix tests, check out these lines

    cy.getLabelInput('Referencia platiteľa').should('not.have.attr', 'disabled')

    // NOT IN USE ANYMORE payment reference validation
    // cy.validateInput('Referencia platiteľa', ' ', 'Zadajte platnú referenciu platiteľa.')

    cy.validateInput(
      'Referencia platiteľa',
      '#',
      "Používajte iba tieto špeciálne znaky: / - ? : ( ). , ' +",
    )
    cy.validateInput(
      'Referencia platiteľa',
      '好',
      'Používajte iba znaky latinskej abecedy a čísla.',
    )
    cy.getLabelInput('Referencia platiteľa')
      .clear()
      .type('/VS1234567890/SS1234567890/KS1234')
      .blur()

    // 826 - cancel payment
    paymentsPage.cancelSepa()

    cy.visit('/transfers/sepa-payment/form')

    // all inputs should be empty
    paymentsPage.emptyInputs()

    // 897 - payment without saving contact
    paymentsPage.payWithoutSaveContact()

    // check no contact added
    cy.visit('/contacts', { timeout: 5000 })
    contactsPage.getTitle().should('have.text', 'Kontakty').should('be.visible')

    contactsPage.getNoContsImg().should('be.visible')
    contactsPage.getNoContsTitle().should('have.text', 'Žiadne kontakty')
    contactsPage
      .getNoContsText()
      .should('have.text', 'Momentálne nemáte uložené žiadne obľúbené kontakty.')
  })

  it('should validate SEPA with contact save', () => {
    const randomName = faker.name.findName().toLowerCase()
    const randomIBAN = paymentsPage.getRandomIBAN()

    // create contact - happy flow
    cy.visit('/contacts', { timeout: 5000 })
    contactsPage.getTitle().should('have.text', 'Kontakty').should('be.visible')
    contactsPage.getLoadingContacts().should('not.exist')
    contactsPage.getNewContactBtn().eq(1).click()
    contactsPage.getCreateName().clear().type(randomName)
    contactsPage.getCreateIban().clear().type(randomIBAN).blur()
    contactsPage.getPrimaryBtn().eq(1).click()

    // 426 - contact Select - happy flow
    cy.viewport(1100, 1100)
    cy.visit('/transfers/sepa-payment/form')
    cy.getLabelInput('Meno príjemcu').clear().type(randomName).blur()
    paymentsPage.getDropdownItem().contains(randomName).click()
    cy.getLabelInput('Meno príjemcu').should('have.value', randomName)
    cy.getLabelInput('Meno príjemcu').clear().blur()
    cy.getLabelInput('IBAN číslo').clear().blur()
    cy.getLabelInput('Meno príjemcu').clear().type(randomName).blur()
    paymentsPage.getDropdownItem().contains(randomName).click()
    cy.getLabelInput('Suma').clear().type('1').blur()

    // send
    paymentsPage.getPrimaryBtn().click()
    paymentsPage.validateReviewScreen(randomName, randomIBAN)
    paymentsPage.getPrimaryBtn().contains('Zaplatiť').click()

    // delete contact
    cy.visit('/contacts', { timeout: 5000 })
    contactsPage.getTitle().should('have.text', 'Kontakty').should('be.visible')
    contactsPage.getLoadingContacts().should('not.exist')
    contactsPage.deleteContactHappyFlow()
  })

  it('should validate SEPA with contact save in SEPA screen', () => {
    const randomName = faker.name.findName().toLowerCase()
    const randomIBAN = paymentsPage.getRandomIBAN()

    // create contact - happy flow
    cy.visit('/contacts', { timeout: 5000 })
    contactsPage.getTitle().should('have.text', 'Kontakty').should('be.visible')
    contactsPage.getLoadingContacts().should('not.exist')
    contactsPage.getNewContactBtn().eq(1).click()
    contactsPage.getCreateName().clear().type(randomName)
    contactsPage.getCreateIban().clear().type(randomIBAN).blur()
    contactsPage.getPrimaryBtn().eq(1).click()

    // 142 - edit existing contact
    cy.viewport(1100, 1100)
    cy.visit('/transfers/sepa-payment/form')
    cy.getLabelInput('Meno príjemcu').clear().type(randomName).blur()
    paymentsPage.getDropdownItem().contains(randomName).click()
    cy.getLabelInput('Meno príjemcu').should('have.value', randomName)

    cy.getLabelInput('Meno príjemcu').clear().type(randomName1).blur()
    cy.getLabelInput('IBAN číslo').clear().type(randomIBAN1).blur()
    paymentsPage.getCheckbox().check().should('be.checked')
    cy.getLabelInput('Suma').clear().type('1').blur()

    // send
    paymentsPage.getPrimaryBtn().click()
    paymentsPage.validateReviewScreen(randomName1, randomIBAN1)
    // paymentsPage.getToName().should('have.text', randomName1)
    // paymentsPage.getToIBAN().should('have.text', randomIBAN1)
    paymentsPage.getPrimaryBtn().contains('Zaplatiť').click()

    // delete 1st + 2nd contact
    cy.visit('/contacts', { timeout: 5000 })
    contactsPage.getTitle().should('have.text', 'Kontakty').should('be.visible')
    contactsPage.getLoadingContacts().should('not.exist')
    // contactsPage.getFirstContact().should('have.text', randomName)
    contactsPage.getContactList().contains('h4', randomName).should('exist')

    for (let i = 0; i < 2; i++) {
      contactsPage.deleteContactHappyFlow()
      cy.getToastAndClose('Kontakt bol zmazaný.')
    }
  })
})
