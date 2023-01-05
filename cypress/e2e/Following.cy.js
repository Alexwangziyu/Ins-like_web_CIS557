describe('Test we can create a new user - registration', () => {
  it('passes if we can create a new user', () => {
    cy.visit('http://localhost:3000/')
    cy.get('#Username').type('createNew').should('have.value','createNew')
    cy.get('#Pword').type('Abc123!!').should('have.value','Abc123!!')
    cy.get('#submitButton').click()
    cy.get('#navbarDropdown').click()
    cy.get('#search').click()
    cy.get('#searchBar').type('ZZ').should('have.value','ZZ')
    cy.get('#searchedUser').click()
    cy.get('#followbtn').click()
  })
})