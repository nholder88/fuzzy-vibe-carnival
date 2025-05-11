import { Browser, Page } from 'puppeteer';
import * as puppeteer from 'puppeteer';

describe('Dashboard E2E Tests', () => {
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
    // Login and navigate to dashboard
    await page.goto('http://localhost:4200/login');
    await page.type('input[formControlName="email"]', 'test@example.com');
    await page.type('input[formControlName="password"]', 'password123');
    const loginButton = await page.$('button[type="submit"]');
    await loginButton?.click();
    await page.waitForNavigation();
    await page.goto('http://localhost:4200/dashboard');
  });

  afterEach(async () => {
    await page.close();
  });

  it('should display dashboard title', async () => {
    const title = await page.$('h1');
    const text = await page.evaluate((el) => el?.textContent, title);
    expect(text).toContain('Dashboard');
  });

  it('should display chores list', async () => {
    const choresList = await page.$('[data-testid="chores-list"]');
    expect(choresList).toBeTruthy();
  });

  it('should allow adding a new chore', async () => {
    const addButton = await page.$('[data-testid="add-chore-button"]');
    await addButton?.click();

    // Fill in new chore form
    await page.type('[data-testid="chore-title-input"]', 'Test Chore');
    await page.type(
      '[data-testid="chore-description-input"]',
      'Test Description'
    );

    const submitButton = await page.$('[data-testid="submit-chore-button"]');
    await submitButton?.click();

    // Wait for the new chore to appear in the list
    await page.waitForSelector('[data-testid="chore-item"]');
    const choreItems = await page.$$('[data-testid="chore-item"]');
    expect(choreItems.length).toBeGreaterThan(0);
  });

  it('should allow marking a chore as complete', async () => {
    const completeButton = await page.$(
      '[data-testid="complete-chore-button"]'
    );
    await completeButton?.click();

    const completedChore = await page.$('[data-testid="completed-chore"]');
    expect(completedChore).toBeTruthy();
  });

  it('should show chore details when clicking on a chore', async () => {
    const choreItem = await page.$('[data-testid="chore-item"]');
    await choreItem?.click();

    const choreDetails = await page.$('[data-testid="chore-details"]');
    expect(choreDetails).toBeTruthy();
  });

  it('should allow filtering chores by status', async () => {
    const filterSelect = await page.$('[data-testid="status-filter"]');
    await filterSelect?.click();

    const completedOption = await page.$('[data-testid="filter-completed"]');
    await completedOption?.click();

    const filteredChores = await page.$$('[data-testid="completed-chore"]');
    expect(filteredChores.length).toBeGreaterThan(0);
  });

  it('should show loading state while fetching chores', async () => {
    await page.reload();
    const loadingSpinner = await page.$('mat-spinner');
    expect(loadingSpinner).toBeTruthy();
  });
});
