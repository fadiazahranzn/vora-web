# STORY-006: Implement Account Lockout Mechanism

**Epic:** EPIC-002 - Implement User Authentication  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a security-conscious platform,  
I want accounts to temporarily lock after repeated failed login attempts,  
So that brute-force password attacks are mitigated.

## Description
Implement server-side account lockout that tracks consecutive failed login attempts. After 5 failures, the account is locked for 15 minutes. Store `failed_login_attempts` counter and `locked_until` timestamp on the User model. Reset the counter on successful login.

## Acceptance Criteria
```gherkin
GIVEN a user has 0 failed login attempts
WHEN they enter incorrect credentials 4 times
THEN the login fails normally each time and the counter increments to 4

GIVEN a user has 4 failed login attempts
WHEN they enter incorrect credentials a 5th time
THEN the account is locked and the user sees "Too many failed attempts. Please try again in 15 minutes."

GIVEN an account is locked
WHEN the user tries to log in with correct credentials within 15 minutes
THEN the login is rejected with the lockout message

GIVEN an account is locked
WHEN 15 minutes have elapsed
THEN the lockout expires and the user can log in normally

GIVEN a user has 3 failed attempts
WHEN they log in successfully
THEN the failed_login_attempts counter resets to 0
```

## Business Rules
- **BR-006:** Lock account after 5 consecutive failed login attempts for 15 minutes

## Technical Notes
- Fields on User model: `failed_login_attempts Int @default(0)`, `locked_until DateTime?`
- Check lockout in the Credentials provider `authorize` function before password verification
- Reset counter in the `authorize` function after successful login
- Lockout check: `locked_until && locked_until > new Date()` → reject
- Error response should NOT reveal whether the email exists (avoid user enumeration)

## Traceability
- **FSD Reference:** FR-003 (Login), BR-006
- **TDD Reference:** §6.1 Security Controls
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** STORY-004 (NextAuth Credentials provider)
- **Blocks:** None
- **External Dependencies:** None

## Definition of Done
- [ ] Failed login attempts tracked in User model
- [ ] Account locks after 5 failed attempts
- [ ] Lockout lasts 15 minutes
- [ ] Successful login resets counter
- [ ] Lockout expiry allows re-login
- [ ] Error messages don't expose user existence
- [ ] Unit tests for lockout logic passing
- [ ] Code merged to main branch
