import puppeteer, { Browser, Page } from 'puppeteer';

// Define a simple interface for our WebSocket events
interface WebSocketConnection {
  on(event: 'message', callback: (data: any) => void): void;
}

describe('Chore Status Change', () => {
  let browser: Browser;
  let page: Page;
  let apiCallData: any = null;
  let wsMessages: any[] = [];

  const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
  const TEST_USER = {
    email: 'test@example.com',
    password: 'Password123!',
  };
  const TEST_CHORE_ID = '1'; // ID of a chore to interact with

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: process.env.CI ? true : false, // Show browser during local development
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();

    // Set up network interception for API requests
    await page.setRequestInterception(true);

    // Capture API calls for validation
    page.on('request', async (request) => {
      // Allow the request to continue
      await request.continue();
    });

    // Capture API responses and WebSocket messages
    page.on('response', async (response) => {
      const url = response.url();
      // Capture status update API call
      if (
        url.includes('/api/chores') &&
        url.includes('/status') &&
        response.request().method() === 'PATCH'
      ) {
        try {
          apiCallData = await response.json();
        } catch (error) {
          console.error('Error parsing API response:', error);
        }
      }
    });

    // Monitor WebSocket communication if applicable
    page.on('websocket', (ws: unknown) => {
      // Use type assertion to work with the websocket
      (ws as WebSocketConnection).on('message', (data: any) => {
        try {
          const parsedData = JSON.parse(
            typeof data === 'string' ? data : data.toString()
          );
          if (parsedData.type === 'chore-update') {
            wsMessages.push(parsedData);
          }
        } catch (error) {
          // Ignore parsing errors for non-JSON messages
        }
      });
    });

    // Set viewport size
    await page.setViewport({ width: 1280, height: 800 });
  });

  afterEach(async () => {
    await page.close();
    // Reset captured data
    apiCallData = null;
    wsMessages = [];
  });

  afterAll(async () => {
    await browser.close();
  });

  test('should login, change chore status and verify API response', async () => {
    // Step 1: Navigate to login page
    await page.goto(`${BASE_URL}/login`);

    // Ensure login form is loaded
    await page.waitForSelector('form');

    // Step 2: Log in as test user
    await page.type('#email', TEST_USER.email);
    await page.type('#password', TEST_USER.password);
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);

    // Verify successful login by checking for dashboard elements
    await page.waitForSelector('h1');
    const title = await page.$eval('h1', (el) => el.textContent);
    expect(title).toContain('Dashboard');

    // Step 3: Navigate to the chores page
    await Promise.all([
      page.click('a[href="/chores"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);

    // Verify we're on chores page
    await page.waitForSelector('h1');
    const choresTitle = await page.$eval('h1', (el) => el.textContent);
    expect(choresTitle).toContain('Chores');

    // Wait for the chore cards to be loaded
    await page.waitForSelector(`[data-testid="chore-card-${TEST_CHORE_ID}"]`);

    // Step 4: Change chore status to 'in_progress'
    // First, check current status
    const initialStatus = await page.$eval(
      `[data-testid="chore-card-${TEST_CHORE_ID}"] .w-[140px]`,
      (el) => el.textContent
    );
    console.log(`Initial chore status: ${initialStatus}`);

    // Open the select dropdown
    await page.click(`[data-testid="chore-card-${TEST_CHORE_ID}"] .w-[140px]`);

    // Click the 'in_progress' option
    await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes(`/api/chores/${TEST_CHORE_ID}/status`) &&
          response.request().method() === 'PATCH'
      ),
      page.click('div[data-value="in_progress"]'),
    ]);

    // Step 5: Verify the UI was updated
    await page.waitForFunction(
      (choreId) => {
        const element = document.querySelector(
          `[data-testid="chore-card-${choreId}"] .w-[140px]`
        );
        return element && element.textContent?.includes('In Progress');
      },
      {},
      TEST_CHORE_ID
    );

    // Step 6: Verify the API response
    expect(apiCallData).not.toBeNull();
    expect(apiCallData.id).toBe(TEST_CHORE_ID);
    expect(apiCallData.status).toBe('in_progress');

    // Step 7: Verify WebSocket messages if applicable
    if (wsMessages.length > 0) {
      const statusUpdateMessage = wsMessages.find(
        (msg) => msg.type === 'chore-update' && msg.data.id === TEST_CHORE_ID
      );

      expect(statusUpdateMessage).toBeDefined();
      expect(statusUpdateMessage.data.status).toBe('in_progress');
    }
  });
});
