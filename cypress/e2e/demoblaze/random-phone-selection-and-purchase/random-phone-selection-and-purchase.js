/// <reference types="cypress"/>

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

Given('the user is on the homepage', () => {
    cy.visit('https://www.demoblaze.com');
});

When('the user navigates to the Phones category', () => {
    cy.intercept('POST', '**/bycat').as('loadBycat');
    cy.get('a#cat')
        .siblings('.list-group-item')
        .contains('a', 'Phones')
        .should('exist')
        .and('have.length', 1)
        .and('not.be.disabled')
        .and('be.visible')
        .click();
    cy.wait('@loadBycat');
});

When('the user selects a random phone', () => {
    cy.intercept('POST', '**/view*').as('loadview');
    cy.get('#tbodyid .col-lg-4')
        .then(($rows) => {
            const randomIndex = Math.floor(Math.random() * $rows.length);
            const randomPhone = $rows[randomIndex];

            cy.wrap(randomPhone).as('randomPhone');
            cy.wrap(randomPhone)
                .find('.card-title, .classtitle')
                .then(($title) => {
                    const title = $title.text();
                    cy.wrap(title.trim()).as('selectedPhoneTitle');
                });

            cy.get('@randomPhone')
                .find('a.hrefch')
                .should('exist')
                .should('not.be.disabled')
                .should('be.visible')
                .click({ force: true });
        });
    cy.wait('@loadview');
});

Then('the product title should match the selected one', () => {
    cy.get('@selectedPhoneTitle').then((selectedPhoneTitle) => {
        cy.get('.product-content h2.name').then(($title) => {
            const title = $title.text().trim();
            if (title !== selectedPhoneTitle) {
                throw new Error('Product does not match!');
            }
        });
    });
});

When('the user adds the phone to the cart', () => {
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
    cy.intercept('POST', '**/view*').as('loadview2');
    cy.get('#cartur')
        .should('exist')
        .and('not.be.disabled')
        .and('be.visible')
        .click();
    cy.wait('@loadview2');
});

When('the user clicks on place order', () => {
    cy.get('button[data-target="#orderModal"]')
        .should('exist')
        .and('not.be.disabled')
        .and('be.visible')
        .click();
});

When('the user fills in the order details and confirms the purchase', () => {
    cy.get('.modal-body', { timeout: 5000 }).should('be.visible')
        .then(() => {
            cy.get('#name').type('Aaron Méndez');
            cy.get('#country').type('Spain');
            cy.get('#city').type('Barcelona');
            cy.get('#card').type('0000000000000000');
            cy.get('#month').type('04');
            cy.get('#year').type('2026');
            cy.get('.modal-footer')
                .contains('button', 'Purchase')
                .should('exist')
                .and('not.be.disabled')
                .and('be.visible')
                .click();
        });
});

Then('the user should see the message {string}', (message) => {
    cy.get('.sweet-alert > h2').
        should('be.visible')
        .then(($item) => {
            const itemText = $item.text().trim();
            if (itemText.toLowerCase() !== message.toLowerCase()) {
                throw new Error('Alert message does not match!');
            }
        });
});