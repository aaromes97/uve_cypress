/// <reference types="cypress" />

describe("UVE main page", () => {
    it("Should change the cookie language when the page language changes", () => {
        let arrayLanguages = [];

        Cypress.on("uncaught:exception", (err, runnable) => {
            return false; // Ignore possible errors
        });
        cy.viewport(1280, 720);
        cy.visit("https://uvesolutions.com/es/");
        cy.get("li.menu-item.wpml-ls-current-language")
            .first()
            .then((item) => {
                if (item.hasClass("wpml-ls-item-en")) {
                    arrayLanguages = ["ES", "FR", "IT"];
                } else if (item.hasClass("wpml-ls-item-es")) {
                    arrayLanguages = ["EN", "FR", "IT"];
                } else if (item.hasClass("wpml-ls-item-fr")) {
                    arrayLanguages = ["ES", "EN", "IT"];
                } else {
                    arrayLanguages = ["ES", "FR", "EN"];
                }

                for (let i = 0; i < arrayLanguages.length; i++) {
                    cy.intercept(
                        "POST",
                        "https://region1.google-analytics.com/g/collect*",
                        { forceNetworkError: true }
                    ).as("googleAnalytics"); // Sometimes this POST request takes too long to respond, that's why is blocked

                    cy.get("li.menu-item.wpml-ls-current-language")
                        .first()
                        .click()
                        .as("chosenLanguage");
                    cy.get("@chosenLanguage").find("ul.sub-menu").should("be.visible");
                    cy.get("@chosenLanguage")
                        .find("li.menu-item > a")
                        .contains(String(arrayLanguages[i]))
                        .click();
                    cy.wait(1000);

                    cy.get("#CybotCookiebotDialog").as("cookieDialog");
                    cy.get("@cookieDialog")
                        .should("have.class", "CybotCookiebotDialogActive")
                        .and("be.visible");
                    cy.get("@cookieDialog")
                        .find("button#CybotCookiebotDialogBodyButtonDecline")
                        .as("cookieDialogDecline");
                    cy.get("@cookieDialogDecline")
                        .should("have.attr", "lang")
                        .then((lang) => {
                            if (!(lang.toLowerCase() === arrayLanguages[i].toLowerCase())) {
                                throw new Error(
                                    "The cookie language has not been changed! (" +
                                    lang.toUpperCase() +
                                    " to " +
                                    String(arrayLanguages[i]) +
                                    " )"
                                );
                            }
                        });

                    cy.get("@cookieDialog")
                        .find("button#CybotCookiebotDialogBodyLevelButtonCustomize")
                        .as("cookieDialogCustomize");
                    cy.get("@cookieDialogCustomize")
                        .should("have.attr", "lang")
                        .then((lang) => {
                            if (!(lang.toLowerCase() === arrayLanguages[i].toLowerCase())) {
                                throw new Error(
                                    "The cookie language has not been changed! (" +
                                    lang.toUpperCase() +
                                    " to " +
                                    String(arrayLanguages[i]) +
                                    " )"
                                );
                            }
                        });

                    cy.get("@cookieDialog")
                        .find(
                            "button#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll"
                        )
                        .as("cookieDialogAllowAll");
                    cy.get("@cookieDialogAllowAll")
                        .should("have.attr", "lang")
                        .then((lang) => {
                            if (!(lang.toLowerCase() === arrayLanguages[i].toLowerCase())) {
                                throw new Error(
                                    "The cookie language has not been changed! (" +
                                    lang.toUpperCase() +
                                    " to " +
                                    String(arrayLanguages[i]) +
                                    " )"
                                );
                            }
                        });
                }
            });
    });
});
