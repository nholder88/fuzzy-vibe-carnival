import { Browser, Page } from 'puppeteer';
import * as puppeteer from 'puppeteer';

describe('Navigation E2E Tests', () => {
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
  });

  afterEach(async () => {
    await page.close();
  });

  it('should display navigation menu', async () => {
    const navMenu = await page.$('[data-testid="nav-menu"]');
    expect(navMenu).toBeTruthy();
  });

  it('should highlight active route', async () => {
    await page.goto('http://localhost:4200/dashboard');
    const activeLink = await page.$('[data-testid="nav-link-active"]');
    const text = await page.evaluate((el) => el?.textContent, activeLink);
    expect(text).toContain('Dashboard');
  });

  it('should toggle mobile menu', async () => {
    // Set mobile viewport
    await page.setViewport({ width: 375, height: 667 });

    const menuButton = await page.$('[data-testid="mobile-menu-button"]');
    await menuButton?.click();

    const mobileMenu = await page.$('[data-testid="mobile-menu"]');
    const isVisible = await page.evaluate((el) => {
      const style = window.getComputedStyle(el as Element);
      return style.display !== 'none';
    }, mobileMenu);

    expect(isVisible).toBe(true);
  });

  it('should navigate to different routes', async () => {
    // Navigate to Dashboard
    const dashboardLink = await page.$('[data-testid="nav-link-dashboard"]');
    await dashboardLink?.click();
    await page.waitForNavigation();
    expect(page.url()).toContain('/dashboard');

    // Navigate to Profile
    const profileLink = await page.$('[data-testid="nav-link-profile"]');
    await profileLink?.click();
    await page.waitForNavigation();
    expect(page.url()).toContain('/profile');

    // Navigate to Home
    const homeLink = await page.$('[data-testid="nav-link-home"]');
    await homeLink?.click();
    await page.waitForNavigation();
    expect(page.url()).toBe('http://localhost:4200/');
  });

  it('should show user info in navigation', async () => {
    const userInfo = await page.$('[data-testid="nav-user-info"]');
    expect(userInfo).toBeTruthy();
  });

  it('should persist navigation state after page reload', async () => {
    await page.goto('http://localhost:4200/dashboard');
    await page.reload();

    const activeLink = await page.$('[data-testid="nav-link-active"]');
    const text = await page.evaluate((el) => el?.textContent, activeLink);
    expect(text).toContain('Dashboard');
  });
});
