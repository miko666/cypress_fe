import { TransactionDetails } from '../../enums/MainScreen.enum'
import BasePage from '../BasePage'

export class MainScreenPage extends BasePage {
  selectors = {
    logo: 'img[alt="365 logo"]',
    title: 'h1',
    subTitle: 'h2.card-title',
    headers: 'div.menu',
    balance: 'div.account.placeholder-glow',
    bell: 'ib365-icon[color="primary"][svgicon="bell"]',
    user: '.user-dropdown .full-name',
    icon: '.account-icon.incoming, .account-icon.outgoing',
    transactionName: '.counter-party-name.text-break',
    transactionAmount: '.transaction-positive-amount, .transaction-negative-amount',
  }

  getLogo() {
    return cy.get(this.selectors.logo)
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

  getBalance() {
    return cy.get(this.selectors.balance)
  }

  getBell() {
    return cy.get(this.selectors.bell)
  }

  getUser() {
    return cy.get(this.selectors.user)
  }

  getAccountIcon() {
    return cy.get(this.selectors.icon)
  }

  getTransactionName() {
    return cy.get(this.selectors.transactionName)
  }

  getTransactionAmount() {
    return cy.get(this.selectors.transactionAmount)
  }

  public clickAccountInfo() {
    cy.get('.account.placeholder-glow').wait(1000).should('be.visible').click({ force: true })
  }

  public checkTransactionDetails = () => {
    cy.get('.dialog__account-icon.incoming, .dialog__account-icon.outgoing').should('be.visible')
    cy.get('h4.mb-3').should('be.visible')
    cy.get('[data-testid="transaction-amount"]').should('be.visible')
    cy.contains('.text-body-secondary', 'Prevod').next('.dialog__value').should('be.visible')
    cy.contains('Detaily').should('be.visible')
    cy.contains('.text-body-secondary', 'IBAN').next('.dialog__value').should('be.visible')
    cy.contains('.text-body-secondary', 'Dátum realizácie').next('.dialog__value').should('exist')
    cy.contains('.text-body-secondary', 'Priebežný zostatok')
      .next('.dialog__value')
      .should('be.visible')
    // cy.get('.cursor-pointer > .color-primary-text').click()
  }

  public transactionValues() {
    // check labels
    Object.values(TransactionDetails).forEach((label) => {
      cy.contains(label).should('be.visible')
    })

    // transaction type icon (incoming/outgoing)
    this.getAccountIcon().should('be.visible')

    // sender's details
    cy.get('h4.mb-3').should('be.visible')

    // transaction Amount
    cy.get('[data-testid="transaction-amount"]').should('be.visible')

    // transaction Date and time (Date and time are local device)
    cy.get('.dialog__date').should('be.visible')

    // transaction details section
    cy.contains('Všeobecné').should('be.visible')

    // type [Incoming]
    cy.contains('.text-body-secondary', 'Typ transakcie')
      .next('.dialog__value')
      .should('be.visible')

    // transfer [From counterPartyName to recipientName]
    cy.contains('.text-body-secondary', 'Prevod').next('.dialog__value').should('be.visible')

    // Details section
    cy.contains('Detaily').should('be.visible')

    // IBAN [sender's details]
    cy.contains('.text-body-secondary', 'IBAN').next('.dialog__value').should('be.visible')

    // Date of realization
    cy.contains('.text-body-secondary', 'Dátum realizácie').next('.dialog__value').should('exist')

    // Running balance
    cy.contains('.text-body-secondary', 'Priebežný zostatok')
      .next('.dialog__value')
      .should('be.visible')

    // close transaction detail
    cy.get('.cursor-pointer > .color-primary-text').click()
  }

  public transactionAmount() {
    cy.get('.transaction-amount').then(($el) => {
      const rawAmount = $el.text().trim()
      const amount = parseInt(rawAmount.replace(/\D/g, ''), 10)
      const formattedAmount = amount.toLocaleString('en-US', { style: 'currency', currency: 'EUR' })
      console.log(`rawAmount: ${rawAmount}`)
      console.log(`amount: ${amount}`)
      console.log(`formattedAmount: ${formattedAmount}`)
      return cy.wrap(formattedAmount)
    })
  }

  public filterIncomingTransaction() {
    // todo - cy.wait() refactor + more test cases
    // Select a value in the Payes filter dropdown
    cy.get('.transaction-filter-dropdown .btn-dropdown').click()
    cy.get('.transaction-filter-dropdown .dropdown-menu').contains('Prijaté').click()

    // Click Apply filter button
    cy.get('button.btn-primary').contains('Použiť filter').click()
    cy.wait(500)

    // Your further assertions or verifications based on the applied filter
    // ...

    // Click Cancel filter button to close the filter
    cy.get('button.btn-link.text-danger').click()
    cy.wait(500)
  }
}

export const mainScreenPage = new MainScreenPage()
