import BasePage from '../BasePage'

export class ProfilePage extends BasePage {
  selectors = {
    // example
    title: 'ib365-header h1',
    editAddress: 'a > ib365-icon > .color-primary',
  }

  getTitle() {
    return cy.get(this.selectors.title)
  }

  getEditAddress() {
    return cy.get(this.selectors.editAddress)
  }
}

export const profilePage = new ProfilePage()
