import { Browser, Page, ElementHandle, HTTPRequest } from 'puppeteer';
import * as puppeteer from 'puppeteer';

describe('Household Management E2E Tests', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    // Login first to access protected routes
    await page.goto('http://localhost:4200/login');
    await page.type('input[formControlName="email"]', 'test@example.com');
    await page.type('input[formControlName="password"]', 'password123');
    const loginButton = await page.$('button[type="submit"]');
    await loginButton?.click();
    await page.waitForNavigation();
    // Navigate to household management page
    await page.goto('http://localhost:4200/household');
  });

  afterEach(async () => {
    await page.close();
  });

  it('should display household management page', async () => {
    const title = await page.$('h1');
    const text = await page.evaluate(
      (el: HTMLHeadingElement | null) => el?.textContent || '',
      title
    );
    expect(text).toContain('Household Management');
  });

  it('should show add member button', async () => {
    const addButton = await page.$('[data-testid="add-member-button"]');
    expect(addButton).toBeTruthy();
  });

  it('should open add member modal when clicking add button', async () => {
    const addButton = await page.$('[data-testid="add-member-button"]');
    await addButton?.click();

    const modal = await page.$('[data-testid="add-member-modal"]');
    expect(modal).toBeTruthy();
  });

  it('should add a new household member', async () => {
    // Open add member modal
    const addButton = await page.$('[data-testid="add-member-button"]');
    await addButton?.click();

    // Fill in member details
    await page.type('[data-testid="member-name-input"]', 'John Doe');
    await page.type('[data-testid="member-email-input"]', 'john@example.com');
    await page.type('[data-testid="member-phone-input"]', '1234567890');

    // Submit form
    const submitButton = await page.$('[data-testid="submit-member-button"]');
    await submitButton?.click();

    // Wait for the new member to appear in the list
    await page.waitForSelector('[data-testid="member-item"]');
    const memberItems = await page.$$('[data-testid="member-item"]');
    expect(memberItems.length).toBeGreaterThan(0);
  });

  it('should show validation errors for invalid member form', async () => {
    // Open add member modal
    const addButton = await page.$('[data-testid="add-member-button"]');
    await addButton?.click();

    // Try to submit without filling required fields
    const submitButton = await page.$('[data-testid="submit-member-button"]');
    await submitButton?.click();

    // Check for validation errors
    const errors = await page.$$('mat-error');
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should edit an existing household member', async () => {
    // Find and click edit button for first member
    const editButton = await page.$('[data-testid="edit-member-button"]');
    await editButton?.click();

    // Update member details
    await page.type('[data-testid="member-name-input"]', ' Updated');
    await page.type('[data-testid="member-email-input"]', '.updated');

    // Submit form
    const submitButton = await page.$('[data-testid="submit-member-button"]');
    await submitButton?.click();

    // Verify updated member details
    const memberName = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="member-name"]');
      return el?.textContent || '';
    });
    expect(memberName).toContain('Updated');
  });

  it('should remove a household member', async () => {
    // Get initial member count
    const initialMembers = await page.$$('[data-testid="member-item"]');
    const initialCount = initialMembers.length;

    // Click remove button for first member
    const removeButton = await page.$('[data-testid="remove-member-button"]');
    await removeButton?.click();

    // Confirm removal in confirmation dialog
    const confirmButton = await page.$('[data-testid="confirm-remove-button"]');
    await confirmButton?.click();

    // Wait for member to be removed
    await page.waitForFunction(
      (count: number) => {
        const members = document.querySelectorAll(
          '[data-testid="member-item"]'
        );
        return members.length === count - 1;
      },
      { timeout: 5000 },
      initialCount
    );

    // Verify member count decreased
    const finalMembers = await page.$$('[data-testid="member-item"]');
    expect(finalMembers.length).toBe(initialCount - 1);
  });

  it('should show loading state while fetching members', async () => {
    await page.reload();
    const loadingSpinner = await page.$('mat-spinner');
    expect(loadingSpinner).toBeTruthy();
  });

  it('should handle error state when fetching members fails', async () => {
    // Simulate error by modifying network request
    await page.setRequestInterception(true);
    page.on('request', (request: HTTPRequest) => {
      if (request.url().includes('/api/household/members')) {
        request.respond({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal Server Error' }),
        });
      } else {
        request.continue();
      }
    });

    await page.reload();
    const errorMessage = await page.$('[data-testid="error-message"]');
    expect(errorMessage).toBeTruthy();
  });
});
