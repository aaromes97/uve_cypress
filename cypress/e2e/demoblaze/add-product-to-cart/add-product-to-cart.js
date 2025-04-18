/// <reference types="cypress"/>

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

Given('the user is on the homepage', () => {
    cy.visit('https://www.demoblaze.com');
});

When('the user navigates to the Laptops category', () => {
    cy.intercept('POST', '**/bycat').as('loadBycat');
    cy.get('a#cat')
        .siblings('.list-group-item')
        .contains('a', 'Laptops')
        .should('exist')
        .and('have.length', 1)
        .and('not.be.disabled')
        .and('be.visible')
        .click();
    cy.wait('@loadBycat');
});

When('the user selects a product', () => {
    cy.get('#tbodyid .col-lg-4').first().then(($item) => {
        const title = $item.find('.card-title, .classtitle').text().trim();
        cy.wrap(title).as('selectedLaptopTitle');
        cy.wrap($item)
            .find('a.hrefch')
            .should('exist')
            .should('not.be.disabled')
            .should('be.visible')
            .click({ force: true });
    });
});

Then('the product title should match the selected one', () => {
    cy.get('@selectedLaptopTitle').then((selectedLaptopTitle) => {
        cy.get('.product-content h2.name').then(($title) => {
            const title = $title.text().trim();
            if (title !== selectedLaptopTitle) {
                throw new Error('Product does not match!');
            }
        });
    });
});

When('the user clicks on the add to cart button', () => {
    cy.on('window:alert', (str) => {
        expect(str).to.equal('Product added');
    });
    cy.get('.product-content a.btn.btn-success')
        .should('exist')
        .and('not.be.disabled')
        .and('be.visible')
        .click();
});

When('the user navigates to the cart', () => {
    cy.intercept('POST', '**/addtocart', { forceNetworkError: true });
    cy.intercept('POST', '**/view*').as('loadview');
    cy.get('#cartur')
        .should('exist')
        .and('not.be.disabled')
        .and('be.visible')
        .click();
    cy.wait('@loadview');
});

When('the user deletes the product from the cart', () => {
    cy.intercept('POST', '**/view*').as('loadview2');
    cy.get('#tbodyid tr')
        .should('have.length.at.least', 1)
        .first()
        .find('a')
        .then(($link) => {
            expect($link).to.contain.text('Delete');
            expect($link).to.have.attr('onclick');
            expect($link.attr('onclick')).to.include('deleteItem');
            cy.wrap($link).click();
        });
    cy.wait('@loadview2');
});

Then('the cart should be empty', () => {
    cy.get('#tbodyid tr')
        .should('have.length', 0)
});