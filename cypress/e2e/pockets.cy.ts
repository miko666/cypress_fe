import { PocketLabels } from '../enums/Pockets.enum'
import { pocketsPage } from '../page-objects/pages/PocketsPage'

describe('Pockets test', () => {
  beforeEach(() => {
    cy.visit('/pockets', { timeout: 5000 })
    pocketsPage.getTitle().should('have.text', 'Pokety').should('be.visible')
  })

  it('should display empty pocket page', () => {
    // todo - vymazat vsetky pokety

    // pocketsPage.getFirstPocket().click()
    // pocketsPage.getOptionBtns().eq(2).click()

    // pocketsPage.deleteAllPockets() // opravit

    cy.get('img[src="assets/images/pockets/no-pockets.svg"]').should('be.visible')
    pocketsPage.getSubTitle().should('contain', 'Usporte viac s Poketmi')
    pocketsPage
      .getNoPockets()
      .should(
        'have.text',
        'Vytvorte si vyhradený priestor, ktorý vám pomôže držať krok s vašimi cieľmi v sporení.',
      )
      .should('be.visible')
    cy.get('button[type="submit"]').should('be.enabled').should('contain', 'Vytvoriť Poket')
  })

  it('should create pocket', () => {
    pocketsPage.getBtn().contains('Vytvoriť Poket').click()

    pocketsPage.selectRandomImg()

    Object.values(PocketLabels).forEach((pocketLabel) => {
      cy.contains(pocketLabel).should('be.visible')
    })

    cy.get('button')
      .contains('Vytvoriť Poket')
      .should('be.visible')
      .next()
      .should('contain', 'Zmazať Poket')
      .should('be.visible')

    pocketsPage.getDateLabel().contains('Dĺžka sporenia').should('be.visible')
    pocketsPage.getCheckbox().check().should('be.checked')
    pocketsPage.getHiddenLabel().contains('Konečný dátum').should('be.visible')
    pocketsPage.getDateInput().should('be.visible')
    pocketsPage.getCheckbox().uncheck().should('not.be.checked')
    pocketsPage.getCheckbox().check().should('be.checked')
    cy.get('button.btn.btn-light.calendar').click()
    cy.get('ngb-datepicker-month').should('be.visible')

    pocketsPage.selectRandomDate()

    pocketsPage.getInput().eq(1).type(pocketsPage.randomDecimal)
    pocketsPage.getInput().eq(0).clear().blur()
    pocketsPage.getInputCreate().should('have.text', 'Zadajte platné meno Poketu.')

    pocketsPage.clickAndVerifyButtons()

    pocketsPage.getBtn().contains('Vytvoriť Poket').click()
    cy.getToastAndClose('Poket bol úspešne vytvorený.')
  })

  it('should display pockets listing and review of pocket', () => {
    pocketsPage.getPocketBody().should('contain', 'Potrebujete sporiť na niečo iné?')
    cy.get('.col-sm-12.col-md-6:has(img)').each(($pocket) => {
      cy.wrap($pocket).find('img').should('have.attr', 'alt')
    })

    pocketsPage.verifyPocketsProgressBar()

    pocketsPage
      .getPocketLabel()
      .should('have.class', 'fw-bold')
      .should(($h4) => {
        expect($h4.text()).to.not.be.empty
      })

    pocketsPage.verifyPocketsListing()

    pocketsPage.getFirstPocket().click()

    pocketsPage.verifyPocketDetails()

    pocketsPage.getLabelTitle().should('be.visible')
    pocketsPage.getNumbers().eq(0).should('be.visible')
  })

  it('should deposit pocket', () => {
    pocketsPage.depositCancel()
    pocketsPage.getOptionBtns().eq(0).click()
    pocketsPage.verifyAndUpdateBalance('Suma vášho vkladu nemôže byť vyššia ako dostupný zostatok.')
    pocketsPage.depositToPocket()

    // todo - uncomment when transaction toast for deposit pocket is available
    // cy.getToastAndClose('Váš vklad bol vložený do Poketu.')
  })

  it('should withdraw pocket', () => {
    pocketsPage.withdrawCancel()
    pocketsPage.getOptionBtns().eq(1).click()
    pocketsPage.verifyAndUpdateBalance('Suma vášho výberu nemôže byť vyššia ako dostupný zostatok.')
    pocketsPage.withdrawPocket()

    // todo - uncomment when transaction toast for withdraw pocket is available
    // cy.getToastAndClose('Váš výber z Poketu bol úspešný.')

    // todo - uncomment when transaction list is available
    // pocketsPage.getNavAcc().click().should('be.visible')
    // pocketsPage.getMainAcc().click()
    // pocketsPage.getMainTransactions().contains('Prijatá').should('exist')
    // pocketsPage
    //   .getMainTransactions()
    //   .contains(/(\d+)\s*EUR/)
    //   .should('exist')
  })

  // todo - do buducna, kazdy test by mal prebiehat zvlast = vytvorenie poketu az potom delete
  it('should delete pocket', () => {
    pocketsPage.getFirstPocket().click()

    pocketsPage.verifyPocketDetails()
    pocketsPage.getLabelTitle().should('be.visible')
    pocketsPage.getNumbers().eq(0).should('be.visible')

    pocketsPage.deletePocketValidations()
    cy.getToastAndClose('Poket bol úspešne zmazaný.')
  })
})
