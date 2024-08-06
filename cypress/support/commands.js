// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const loginPage = require("../fixtures/pages/loginPage.json");
const generalElements = require("../fixtures/pages/general.json");
const users = require("../fixtures/users.json");
const inviteeBoxPage = require("../fixtures/pages/inviteeBoxPage.json");
const inviteeDashboardPage = require("../fixtures/pages/inviteeDashboardPage.json");

Cypress.Commands.add("login", (userName, password) => {
  cy.get(loginPage.loginField).type(userName);
  cy.get(loginPage.passwordField).type(password);
  cy.get(generalElements.submitButton).click();
});

Cypress.Commands.add("addUsersToTheList", (userNameSelector, emailSelector, userName, email) => {
    cy.get(userNameSelector).type(userName);
    cy.get(emailSelector).type(email);
  });

Cypress.Commands.add("approveParticipation", (boxId, wishes) => {
    cy.get (generalElements.hederBox);
    cy.visit(`/box/${boxId}/card`);
    cy.get(generalElements.submitButton).click({force: true});
    cy.get(generalElements.arrowRight).click({force: true});
    cy.get(inviteeDashboardPage.seventhIcon).click();
    cy.get(generalElements.arrowRight).click({force: true});
    cy.get(inviteeBoxPage.wishesInput).type(wishes);
    cy.get(generalElements.arrowRight).click({force: true});
  });