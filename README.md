# VibeCode Alpha

VibeCode is a revolutionary AI-powered platform that generates complete, unique, and deployable web applications from a single natural language prompt. This repository contains the core infrastructure for the VibeCode application, including the frontend, backend, AI orchestration logic, and deployment automation.

## Table of Contents

- [VibeCode Alpha](#vibecode-alpha)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
  - [Core Implementation Details](#core-implementation-details)
    - [1. AI Orchestration](#1-ai-orchestration)
    - [2. Dynamic Deployment](#2-dynamic-deployment)
    - [3. Freemium Model](#3-freemium-model)
  - [Security](#security)
  - [Testing](#testing)
  - [Next Steps & Future Vision](#next-steps--future-vision)

## Features

- **AI-Powered Application Generation:** Leverages cutting-edge AI models (OpenAI, Claude, Gemini) to generate full-stack web applications.
- **Dynamic Model Selection:** Intelligently chooses the best AI model for a given prompt.
- **Iterative Prompting:** Engages in a follow-up Q&A loop with the AI to clarify requirements and generate more accurate applications.
- **Automated Deployment:** Automatically deploys generated applications to Render, providing users with a live URL.
- **Secure by Design:** Implements a robust set of security best practices, including secure secret management, input/output validation, and rate limiting.
- **Freemium Model:** Tracks user usage and provides a clear path for upgrading to premium plans.
- **Custom Subdomains:** (Planned) Assigns unique, custom subdomains for each generated application using Supabase.

## Project Structure

The project is organized as a monorepo with a clear separation of concerns:

```
.
├── frontend/         # Next.js frontend application
│   ├── components/   # React components
│   └── pages/        # Next.js pages
├── backend/          # Node.js/Express backend API
│   ├── src/
│   │   ├── lib/      # Core logic (AI clients, orchestrator, deployer)
│   │   ├── middleware/ # Express middleware (auth, usage tracking)
│   │   ├── routes/   # API routes
│   │   └── server.js # Express server entry point
│   └── migrations/   # Database migrations
├── common/           # Shared types and interfaces
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A Supabase account
- A Render account
- A GitHub account

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/vibeCodesSpace/VibeCodeAlpha.git
    cd VibeCodeAlpha
    ```

2.  **Install backend dependencies:**

    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**

    ```bash
    cd ../frontend
    npm install
    ```

4.  **Set up environment variables:**
    - Create a `.env` file in the `backend` directory by copying `.env.example`.
    - Fill in the required API keys and credentials for Supabase, Render, GitHub, and the AI providers.

## Usage

1.  **Start the backend server:**

    ```bash
    cd backend
    npm run dev
    ```

2.  **Start the frontend development server:**

    ```bash
    cd ../frontend
    npm run dev
    ```

3.  Open your browser to `http://localhost:3000` to access the VibeCode application.

## Core Implementation Details

### 1. AI Orchestration

The magic of VibeCode happens in the **AI Orchestrator** (`backend/src/lib/aiOrchestrator.js`). This module is responsible for:

- Taking a user's initial prompt.
- Engaging in an iterative loop with an AI model (currently GPT-4o) to clarify requirements and refine the application.
- Generating a structured JSON object containing the complete code for the frontend and backend of the new application.

### 2. Dynamic Deployment

Once an application is generated, the orchestrator triggers the **Deployer** module (`backend/src/lib/deployer.js`). This module:

- Creates a new, private GitHub repository using the GitHub API.
- Pushes the generated code to this new repository.
- Uses the Render API to programmatically create new Web Services and Static Sites, pointing them to the new repository.
- This process is asynchronous to avoid blocking the user interface.

### 3. Freemium Model

VibeCode includes a freemium model to manage usage and provide a path to monetization.

- **Database:** The `profiles` table in Supabase is extended with `plan` and `generations_used` columns.
- **Atomic Updates:** A PostgreSQL function (`increment_generations`) is used to atomically update a user's usage count, preventing race conditions.
- **Middleware:** An Express middleware (`backend/src/middleware/checkUsage.js`) checks a user's plan and usage before allowing access to the resource-intensive generation endpoint.

## Security

Security is a top priority for VibeCode. We have implemented a multi-layered security strategy:

- **Input Validation:** All API endpoints use `express-validator` to validate and sanitize incoming data.
- **Prompt Injection Defense:** We use instructional defense in our AI prompts to treat user input as data, not as instructions.
- **Output Moderation:** All AI-generated content is passed through the OpenAI Moderation API to filter out harmful content.
- **Rate Limiting:** `express-rate-limit` is used to protect all public API endpoints from abuse.
- **Secret Management:** All API keys and sensitive data are managed through environment variables and Render's secure secret management. **No secrets are ever exposed to the client.**
- **Data Encryption:** All data is encrypted in transit (TLS/HTTPS) and at rest by our cloud providers (Supabase and Render).
- **Access Control:** We use Supabase's Row-Level Security (RLS) and role-based access control (RBAC) middleware to ensure users can only access their own data.

## Testing

We have a comprehensive testing strategy that includes:

- **Unit Tests:** Using Jest to test individual backend modules and frontend components in isolation.
- **Integration Tests:** Using Jest and Supertest to test the backend API endpoints.
- **End-to-End Tests:** (Planned) Using Playwright or Cypress to test the full user flow, from prompting to deployment.

To run the tests:

```bash
# From the backend directory
npm test
```

## Next Steps & Future Vision

VibeCode is currently in its alpha stage. Our roadmap includes:

- **Enhanced User Experience:** Improving loading states, providing real-time progress indicators for generation and deployment, and creating a more polished UI.
- **Advanced AI Capabilities:**
  - Allowing users to choose their preferred AI model.
  - Implementing a more sophisticated prompt analysis to better understand user intent.
  - Enabling users to "eject" their generated code and download it as a zip file.
- **Full Payment Integration:** Integrating with Stripe or Lemon Squeezy to handle premium plan upgrades.
- **Comprehensive Testing:** Expanding our test suite to cover more edge cases and user scenarios.
- **Community Features:** Building a gallery of user-generated applications and allowing users to share their creations.
