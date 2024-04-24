import BasePage from '../BasePage'

export class CardsPage extends BasePage {
  selectors = {
    title: 'ib365-header h1',
    emptyCards: 'ib365-result-screen',
    cardPreview: 'ib365-card-preview',
    cardActivateBtn: '.texts',
    confirmBtn: '.btn-primary',
    cvv: '#cvv',
    details: '.bank-card__sides',
    clickableOptions: '.card-body .item.clickable',
    back: 'a.link',
    backBtnText: '.back-link .fw-bolder',
    purpleBannerText: '.alert.alert-info',
    purpleBtnClose: '.btn-close',
    saveBtn: 'button[type=submit]',
    inputLimit: 'input[type="text"]',
    label: 'label',
    smallText: 'small.form-text.text-muted',
    resultTitle: '.card-body .result-screen .pt-4',
    resultImg: '.card-body img',
    resultText: '.card-body .result-screen .m-0',
  }

  getTitle() {
    return cy.get(this.selectors.title)
  }

  getEmptyCards() {
    return cy.get(this.selectors.emptyCards)
  }

  getCardPreview() {
    return cy.get(this.selectors.cardPreview)
  }

  getCardActivateBtn() {
    return cy.get(this.selectors.cardActivateBtn)
  }

  getConfirmBtn() {
    return cy.get(this.selectors.confirmBtn)
  }

  getCvv() {
    return cy.get(this.selectors.cvv)
  }

  getDetails() {
    return cy.get(this.selectors.details)
  }

  getClickableOptions() {
    return cy.get(this.selectors.clickableOptions)
  }

  getBack() {
    return cy.get(this.selectors.back)
  }

  getBackBtnText() {
    return cy.get(this.selectors.backBtnText)
  }

  getPurpleBannerText() {
    return cy.get(this.selectors.purpleBannerText)
  }

  getPurpleBtnClose() {
    return cy.get(this.selectors.purpleBtnClose)
  }

  getSaveBtn() {
    return cy.get(this.selectors.saveBtn)
  }

  getInputLimit() {
    return cy.get(this.selectors.inputLimit)
  }

  getLabel() {
    return cy.get(this.selectors.label)
  }

  getSmallText() {
    return cy.get(this.selectors.smallText)
  }

  getResultTitle() {
    return cy.get(this.selectors.resultTitle)
  }

  getResultImg() {
    return cy.get(this.selectors.resultImg)
  }

  getResultText() {
    return cy.get(this.selectors.resultText)
  }
}

export const randomNumber = Math.floor(Math.random() * 10001)
export const randomNumberTo10k = randomNumber.toString()

export const cardsPage = new CardsPage()
