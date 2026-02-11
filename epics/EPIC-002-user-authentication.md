# EPIC-002: Implement User Authentication

## Business Value Statement

Enable users to create accounts, sign in securely, and maintain persistent sessions so that their habits, tasks, and analytics data are private and accessible only to them across devices.

## Description

This EPIC covers the full authentication lifecycle: email/password registration with validation, Google OAuth sign-in, email/password login, JWT session management via HTTP-only cookies, session persistence across browser restarts, logout, and account lockout after repeated failed attempts. The implementation uses NextAuth.js v5 with the Prisma adapter.

## Source Traceability

| Document  | Reference          | Section / Page                 |
| --------- | ------------------ | ------------------------------ |
| FSD       | FR-001             | Email registration             |
| FSD       | FR-002             | Google OAuth login             |
| FSD       | FR-003             | Email/password login           |
| FSD       | FR-004             | Logout                         |
| FSD       | FR-005             | Session management             |
| FSD       | BR-001 to BR-010   | Auth business rules            |
| TDD       | Auth Module        | §4.3 Authentication & Auth     |
| TDD       | Security Controls  | §6.1 Security Controls         |
| Wireframe | Login Screen       | Screen 1                       |
| Wireframe | Register Screen    | Screen 1                       |
| Wireframe | Settings (Logout)  | Screen 9                       |

## Scope Definition

| In Scope                                              | Out of Scope                          |
| ----------------------------------------------------- | ------------------------------------- |
| NextAuth.js v5 configuration with Prisma adapter       | Email verification flow               |
| Credentials provider (email + password)                | Password reset / forgot password      |
| Google OAuth provider                                  | Two-factor authentication             |
| Password hashing with bcrypt (12 rounds)               | Social providers beyond Google        |
| JWT session strategy (30-day expiry)                    | Admin role / role-based access        |
| Login page UI (email, password, Google button)          | User profile editing (→ EPIC-008)     |
| Registration page UI (name, email, password, confirm)   | —                                     |
| Password validation (min 8, 1 upper, 1 lower, 1 digit) | —                                     |
| Account lockout (5 failures → 15 min) (BR-006)          | —                                     |
| `requireAuth()` guard utility for API routes             | —                                     |
| Redirect unauthenticated users to `/login`               | —                                     |

## High-Level Acceptance Criteria

- [ ] User can register with name, email, and password (validated per BR-002)
- [ ] Duplicate email registration returns appropriate error (BR-003)
- [ ] User can sign in with Google OAuth and account is created/linked
- [ ] User can log in with email and password
- [ ] Invalid credentials show generic error message (BR-005)
- [ ] Account locks after 5 failed login attempts for 15 minutes (BR-006)
- [ ] JWT session persists across browser restarts (30-day expiry)
- [ ] Authenticated user is redirected from `/login` to `/`
- [ ] Unauthenticated user is redirected from `/` to `/login`
- [ ] Logout clears session and redirects to `/login`
- [ ] All API routes under `(app)` return 401 without valid session

## Dependencies

- **Prerequisite EPICs:** EPIC-001 (database, Prisma schema with User/Account/Session models)
- **External Dependencies:** Google Cloud Console (OAuth client ID/secret)
- **Technical Prerequisites:** PostgreSQL running, environment variables configured

## Complexity Assessment

- **Size:** M
- **Technical Complexity:** Medium
- **Integration Complexity:** Medium (Google OAuth)
- **Estimated Story Count:** 7–9

## Risks & Assumptions

**Assumptions:**
- Google OAuth credentials are pre-configured in Google Cloud Console
- NEXTAUTH_SECRET environment variable is securely generated
- Email verification is deferred to a future iteration

**Risks:**
- JWT decryption errors (`JWEDecryptionFailed`) if NEXTAUTH_SECRET changes between deployments
- Google OAuth callback URL misconfiguration in different environments
- Account lockout state storage (in-memory won't persist across serverless invocations — needs DB or Redis)

## Related EPICs

- **Depends On:** EPIC-001
- **Blocks:** EPIC-003, EPIC-004, EPIC-005, EPIC-006, EPIC-007
- **Related:** EPIC-010 (security hardening)
