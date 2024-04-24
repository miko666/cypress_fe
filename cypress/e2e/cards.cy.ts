import { cardsPage, randomNumberTo10k } from '../page-objects/pages/CardsPage'

describe('Cards test', () => {
  beforeEach(() => {
    cy.visit('/cards', { timeout: 5000 })
    cardsPage.getTitle().should('have.text', 'Karty').should('be.visible')
  })

  it('should display empty cards page', () => {
    // todo - should check if the first card is "Neaktívna" -
    // VYJADRENIE - vymazanie kariet neexistuje (pridat vymazanie vsetkych kariet pred tym nez sa pusti tento test)

    // add view cards no cards - 303
    cardsPage.getEmptyCards().find('img').should('be.visible')
    cardsPage.getEmptyCards().find('h2').contains('Žiadne karty').should('be.visible')
    cardsPage
      .getEmptyCards()
      .contains('Momentálne nemáte k vašim účtom priradené žiadne karty.')
      .should('be.visible')
  })

  it('should view card details', () => {
    // 304
    cardsPage.getDetails().each(($card) => {
      cy.wrap($card).within(() => {
        cy.get('.bank-card__logos__365-bank').should('be.visible')
        cy.get('.bank-card__logos__master-card').should('be.visible')
        cy.get('.card-holder').should('be.visible')
        cy.get('.card-expiration-label').should('be.visible')
        cy.get('.card-expiration-date').should('be.visible')

        // 331
        cy.get('.card-number').should('be.visible').and('contain', '•••• •••• ••••')
      })
    })
  })

  it('should activate card - Inactive', () => {
    // todo - prejst na NEaktivna - momentalne zoberie prvu kartu ked realoadne page

    cardsPage
      .getCardPreview()
      .find('.bank-card__overlay__container__badge')
      .should('have.text', 'Neaktívna')

    cardsPage.getCardActivateBtn().contains('Aktivovať').click()

    // add shorther CCV - 336
    cardsPage.getCvv().clear().type('12')
    cardsPage.getConfirmBtn().contains('Aktivovať').should('have.attr', 'disabled')

    // add incorrect CCV - 310
    cardsPage.getCvv().clear().type('123')
    cardsPage.getConfirmBtn().contains('Aktivovať').click()
    cy.getToastAndClose('Žiadosť o aktiváciu bola neúspešná.')

    // add correct CCV - 332
    cardsPage.getCvv().clear().type('124')
    cardsPage.getConfirmBtn().contains('Aktivovať').click()
    cy.getToastAndClose('Žiadosť o aktiváciu bola úspešná.')
  })

  it('should check if the first card is Inactive', () => {
    // toDo - lokator je ok, no padne to v try catch ked je text iný ako na prvej karte

    // cy.get('ib365-card-preview').find('.text-primary').eq(0).should('have.text', 'Zamknutá')
    // cy.log('OK')

    try {
      // ked nenajde tento riadok, test failne
      cy.get('ib365-card-preview').find('.text-primary').eq(0).should('have.text', 'Zamknutá')
      cy.log('OK')
      // vykonat zvysok testu ak je karta v stave "Neaktívna"
    } catch (err) {
      cy.log('card status "Zamknutá" is not visible')
      // test ked je karta v inom stave ako "Neaktívna"
    }
  })

  it('should check Active card deatils', () => {
    // 605
    // todo - prejst na aktivna - momentalne zoberie prvu kartu ked realoadne page

    // check details of active card
    cy.get('.card-body .item').each(($el, index, $list) => {
      if (index === 0) {
        cy.wrap($el).find('input[type="checkbox"]').should('be.visible').should('not.be.checked')
      } else {
        const itemText = $el.find('h4').text()
        if (
          itemText === 'Výdavkové limity' ||
          itemText === 'Vymeňte kartu' ||
          itemText === 'Obnoviť PIN'
        ) {
          cy.wrap($el).contains(itemText).should('be.visible')
        }
      }
    })
  })

  it('should check Locked card deatils', () => {
    // 335
    // todo - prejst na aktivna - momentalne zoberie prvu kartu ked realoadne page

    cy.get('.card-body .item').first().find('input[type="checkbox"]').click().should('be.checked')
    cy.get('.text-primary:contains("Zamknutá")').should('exist')

    // Toldy Michal co to kodil, nevie ake css pouzit pri overeni aktivhej(zelenej) a neaktivej(sivej) karte
    // todo - cy.get('.bank-card--master-card').should('have.css', 'background-color', 'rgb(192, 192, 192)')

    cy.get('.alert.show').should('contain', 'Chýba karta alebo je poškodená?')
    cy.get('h4').should('contain', 'Zamknúť kartu').should('be.visible')
    cy.get('h4').should('contain', 'Vymeňte kartu').should('be.visible')
    cy.get('body').should('not.contain', 'Spending Limits')
  })

  it('should check Lock card deatils', () => {
    // 333
    // todo - prejst na aktivna - momentalne zoberie prvu kartu ked realoadne page

    // check details of active card
    cy.get('.card-body .item').each(($el, index, $list) => {
      if (index === 0) {
        cy.wrap($el).find('input[type="checkbox"]').should('be.visible').should('be.checked')
        cy.get('.card-body .item')
          .first()
          .find('input[type="checkbox"]')
          .click()
          .should('not.be.checked')
      } else {
        const itemText = $el.find('h4').text()
        if (
          itemText === 'Výdavkové limity' ||
          itemText === 'Vymeňte kartu' ||
          itemText === 'Obnoviť PIN'
        ) {
          cy.wrap($el).contains(itemText).should('be.visible')
        }
      }
    })
  })

  it('should replace - cancel', () => {
    // 337
    // todo - prejst na aktivna - momentalne zoberie prvu kartu ked realoadne page

    cardsPage.getClickableOptions().contains('Vymeňte kartu').click()

    cardsPage
      .getClickableOptions()
      .should('have.length', 3)
      .each(($item, index) => {
        const expectedText = [
          'Stratená karta',
          'Ukradnutá karta',
          'Poškodená karta, alebo zmena mena',
        ]
        expect($item).to.contain(expectedText[index])
      })

    cardsPage.getBack().contains('Späť na Karty').click()
  })

  it('should replace > options - cancel', () => {
    // 319
    // todo - prejst na aktivna - momentalne zoberie prvu kartu ked realoadne page

    // 1
    cardsPage.getClickableOptions().contains('Vymeňte kartu').click()
    cardsPage
      .getClickableOptions()
      .should('have.length', 3)
      .each(($item, index) => {
        const expectedText = [
          'Stratená karta',
          'Ukradnutá karta',
          'Poškodená karta, alebo zmena mena',
        ]
        expect($item).to.contain(expectedText[index])
      })
    cardsPage.getBack().contains('Späť na Karty')

    // 2
    // Stratená karta
    cardsPage.getClickableOptions().contains('Stratená karta').click()
    cardsPage.getBackBtnText().should('have.text', 'Späť na Výmenu karty')
    cardsPage
      .getPurpleBannerText()
      .should('be.visible')
      .contains('Vaša karta bude zrušená')
      .parent()
      .contains('Ako bezpečnostné opatrenie bude aktuálna karta okamžite zrušená.')
    cardsPage.getPurpleBtnClose().should('be.visible')
    // cardsPage.getSaveBtn().should('be.disabled').and('have.text', 'Objednať novú kartu')

    // 3
    cy.get('formly-field ib365-input label.form-label')
      .should('have.length', 3)
      .each(($label, index) => {
        cy.wrap($label).should('have.text', ['Ulica a číslo domu', 'PSČ', 'Obec'][index])
      })

    cardsPage.getBack().contains('Späť na Výmenu karty').click()

    // 4
    // Ukradnutá karta
    cardsPage.getClickableOptions().contains('Ukradnutá karta').click()
    cardsPage.getBackBtnText().should('have.text', 'Späť na Výmenu karty')
    cardsPage
      .getPurpleBannerText()
      .should('be.visible')
      .contains('Vaša karta bude zrušená')
      .parent()
      .contains('Ako bezpečnostné opatrenie bude aktuálna karta okamžite zrušená.')
    cardsPage.getPurpleBtnClose().should('be.visible')

    // TC - not visible, on web test visible
    // cardsPage.getSaveBtn().should('be.disabled').and('have.text', 'Objednať novú kartu')

    // 5
    cy.get('formly-field ib365-input label.form-label')
      .should('have.length', 3)
      .each(($label, index) => {
        cy.wrap($label).should('have.text', ['Ulica a číslo domu', 'PSČ', 'Obec'][index])
      })

    cardsPage.getBack().contains('Späť na Výmenu karty').click()

    // 6
    // Poškodená karta, ale zmena mena
    cardsPage.getClickableOptions().contains('Poškodená karta, alebo zmena mena').click()
    cardsPage.getBackBtnText().should('have.text', 'Späť na Výmenu karty')
    cardsPage
      .getPurpleBannerText()
      .should('be.visible')
      .contains('Vaša karta zostane aktívna')
      .parent()
      .contains('Aktuálna karta bude platiť kým vám bude doručená nová.')
    cardsPage.getPurpleBtnClose().should('be.visible')
    // cardsPage.getSaveBtn().should('be.disabled').and('have.text', 'Objednať novú kartu')

    // 6
    cy.get('formly-field ib365-input label.form-label')
      .should('have.length', 3)
      .each(($label, index) => {
        cy.wrap($label).should('have.text', ['Ulica a číslo domu', 'PSČ', 'Obec'][index])
      })
  })

  it('should order lost card', () => {
    // 317, 339
    // 1
    cardsPage.getClickableOptions().contains('Vymeňte kartu').click()
    cardsPage
      .getClickableOptions()
      .should('have.length', 3)
      .each(($item, index) => {
        const expectedText = [
          'Stratená karta',
          'Ukradnutá karta',
          'Poškodená karta, alebo zmena mena',
        ]
        expect($item).to.contain(expectedText[index])
      })
    cardsPage.getBack().contains('Späť na Karty')

    // 2
    // Stratená karta
    cardsPage.getClickableOptions().contains('Stratená karta').click()
    cardsPage.getBackBtnText().should('have.text', 'Späť na Výmenu karty')
    cardsPage
      .getPurpleBannerText()
      .should('be.visible')
      .contains('Vaša karta bude zrušená')
      .parent()
      .contains('Ako bezpečnostné opatrenie bude aktuálna karta okamžite zrušená.')
    cardsPage.getPurpleBtnClose().should('be.visible')
    cardsPage.getSaveBtn().should('be.visible').and('have.text', 'Objednať novú kartu')

    // 3
    cy.get('formly-field ib365-input label.form-label')
      .should('have.length', 3)
      .each(($label, index) => {
        cy.wrap($label).should('have.text', ['Ulica a číslo domu', 'PSČ', 'Obec'][index])
      })
    cardsPage.getSaveBtn().should('have.text', 'Objednať novú kartu').click()

    // BUG - BLOCKED
    cy.getToastAndClose('Žiadosť o novú kartu bola odoslaná.')
  })

  it('should order lost card', () => {
    // 328
    // 1
    cardsPage.getClickableOptions().contains('Vymeňte kartu').click()
    cardsPage
      .getClickableOptions()
      .should('have.length', 3)
      .each(($item, index) => {
        const expectedText = [
          'Stratená karta',
          'Ukradnutá karta',
          'Poškodená karta, alebo zmena mena',
        ]
        expect($item).to.contain(expectedText[index])
      })
    cardsPage.getBack().contains('Späť na Karty')

    // 2
    // Stratená karta
    cardsPage.getClickableOptions().contains('Poškodená karta, alebo zmena mena').click()
    cardsPage.getBackBtnText().should('have.text', 'Späť na Výmenu karty')
    cardsPage
      .getPurpleBannerText()
      .should('be.visible')
      .contains('Vaša karta zostane aktívna')
      .parent()
      .contains('Aktuálna karta bude platiť kým vám bude doručená nová.')
    cardsPage.getPurpleBtnClose().should('be.visible')
    cardsPage.getSaveBtn().should('be.visible').and('have.text', 'Objednať novú kartu')

    // 3
    cy.get('formly-field ib365-input label.form-label')
      .should('have.length', 3)
      .each(($label, index) => {
        cy.wrap($label).should('have.text', ['Ulica a číslo domu', 'PSČ', 'Obec'][index])
      })
    cardsPage.getSaveBtn().should('have.text', 'Objednať novú kartu').click()

    // BUG - BLOCKED
    cy.getToastAndClose('Žiadosť o novú kartu bola odoslaná.')
  })

  it('should check limits', () => {
    // todo - prejst na aktivna - momentalne zoberie prvu kartu ked realoadne page

    // 340
    cardsPage.getClickableOptions().contains('Výdavkové limity').click()
    cardsPage.getClickableOptions().contains('Výbery z bankomatov').click()
    cardsPage.getInputLimit().clear().type(randomNumberTo10k)
    cardsPage.getInputLimit().clear()
  })

  it('should check limits - amount min, max', () => {
    // todo - prejst na aktivna - momentalne zoberie prvu kartu ked realoadne page

    // 329
    cardsPage.getClickableOptions().contains('Výdavkové limity').click()
    cardsPage
      .getClickableOptions()
      .should('have.length', 3)
      .each(($item, index) => {
        const expectedText = ['Výbery z bankomatov', 'Platby v obchode', 'Online platby']
        expect($item).to.contain(expectedText[index])
      })
    cardsPage.getClickableOptions().contains('Výbery z bankomatov').click()
    cardsPage.getInputLimit().clear().type('0')
    cardsPage.getInputLimit().clear().type('10000')
    cardsPage.getSaveBtn().click()
  })

  it('should check each limit option ', () => {
    // todo - prejst na aktivna - momentalne zoberie prvu kartu ked realoadne page

    // 305

    // 1
    cardsPage.getClickableOptions().contains('Vymeňte kartu').click()
    cardsPage
      .getClickableOptions()
      .should('have.length', 3)
      .each(($item, index) => {
        const expectedText = [
          'Stratená karta',
          'Ukradnutá karta',
          'Poškodená karta, alebo zmena mena',
        ]
        expect($item).to.contain(expectedText[index])
      })

    // 2
    cardsPage.getClickableOptions().contains('Poškodená karta, alebo zmena mena').click()
    cardsPage.getBackBtnText().should('have.text', 'Späť na Výmenu karty')
    cardsPage
      .getPurpleBannerText()
      .should('be.visible')
      .contains('Vaša karta zostane aktívna')
      .parent()
      .contains('Aktuálna karta bude platiť kým vám bude doručená nová.')
    cardsPage.getPurpleBtnClose().should('be.visible')
    cardsPage.getSaveBtn().should('have.text', 'Objednať novú kartu')

    cy.get('formly-field ib365-input label.form-label')
      .should('have.length', 3)
      .each(($label, index) => {
        cy.wrap($label).should('have.text', ['Ulica a číslo domu', 'PSČ', 'Obec'][index])
      })

    // 3
    cardsPage.getSaveBtn().should('have.text', 'Objednať novú kartu').click()
    // cy.getToastAndClose('Žiadosť o novú kartu bola odoslaná.')

    // 4
    // BUG - BLOCKED
  })

  it('should check limits - limit boundaries', () => {
    // todo - prejst na aktivna - momentalne zoberie prvu kartu ked realoadne page

    // 320

    // 1
    cardsPage.getClickableOptions().contains('Výdavkové limity').click()
    cardsPage.getClickableOptions().contains('Výbery z bankomatov').click()

    cardsPage.getBack().should('have.text', 'Späť na Výdavkové limity')
    cardsPage.getLabel().should('have.text', 'Limit pre výber z bankomatu')
    cardsPage.getInputLimit().should('be.visible')
    cardsPage.getSmallText().should('have.text', 'Maximálne povolený 10 000 €')
    cardsPage.getSaveBtn().should('be.visible')

    // 2
    cardsPage.getInputLimit().clear().type('10001')
    cardsPage.getSaveBtn().should('be.disabled')

    // 3
    cardsPage.getInputLimit().clear().type('0')
    cardsPage.getSaveBtn().click()
    cy.getToastAndClose('Limit na karte bol zmenený.')

    // 4
    cardsPage.getBack().contains('Späť na Výdavkové limity').click()
    cardsPage.getClickableOptions().contains('Platby v obchode').click()

    cardsPage.getBack().should('have.text', 'Späť na Výdavkové limity')
    cardsPage.getLabel().should('have.text', 'Limit pre platbu v obchode')
    cardsPage.getInputLimit().should('be.visible')
    cardsPage.getSmallText().should('have.text', 'Maximálne povolený 10 000 €')
    cardsPage.getSaveBtn().should('be.visible')

    // 5
    cardsPage.getInputLimit().clear().type('10001')
    cardsPage.getSaveBtn().should('be.disabled')

    // 6
    cardsPage.getInputLimit().clear().type('0')
    cardsPage.getSaveBtn().click()
    cy.getToastAndClose('Limit na karte bol zmenený.')

    // 7
    cardsPage.getBack().contains('Späť na Výdavkové limity').click()
    cardsPage.getClickableOptions().contains('Online platby').click()

    cardsPage.getBack().should('have.text', 'Späť na Výdavkové limity')
    cardsPage.getLabel().should('have.text', 'Limit pre online platbu')
    cardsPage.getInputLimit().should('be.visible')
    cardsPage.getSmallText().should('have.text', 'Maximálne povolený 10 000 €')
    cardsPage.getSaveBtn().should('be.visible')

    // 8
    cardsPage.getInputLimit().clear().type('10001')
    cardsPage.getSaveBtn().should('be.disabled')

    // 9
    cardsPage.getInputLimit().clear().type('0')
    cardsPage.getSaveBtn().click()
    cy.getToastAndClose('Limit na karte bol zmenený.')
  })

  it('should check limits - spending limit update', () => {
    // todo - prejst na aktivna - momentalne zoberie prvu kartu ked realoadne page

    // 571

    // 3
    cardsPage.getClickableOptions().contains('Výdavkové limity').click()
    cardsPage
      .getClickableOptions()
      .should('have.length', 3)
      .each(($item, index) => {
        const expectedText = ['Výbery z bankomatov', 'Platby v obchode', 'Online platby']
        expect($item).to.contain(expectedText[index])
      })

    // 4
    cardsPage.getClickableOptions().contains('Výbery z bankomatov').click()

    // 5
    cardsPage.getInputLimit().clear().type(randomNumberTo10k)

    // 6
    cardsPage.getSaveBtn().click()

    // 7
    cardsPage.getResultTitle().should('have.text', 'Výborne!')
    cardsPage.getResultImg().should('be.visible')
    cardsPage.getResultText().should('have.text', 'Limit na karte bol zmenený.')
    cardsPage.getConfirmBtn().should('be.visible')
    cy.getToastAndClose('Limit na karte bol zmenený.')

    // 8
    cardsPage.getConfirmBtn().click()

    // 9
    cardsPage.getClickableOptions().contains('Výdavkové limity').click()
    cardsPage.getClickableOptions().contains('Platby v obchode').click()

    cardsPage.getInputLimit().clear().type(randomNumberTo10k)

    // 10
    cardsPage.getSaveBtn().click()

    // 11
    cardsPage.getResultTitle().should('have.text', 'Výborne!')
    cardsPage.getResultImg().should('be.visible')
    cardsPage.getResultText().should('have.text', 'Limit na karte bol zmenený.')
    cardsPage.getConfirmBtn().should('be.visible')
    cy.getToastAndClose('Limit na karte bol zmenený.')

    // 12
    cardsPage.getBack().contains('Späť na Výdavkové limity').click()
    cardsPage.getClickableOptions().contains('Online platby').click()

    // 13
    cardsPage.getInputLimit().clear().type(randomNumberTo10k)

    // 14
    cardsPage.getSaveBtn().click()

    // 15
    cardsPage.getResultTitle().should('have.text', 'Výborne!')
    cardsPage.getResultImg().should('be.visible')
    cardsPage.getResultText().should('have.text', 'Limit na karte bol zmenený.')
    cardsPage.getConfirmBtn().should('be.visible')
    cy.getToastAndClose('Limit na karte bol zmenený.')
  })

  it('should replace lost card', () => {
    // 325
    // todo - prejst na aktivna - momentalne zoberie prvu kartu ked realoadne page

    // 1
    cardsPage.getClickableOptions().contains('Vymeňte kartu').click()
    cardsPage
      .getClickableOptions()
      .should('have.length', 3)
      .each(($item, index) => {
        const expectedText = [
          'Stratená karta',
          'Ukradnutá karta',
          'Poškodená karta, alebo zmena mena',
        ]
        expect($item).to.contain(expectedText[index])
      })
    cardsPage.getBack().contains('Späť na Karty')

    cardsPage.getClickableOptions().contains('Stratená karta').click()
    cardsPage.getBackBtnText().should('have.text', 'Späť na Výmenu karty')
    cardsPage
      .getPurpleBannerText()
      .should('be.visible')
      .contains('Vaša karta bude zrušená')
      .parent()
      .contains('Ako bezpečnostné opatrenie bude aktuálna karta okamžite zrušená.')
    cardsPage.getPurpleBtnClose().should('be.visible')
    // cardsPage.getSaveBtn().should('be.disabled').and('have.text', 'Objednať novú kartu')

    cy.get('formly-field ib365-input label.form-label')
      .should('have.length', 3)
      .each(($label, index) => {
        cy.wrap($label).should('have.text', ['Ulica a číslo domu', 'PSČ', 'Obec'][index])
      })

    // 3
    cardsPage.getSaveBtn().should('have.text', 'Objednať novú kartu').click()
    cy.getToastAndClose('Žiadosť o novú kartu bola odoslaná.')

    // 4
    // BUG - BLOCKED
  })

  it('should view details of lost card', () => {
    // 309 - Toldy Michal co to kodil, nevie ake css pouzit pri overeni aktivhej(zelenej) a neaktivej(sivej) karte
    // todo - prejst na zrusena - momentalne zoberie prvu kartu ked realoadne page

    cy.get('.bank-card--master-card').should('have.css', 'opacity', '0.5')
  })

  it('should replace stolen card', () => {
    // 342
    // todo - prejst na aktivna - momentalne zoberie prvu kartu ked realoadne page

    // 1
    cardsPage.getClickableOptions().contains('Vymeňte kartu').click()
    cardsPage
      .getClickableOptions()
      .should('have.length', 3)
      .each(($item, index) => {
        const expectedText = [
          'Stratená karta',
          'Ukradnutá karta',
          'Poškodená karta, alebo zmena mena',
        ]
        expect($item).to.contain(expectedText[index])
      })

    // 2
    cardsPage.getClickableOptions().contains('Stratená karta').click()
    cardsPage.getBackBtnText().should('have.text', 'Späť na Výmenu karty')
    cardsPage
      .getPurpleBannerText()
      .should('be.visible')
      .contains('Vaša karta bude zrušená')
      .parent()
      .contains('Ako bezpečnostné opatrenie bude aktuálna karta okamžite zrušená.')
    cardsPage.getPurpleBtnClose().should('be.visible')
    cardsPage.getSaveBtn().should('have.text', 'Objednať novú kartu')

    cy.get('formly-field ib365-input label.form-label')
      .should('have.length', 3)
      .each(($label, index) => {
        cy.wrap($label).should('have.text', ['Ulica a číslo domu', 'PSČ', 'Obec'][index])
      })

    // 3
    cardsPage.getSaveBtn().should('have.text', 'Objednať novú kartu').click()
    cy.getToastAndClose('Žiadosť o novú kartu bola odoslaná.')

    // 4
    // BUG - BLOCKED
  })

  it('should view details of stolen card', () => {
    // 309,327 - Toldy Michal co to kodil, nevie ake css pouzit pri overeni aktivhej(zelenej) a neaktivej(sivej) karte
    // todo - prejst na zrusena - momentalne zoberie prvu kartu ked realoadne page

    cy.get('.bank-card--master-card').should('have.css', 'opacity', '0.5')
  })
})
