import { getMsgData } from '../../data/client-data'
import BasePage from '../BasePage'

export class MessagesPage extends BasePage {
  selectors = {
    title: 'ib365-header:not(.d-md-none) h1',
    noMsgsImg: 'div.result-screen img',
    noMsgsTitle: 'div.result-screen h2',
    noMsgsText: 'div.result-screen p.text-primary',
    newMsgBtn: '.col-12 > .btn',
    titleMsgInput: 'input[placeholder="Napíšte predmet"]',
    msgInput: 'textarea[placeholder="Napíšte nejaký text"]',
    primaryBtn: '.btn-primary',
    threeDots: ':nth-child(5) > .btn',
    backBtn: '.btn-secondary',
    confimDelete: '.btn-danger',
    navTabs: 'ul.nav-tabs',
    dropdownNavMsgs: '.dropdown-toggle.show > .dropdown-menu > :nth-child(2)',
    dropdownSubject: 'button.btn-dropdown',
    dropdownSubjectItems: 'div.dropdown-menu button.dropdown-item',
    dropdownSubjectFirst: '.mb-3 > .dropdown > .dropdown-menu > :nth-child(2)',
    dropdownSubjectThird: '.mb-3 > .dropdown > .dropdown-menu > :nth-child(4)',
    firstMsg: '.card-body > :nth-child(1)',
    uploadFile: 'input[type="file"]',
    uploadProgress: '.progress-bar',
    uploadFileName: '.fileInput__name',
    modalTitle: '.modal-title',
    modalBody: '.modal-body',
    modalWindow: 'ngb-modal-window',
    msgTitle: '.col-12 > .mb-3',
    msgText: '.message__description',
    saveDraftBtn: '.btn-link',
    drafts: '.messages__item__data__subject',
    sentNavMsgs: ':nth-child(2) > #home-tab',
    sentAndInboxMsgs: '.flex-grow-1 > .text-body-secondary',
    stepBack: '.ps-2',
    navDrafts: ':nth-child(3) > #home-tab',
    navInbox: ':nth-child(1) > #home-tab',
    deleteIcon: 'a.link ib365-icon[svgicon="trash"]',
  }

  getTitle() {
    return cy.get(this.selectors.title)
  }

  getNoMsgsImg() {
    return cy.get(this.selectors.noMsgsImg)
  }

  getNoMsgsTitle() {
    return cy.get(this.selectors.noMsgsTitle)
  }

  getNoMsgsText() {
    return cy.get(this.selectors.noMsgsText)
  }

  getNewMsgBtn() {
    return cy.get(this.selectors.newMsgBtn)
  }

  getTitleMsgInput() {
    return cy.get(this.selectors.titleMsgInput)
  }

  getMsgInput() {
    return cy.get(this.selectors.msgInput)
  }

  getPrimaryBtn() {
    return cy.get(this.selectors.primaryBtn)
  }

  getThreeDots() {
    return cy.get(this.selectors.threeDots)
  }

  getBackBtn() {
    return cy.get(this.selectors.backBtn)
  }

  getConfimDelete() {
    return cy.get(this.selectors.confimDelete)
  }

  getNavTabs() {
    return cy.get(this.selectors.navTabs)
  }

  getDropdownNavMsgs() {
    return cy.get(this.selectors.dropdownNavMsgs)
  }

  getDropdownSubject() {
    return cy.get(this.selectors.dropdownSubject)
  }

  getDropdownSubjectItems() {
    return cy.get(this.selectors.dropdownSubjectItems)
  }

  getDropdownSubjectFirst() {
    return cy.get(this.selectors.dropdownSubjectFirst)
  }

  getDropdownSubjectThird() {
    return cy.get(this.selectors.dropdownSubjectThird)
  }

  getFirstMsg() {
    return cy.get(this.selectors.firstMsg)
  }

  getUploadFile() {
    return cy.get(this.selectors.uploadFile)
  }

  getUploadProgress() {
    return cy.get(this.selectors.uploadProgress)
  }

  getUploadFileName() {
    return cy.get(this.selectors.uploadFileName)
  }

  getModalTitle() {
    return cy.get(this.selectors.modalTitle)
  }

  getModalBody() {
    return cy.get(this.selectors.modalBody)
  }

  getModalWindow() {
    return cy.get(this.selectors.modalWindow)
  }

  getMsgTitle() {
    return cy.get(this.selectors.msgTitle)
  }

  getMsgText() {
    return cy.get(this.selectors.msgText)
  }

  getSaveDraftBtn() {
    return cy.get(this.selectors.saveDraftBtn).last()
  }

  getDrafts() {
    return cy.get(this.selectors.drafts)
  }

  getSentNavMsgs() {
    return cy.get(this.selectors.sentNavMsgs)
  }

  getSentAndInboxMsgs() {
    return cy.get(this.selectors.sentAndInboxMsgs)
  }

  getStepBack() {
    return cy.get(this.selectors.stepBack)
  }

  getNavDrafts() {
    return cy.get(this.selectors.navDrafts)
  }

  getNavInbox() {
    return cy.get(this.selectors.navInbox)
  }

  getDeleteIcon() {
    return cy.get(this.selectors.deleteIcon)
  }

  /*
   * validate message
   */
  public validateMsg(inputText: string, expectedText: string) {
    messagesPage.getMsgInput().clear().type(inputText).blur()
    cy.getInvalidLabel().should('have.text', expectedText)
  }

  public getToastAndClose(text: string) {
    cy.get('.toast-body', { timeout: 15000 })
      .should('be.visible')
      .within(() => {
        cy.get('.content').should('have.text', text)
        cy.get('ib365-icon[svgicon="close"]').click()
      })
  }

  /*
   * saved message - correct subject, topic, date
   */
  public validateDate() {
    cy.get('.messages__item__data__date')
      .invoke('text')
      .then((text) => {
        const currentDate = new Date()
        const formattedCurrentDate = `${this.getDayName(
          currentDate,
        )} ${currentDate.getDate()}. ${this.getMonthName(
          currentDate,
        )} ${currentDate.getFullYear()} o ${currentDate.getHours()}:${this.padMinutes(
          currentDate.getMinutes(),
        )}`
        const trimmedText = text.trim()
        const trimmedFormattedCurrentDate = formattedCurrentDate.trim()
        expect(trimmedText).to.equal(trimmedFormattedCurrentDate)
      })
  }

  private getMonthName(date: Date) {
    const months = [
      'januára',
      'februára',
      'marca',
      'apríla',
      'mája',
      'júna',
      'júla',
      'augusta',
      'septembra',
      'októbra',
      'novembra',
      'decembra',
    ]
    return months[date.getMonth()]
  }

  private getDayName(date: Date) {
    const days = ['nedeľa', 'pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota']
    return days[date.getDay()]
  }

  private padMinutes(minutes: number) {
    return minutes < 10 ? `0${minutes}` : `${minutes}`
  }

  // 371 + 368 + ERROR HANDLING EXCEL
  public getNewMessage() {
    messagesPage.getThreeDots().click()
    messagesPage.getDropdownNavMsgs().click()
    messagesPage.getNewMsgBtn().click()
  }

  // 371 + 370
  public saveAsDraft() {
    // 2
    messagesPage.getNewMsgBtn().click()

    // 4
    messagesPage.getDropdownSubject().click()
    messagesPage.getDropdownSubjectFirst().click()
    messagesPage.getTitleMsgInput().clear().type(getMsgData.title).blur()
    messagesPage.getMsgInput().clear().type(getMsgData.text).blur()
    messagesPage.getSaveDraftBtn().click()
  }

  // 371 + 370
  public editAndSaveDraft() {
    // 5
    messagesPage.getDrafts().should('not.have.text', '')
    messagesPage.getFirstMsg().click()
    messagesPage.getDropdownSubject().click()
    messagesPage.getDropdownSubjectThird().click()
    messagesPage.getTitleMsgInput().clear().type(getMsgData.editTitle).blur()
    messagesPage.getMsgInput().clear().type(getMsgData.editText).blur()
    messagesPage.getSaveDraftBtn().click()
  }

  // 373 - 1-4
  public getSentMessage() {
    // 1
    this.getThreeDots().click()
    this.getDropdownNavMsgs().click()

    // 2
    this.getSentNavMsgs().click()

    // 3
    this.getSentAndInboxMsgs().should('not.have.text', '')
    this.getFirstMsg().click()

    // 4
    this.getStepBack().click()
  }

  // 373 - 5-7
  public getDraftMessage() {
    // 5
    this.getNavDrafts().click()

    // 6
    this.getDrafts().should('not.have.text', '')
    this.getFirstMsg().click()

    // 7
    this.getSaveDraftBtn().click()
  }

  // 373 - 8-10
  public getInboxMessage() {
    // 8
    this.getNavInbox().click()

    // 9
    this.getSentAndInboxMsgs().should('be.visible')
    this.getFirstMsg().click()

    // 10
    this.getStepBack().click()
  }

  // 372 - 1-3
  public deleteSentMessage() {
    // 1 - already implemented

    // 2 - delete message is set for sent, if i want to delete inbox message, use this  instead:
    // cy.get(':nth-child(1) > #home-tab').click()
    this.getSentNavMsgs().click()
    this.getSentAndInboxMsgs().should('not.have.text', '')
    this.getFirstMsg().click()

    // 3
    this.getDeleteIcon().click()
  }

  // 372 - 4-6
  public confirmDeleteMessage() {
    // 4
    this.getBackBtn().click()

    // 5
    this.getDeleteIcon().click()

    // 6
    this.getConfimDelete().click()
  }
}

export const messagesPage = new MessagesPage()
