Cypress.Commands.add("signupByApi", (username, displayName, email, password) => {
  // Programmatically signs up by sending a request to the backend API.
  // This bypasses the UI and is much faster and more reliable.
  cy.request({
    method: "POST",
    url: `${Cypress.env("NEXT_PUBLIC_LOCAL_BACKEND_URL")}/auth/signup`,
    body: { username, displayName, email, password },
  }).then((response) => {
    expect(response.status).to.eq(201);
  });
});

Cypress.Commands.add("signinByApi", (email, password) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("NEXT_PUBLIC_LOCAL_BACKEND_URL")}/auth/signin`,
    body: { email, password },
  }).then((response) => {
    expect(response.status).to.eq(201);
  });
});

