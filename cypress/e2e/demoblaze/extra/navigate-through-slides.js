/// <reference types="cypress"/>

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

Given('the user is on the homepage', () => {
    cy.visit('https://www.demoblaze.com');
});

When('the user navigates forward through all slides', () => {
    const visited = new Set();

    cy.get('#carouselExampleIndicators > .carousel-indicators')
        .children()
        .each(($el) => {
            const slideId = $el.attr('data-slide-to');

            if (visited.has(slideId)) {
                throw new Error('Slide has been repeated!');
            }

            visited.add(slideId);

            cy.wrap($el)
                .click()
                .then(() => {
                    cy.get('#carouselExampleIndicators > .carousel-indicators')
                        .children('.active')
                        .should('have.length', 1)
                        .should('have.attr', 'data-slide-to', slideId);
                });
        });
});

Then('the user should be on the first slide again', () => {
    cy.get('#carouselExampleIndicators > .carousel-indicators')
        .children()
        .first()
        .click()
        .then(($el) => {
            cy.wrap($el).should('have.class', 'active');
        })
});