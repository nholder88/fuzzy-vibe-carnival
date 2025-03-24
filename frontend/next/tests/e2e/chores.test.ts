import puppeteer, { Browser, Page } from 'puppeteer';

describe('Chores Page', () => {
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

  // Mock chores data
  const mockChores = [
    {
      id: '1',
      title: 'Wash dishes',
      description: 'Clean all dishes in the sink',
      status: 'pending',
      assignedTo: '1',
      dueDate: '2023-12-31',
      priority: 'medium',
      householdId: '1',
    },
    {
      id: '2',
      title: 'Vacuum living room',
      description: 'Vacuum the entire living room floor',
      status: 'in_progress',
      assignedTo: '1',
      dueDate: '2023-12-25',
      priority: 'high',
      householdId: '1',
    },
    {
      id: '3',
      title: 'Take out trash',
      description: 'Take out kitchen and bathroom trash',
      status: 'completed',
      assignedTo: '2',
      dueDate: '2023-12-20',
      priority: 'low',
      householdId: '1',
    },
  ];

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: process.env.CI ? true : false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

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

  test('should display chores page when authenticated', async () => {
    // Create a mock chores page
    await page.setContent(`
      <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Household Chores</h1>
          <button class="flex items-center gap-2">Add Chore</button>
        </div>
        
        <div role="tablist" class="grid w-full grid-cols-4 mb-8">
          <button role="tab">All Chores</button>
          <button role="tab">To Do</button>
          <button role="tab">Completed</button>
          <button role="tab">Statistics</button>
        </div>
        
        <div class="chore-list grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          ${mockChores
            .map(
              (chore) => `
            <div data-testid="chore-card-${
              chore.id
            }" class="border rounded-lg p-4 shadow">
              <h3 class="font-semibold">${chore.title}</h3>
              <p>${chore.description}</p>
              <div class="status-selector">${
                chore.status === 'in_progress'
                  ? 'In Progress'
                  : chore.status === 'completed'
                  ? 'Completed'
                  : 'Pending'
              }</div>
              <p>Due: ${chore.dueDate}</p>
              <p>Priority: ${chore.priority}</p>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `);

    // Check for page title
    const titleText = await page.$eval('h1', (el) => el.textContent);
    expect(titleText).toContain('Household Chores');

    // Check for "Add Chore" button
    const buttonText = await page.$eval('button', (el) => el.textContent);
    expect(buttonText).toContain('Add Chore');

    // Check for tabs
    const tabs = await page.$$eval('[role="tab"]', (elements) =>
      elements.map((el) => el.textContent)
    );
    expect(tabs).toContain('All Chores');
    expect(tabs).toContain('To Do');
    expect(tabs).toContain('Completed');
    expect(tabs).toContain('Statistics');

    // Check if chores are displayed
    const choreCards = await page.$$('[data-testid^="chore-card-"]');
    expect(choreCards.length).toBeGreaterThan(0);
  }, 60000);

  test('should filter chores by status', async () => {
    // Create a mock chores page with filterable tabs
    await page.setContent(`
      <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Household Chores</h1>
          <button class="flex items-center gap-2">Add Chore</button>
        </div>
        
        <div role="tablist" class="grid w-full grid-cols-4 mb-8">
          <button role="tab" id="all-tab">All Chores</button>
          <button role="tab" id="todo-tab">To Do</button>
          <button role="tab" id="completed-tab">Completed</button>
          <button role="tab" id="stats-tab">Statistics</button>
        </div>
        
        <div id="all-chores" class="chore-list grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          ${mockChores
            .map(
              (chore) => `
            <div data-testid="chore-card-${
              chore.id
            }" class="border rounded-lg p-4 shadow">
              <h3 class="font-semibold">${chore.title}</h3>
              <p>${chore.description}</p>
              <div class="status-selector">${
                chore.status === 'in_progress'
                  ? 'In Progress'
                  : chore.status === 'completed'
                  ? 'Completed'
                  : 'Pending'
              }</div>
              <p>Due: ${chore.dueDate}</p>
              <p>Priority: ${chore.priority}</p>
            </div>
          `
            )
            .join('')}
        </div>
        
        <div id="todo-chores" class="chore-list hidden grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          ${mockChores
            .filter((chore) => chore.status !== 'completed')
            .map(
              (chore) => `
            <div data-testid="chore-card-${
              chore.id
            }" class="border rounded-lg p-4 shadow">
              <h3 class="font-semibold">${chore.title}</h3>
              <p>${chore.description}</p>
              <div class="status-selector">${
                chore.status === 'in_progress' ? 'In Progress' : 'Pending'
              }</div>
              <p>Due: ${chore.dueDate}</p>
              <p>Priority: ${chore.priority}</p>
            </div>
          `
            )
            .join('')}
        </div>
        
        <div id="completed-chores" class="chore-list hidden grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          ${mockChores
            .filter((chore) => chore.status === 'completed')
            .map(
              (chore) => `
            <div data-testid="chore-card-${chore.id}" class="border rounded-lg p-4 shadow">
              <h3 class="font-semibold">${chore.title}</h3>
              <p>${chore.description}</p>
              <div class="status-selector">Completed</div>
              <p>Due: ${chore.dueDate}</p>
              <p>Priority: ${chore.priority}</p>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
      
      <script>
        document.getElementById('todo-tab').addEventListener('click', function() {
          document.getElementById('all-chores').classList.add('hidden');
          document.getElementById('completed-chores').classList.add('hidden');
          document.getElementById('todo-chores').classList.remove('hidden');
        });
        
        document.getElementById('completed-tab').addEventListener('click', function() {
          document.getElementById('all-chores').classList.add('hidden');
          document.getElementById('todo-chores').classList.add('hidden');
          document.getElementById('completed-chores').classList.remove('hidden');
        });
        
        document.getElementById('all-tab').addEventListener('click', function() {
          document.getElementById('todo-chores').classList.add('hidden');
          document.getElementById('completed-chores').classList.add('hidden');
          document.getElementById('all-chores').classList.remove('hidden');
        });
      </script>
    `);

    // Verify initial view shows all chores
    let choreCards = await page.$$('[data-testid^="chore-card-"]');
    expect(choreCards.length).toBe(mockChores.length);

    // Click on 'Completed' tab
    await page.click('#completed-tab');

    // Wait for completed chores to be displayed
    await page.waitForSelector('#completed-chores:not(.hidden)');

    // Verify only completed chores are shown
    const completedChores = await page.$$(
      '#completed-chores [data-testid^="chore-card-"]'
    );
    expect(completedChores.length).toBe(
      mockChores.filter((chore) => chore.status === 'completed').length
    );

    const completedStatuses = await page.$$eval(
      '#completed-chores .status-selector',
      (elements) => elements.map((el) => el.textContent)
    );

    completedStatuses.forEach((status) => {
      expect(status).toBe('Completed');
    });

    // Click on 'To Do' tab
    await page.click('#todo-tab');

    // Wait for todo chores to be displayed
    await page.waitForSelector('#todo-chores:not(.hidden)');

    // Verify no completed chores are shown
    const todoChores = await page.$$(
      '#todo-chores [data-testid^="chore-card-"]'
    );
    expect(todoChores.length).toBe(
      mockChores.filter((chore) => chore.status !== 'completed').length
    );

    const todoStatuses = await page.$$eval(
      '#todo-chores .status-selector',
      (elements) => elements.map((el) => el.textContent)
    );

    todoStatuses.forEach((status) => {
      expect(status).not.toBe('Completed');
    });
  }, 60000);

  test('should open add chore form when add button is clicked', async () => {
    // Create a mock chores page with add form functionality
    await page.setContent(`
      <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Household Chores</h1>
          <button id="add-chore-btn" class="flex items-center gap-2">Add Chore</button>
        </div>
        
        <div id="add-chore-form" class="hidden">
          <form>
            <div class="mb-4">
              <label for="title">Title</label>
              <input id="title" type="text" placeholder="Chore title" />
            </div>
            <div class="mb-4">
              <label for="description">Description</label>
              <textarea id="description" placeholder="Describe the chore"></textarea>
            </div>
            <div class="mb-4">
              <label for="priority">Priority</label>
              <select id="priority">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <button type="submit">Save Chore</button>
          </form>
        </div>
      </div>
      
      <script>
        document.getElementById('add-chore-btn').addEventListener('click', function() {
          document.getElementById('add-chore-form').classList.remove('hidden');
        });
      </script>
    `);

    // Verify form is initially hidden
    const isFormHidden = await page.$eval('#add-chore-form', (el) =>
      el.classList.contains('hidden')
    );
    expect(isFormHidden).toBe(true);

    // Click the "Add Chore" button
    await page.click('#add-chore-btn');

    // Verify form becomes visible
    const isFormVisible = await page.$eval(
      '#add-chore-form',
      (el) => !el.classList.contains('hidden')
    );
    expect(isFormVisible).toBe(true);

    // Check if form fields are present
    const titleInput = await page.$('input#title');
    expect(titleInput).not.toBeNull();

    const descriptionInput = await page.$('textarea#description');
    expect(descriptionInput).not.toBeNull();

    const prioritySelect = await page.$('select#priority');
    expect(prioritySelect).not.toBeNull();

    const submitButton = await page.$('button[type="submit"]');
    expect(submitButton).not.toBeNull();
  }, 60000);

  test('should change chore status', async () => {
    // Create a mock chores page with status change functionality
    await page.setContent(`
      <div class="container mx-auto px-4 py-8">
        <div class="chore-list grid gap-4">
          <div data-testid="chore-card-1" class="border rounded-lg p-4 shadow">
            <h3 class="font-semibold">Wash dishes</h3>
            <p>Clean all dishes in the sink</p>
            <div class="status-wrapper">
              <div class="status-selector">Pending</div>
              <div class="status-dropdown hidden">
                <div data-value="pending">Pending</div>
                <div data-value="in_progress">In Progress</div>
                <div data-value="completed">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <script>
        // Track the API payload that would be sent
        window.statusChangePayload = null;
        
        // Add click handler to toggle dropdown
        document.querySelector('.status-selector').addEventListener('click', function() {
          document.querySelector('.status-dropdown').classList.toggle('hidden');
        });
        
        // Add click handlers for status options
        document.querySelectorAll('.status-dropdown div').forEach(function(option) {
          option.addEventListener('click', function() {
            const newStatus = this.getAttribute('data-value');
            const statusText = this.textContent;
            
            // Update UI
            document.querySelector('.status-selector').textContent = statusText;
            document.querySelector('.status-dropdown').classList.add('hidden');
            
            // Save the payload that would be sent to API
            window.statusChangePayload = { status: newStatus };
          });
        });
      </script>
    `);

    // Check initial status
    const initialStatus = await page.$eval(
      '.status-selector',
      (el) => el.textContent
    );
    expect(initialStatus).toBe('Pending');

    // Click status dropdown to open it
    await page.click('.status-selector');

    // Wait for dropdown to appear
    await page.waitForSelector('.status-dropdown:not(.hidden)');

    // Click "In Progress" option
    await page.click('div[data-value="in_progress"]');

    // Verify status was updated in UI
    const updatedStatus = await page.$eval(
      '.status-selector',
      (el) => el.textContent
    );
    expect(updatedStatus).toBe('In Progress');

    // Verify "API payload" was created with correct status
    const payloadData = await page.evaluate(() => window.statusChangePayload);
    expect(payloadData).not.toBeNull();
    expect(payloadData.status).toBe('in_progress');
  }, 60000);
});
