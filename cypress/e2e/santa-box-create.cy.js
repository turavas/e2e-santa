const users = require("../fixtures/users.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const generalElements = require("../fixtures/pages/general.json");
const dashboardPage = require("../fixtures/pages/dashboardPage.json");
const inviteeBoxPage = require("../fixtures/pages/inviteeBoxPage.json");
const drawPage = require("../fixtures/pages/drawPage.json");

import { faker } from "@faker-js/faker";

describe("user can create a box and run it", () => {
  let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
  let boxId;
  let maxAmount = 50;
  let currency = "Евро";
  let cookieHeader;

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

  it("the draw verification", () => {
    cy.get(drawPage.drawStartLink).click({ force: true });
    cy.get(drawPage.drawStartButton).click();
    cy.get(drawPage.drawConfirmButton).click();
    cy.get(drawPage.drawResultText).click();
    cy.contains("Жеребьевка проведена");
  });

  it("delete box", () => {
    cy.visit("/login");
    cy.login(users.userAuthor.email, users.userAuthor.password);
    cy.request({
          method: "DELETE",
          url: `https://staging.lpitko.ru/api/account/box/${boxId}`,
          Cookie: "jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMwMDE2NjAsImlhdCI6MTcyMjIzOTI3NiwiZXhwIjoxNzIyMjQyODc2fQ.cyu-e5sE7ViYjU1WyF45ec9QzD8UNz2RdCx-nFMrfEo; refresh=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMwMDE2NjAsImlhdCI6MTcyMjIzOTI3NiwiZXhwIjoxNzIyMjQ2NDc2fQ.j6uY-3TVBG58ik-Wxbq5ANc2PBJU0q-w7gv57KqXRJU",
        }).then((deleteResponse) => {
          expect(deleteResponse.status).to.eq(200);
        });
      });
    });
  

