import { getNewUserData } from '../data/client-data'
import IBAN from '../enums/Contacts.enum'
import { contactsPage } from '../page-objects/pages/ContactsPage'

describe('Contacts test', () => {
  beforeEach(() => {
    cy.visit('/contacts', { timeout: 5000 })
    contactsPage.getTitle().should('have.text', 'Kontakty').should('be.visible')
  })

  it('should check no contacts page', () => {
    // todo - it test pred vsetkym - vymazat vsetky pokety
    contactsPage.getNoContsImg().should('be.visible')
    contactsPage.getNoContsTitle().should('have.text', 'Žiadne kontakty')
    contactsPage
      .getNoContsText()
      .should('have.text', 'Momentálne nemáte uložené žiadne obľúbené kontakty.')

    // after click create new contact
    contactsPage.getNewContactBtn().eq(1).click()
    contactsPage.getNoContsImg().should('be.visible')
    contactsPage.getNoContsTitle().should('have.text', 'Nenájdený kontakt')
    contactsPage
      .getNoContsText()
      .should('have.text', 'Momentálne nemáte uložený žiadny z vyhľadávaných kontaktov.')
  })

  it('should add new contact', () => {
    // 311 + ERROR HANDLING EXCEL
    contactsPage.getLoadingContacts().should('not.exist')
    contactsPage.getNewContactBtn().eq(1).click()

    // NAME
    contactsPage.getCreateName().clear().blur() // type nothing
    cy.getInvalidLabel().should('have.text', 'Zadajte platné meno prijímateľa.')

    contactsPage.getCreateName().type('asd')
    cy.cancelInput()
    cy.getInvalidLabel().should('have.text', 'Zadajte platné meno prijímateľa.')

    contactsPage.validateNameInput(' ', 'Zadajte platné meno prijímateľa.')
    contactsPage.validateNameInput('x'.repeat(71), 'Maximálna dĺžka je 70 znakov.')
    contactsPage.validateNameInput('漢', 'Používajte iba znaky latinskej abecedy a čísla.')
    contactsPage.getCreateName().clear().type(getNewUserData.newName)

    // IBAN
    // 824
    // check enums - country IBAN list
    Object.keys(IBAN).forEach((ibanKey) => {
      const ibanValue = IBAN[ibanKey]
      contactsPage.getCreateIban().clear().type(ibanValue).blur()
      contactsPage.getPrimaryBtn().eq(1).should('not.be.disabled')
    })
    contactsPage.getCreateIban().clear().blur() // type nothing
    cy.getInvalidLabel().should('have.text', 'Zadajte platné IBAN číslo.')

    contactsPage.getCreateIban().type('123')
    cy.cancelInput()
    cy.getInvalidLabel().should('have.text', 'Zadajte platné IBAN číslo.')

    contactsPage.validateIbanInput('CC48 3200 0000 1234 5864', 'Neplatný IBAN kód krajiny.')
    contactsPage.validateIbanInput('SK31 12', 'Zadajte platný IBAN, prosím.')
    contactsPage.validateIbanInput('漢', 'Zadajte platné IBAN číslo.')
    contactsPage.getCreateIban().clear().type(getNewUserData.newIban).blur()

    contactsPage.getPrimaryBtn().eq(1).click()

    // 2
    cy.getToastAndClose('Kontakt bol uložený.')
  })

  it('should overview contact', () => {
    // 318
    // 1
    contactsPage.getThreeDots().click()
    contactsPage.getContactsPage().click()

    // 2
    contactsPage.getFirstContact().click()
    contactsPage.getNewContactBtn().should('be.visible')
    contactsPage.getSearch().should('be.visible')

    // contact contain name and IBAN
    contactsPage.getListNameLabel().should('be.visible')
    contactsPage.getListIbanLabel().should('be.visible')
    // values of name + iban
    contactsPage.getListNameInput().should('have.text', getNewUserData.newName)
    contactsPage.getListIbanInput().should('have.text', getNewUserData.newIban)

    // labels and contact name + iban on right
    contactsPage.getNameLabel().should('be.visible')
    contactsPage.getIbanLabel().should('be.visible')
    // values of name + iban on right
    contactsPage.getNameInput().should('have.text', getNewUserData.newName)
    contactsPage.getIbanInput().should('have.text', getNewUserData.newIban)

    contactsPage.getEditBtn().should('be.visible')
  })

  it('should delete contact', () => {
    // 312
    // 1
    contactsPage.getFirstContact().click() // zoberie vsetky kontakty
    contactsPage.getEditBtn().eq(1).click()
    contactsPage.getSaveContactBtn().should('be.visible')
    contactsPage.getDeleteContactBtn().click()

    // modal window
    contactsPage
      .getModalText()
      .should('have.text', 'Naozaj chcete odstrániť kontakt zo svojho zoznamu?')
    contactsPage.getBackBtn().should('be.visible')
    contactsPage.getConfimDelete().click()

    // 2
    cy.getToastAndClose('Kontakt bol zmazaný.')
  })
})
