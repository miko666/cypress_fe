import { getAddressData } from '../data/client-data'
import { ProfileLabels } from '../enums/Profile.enum'
import { profilePage } from '../page-objects/pages/ProfilePage'

describe('Profile test', () => {
  beforeEach(() => {
    cy.visit('/profile', { timeout: 5000 })
    profilePage.getTitle().should('have.text', 'Profil').should('be.visible')
  })

  // TC
  it('should display profile and validate labels', () => {
    Object.values(ProfileLabels).forEach((profileLabel) => {
      cy.contains(profileLabel).should('be.visible')
    })
  })

  // EXCEL error handling
  it('should validate edit contact address', () => {
    profilePage.getEditAddress().click()

    cy.getLabelInput('Ulica a číslo domu').should('not.have.value', '').clear()
    cy.getLabelInput('PSČ').should('not.have.value', '').clear()
    cy.getLabelInput('Obec').should('not.have.value', '').clear()

    cy.getLabelInput('Ulica a číslo domu').type('123')
    cy.cancelInput()
    cy.getInvalidLabel().should('have.text', 'Zadajte adresu, prosím.')
    cy.getLabelInput('Ulica a číslo domu').clear().type(getAddressData.street)

    cy.getLabelInput('PSČ').type('123')
    cy.cancelInput()
    cy.getInvalidLabel().should('have.text', 'Zadajte PSČ, prosím.')
    cy.getLabelInput('PSČ').clear().type(getAddressData.zip)

    cy.getLabelInput('Obec').type('123')
    cy.cancelInput()
    cy.getInvalidLabel().should('have.text', 'Zadajte názov Obce, prosím.')
    cy.getLabelInput('Obec').clear().type(getAddressData.city)
  })
})
