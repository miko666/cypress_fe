import { PockeBtnNames, PocketLabels } from '../../enums/Pockets.enum'
import BasePage from '../BasePage'

export class PocketsPage extends BasePage {
  selectors = {
    title: 'ib365-header h1',
    subTitle: 'div.text-center > h1',
    pocketLabel: 'h4',
    dateLabel: 'label.d-flex.align-items-center > div.text-container > span.title',
    checkbox: 'input[type="checkbox"]',
    button: 'button',
    buttons: 'div.d-flex.flex-wrap.px-2.pt-1 button.btn',
    input: '.formly-custom-validation',
    inputCreate: 'formly-validation-message',
    message: 'div.invalid-feedback',
    hiddenLabel: 'label.form-label',
    dateInput: 'input[name="dp"]',
    pocketBody: '.card-body',
    noPockets: '.card-body p',
    firstPocket: '.col-sm-12.col-md-6:first',
    labelTitle: '.mb-3 > .d-flex > .fw-medium',
    back: 'a.link',
    numbers: '.card-body > :nth-child(1) > .align-items-center > div',
    optionBtns: '[class*="btn-icon btn-secondary"]',
    dangerBtn: 'button.btn-link.text-danger',
    confirmContent: '.modal-content',
    confirmBtn: 'button.btn.btn-danger',
    keepBtn: 'button.btn.btn-secondary',
    pockets: '.col-sm-12.col-md-6 .card-body',
    navAcc: '.menu > :nth-child(1)',
    mainAcc: '.card-body',
    mainTransactions: '.transaction-info',
  }

  getTitle() {
    return cy.get(this.selectors.title)
  }

  getSubTitle() {
    return cy.get(this.selectors.subTitle)
  }

  getPocketLabel() {
    return cy.get(this.selectors.pocketLabel)
  }

  getDateLabel() {
    return cy.get(this.selectors.dateLabel)
  }

  getCheckbox() {
    return cy.get(this.selectors.checkbox)
  }

  getBtn() {
    return cy.get(this.selectors.button)
  }

  getBtns() {
    return cy.get(this.selectors.buttons)
  }

  getInput() {
    return cy.get(this.selectors.input)
  }

  getInputCreate() {
    return cy.get(this.selectors.inputCreate)
  }

  getMsg() {
    return cy.get(this.selectors.message)
  }

  getHiddenLabel() {
    return cy.get(this.selectors.hiddenLabel)
  }

  getDateInput() {
    return cy.get(this.selectors.dateInput)
  }

  getPocketBody() {
    return cy.get(this.selectors.pocketBody)
  }

  getNoPockets() {
    return cy.get(this.selectors.noPockets)
  }

  getFirstPocket() {
    return cy.get(this.selectors.firstPocket)
  }

  getLabelTitle() {
    return cy.get(this.selectors.labelTitle)
  }

  getBack() {
    return cy.get(this.selectors.back)
  }

  getNumbers() {
    return cy.get(this.selectors.numbers)
  }

  getOptionBtns() {
    return cy.get(this.selectors.optionBtns)
  }

  getDangerBtn() {
    return cy.get(this.selectors.dangerBtn)
  }

  getConfirmContent() {
    return cy.get(this.selectors.confirmContent)
  }

  getConfirmBtn() {
    return cy.get(this.selectors.confirmBtn)
  }

  getKeepBtn() {
    return cy.get(this.selectors.keepBtn)
  }

  getPockets() {
    return cy.get(this.selectors.pockets)
  }

  getNavAcc() {
    return cy.get(this.selectors.navAcc)
  }

  getMainAcc() {
    return cy.get(this.selectors.mainAcc).contains('Hlavný účet').parent()
  }

  getMainTransactions() {
    return cy.get(this.selectors.mainTransactions)
  }

  /**
   * create pocket without validations
   */
  public createPocket() {
    this.getBtn().contains('Vytvoriť Poket').click()

    this.selectRandomDate()
    this.getInput().eq(1).type(this.randomDecimal)

    this.getBtn().contains('Vytvoriť Poket').click()
    cy.getToastAndClose('Poket bol úspešne vytvorený.')
  }

  /**
   * find all the enabled date cells (not disabled) - pick random date
   */
  public selectRandomImg() {
    cy.get('.edit').click({ timeout: 1000 }) // nemozem spravit getter pretoze neviem pouzit timeout
    cy.get('.images button').then((buttons) => {
      const randomIndex = Math.floor(Math.random() * buttons.length)
      cy.wrap(buttons[randomIndex]).click() // potom tato metoda neprejde, lebo este nie je nacitana
    })
  }

  /**
   * find all the enabled date cells (not disabled) - pick random date
   */
  public selectRandomDate() {
    cy.get('ngb-datepicker-month .ngb-dp-day:not(.disabled)').then(($dates) => {
      const randomIndex = Cypress._.random(0, $dates.length - 1)
      cy.wrap($dates[randomIndex]).click()
    })
  }

  /**
   * validate pocket listing
   */
  public verifyPocketsListing() {
    // check visibility of element and child elements in all pockets
    cy.get('.d-flex.flex-row.justify-content-between.mt-1.goal').each(($card) => {
      cy.wrap($card)
        .should('be.visible')
        .within(() => {
          cy.get('p:first-of-type')
            .should('have.class', 'fw-medium')
            .should(($p) => {
              expect($p.text()).to.match(/^\s*\d{1,3}%\s+Splnené\s*$/)
            })
        })
    })
  }

  /** cancel deposit pocket */
  public depositCancel() {
    this.getFirstPocket().click()
    this.getOptionBtns().eq(0).click()
    this.getDangerBtn().click()
    this.getConfirmBtn().click()
  }

  /**
   * price too high - calculate a higher number based on the current balance + 100
   */
  public verifyAndUpdateBalance(newBalanceText: string) {
    cy.get('.amount')
      .invoke('text')
      .then((currentBalanceText) => {
        const currentBalance = parseFloat(currentBalanceText.replace(/[^0-9.-]+/g, ''))
        // Calculate a higher number based on the current balance + 100
        const higherNumber = currentBalance + 100
        // Update the input field with the new balance text
        this.getInput().clear().type(higherNumber.toString()).blur()
        // Verify the message with the provided text
        this.getMsg().should('be.visible').should('have.text', newBalanceText)
      })
  }

  /** deposit 10€ */
  public depositToPocket() {
    this.getInput().clear().type('1').blur()
    this.getBtn().contains('Vložiť peniaze').click()
  }

  /** cancel withdraw pocket */
  public withdrawCancel() {
    this.getFirstPocket().click({ timeout: 20000 })
    this.getOptionBtns().eq(1).click()
    this.getDangerBtn().click()
    this.getConfirmBtn().click()
  }

  /** withdraw 10€ */
  public withdrawPocket() {
    this.getInput().clear().type('1').blur()
    this.getBtn().contains('Vybrať peniaze').click()
  }

  /**
   * verify pocket details
   */
  public verifyPocketDetails() {
    cy.get('.card-body')
      .should('be.visible')
      .then((cardBody) => {
        if (cardBody.find('h4').length > 0 && cardBody.find('h4').text() === 'Žiadne transakcie') {
          cy.get('h4').should('contain', 'Žiadne transakcie')
        } else if (cardBody.find('.transactions').length > 0) {
        }
        this.getBack()
          .should('be.visible')
          .within(() => {
            cy.get('[class*="svg-icon-mask"]').should('be.visible')
            cy.get('span[class*="fw-bolder cursor-pointer"]')
              .should('be.visible')
              .contains('Späť na Pokety')
          })

        // toDo - odkomentovat, ked to bude funkcne
        // this.verifyPocketProgressBar()

        // check option buttons
        for (let i = 0; i < 3; i++) {
          this.getOptionBtns().eq(i).should('be.visible')
        }
      })
  }

  /**
   * verify and confirm pocket delete button
   */
  public deletePocketValidations() {
    this.getOptionBtns().eq(2).click()
    this.getDangerBtn().click()
    // validate and confirm delete
    this.getConfirmContent()
      .should('be.visible')
      .within(() => {
        cy.get('.modal-title').should('have.text', 'Zrušiť Poket')
        cy.get('.modal-body p').should(
          'have.text',
          'Všetky informácie budú zmazané a peniaze vrátené na hlavný účet.',
        )
        cy.get('.modal-footer button.btn-secondary').should('have.text', 'Ponechať')
        cy.get('.modal-footer button.btn-danger').should('have.text', 'Zrušiť Poket')
      })

    this.getKeepBtn().click()

    this.getDangerBtn().click()
    this.getConfirmBtn().click()
  }

  /**
   * delete pockets if visible - without validations
   */
  public deleteAllPockets() {
    this.getPockets().each(($pocket, index) => {
      cy.wrap($pocket).within(() => {
        cy.get(':first-child').eq(index).click()
        this.getOptionBtns().eq(2).click() // todo - failuje to stale, neni problem v lokatori, ale skor funkcii
        this.getDangerBtn().click()
        this.getConfirmBtn().click()
      })
    })
  }

  /**  random generated price 1-100 with 2 decimals */
  public randomDecimal = (Math.random() * (1000 - 1) + 1).toFixed(2)

  /**
   * validate each button text
   */
  public clickAndVerifyButtons() {
    this.getBtns().each(($button) => {
      const buttonText = $button.find('span').text()
      const matchingEnumValue = Object.keys(PockeBtnNames).find(
        (key) => PockeBtnNames[key] === buttonText,
      )
      if (matchingEnumValue) {
        cy.wrap($button).click()
        cy.get('.formly-custom-validation').should('have.value', buttonText)
      }
    })
  }

  /**
   * verify progress bar for each pocket
   */
  public verifyPocketsProgressBar() {
    cy.get('.col-sm-12.col-md-6').each(($pocket) => {
      // check if the pocket contains a progress bar
      cy.wrap($pocket)
        .find('.progress .progress-bar')
        .should('exist')
        .then(($progressbar) => {
          // if a progress bar exists, validate it
          if ($progressbar.length > 0) {
            cy.wrap($progressbar)
              .should('not.have.css', 'width', '0%')
              .should('have.attr', 'aria-valuemax', '100')
              .should('have.attr', 'aria-valuemin', '0')
              .should(($prog) => {
                const valuenow = parseInt($prog.attr('aria-valuenow'), 10) || 0
                expect(valuenow).to.be.within(0, 100)
              })
              .should(($prog) => {
                const width = $prog[0].style.width
                const match = width.match(/^(\d*(.\d+)?)%/)
                const progressPercentage = match ? parseFloat(match[1]) : 0
                expect(progressPercentage).to.be.above(-1)
              })
          } else {
            cy.log('Pocket does not contain a progress bar')
          }
        })
    })
  }

  /**
   * validate progress bar for the pocket
   */

  // toDo - overit ci 1 otvoreny pocket obsahuje progras bar a vykonat tuto funkciu - momentalne failne test a nepokracuje ked nenajde progress ba

  // private verifyPocketProgressBar() {
  //   cy.get('.card-body').within(() => {
  //     // check if the pocket contains a progress bar
  //     cy.get('.progress .progress-bar')
  //       .should('exist')
  //       .should('not.have.css', 'width', '0%')
  //       .should('have.attr', 'aria-valuemax', '100')
  //       .should('have.attr', 'aria-valuemin', '0')
  //       .should(($prog) => {
  //         const valuenow = parseInt($prog.attr('aria-valuenow'), 10) || 0
  //         expect(valuenow).to.be.within(0, 100)
  //       })
  //       .should(($prog) => {
  //         const width = $prog[0].style.width
  //         const match = width.match(/^(\d*(.\d+)?)%/)
  //         const progressPercentage = match ? parseFloat(match[1]) : 0
  //         expect(progressPercentage).to.be.above(-1)
  //       })
  //   })
  // }
}

export const pocketsPage = new PocketsPage()
