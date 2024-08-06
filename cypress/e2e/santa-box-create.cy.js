const users = require("../fixtures/users.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const generalElements = require("../fixtures/pages/general.json");
const dashboardPage = require("../fixtures/pages/dashboardPage.json");
const inviteeBoxPage = require("../fixtures/pages/inviteeBoxPage.json");
const inviteeDashboardPage = require("../fixtures/pages/inviteeDashboardPage.json");
const drawPage = require("../fixtures/pages/drawPage.json");
const deleteBox = require("../fixtures/pages/deleteBox.json");

import { faker } from "@faker-js/faker";

describe("user can create a box and run it", () => {
  let wishes = faker.word.noun() + faker.word.adverb() + faker.word.adjective();
  let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
  let maxAmount = 50;
  let currency = "Евро";
  let boxId;

  it("user logins and create a box", () => {
    cy.visit("/login");
    cy.login(users.userAuthor.email, users.userAuthor.password);
    cy.contains("Создать коробку").click();
    cy.get(boxPage.boxNameField).type(newBoxName);
    cy.get(boxPage.boxIdField)
      .invoke("val")
      .then((value) => {
        boxId = value;
      });
    cy.get(generalElements.arrowRight).click();
    cy.get(boxPage.sixthIcon).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(boxPage.giftPriceToggle).click();
    cy.get(boxPage.maxAmount).type(maxAmount);
    cy.get(boxPage.currency).select(currency);
    cy.get(generalElements.arrowRight).should("be.visible").click();
    cy.contains("Дополнительные настройки").should("be.visible");
    cy.get(generalElements.arrowRight)
      .should("be.visible")
      .click({ force: true });
    cy.get(dashboardPage.createdBoxName).should("have.text", newBoxName);
    cy.get(dashboardPage.boxHederToggles)
      .invoke("text")
      .then((text) => {
        expect(text).to.include("Участники");
        expect(text).to.include("Моя карточка");
        expect(text).to.include("Подопечный");
      });
  });

  it("add participants", () => {
    cy.get(generalElements.submitButton).click();
    cy.addUsersToTheList(
      inviteeBoxPage.nameFirstField,
      inviteeBoxPage.emailFirstField,
      users.user1.name,
      users.user1.email
    );
    cy.addUsersToTheList(
      inviteeBoxPage.nameSecondField,
      inviteeBoxPage.emailSecondField,
      users.user2.name,
      users.user2.email
    );
    cy.addUsersToTheList(
      inviteeBoxPage.nameThirdField,
      inviteeBoxPage.emailThirdField,
      users.user3.name,
      users.user3.email
    );
    cy.get(inviteeBoxPage.inviteButton).click();
    cy.visit(`/box/${boxId}`);
    cy.get(dashboardPage.inviteeNames)
      .invoke("text")
      .then((text) => {
        expect(text).to.include(users.user1.name);
        expect(text).to.include(users.user2.name);
        expect(text).to.include(users.user3.name);
      });
  });
  
  it("approve as user1", () => {
    cy.visit("/login");
    cy.login(users.user1.email, users.user1.password);
    cy.approveParticipation(boxId, wishes);
    cy.get(inviteeDashboardPage.noticeForInvitee)
      .invoke("text")
      .then((text) => {
        expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
      });
    cy.clearCookies();
  });

  it("approve as user2", () => {
    cy.visit("/login");
    cy.login(users.user2.email, users.user2.password);
    cy.approveParticipation(boxId, wishes);
    cy.get(inviteeDashboardPage.noticeForInvitee)
      .invoke("text")
      .then((text) => {
        expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
      });
    cy.clearCookies();
  });

  it("approve as user3", () => {
    cy.visit("/login");
    cy.login(users.user3.email, users.user3.password);
    cy.approveParticipation(boxId, wishes);
    cy.get(inviteeDashboardPage.noticeForInvitee)
      .invoke("text")
      .then((text) => {
        expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
      });
    cy.clearCookies();
  });

  it("the draw verification", () => {
    cy.get(drawPage.drawStartLink).click({ force: true,  multiple: true}); 
    cy.get(drawPage.drawStartButton).click();
    cy.get(drawPage.drawConfirmButton).click();
    cy.get(drawPage.drawResultText).click();
    cy.contains(
      "Жеребьевка проведена"
    );
  });

  it("delete box", () => {
    cy.visit("/login");
    cy.login(users.userAuthor.email, users.userAuthor.password);
    cy.request({
      method: "DELETE",
      url: `/api/account/box/${boxId}`,
      Cookie: deleteBox.cookies,
    }).then((deleteResponse) => {
      expect(deleteResponse.status).to.eq(200);
    });
  });
});