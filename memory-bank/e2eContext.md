# E2E Test Context for Angular Frontend

## Framework & Setup
- **Framework:** Puppeteer (custom, not Cypress or Protractor)
- **Test Directory:** `frontend/angular/e2e/`
- **Test Runner:** Likely invoked via `npm run test:e2e` (see `jest.e2e.config.js`)
- **Headless Mode:** All tests run in headless Chrome
- **Authentication:** Most tests log in using a test user before running assertions

## E2E Test Files & Coverage

### 1. `login.spec.ts`
- **Covers:**
  - Login form rendering
  - Validation errors (empty/invalid input)
  - Error message for invalid credentials
  - Successful login (checks localStorage, navigation)
  - Loading spinner during login
  - Error message clearing on new attempt

### 2. `home.spec.ts`
- **Covers:**
  - Welcome message
  - User profile section
  - Navigation to dashboard
  - Recent activity section
  - Logout flow

### 3. `navigation.spec.ts`
- **Covers:**
  - Navigation menu rendering
  - Active route highlighting
  - Mobile menu toggle
  - Route navigation (dashboard, profile, home)
  - User info in nav
  - Navigation state persistence after reload

### 4. `dashboard.spec.ts`
- **Covers:**
  - Dashboard title
  - Chores list rendering
  - Adding a new chore
  - Marking a chore as complete
  - Chore details modal
  - Filtering chores by status
  - Loading spinner while fetching chores

## Gaps & Outdated Areas
- **Household management:** No E2E coverage for creating households, adding/removing members, or role-based access.
- **Inventory management:** No E2E tests for inventory flows.
- **Shopping list:** No E2E tests for shopping list or Instacart integration.
- **Edge cases:** Most tests are happy-path; limited negative/edge case coverage.
- **Test data:** Assumes a test user exists; no explicit setup/teardown for test data.

## Next Steps (Planned)
1. Add/expand E2E tests for household management (creation, member management, roles).
2. Add E2E tests for inventory and shopping list features.
3. Add more edge/negative case tests (e.g., unauthorized access, error states).
4. Improve test data management (fixtures, setup/teardown scripts).
5. Keep E2E tests in sync with UI/feature changes. 