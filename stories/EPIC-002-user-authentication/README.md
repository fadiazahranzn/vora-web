# EPIC-002: Implement User Authentication — Story Index

**Epic ID:** EPIC-002  
**Epic Title:** Implement User Authentication  
**Epic Description:** Enable users to create accounts, sign in securely, and maintain persistent sessions so that their data is private and accessible only to them across devices.

---

## Story Index by Role

### Frontend Stories
| Story ID | Title | Priority | Story Points | Status | File |
|----------|-------|----------|--------------|--------|------|
| STORY-001 | Build Login Page UI | Must Have | 3 | Not Started | [Link](./Frontend/STORY-001-login-page-ui.md) |
| STORY-002 | Build Registration Page UI | Must Have | 3 | Not Started | [Link](./Frontend/STORY-002-registration-page-ui.md) |
| STORY-003 | Implement Auth State & Route Protection | Must Have | 3 | Not Started | [Link](./Frontend/STORY-003-auth-state-route-protection.md) |

### Backend Stories
| Story ID | Title | Priority | Story Points | Status | File |
|----------|-------|----------|--------------|--------|------|
| STORY-004 | Configure NextAuth.js with Credentials Provider | Must Have | 5 | Not Started | [Link](./Backend/STORY-004-nextauth-credentials-provider.md) |
| STORY-005 | Implement Google OAuth Provider | Must Have | 3 | Not Started | [Link](./Backend/STORY-005-google-oauth-provider.md) |
| STORY-006 | Implement Account Lockout Mechanism | Must Have | 3 | Not Started | [Link](./Backend/STORY-006-account-lockout.md) |
| STORY-007 | Build Registration API Endpoint | Must Have | 3 | Not Started | [Link](./Backend/STORY-007-registration-api.md) |
| STORY-008 | Implement requireAuth Guard Utility | Must Have | 2 | Not Started | [Link](./Backend/STORY-008-require-auth-guard.md) |

---

## Story Dependency Map
```
STORY-004 ──► STORY-005
STORY-004 ──► STORY-006
STORY-007 ──► STORY-002
STORY-004 ──► STORY-001
STORY-004 ──► STORY-003
STORY-004 ──► STORY-008
```

## Total Estimates
- **Total Story Points:** 25
- **Frontend:** 9
- **Backend:** 16
- **By Priority:**
  - **Must Have:** 25
