# Vora Web App

Welcome to the Vora Web App, a goal-tracking application designed to help users set, monitor, and achieve their objectives. This project is built with **Next.js**, **React**, **PostgreSQL**, and **Prisma**.

## Tech Stack

This project leverages the following technologies:

- **Frontend**: [Next.js (App Router)](https://nextjs.org/)
- **Backend**: API Routes in Next.js (Server Actions potentially later)
- **Database**: [PostgreSQL](https://www.postgresql.org/) managed by [Prisma ORM](https://www.prisma.io/)
- **Styling**: CSS Modules
- **Testing**:
  - **Unit/Integration**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)
  - **E2E**: [Playwright](https://playwright.dev/)
- **Linting/Formatting**: ESLint, Prettier
- **CI/CD**: GitHub Actions

## Prerequisites

Before starting, ensure you have the following installed:

1.  **Node.js**: Version 20 or higher.
2.  **npm**: Comes with Node.js.
3.  **PostgreSQL**: A running PostgreSQL instance (local or remote).
4.  **Git**: For version control.

## Getting Started

Follow these steps to set up the project locally:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/fadiazahranzn/vora-web.git
    cd vora-web-app
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Copy the example environment file `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```
    Update `.env` with your PostgreSQL database URL and other secrets.
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/vora_db?schema=public"
    ```

4.  **Database Migration**:
    Initialize the database using Prisma:
    ```bash
    npx prisma migrate dev
    ```

5.  **Run Development Server**:
    Start the local development server:
    ```bash
    npm run dev
    ```
    The application will be available at [http://localhost:3000](http://localhost:3000).

## Scripts

Here are the available npm scripts:

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run lint:fix`: Automatically fixes ESLint issues.
- `npm run type-check`: Validates TypeScript types (no emit).
- `npm run format`: Formats code using Prettier.
- `npm test`: Runs unit and integration tests using Vitest.
- `npm run test:watch`: Runs Vitest in watch mode.
- `npm run test:coverage`: Generates test coverage reports.
- `npm run test:e2e`: Runs end-to-end tests using Playwright.
- `npm run prepare`: Sets up Husky git hooks.

## Project Structure

A high-level overview of the main directories:

```
vora-web-app/
├── .github/          # GitHub Actions workflows
├── e2e/              # Playwright E2E tests
├── public/           # Static assets (images, fonts, etc.)
├── src/
│   ├── app/          # Next.js App Router pages and layouts
│   ├── components/   # Reusable UI components (future)
│   ├── lib/          # Utilities and helper functions
│   └── __tests__/    # Unit and component tests
├── prisma/           # Database schema and migrations
├── stories/          # User stories and documentation
├── .env.example      # Example environment variables
├── package.json      # Project dependencies and scripts
└── README.md         # Project documentation
```

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct, branching strategy, and the process for submitting pull requests.

## Troubleshooting

### Deployment Issues

- **Build Failure**: Check `npm run build` locally first. Ensure `SKIP_ENV_VALIDATION=1` is set if running without full env vars in CI (temporarily).

### Database Issues

- **Connection Refused**: Verify your PostgreSQL service is running and the `DATABASE_URL` in `.env` is correct.
- **Migration Error**: If schema changes conflict, try resetting the database (careful locally!): `npx prisma migrate reset`.

### Testing Issues

- **Vitest Not Found**: Run `npm install` again to ensure devDependencies are installed.
- **Playwright Browser Missing**: Run `npx playwright install` to download browser binaries.

### Hydration Errors

- Ensure you are not mismatching server and client rendering output (e.g., `Date.now()` directly in render vs in a `useEffect`).

---

**Developed by the Vora Team**
