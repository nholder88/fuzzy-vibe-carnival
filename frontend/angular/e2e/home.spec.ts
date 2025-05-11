import { Browser, Page } from 'puppeteer';
import * as puppeteer from 'puppeteer';

describe('Home Page E2E Tests', () => {
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
    // Login first since home page requires authentication
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

  it('should display welcome message', async () => {
    const welcomeMessage = await page.$('h1');
    const text = await page.evaluate((el) => el?.textContent, welcomeMessage);
    expect(text).toContain('Welcome');
  });

  it('should show user profile information', async () => {
    const profileSection = await page.$('[data-testid="profile-section"]');
    expect(profileSection).toBeTruthy();
  });

  it('should navigate to dashboard when clicking dashboard link', async () => {
    const dashboardLink = await page.$('[data-testid="dashboard-link"]');
    await dashboardLink?.click();
    await page.waitForNavigation();
    expect(page.url()).toContain('/dashboard');
  });

  it('should show recent activity section', async () => {
    const activitySection = await page.$('[data-testid="recent-activity"]');
    expect(activitySection).toBeTruthy();
  });

  it('should allow logging out', async () => {
    const logoutButton = await page.$('[data-testid="logout-button"]');
    await logoutButton?.click();
    await page.waitForNavigation();
    expect(page.url()).toContain('/login');
  });
});
