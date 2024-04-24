import BasePage from '../BasePage'

export class ContactsPage extends BasePage {
  selectors = {
    title: 'ib365-header:not(.d-md-none) h1',
    noContsImg: 'div.result-screen img',
    noContsTitle: 'div.result-screen h2',
    noContsText: 'div.result-screen p.text-primary',
    editAddress: 'a > ib365-icon > .color-primary',
    primaryBtn: '.btn-primary',
    loadingContacts: 'h5.loading-indicator__headline',
    createName: 'input[placeholder="Meno Priezvisko"]',
    createIban: 'input[placeholder="SK00 0000 0000 0000 0000"]',
    threeDots: ':nth-child(5) > .btn',
    contactsPage: '.dropdown-toggle.show > .dropdown-menu > :nth-child(1)',
    contact: '.desktop > .contact-list > .mb-3 > .py-3',
    contactList: '.contact-list',
    newContactBtn: '.col-12 > .btn',
    search: '#contact-search',
    listNameLabel: '.py-3 > h4',
    listIbanLabel: '.py-3 > .m-0',
    listNameInput: 'ib365-contact-item h4',
    listIbanInput: 'ib365-contact-item p.m-0',
    nameInput: 'section p.text-break',
    ibanInput: 'div.card-body p.text-body-secondary:contains("IBAN číslo") + p',
    nameLabel: '.card-body .d-flex > :nth-child(1) .mb-2',
    ibanLabel: '.row > :nth-child(2) > ib365-contact-detail > .card > .card-body > :nth-child(2)',
    editBtn: '.card-body .d-flex :nth-child(2) .btn .color-primary',
    contactName: '.desktop > .contact-list > :nth-child(1) > .py-3 > h4',
    saveContactBtn: '.card-body.row :nth-child(2) ib365-edit-contact :nth-child(1) .btn span',
    deleteContactBtn: '.card-body.row > :nth-child(2) ib365-edit-contact > .row .mt-3 .btn span',
    modalText: '.modal-body > p',
    backBtn: '.btn-secondary',
    confimDelete: '.btn-danger',
  }

  getTitle() {
    return cy.get(this.selectors.title)
  }

  getNoContsImg() {
    return cy.get(this.selectors.noContsImg)
  }

  getNoContsTitle() {
    return cy.get(this.selectors.noContsTitle)
    // .eq(1)
  }

  getNoContsText() {
    return cy.get(this.selectors.noContsText)
    // .eq(1)
  }

  getEditAddress() {
    return cy.get(this.selectors.editAddress)
  }

  getPrimaryBtn() {
    return cy.get(this.selectors.primaryBtn)
  }

  getLoadingContacts() {
    return cy.get(this.selectors.loadingContacts)
  }

  getCreateName() {
    return cy.get(this.selectors.createName).eq(1)
  }

  getCreateIban() {
    return cy.get(this.selectors.createIban).eq(1)
  }

  getThreeDots() {
    return cy.get(this.selectors.threeDots)
  }

  getContactsPage() {
    return cy.get(this.selectors.contactsPage)
  }

  getFirstContact() {
    return cy.get(this.selectors.contact).eq(0)
  }

  getContactList() {
    return cy.get(this.selectors.contactList)
  }

  getNewContactBtn() {
    return cy.get(this.selectors.newContactBtn)
  }

  getSearch() {
    return cy.get(this.selectors.search)
  }

  getListNameLabel() {
    return cy.get(this.selectors.listNameLabel)
  }

  getListIbanLabel() {
    return cy.get(this.selectors.listIbanLabel)
  }

  getListNameInput() {
    return cy.get(this.selectors.listNameInput).first()
  }

  getListIbanInput() {
    return cy.get(this.selectors.listIbanInput).first()
  }

  getNameLabel() {
    return cy.get(this.selectors.nameLabel)
  }

  getIbanLabel() {
    return cy.get(this.selectors.ibanLabel)
  }

  getNameInput() {
    return cy.get(this.selectors.nameInput).eq(1)
  }

  getIbanInput() {
    return cy.get(this.selectors.ibanInput).eq(1)
  }

  getEditBtn() {
    return cy.get(this.selectors.editBtn)
  }

  getContactName() {
    return cy.get(this.selectors.contactName)
  }

  getSaveContactBtn() {
    return cy.get(this.selectors.saveContactBtn)
  }

  getDeleteContactBtn() {
    return cy.get(this.selectors.deleteContactBtn)
  }

  getModalText() {
    return cy.get(this.selectors.modalText)
  }

  getBackBtn() {
    return cy.get(this.selectors.backBtn)
  }

  getConfimDelete() {
    return cy.get(this.selectors.confimDelete)
  }

  public validateNameInput(inputText: string, expectedText: string) {
    this.getCreateName().clear().type(inputText).blur()
    cy.getInvalidLabel().should('have.text', expectedText)
  }
  public validateIbanInput(inputText: string, expectedText: string) {
    this.getCreateIban().clear().type(inputText).blur()
    cy.getInvalidLabel().should('have.text', expectedText)
  }

  public deleteContactHappyFlow() {
    let deletedContactName: string
    this.getFirstContact().click()
    this.getEditBtn().eq(1).click()
    this.getContactName()
      .invoke('text')
      .then((text) => {
        deletedContactName = text.trim()
      })
    this.getSaveContactBtn().should('be.visible')
    this.getDeleteContactBtn().click()
    this.getConfimDelete().click()
    this.getContactList().should('not.contain', deletedContactName)
  }
}

export const contactsPage = new ContactsPage()
