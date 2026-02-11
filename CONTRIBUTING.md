# Contributing to Vora Web App

Thank you for your interest in contributing to the Vora Web App! We welcome contributions from everyone.

## Development Workflow

### Branching Strategy

We follow a structured branching strategy to maintain stability:

- **`main`**: The production-ready branch. Code here is deployed to production.
- **`develop`**: The integration branch for staging. All features are merged here first.
- **`feature/<story-id>-<short-description>`**: For new features (e.g., `feature/STORY-005-eslint-setup`).
- **`fix/<story-id>-<short-description>`**: For bug fixes (e.g., `fix/BUG-101-login-error`).
- **`hotfix/<short-description>`**: For critical production fixes directly to `main` (rare).

### Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

**Format:** `<type>(<scope>): <description>`

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation

**Examples:**
- `feat(auth): implement login with email`
- `fix(ui): resolve button alignment issue on mobile`
- `docs(readme): update setup instructions`

### Pull Request Process

1.  Create a new branch from `develop` (or `main` for hotfixes).
2.  Implement your changes. 
3.  Ensure all tests pass locally: `npm run test` and `npm run type-check`.
4.  Commit your changes using the conventional commit format.
5.  Push your branch to the repository.
6.  Open a Pull Request (PR) targeting `develop`.
7.  Fill out the PR template with relevant details (referenced stories, screenshots, test plan).
8.  Request a review from at least one team member.
9.  Once approved and CI checks pass, merge your PR.

## Code Standards

- **Linting**: We use ESLint. Run `npm run lint` to check for issues.
- **Formatting**: We use Prettier. Run `npm run format` to auto-format code.
- **Type Safety**: Try to avoid `any`. Ensure `npm run type-check` passes.

## Testing

- Write unit tests for utility functions.
- Write component tests for reusable UI components.
- Run `npm test` before pushing to ensure no regressions.

## Reporting Issues

If you find a bug or have a feature request, please open an issue in the repository with a detailed description.
