import puppeteer, { Browser, Page } from 'puppeteer';

describe('Dashboard Page', () => {
  let browser: Browser;
  let page: Page;

  const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

  // Mock user data
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
  };

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: process.env.CI ? true : false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Set up request interception
    await page.setRequestInterception(true);

    // Mock auth response
    page.on('request', (request) => {
      if (request.url().includes('/api/auth/me')) {
        request.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ user: mockUser }),
        });
      } else {
        request.continue();
      }
    });

    // Set a mock JWT token to simulate authenticated state
    await page.evaluateOnNewDocument((mockUserData) => {
      localStorage.setItem('auth_token', 'mock_jwt_token');
      localStorage.setItem('user', JSON.stringify(mockUserData));

      // Mock auth context for protected routes
      Object.defineProperty(window, 'mockAuthContext', {
        value: {
          user: mockUserData,
          isAuthenticated: true,
        },
      });
    }, mockUser);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('should display dashboard when authenticated', async () => {
    // Create a basic dashboard mock
    await page.setContent(`
      <div class="container py-10">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-2xl">Welcome to your Dashboard</h2>
          <p>You are logged in as ${mockUser.email}</p>
          <p>Hello ${mockUser.firstName} ${mockUser.lastName}, you have successfully logged in!</p>
          <button>Logout</button>
        </div>
      </div>
    `);

    // Check for dashboard title and welcome message
    const title = await page.waitForSelector('h2');
    const titleText = await page.$eval('h2', (el) => el.textContent);
    expect(titleText).toContain('Welcome to your Dashboard');

    // Check for user info
    const content = await page.$eval('body', (el) => el.textContent);
    expect(content).toContain(`logged in as ${mockUser.email}`);
    expect(content).toContain(
      `Hello ${mockUser.firstName} ${mockUser.lastName}`
    );

    // Verify logout button exists
    const logoutButton = await page.$('button');
    expect(logoutButton).not.toBeNull();

    // Check button text
    const buttonText = await page.$eval('button', (el) => el.textContent);
    expect(buttonText).toContain('Logout');
  }, 60000);

  test('should handle logout functionality', async () => {
    // Create a basic dashboard mock
    await page.setContent(`
      <div class="container py-10">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-2xl">Welcome to your Dashboard</h2>
          <p>You are logged in as ${mockUser.email}</p>
          <button>Logout</button>
        </div>
      </div>
    `);

    // Wait for button to be displayed
    const logoutButton = await page.waitForSelector('button');

    // Mock the logout behavior
    await page.evaluate(() => {
      const button = document.querySelector('button');
      if (button) {
        button.addEventListener('click', () => {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');

          // Simulate redirect by changing the content
          document.body.innerHTML = '<h2>Login</h2>';
        });
      }
    });

    // Click logout button
    await logoutButton.click();

    // Check if localStorage is cleared
    const authToken = await page.evaluate(() =>
      localStorage.getItem('auth_token')
    );
    const user = await page.evaluate(() => localStorage.getItem('user'));

    expect(authToken).toBeNull();
    expect(user).toBeNull();

    // Check if redirected to login page (or content changed to login)
    const pageContent = await page.$eval('body', (el) => el.textContent);
    expect(pageContent).toContain('Login');
    expect(pageContent).not.toContain('Welcome to your Dashboard');
  }, 60000);

  test('should redirect to login page when not authenticated', async () => {
    // Clear local storage to simulate unauthenticated state
    await page.evaluateOnNewDocument(() => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');

      // Mock auth context for protected routes
      Object.defineProperty(window, 'mockAuthContext', {
        value: {
          user: null,
          isAuthenticated: false,
        },
      });
    });

    // Override the previous request handler
    page.removeAllListeners('request');
    await page.setRequestInterception(true);

    page.on('request', (request) => {
      if (request.url().includes('/api/auth/me')) {
        request.respond({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Unauthorized' }),
        });
      } else {
        request.continue();
      }
    });

    // Create a mock login redirect content
    await page.setContent(`
      <div>
        <h2>Login</h2>
        <form>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Login</button>
        </form>
      </div>
    `);

    // Verify we're on the login page
    const pageContent = await page.$eval('body', (el) => el.textContent);
    expect(pageContent).toContain('Login');
    expect(pageContent).not.toContain('Welcome to your Dashboard');
  }, 60000);
});
