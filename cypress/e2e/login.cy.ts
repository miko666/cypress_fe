import { getLoginData } from '../data/client-data'

describe('Login test', () => {
  it('Should be logged in', () => {
    cy.visit('/')
    cy.login(getLoginData.username, getLoginData.password)
  })
})
