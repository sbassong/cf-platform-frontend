# Child-Free Platform - Frontend

<p align="center">
  <h3 align="center">Next.js Frontend for the Child-Free Community Platform</h3>
  <p align="center">
    A prototype full-stack social application built with Next.js 15, Auth.js , and TypeScript. It features a hybrid authentication system, real-time messaging, and community engagement tools.
    <br />
        <br />
    <a href="https://github.com/sbassong/cf-platform-backend">View Backend Repository</a>
  </p>
</p>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#key-features">Key Features</a></li>
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
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

---

## About The Project

This repository contains the frontend portion of the **CF Platform**, a dedicated social space for the child-free community. It connects with a [NestJS backend](https://github.com/sbassong/cf-platform-backend) to provide a secure and interactive user experience.

The application leverages a **Hybrid Session Architecture**:
* **Social Login**: Google OAuth is managed by **Auth.js (NextAuth v5)**.
* **Credentials**: Email/Password login is handled directly by the **NestJS backend**.
* **Session Bridge**: A specialized bridging mechanism synchronizes the NextAuth session with the backend's cookie-based HTTP-only session, to ensure a unified state across the app.

### Key Features

* **Community Groups**: Discover, create, and join interest-based groups to connect with like-minded individuals.
* **Events & Meetups**: Browse upcoming local and virtual events, create new ones, and manage RSVPs.
* **Real-Time Messaging**: Instant private messaging powered by **Socket.io**, featuring read receipts and live updates.
* **Customizable Profiles**: Users can edit their bio, location, and interests, and view their event/group history.
* **Secure Authentication**: Robust protection using JWTs and secure session cookies.

### Built With

This project is built with a modern, type-safe, and performant technology stack.

* [Next.js](https://nextjs.org/)
* [React](https://react.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [Auth.js](https://authjs.dev/) 
* [SWR](https://swr.vercel.app/) - for data fetching
* [Socket.io Client](https://socket.io/) - Real-time event-based communication
* [TailwindCSS](https://tailwindcss.com/)
* [Shadcn UI](https://ui.shadcn.com/)
* [Cypress](https://www.cypress.io/) - End-to-End Testing

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

You must have **Node.js 22** (or higher) and **npm** installed on your machine.

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

This project uses **Cypress** for end-to-end (E2E) testing to ensure the reliability of key user flows.

### End-to-End Tests (In progress)

The E2E test suite currently covers:
* **Authentication**: Sign-in/Sign-up (Credentials & OAuth), Sign-out, and Session Bridging.

### How to Run E2E Tests

1.  **Start the development server**:
    ```sh
    npm run dev
    ```

2.  **Open the Cypress Test Runner**:
    In a separate terminal window, run:
    ```sh
    npx cypress open
    ```

3.  Select **E2E Testing**, choose your browser, and run the desired spec files.

---

## Architecture Overview

### Authentication & Sessions
* **`/auth.ts`**: Configures Auth.js providers and callbacks.
* **`src/app/context/AuthContext.tsx`**: Provides a global `useAuth` hook that unifies NextAuth and Backend sessions into a single user object.
* **`src/app/(auth)/bridge`**: HHndles the synchronization of Google OAuth sessions with the backend database.

### Data Fetching
* **SWR**: Used throughout the application (e.g., `useSWR('/events', fetcher)`) for efficient, cached, and optimistic UI updates.
* **`src/lib/api.ts`**: Contains the core `fetcher` and API utility functions.

### Real-Time Communication
* **`src/hooks/use-messaging-socket.ts`**: A custom hook that manages the Socket.io connection, handling events like `sendMessage` and `receiveMessage` for the chat functionality.

---

## Roadmap

The following features have been implemented or are planned:

- [x] **User Authentication** (Google & credentials)
- [x] **User Profile Editing** (Bio, location, Interests)
- [x] **Events System** (Create, View, Attend)
- [x] **Groups & Communities** (Create, Join, Post)
- [x] **Real-time Chat** (live messaging)
- [ ] Advanced moderation tools
- [ ] Push Notifications
- [ ] Mobile-responsive optimizations
- [ ] Mobile app migration

---

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

---

## Contact

Samuel Bassong – sam.bassong@gmail.com - [linkedin.com/in/sambassong](https://www.linkedin.com/in/sambassong/)