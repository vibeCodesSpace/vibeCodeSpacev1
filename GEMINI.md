# VibeCode Project Catalog

This document provides a comprehensive overview of the VibeCode project, its architecture, features, and operational procedures.

## 1. Project Overview

**VibeCode** is an AI-powered platform designed to generate complete, unique, and deployable web applications from natural language prompts. It aims to bridge the gap between idea and implementation, allowing both developers and non-technical users to create and launch web applications with ease.

### Core Features:

*   **AI-Powered Application Generation:** Utilizes models from OpenAI, Anthropic, and Gemini to generate full-stack applications.
*   **Dynamic Deployment:** Automatically deploys the generated applications to Render.
*   **Freemium Model:** Implements a usage-based subscription model with different tiers (Free, Pro).
*   **Authentication:** Provides a complete authentication system (signup, signin, social login, password reset) using Supabase.
*   **Payments:** Integrates with Stripe for handling subscriptions and payments.
*   **Resume-to-Portfolio:** A specific feature to automatically generate a portfolio website from a user's resume.

## 2. Architecture

VibeCode is a monorepo with a modern full-stack architecture:

*   **Frontend:** A Next.js application serves the user interface. It includes components for user interaction, such as the prompt interface and subscription management.
*   **Backend:** A Node.js/Express server provides the API for the frontend. It handles user authentication, application generation logic, and payment processing.
*   **Database:** A PostgreSQL database, managed via Supabase, stores user data, generated site information, and subscription details. Drizzle is used as the ORM.
*   **AI Orchestration:** A central module in the backend (`aiOrchestrator.js`) manages the interaction with various AI providers to generate application code.
*   **Deployment:** The `deployer.js` module automates the process of creating a GitHub repository and deploying the generated application to Render.

## 3. Directory Structure

The project is organized into the following key directories:

```
vibeCodeSpace_clone/
├── frontend/         # Next.js frontend application
├── backend/          # Node.js/Express backend API
│   ├── src/
│   │   ├── lib/      # Core logic (AI clients, orchestrator, deployer)
│   │   ├── middleware/ # Express middleware (auth, usage tracking)
│   │   └── routes/   # API routes
│   └── migrations/   # Database migrations
├── common/           # Shared types and interfaces
├── client/           # React client application (Vite)
├── pages/            # Next.js pages (likely for API routes)
├── components/       # Shared React components
└── ...
```

## 4. Getting Started

### Prerequisites:

*   Node.js (v18 or later)
*   npm or yarn
*   Supabase Account
*   Render Account
*   GitHub Account

### Installation & Setup:

1.  **Clone the repository.**
2.  **Install dependencies** for both the `frontend` and `backend` directories using `npm install`.
3.  **Set up environment variables:** Create a `.env` file in the `backend` directory by copying `.env.example` and fill in the necessary API keys and credentials for Supabase, Render, GitHub, and AI providers.

### Running the Application:

1.  **Start the backend server:**
    ```bash
    cd backend
    npm run dev
    ```
2.  **Start the frontend server:**
    ```bash
    cd ../frontend
    npm run dev
    ```
3.  Access the application at `http://localhost:3000`.

## 5. Available Scripts

The following scripts are available in the respective `package.json` files:

### Backend (`backend/package.json`):

*   `npm start`: Starts the production server.
*   `npm run dev`: Starts the development server with `nodemon`.
*   `npm test`: Runs tests using Jest.

### Frontend (`frontend/package.json`):

*   `npm run dev`: Starts the Next.js development server.
*   `npm run build`: Builds the Next.js application for production.
*   `npm start`: Starts the Next.js production server.
*   `npm run lint`: Lints the frontend code.

## 6. Core Implementation Details

### AI Orchestration

The `aiOrchestrator.js` module is the core of the application generation logic. It takes a user prompt, communicates with an AI model (e.g., GPT-4o) to refine requirements, and generates a structured JSON object containing the application code.

### Dynamic Deployment

The `deployer.js` module automates the deployment process. It creates a new private GitHub repository, pushes the generated code, and then uses the Render API to create and deploy the new application.

### Freemium Model

The freemium model is implemented using a combination of a Supabase database and backend middleware. The `profiles` table tracks user plans and usage, and the `checkUsage` middleware protects the generation endpoint from overuse.
