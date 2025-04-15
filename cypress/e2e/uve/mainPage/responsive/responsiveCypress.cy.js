/// <reference types="Cypress" />

describe('Responsive', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });

    const viewports = [
        { name: 'Small mobile', width: 320, height: 568 },
        { name: 'Standard mobile', width: 375, height: 667 },
        { name: 'Tablet portrait', width: 768, height: 1024 },
        { name: 'Tablet landscape', width: 1024, height: 768 },
        { name: 'Laptop', width: 1280, height: 800 },
        { name: 'Large desktop', width: 1440, height: 900 }
    ];

    viewports.forEach((viewport) => {
        it(`Should display correctly on ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
            cy.viewport(viewport.width, viewport.height);
            cy.visit('https://uvesolutions.com/es/');

            cy.intercept('POST', 'https://region1.google-analytics.com/g/collect*', { forceNetworkError: true }).as('googleAnalytics'); // Sometimes this POST request takes too long to respond, that's why is blocked

            cy.get('.i-user-login')
                .filter(':visible')
                .should('have.length.greaterThan', 0)
                .each(($el) => {
                    cy.wrap($el)
                        .should('contain.text', 'Login');
                });
        });
    });
});