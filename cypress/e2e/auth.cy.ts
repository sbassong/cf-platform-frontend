describe("Authentication Flow", () => {
  // Use a timestamp to ensure user data is unique for each test run.
  // This prevents conflicts with existing users in the database.
  const timestamp = new Date().getTime();
  const uniqueUser = {
    email: `testuser_${timestamp}@example.com`,
    password: "password123",
    displayName: `Test User ${timestamp}`,
    username: `testuser_${timestamp}`,
  };

  beforeEach(() => {
    // Clear cookies before each test to ensure a clean state
    cy.clearCookies();
  });

  it("should allow a user to sign up with credentials", () => {
    cy.visit("/signup");

    // Intercept the network request that the UI will make
    cy.intercept("POST", "**/auth/signup").as("signupRequest");

    // Fill out the form
    cy.get("[data-cy=signup-displayName]").type(uniqueUser.displayName);
    cy.get("[data-cy=signup-username]").type(uniqueUser.username);
    cy.get("[data-cy=signup-email]").type(uniqueUser.email);
    cy.get('[data-cy="signup-password"]').type(uniqueUser.password);
    cy.get('[data-cy="signup-confirm-password"]').type(uniqueUser.password);

    // Submit the form
    cy.get('[data-cy="signup-submit"]').click();
    cy.wait("@signupRequest").its("response.statusCode").should("eq", 201);

    // Assert that the user is redirected to the sign-in page on success
    cy.url().should("include", "/signin");
    cy.contains("Sign In to Your Account").should("be.visible");
  });

  it("should allow a registered user to sign in with credentials and view the protected page", () => {
    // will create the user via an API call in a `before` hook in the future
    // to ensure this test is not dependent on the signup test.
    // for now test relies on the user created in the previous test.
    cy.visit("/signin");

    cy.get('[data-cy="signin-email"]').type(uniqueUser.email);
    cy.get('[data-cy="signin-password"]').type(uniqueUser.password);

    cy.get('[data-cy="signin-submit"]').click();

    cy.url().should("eq", Cypress.config().baseUrl + "/");

    // Assert that the navbar now shows the user's display name
    // and the profile link is correct.
    cy.get("[data-cy=profile-link]")
      .should("contain", `Welcome, ${uniqueUser.displayName}`)
      .and("have.attr", "href", `/profiles/${uniqueUser.username}`);

    // Navigate to the protected page explicitly to check its content
    cy.visit("/protected");
    cy.contains("Protected Dashboard").should("be.visible");
    cy.contains(`Welcome, ${uniqueUser.displayName}!`).should("be.visible");
    cy.contains(`@${uniqueUser.username}`).should("be.visible");
    cy.contains(uniqueUser.email).should("be.visible");
  });

  it("should allow a logged-in user to sign out", () => {
    // Use custom command to log in programmatically
    // assumes you have a known user in your database for testing
    // For this example, we'll use the user created earlier
    cy.signinByApi(uniqueUser.email, uniqueUser.password);

    cy.visit("/"); // Visit the homepage, should be logged in

    // Find the sign-out button in the navbar and click it
    cy.get("[data-cy=signout-button]").click();

    // Assert that we are redirected to the signin page after signout
    cy.url().should("include", "/signin");
    cy.contains("Sign In to Your Account").should("be.visible");

    // Assert that the user's name is no longer in the navbar
    cy.get("[data-cy=profile-link]").should("not.exist");
  });

  it("should initiate the Google sign-in flow", () => {
    // NOTE: End-to-end testing third-party OAuth flows is an anti-pattern.
    // It's slow, unreliable, and requires handling real credentials.
    // The correct approach is to mock the OAuth callback.
    // This test will only verify that the initial step works.

    cy.visit("/signin");

    // intercept the call to the NextAuth.js Google provider endpoint
    // to confirm the flow starts, without actually redirecting to Google.
    cy.intercept("POST", "/api/auth/signin/google?").as("googleSignIn");

    cy.get('[data-cy="google-signin-button"]').click();

    // Assert that the request to start the Google sign-in was made
    cy.wait("@googleSignIn")
      .its("response.statusCode")
      .should("be.oneOf", [200, 302]);

    cy.visit("/signin");
    // A full test would involve mocking the callback from Google, setting the session cookie,
    // and verifying the user lands on the bridge page and then the final destination.
    // This requires a more advanced setup with `cy.intercept` and `cy.origin`.
    // WILL BE SET UP IN THE FUTURE
  });
});
