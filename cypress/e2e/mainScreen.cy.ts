import { Labels } from '../enums/MainScreen.enum'
import { contactsPage } from '../page-objects/pages/ContactsPage'
import { mainScreenPage } from '../page-objects/pages/MainScreenPage'

describe('Navbar', () => {
  beforeEach(() => {
    cy.visit('/my-accounts', { timeout: 10000 })
  })

  it('should display main screen + account details correctly', () => {
    const numericBalancePattern = /\d+(?:,\d{3})*(?:\.\d+)?/
    mainScreenPage
      .getHeaders()
      .should('contain', 'Účty')
      .should('contain', 'Platby')
      .should('contain', 'Karty')
      .should('contain', 'Pokety')
      .should('contain', 'Kontakty')
      .should('contain', 'Správy')

    // toDo
    // .should('contain', 'Výpis z účtu')
    // .should('contain', 'Upozornenia')
    mainScreenPage.getTitle().should('contain', 'Účty')
    mainScreenPage
      .getSubTitle()
      .should('contain', 'Rýchla platba')
      .and('contain', 'Rýchle linky')
      .should('be.visible')

    // check if the IBAN is correctly displayed
    cy.get('p[data-testid="iban"]')
      .wait(500)
      .should('be.visible')
      .invoke('text')
      .should('match', /SK\d{2} \d{4} \d{4} \d{4} \d{4} \d{4}/)

    // check if the available balance is the same is previous one
    cy.get('p.text-body-secondary.available-balance')
      .should('be.visible')
      .invoke('text')
      .then((availableBalanceText) => {
        const displayedBalance = parseFloat(availableBalanceText.replace(/[^0-9.-]+/g, ''))

        cy.get('p.text-body-secondary.available-balance')
          .should('have.text', availableBalanceText) // Compare text with should
          .invoke('text')
          .then((dynamicBalanceText) => {
            const dynamicBalance = parseFloat(dynamicBalanceText.replace(/[^0-9.-]+/g, ''))

            // Compare the displayed balance with the dynamic balance using should
            cy.wrap(displayedBalance).should('eq', dynamicBalance)
          })
      })

    mainScreenPage
      .getBalance()
      .should('contain', 'Dostupný zostatok')
      .invoke('text')
      .then((text) => {
        expect(text).to.match(numericBalancePattern)
      })

    mainScreenPage.getLogo().should('be.visible')
    mainScreenPage.getUser().should('be.visible')
    mainScreenPage.getBell().should('be.visible')

    mainScreenPage.clickAccountInfo()
    cy.contains('button', 'Detaily').should('be.visible').click()

    // check if labels are displayed correct
    Object.values(Labels).forEach((label) => {
      cy.contains(label).should('be.visible')
    })
  })

  it('should validate transactions + details', () => {
    mainScreenPage.clickAccountInfo()

    // check every transaction in list
    mainScreenPage
      .getAccountIcon()
      .should('be.visible')
      .each(($icon) => {
        if ($icon.hasClass('incoming')) {
          cy.wrap($icon).parent().find('.transaction-type').should('have.text', 'Prijatá')
        } else if ($icon.hasClass('outgoing')) {
          cy.wrap($icon).parent().find('.transaction-type').should('have.text', 'Odoslaná')
        }
        mainScreenPage.getTransactionName().should('be.visible')
        cy.get('.transaction-date').should('be.visible')
        mainScreenPage
          .getTransactionAmount()
          .should('be.visible')
          .invoke('text')
          .then((amountsText) => {
            const actualAmounts = amountsText.trim().split(/\s+/)
            actualAmounts.forEach((actualAmount) => {
              if (!isNaN(Number(actualAmount))) {
                const parsedAmount = parseFloat(
                  actualAmount.replace(/[^\d.,]/g, '').replace(',', '.'),
                )
                const expectedAmount = parsedAmount.toFixed(0)
                expect(parsedAmount).to.eq(Number(expectedAmount))
              }
            })
          })
      })

    // check the 1st incoming and 1st outgoing transaction detail
    mainScreenPage
      .getAccountIcon()
      .should('be.visible')
      .then(($icons) => {
        const $firstIncoming = $icons.filter('.incoming').first()
        const $firstOutgoing = $icons.filter('.outgoing').first()

        const incomingTransactionType = 'Prijatá'
        cy.wrap($firstIncoming)
          .parent()
          .find('.transaction-type')
          .should('have.text', incomingTransactionType)
          .click()
        cy.get('.dialog__account-icon.incoming').should('be.visible')
        cy.contains('.text-body-secondary', 'Typ transakcie')
          .next('.dialog__value')
          .should('have.text', incomingTransactionType)
        mainScreenPage.checkTransactionDetails()
        mainScreenPage.transactionValues()

        const outgoingTransactionType = 'Odoslaná'
        cy.wrap($firstOutgoing)
          .parent()
          .find('.transaction-type')
          .should('have.text', outgoingTransactionType)
          .scrollIntoView()
          .click({ force: true })
        cy.get('.dialog__account-icon.outgoing').should('be.visible')
        cy.contains('.text-body-secondary', 'Typ transakcie')
          .next('.dialog__value')
          .should('have.text', outgoingTransactionType)
        mainScreenPage.checkTransactionDetails()
        mainScreenPage.transactionValues()
      })
  })

  it('should validate filter', () => {
    // Click the Filter button
    mainScreenPage.clickAccountInfo()
    cy.get('button.btn-secondary').contains('Filter').click()

    // Check the presence of filter elements
    cy.get('.search-row').should('be.visible')
    cy.get('ib365-icon[svgicon="filter"]').should('be.visible')
    cy.get('button.btn-secondary.btn-icon.ms-3').should('be.visible')
    cy.get('.filter-row').should('be.visible')
    cy.get('.transaction-filter-input').should('have.length', 4) // Assuming there are two date pickers
    cy.get('.transaction-filter-dropdown').should('be.visible')
    cy.get('button.btn-primary').contains('Použiť filter').should('be.visible')
    cy.get('button.text-danger').should('be.visible')

    // todo - 822 - Date - transactions are sorted under particular date (under one date can be visible more transactions in that day)
    // cy.get('.transaction-filter-input input[label="Od"]').type('2023-01-01')
    // cy.get('.transaction-filter-input input[placeholder="Do"]').type('2023-12-31')

    mainScreenPage.filterIncomingTransaction()
  })

  it('should validate filter search', () => {
    mainScreenPage.clickAccountInfo()

    // incoming filter
    cy.get('.input-group.search-query input[formcontrolname="query"]')
      .clear()
      .type('Incoming')
      .type('{enter}')

    mainScreenPage
      .getAccountIcon()
      .filter('.incoming')
      .should('be.visible')
      .first()
      .parent()
      .find('.transaction-type')
      .should('have.text', 'Prijatá')

    // outgoing filter
    cy.get('.input-group.search-query input[formcontrolname="query"]')
      .clear()
      .type('Outgoing')
      .type('{enter}')

    mainScreenPage
      .getAccountIcon()
      .filter('.outgoing')
      .should('be.visible')
      .first()
      .parent()
      .find('.transaction-type')
      .should('have.text', 'Odoslaná')

    // invalid filter
    cy.get('.input-group.search-query input[formcontrolname="query"]')
      .clear()
      .type('ghost1')
      .type('{enter}')
    contactsPage.getNoContsImg().should('be.visible')
    contactsPage.getNoContsTitle().should('have.text', 'Žiadne transakcie')
    contactsPage
      .getNoContsText()
      .should('have.text', 'Momentálne nemáte vykonanú žiadnu z vyhľadávaných platieb.')
  })

  it('should validate the print option', () => {
    mainScreenPage.clickAccountInfo()
    cy.contains('button', 'Detaily').should('be.visible').click()

    // todo
    cy.log('CLOSE THE PRINT POPUP WINDOW')
    cy.get('button[type="button"].btn-secondary.btn-icon').click()

    cy.window().then((win) => {
      win.opener = null
      win.close()
    })
  })

  it.skip('should download transaction list', () => {
    // todo - 1366 https://dsp-project.atlassian.net/browse/QAHORIZON-1366
    mainScreenPage.clickAccountInfo()

    cy.get('ib365-dropdown[icon="download"] button.dropdown-toggle').click()

    cy.readFile('cypress/fixtures/pdf/simple.pdf', 'utf8')
    cy.task('readPdf', 'cypress/fixtures/pdf/simple.pdf')
  })
})
