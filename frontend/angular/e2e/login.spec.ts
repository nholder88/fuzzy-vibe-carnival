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
    // Wait for the form to be rendered
    await page.waitForSelector('form');
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

    // Wait for validation errors to appear
    await page.waitForFunction(() => {
      const errors = document.querySelectorAll('mat-error');
      return errors.length > 0;
    });

    const errors = await page.$$('mat-error');
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should show error for invalid credentials', async () => {
    await page.type('input[formControlName="email"]', 'invalid@example.com');
    await page.type('input[formControlName="password"]', 'wrongpassword');

    const loginButton = await page.$('button[type="submit"]');
    await loginButton?.click();

    // Wait for error message
    await page.waitForFunction(() => {
      const error = document.querySelector('[data-testid="login-error"]');
      return error !== null;
    });

    const errorMessage = await page.$eval(
      '[data-testid="login-error"]',
      (el) => el.textContent
    );
    expect(errorMessage).toContain('Invalid credentials');
  });

  it('should successfully login with valid credentials', async () => {
    await page.type('input[formControlName="email"]', 'test@example.com');
    await page.type('input[formControlName="password"]', 'password123');

    const loginButton = await page.$('button[type="submit"]');
    await loginButton?.click();

    // Wait for navigation and local storage update
    await Promise.all([
      page.waitForNavigation(),
      page.waitForFunction(() => {
        return localStorage.getItem('token') !== null;
      }),
    ]);

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

    // Wait for spinner to appear
    await page.waitForSelector('[data-testid="login-spinner"]');
    const spinner = await page.$('[data-testid="login-spinner"]');
    expect(spinner).toBeTruthy();
  });

  it('should clear error message when starting a new login attempt', async () => {
    // First, trigger an error
    await page.type('input[formControlName="email"]', 'invalid@example.com');
    await page.type('input[formControlName="password"]', 'wrongpassword');
    const loginButton = await page.$('button[type="submit"]');
    await loginButton?.click();

    // Wait for error message
    await page.waitForSelector('[data-testid="login-error"]');

    // Clear fields and type new values
    await page.evaluate(() => {
      const emailInput = document.querySelector(
        'input[formControlName="email"]'
      ) as HTMLInputElement;
      const passwordInput = document.querySelector(
        'input[formControlName="password"]'
      ) as HTMLInputElement;
      if (emailInput) emailInput.value = '';
      if (passwordInput) passwordInput.value = '';
    });

    await page.type('input[formControlName="email"]', 'test@example.com');
    await page.type('input[formControlName="password"]', 'password123');

    // Error message should be gone
    const errorMessage = await page.$('[data-testid="login-error"]');
    expect(errorMessage).toBeNull();
  });
});
