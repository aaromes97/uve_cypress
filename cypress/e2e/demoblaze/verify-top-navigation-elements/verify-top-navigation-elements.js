/// <reference types="cypress"/>

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

Given('the user is on the homepage', () => {
    cy.visit('https://www.demoblaze.com');
});

When('the user clicks the {string} navigation element', (element) => {
    cy.contains('a.nav-link', element)
        .should('exist')
        .and('not.be.disabled')
        .and('be.visible')
        .click();
});

Then('the page should display the expected content for {string}', (element) => {
    switch (element) {
        case 'Home':
            cy.url().should('include', '/index.html');
            break;
        case 'Contact':
            cy.get('#exampleModal').should('be.visible');
            break;
        case 'About us':
            cy.get('#videoModal').should('be.visible');
            break;
        case 'Cart':
            cy.url().should('include', '/cart.html');
            break;
        case 'Log in':
            cy.get('#logInModal').should('be.visible');
            break;
        case 'Sign up':
            cy.get('#signInModal').should('be.visible');
            break;
        default:
            throw new Error(`No match found for navigation item: ${element}`);
    }
});