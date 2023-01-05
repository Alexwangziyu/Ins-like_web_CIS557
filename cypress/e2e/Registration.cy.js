describe('Test we can create a new user - registration', () => {
  it('passes if we can create a new user', () => {
    cy.visit('http://localhost:3000/Signup')
    cy.get('button').contains('SIGN UP')
    cy.get('#username').type('ZhenZhang').should('have.value','ZhenZhang')
    cy.get('#definename').type('ZhenZhangUserName').should('have.value','ZhenZhangUserName')
    cy.get('#password').type('Abc123!!').should('have.value','Abc123!!')
    cy.get('#confirm_pwd').type('Abc123!!').should('have.value','Abc123!!')
    cy.get('button').click()
  })
})