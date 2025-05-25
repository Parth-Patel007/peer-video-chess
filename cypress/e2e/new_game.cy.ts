/// <reference types="cypress" />

describe('New-Game Flow', () => {
  it('redirects to /play/:id?init=true and shows connecting state', () => {
    // stub out getUserMedia so the test never prompts for camera
    cy.visit('/new?init=true', {
      onBeforeLoad(win) {
        if (!win.navigator.mediaDevices) {
          // @ts-ignore
          win.navigator.mediaDevices = {}
        }
        // @ts-ignore
        win.navigator.mediaDevices.getUserMedia = () =>
          Promise.resolve(new MediaStream())
      }
    })

    // you should end up on /play/<uuid>?init=true
    cy.url().should('match', /\/play\/[0-9a-fA-F-]+\?init=true$/)

    // and the header should show “…connecting”
    cy.contains('…connecting')

    // after a brief tick, your simple-peer mock should connect:
    // give the app a moment to run its `setTimeout(...,0)`
    cy.wait(50)
    cy.contains('✅ P2P up')
  })
})
