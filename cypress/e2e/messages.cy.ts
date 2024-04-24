import { getMsgData } from '../data/client-data'
import { messagesPage } from '../page-objects/pages/MessagesPage'

describe('Messages test', () => {
  beforeEach(() => {
    cy.visit('/messages', { timeout: 5000 })
    messagesPage.getTitle().should('have.text', 'Správy').should('be.visible')
  })

  it.skip('should check no messages page', () => {
    // todo - it test pred vsetkym - vymazat vsetky spravy

    // cy.get(':nth-child(2) > #home-tab').click()
    // cy.wait(300)

    // cy.get('ib365-message-item-layout').each(($el) => {
    //   cy.wait(300)
    //   cy.wrap($el).click()
    //   cy.get('a[_ngcontent-ng-c726232533=""] > ib365-icon > .color-primary-text').click() // vymazanie
    //   cy.get('.btn-danger').click() // potvrdenie vymazania
    // })

    // cy.get('body').then((body) => {
    //   if (body.find('ib365-message-item-layout').length > 0) {
    //     cy.get('ib365-message-item-layout').click() // klikne na prvy item
    //     cy.get('a[_ngcontent-ng-c726232533=""] > ib365-icon > .color-primary-text').click() // vymazanie
    //     cy.get('.btn-danger').click() // potvrdenie vymazania
    //   } else {
    //     cy.log('continue test')
    //   }
    // })

    messagesPage.getNoMsgsImg().should('be.visible')
    messagesPage.getNoMsgsTitle().eq(1).should('have.text', 'Žiadne prijaté správy')
    messagesPage
      .getNoMsgsText()
      .eq(1)
      .should('have.text', 'Momentálne nemáte žiadne prijaté správy.')

    messagesPage
      .getNavTabs()
      .find('a.btn.btn-nav')
      .should(($buttons) => {
        expect($buttons).to.have.length(3)
        expect($buttons.eq(0)).to.have.text(' Prijaté ')
        expect($buttons.eq(1)).to.have.text(' Odoslané ')
        expect($buttons.eq(2)).to.have.text(' Koncepty ')
      })
  })

  it('should create new message', () => {
    // 371 + 368 + ERROR HANDLING EXCEL
    messagesPage.getNewMessage()
    messagesPage.getThreeDots().click()
    messagesPage.getDropdownNavMsgs().click()
    messagesPage.getNewMsgBtn().click()

    // title of message (Nadpis) - excel numbers
    messagesPage.getTitleMsgInput().clear().blur() // 82
    cy.getInvalidLabel().should('have.text', 'Musíte zadať nadpis správy.') // 82

    messagesPage.getTitleMsgInput().type('asd')
    cy.cancelInput()
    cy.getInvalidLabel().should('have.text', 'Musíte zadať nadpis správy.')

    cy.validateInput('Nadpis', 'x'.repeat(101), 'Maximálna dĺžka je 100 znakov.') // 81
    cy.validateInput('Nadpis', '漢', 'Používajte iba znaky latinskej abecedy a čísla.') // 80
    cy.validateInput('Nadpis', '!', "Používajte iba tieto špeciálne znaky: / - ? : ( ). , ' +") // 79
    messagesPage.getTitleMsgInput().clear().type(getMsgData.title).blur()

    // message text (Správa)
    messagesPage.getMsgInput().clear().blur() // 76
    cy.getInvalidLabel().should('have.text', 'Zadajte platnú správu.') // 76
    messagesPage.validateMsg('!', "Používajte iba tieto špeciálne znaky: / - ? : ( ). , ' +") // 77
    messagesPage.validateMsg('漢', 'Používajte iba znaky latinskej abecedy a čísla.') // 78
    // messagesPage.validateMsg('x'.repeat(501), 'Používajte iba znaky latinskej abecedy a čísla.') // for future use
    messagesPage.getMsgInput().clear().type(getMsgData.text).blur()

    // subject (Téma)
    messagesPage.getPrimaryBtn().click()
    cy.getInvalidLabel().should('have.text', 'Vyberte prosím tému konverzácie.') // 86
    messagesPage.getDropdownSubject().click()
    messagesPage.getDropdownSubjectItems().should('have.length', 29) // todo - enums ked to bude final verzia
    messagesPage.getDropdownSubjectFirst().click()

    // 6 - todo - BUG ?
    // const vid = 'videos/world.mp4'
    // messagesPage.getUploadFile().attachFile(vid)
    // messagesPage.getUploadProgress().not('exist')
    // cy.get('.content')
    //   .should('be.visible')
    //   .contains('Súbor sa nepodarilo nahrať: Media type video/mp4 is not allowed for upload.')
    // cy.get('ib365-icon[svgicon="close"]').should('be.visible').click() // make sure to close the toast - mp4 toast delayed for 2 seconds

    // cy.get('ib365-icon[svgicon="close"]', { timeout: 5000 }).should('be.visible').click()

    // 9
    const validPic = 'images/valid.png'
    messagesPage.getUploadFile().attachFile(validPic)
    messagesPage.getUploadFileName().contains('valid.png')

    messagesPage.getPrimaryBtn().scrollIntoView().click() // send message

    cy.getToastAndClose('Vaša správa bola odoslaná.')

    // saved message - correct subject, topic, date
    // todo - overenie subjectu(Téma) - ked pridam enumy, momentalne tam je neporiadok..
    // cy.get('.badge').should('have.text', getMsgData.subject)
    messagesPage.getMsgTitle().should('have.text', getMsgData.title)
    messagesPage.getMsgText().should('have.text', getMsgData.text)
    messagesPage.validateDate()
  })

  it('should save message as draft', () => {
    messagesPage.saveAsDraft()
    messagesPage.editAndSaveDraft()
    messagesPage.getDrafts().first().invoke('text').should('include', getMsgData.editTitle) // je v css medzera pred nazvom title, preto invoke/include riesenie
  })

  it('should navigate and view messages', () => {
    // 373 - todo - ak je prazndy inbox, poslat z eapp spravu, nech nie je inbox prazdny, potrebne pre tento test
    messagesPage.getSentMessage()
    messagesPage.getDraftMessage()
    messagesPage.getInboxMessage()
    messagesPage.getSentAndInboxMsgs().should('be.visible')
  })

  it('should delete message', () => {
    messagesPage.deleteSentMessage()
    messagesPage.getModalTitle().should('have.text', 'Chcete zmazať konverzáciu?')
    messagesPage
      .getModalBody()
      .should(
        'have.text',
        'Ak už máte všetky potrebné odpovede, môžete zmazať celú konverzáciu. Inak ju odporúčame ponechať.',
      )
    messagesPage.confirmDeleteMessage()
    cy.getToastAndClose('Vaša správa bola úspešne zmazaná.')
  })
})
