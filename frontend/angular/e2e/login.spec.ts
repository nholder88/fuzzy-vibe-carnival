import { Browser, Page } from 'puppeteer';
import * as puppeteer from 'puppeteer';

describe('Login E2E Tests', () => {
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
    await page.goto('http://localhost:4200/login');
  });

  afterEach(async () => {
    await page.close();
  });

  it('should display login form', async () => {
    const emailInput = await page.$('input[formControlName="email"]');
    const passwordInput = await page.$('input[formControlName="password"]');
    const loginButton = await page.$('button[type="submit"]');

    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(loginButton).toBeTruthy();
  });

  it('should show validation errors for empty form submission', async () => {
    const loginButton = await page.$('button[type="submit"]');
    await loginButton?.click();

    await page.waitForSelector('mat-error');
    const errors = await page.$$('mat-error');
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should show error for invalid credentials', async () => {
    await page.type('input[formControlName="email"]', 'invalid@example.com');
    await page.type('input[formControlName="password"]', 'wrongpassword');

    const loginButton = await page.$('button[type="submit"]');
    await loginButton?.click();

    await page.waitForSelector('.error-message');
    const errorMessage = await page.$eval(
      '.error-message',
      (el) => el.textContent
    );
    expect(errorMessage).toContain('Login failed');
  });

  it('should successfully login with valid credentials', async () => {
    await page.type('input[formControlName="email"]', 'test@example.com');
    await page.type('input[formControlName="password"]', 'password123');

    const loginButton = await page.$('button[type="submit"]');
    await loginButton?.click();

    // Wait for navigation to home page
    await page.waitForNavigation();
    expect(page.url()).toBe('http://localhost:4200/');

    // Verify local storage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const user = await page.evaluate(() => localStorage.getItem('user'));

    expect(token).toBeTruthy();
    expect(user).toBeTruthy();
  });

  it('should show loading state during login', async () => {
    await page.type('input[formControlName="email"]', 'test@example.com');
    await page.type('input[formControlName="password"]', 'password123');

    const loginButton = await page.$('button[type="submit"]');
    await loginButton?.click();

    const spinner = await page.$('mat-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should clear error message when starting a new login attempt', async () => {
    // First, trigger an error
    await page.type('input[formControlName="email"]', 'invalid@example.com');
    await page.type('input[formControlName="password"]', 'wrongpassword');
    const loginButton = await page.$('button[type="submit"]');
    await loginButton?.click();
    await page.waitForSelector('.error-message');

    // Clear fields and try again
    await page.$eval(
      'input[formControlName="email"]',
      (el) => ((el as HTMLInputElement).value = '')
    );
    await page.$eval(
      'input[formControlName="password"]',
      (el) => ((el as HTMLInputElement).value = '')
    );
    await page.type('input[formControlName="email"]', 'test@example.com');
    await page.type('input[formControlName="password"]', 'password123');

    // Error message should be gone
    const errorMessage = await page.$('.error-message');
    expect(errorMessage).toBeNull();
  });
});
