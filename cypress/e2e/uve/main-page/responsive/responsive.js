import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

Given('I visit the homepage on the {string}', (viewport) => {
    const viewports = {
        'Small mobile': { width: 320, height: 568 },
        'Standard mobile': { width: 375, height: 667 },
        'Tablet portrait': { width: 768, height: 1024 },
        'Tablet landscape': { width: 1024, height: 768 },
        'Laptop': { width: 1280, height: 800 },
        'Large desktop': { width: 1440, height: 900 }
    };

    const currentViewport = viewports[viewport];
    cy.viewport(currentViewport.width, currentViewport.height);
    cy.visit('https://uvesolutions.com/es/');

    cy.intercept('POST', 'https://region1.google-analytics.com/g/collect*', { forceNetworkError: true }).as('googleAnalytics'); // Sometimes this POST request takes too long to respond, that's why is blocked
});

Then('I should see the login button visible', () => {
    cy.get('.i-user-login')
        .filter(':visible')
        .should('have.length.greaterThan', 0)
        .each(($el) => {
            cy.wrap($el)
                .should('contain.text', 'Login');
        });
});
