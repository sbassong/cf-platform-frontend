# Child-Free Platform - Frontend

<p align="center">
  <!-- <a href="#">
    <img src="https://raw.githubusercontent.com/authjs/next-auth/main/docs/static/img/logo.svg" alt="Logo" width="80" height="80">
  </a> -->
  <h3 align="center">Next.js Frontend for the Child-Free Community Platform</h3>
  <p align="center">
    A modern, full-stack web application built with Next.js, Auth.js (NextAuth.js v5), and TypeScript, featuring a hybrid authentication system to bridge NextAuth.js sessions with a 
    <a href="https://github.com/sbassong/cf-platform-backend">custom Nest.js backend</a>.
    <br />
    <br />
    <a href="#">View Demo</a>
  </p>
</p>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#environment-variables">Environment Variables</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#running-tests">Running Tests</a></li>
    <li><a href="#architecture-overview">Architecture Overview</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#license">Contact</a></li>
  </ol>
</details>

---

## About The Project

This repository contains the frontend portion of the **CF Platform**, a social application designed for the child-free community. It is a modern Next.js application featuring a hybrid authentication system that integrates two distinct session management strategies.

The key architectural highlights include:

* **Google OAuth Login**: Securely managed end-to-end using **Auth.js (NextAuth.js v5)**, which handles the OAuth 2.0 flow and its own server-side session management.
* **Credentials-Based Authentication**: Traditional email and password sign-in and sign-up are handled by a separate **NestJS backend service**. This frontend communicates directly with it for these tasks.
* **Hybrid Session Synchronization**: A unique "bridge" page architecture ensures a unified user experience. After a successful Google login via NextAuth.js, the user is seamlessly redirected to create a parallel, cookie-based session with the NestJS backend, ensuring consistent authentication state across the entire platform.

### Built With

This project is built with a modern, type-safe, and performant technology stack.

* [Next.js](https://nextjs.org/docs)
* [React](https://react.dev/learn)
* [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)
* [Auth.js](https://authjs.dev/getting-started)
* [TailwindCSS](https://tailwindcss.com/)
* [Axios](https://axios-http.com/docs/intro)
* [Cypress](https://docs.cypress.io/app/get-started/why-cypress)

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

You must have Node.js (version 22.x or higher) and npm installed on your machine.

* npm
    ```sh
    npm install npm@latest -g
    ```

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/sbassong/cf-platform-frontend.git
    ```
2.  Navigate into the project directory
    ```sh
    cd cf-platform-frontend
    ```
3.  Install NPM packages
    ```sh
    npm install
    ```

### Environment Variables

This project requires several environment variables to run. Create a file named `.env.local` in the root of your project and add the following variables.

```env
# Auth.js (NextAuth.js) Secret
# A long, random string used to encrypt the session JWT.
# Generate one with: openssl rand -base64 32
AUTH_SECRET="your-super-secret-string-for-next-auth"

# Google OAuth Credentials
# Get these from your project in the Google Cloud Console.
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Auth.js (NextAuth.js) Configuration
# The canonical URL of your Next.js application. Required for OAuth redirects.
NEXTAUTH_URL="http://localhost:3000"

# Backend API URL
# The URL for your corresponding NestJS backend service.
NEXT_PUBLIC_LOCAL_BACKEND_URL="http://localhost:3001"
```
## Usage

Once the environment variables are set, you can run the development server:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The page will auto-update as you edit the files.

---

## Running Tests

This project uses Cypress for end-to-end (E2E) testing to ensure the reliability of key user flows.

### End-to-End Tests

The E2E test suite currently covers the following scenarios:
* **Authentication**: Signin and signup with credentials, mock provider signin, and signout.


### How to Run E2E Tests

1. **Start the development server**: Before running tests, ensure your Next.js application is running.

    ```sh
    npm run dev
    ```

2. **Open the Cypress Test Runner**: In a separate terminal window, from the project root, run the following command:

    ```sh
    npx cypress open
    ```

3. In the Cypress dashboard, choose **E2E Testing**, select your preferred browser, and click on `auth.cy.ts` to execute the authentication test suite.



## Architecture Overview

### Authentication (`/auth.ts`)

The core of the Google OAuth integration is managed here. It uses **Auth.js v5** and defines the providers and callbacks required for the login flow and session management.

### API Routes (`/src/app/api/`)

- **`api/auth/[...nextauth]/route.ts`**  
  This file exposes the Auth.js handlers to the Next.js routing system, enabling features like sign-in, sign-out, and session retrieval for NextAuth.

- **`api/auth/session/route.tsx`**  
  A custom proxy endpoint used by the `AuthContext` to check the status of a user's session with the NestJS backend.

### Session Management (`/src/app/context/AuthContext.tsx`)

A custom React context that creates a unified authentication state. It checks for either a NextAuth.js session (for Google users) or a NestJS session (for credentials users) and provides a consistent `user` object and `isLoading` state to the entire application.

### Session Bridge (`/src/app/(auth)/bridge`)

This is a critical component of the hybrid system.

- **`page.tsx`**  
  A server component that runs immediately after a successful Google login. It uses the server-side `auth()` helper to get the session and passes it to the client component.

- **`AuthBridgeClient.tsx`**  
  A client component that receives the session data and makes a fetch request to the NestJS backend, prompting it to set its own `access_token` cookie. This synchronizes the user's session across both systems.

### Testing (`/cypress`): 
Contains all end-to-end tests. Also contains `support/commands.ts` which contains reusable and custom commands imported through support file `support/e2e.ts`.

---

## Roadmap

- [ ] Implement user profile editing.
- [ ] Develop a real-time chat feature.
- [ ] Add event creation and RSVPs.
- [ ] Build out a forum/discussion board.

See the [open issues](https://github.com/sbassong/cf-platform-frontend/issues) for a full list of proposed features (and known issues).

---

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

---

## Contact

Samuel Bassong – sam.bassong@gmail.com - [linkedin.com/in/sambassong](https://www.linkedin.com/in/sambassong/)

Project Link: [https://github.com/sbassong/cf-platform-frontend](https://github.com/sbassong/cf-platform-frontend)