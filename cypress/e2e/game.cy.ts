// cypress/e2e/game.cy.ts
describe('Smoke test', () => {
  it('redirects / to /new then loads a game page', () => {
    // visit root → new game auto-redirect
    cy.visit('/')
    cy.url().should('include', '/new')

    // generate a new ID and navigate
    cy.location('pathname').then(path => {
      // path is "/new"; clicking nothing here so we'll just visit a known game
      const fakeId = 'abc-123'
      cy.visit(`/play/${fakeId}?init=true`)
    })

    // show the “connecting” indicator
    cy.contains('…connecting')

    // (Because P2P won’t actually hook up in E2E yet, we just assert the text)
  })
})
