#!/usr/bin/env node

/**
 * This script tests the rendering of Storybook stories using Puppeteer
 * It will open each story and check for errors
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Get all story files
const STORIES_DIR = path.join(__dirname, '../stories');
const storyFiles = fs.readdirSync(STORIES_DIR)
    .filter(file => file.endsWith('.stories.tsx'))
    .map(file => path.join(STORIES_DIR, file));

// Function to extract stories from a file
function extractStoriesFromFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const storyExports = content.match(/export const (\w+):/g) || [];

    return storyExports.map(exp => {
        const storyName = exp.match(/export const (\w+):/)[1];
        const componentName = path.basename(filePath, '.stories.tsx');
        return { componentName, storyName };
    });
}

// Extract all stories
const allStories = [];
storyFiles.forEach(file => {
    const stories = extractStoriesFromFile(file);
    allStories.push(...stories);
});

console.log(`Found ${allStories.length} stories in ${storyFiles.length} files.`);

async function testStories() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // To capture console errors
    const consoleErrors = [];
    page.on('console', message => {
        if (message.type() === 'error') {
            consoleErrors.push({
                text: message.text(),
                location: message.location()
            });
        }
    });

    const results = [];

    for (const story of allStories) {
        const storyUrl = `http://localhost:6006/?path=/story/${story.componentName.toLowerCase()}-${story.storyName.toLowerCase()}`;

        console.log(`Testing: ${story.componentName}/${story.storyName}`);

        // Clear previous errors
        consoleErrors.length = 0;

        try {
            await page.goto(storyUrl, { waitUntil: 'networkidle2', timeout: 30000 });

            // Wait for the story to render
            await page.waitForSelector('#storybook-root', { timeout: 5000 });

            const result = {
                component: story.componentName,
                story: story.storyName,
                url: storyUrl,
                status: consoleErrors.length === 0 ? 'success' : 'error',
                errors: [...consoleErrors]
            };

            results.push(result);

            console.log(`  Status: ${result.status}`);
            if (result.errors.length > 0) {
                console.log(`  Errors: ${result.errors.length}`);
            }
        } catch (error) {
            console.error(`  Failed to load story: ${error.message}`);

            results.push({
                component: story.componentName,
                story: story.storyName,
                url: storyUrl,
                status: 'error',
                errors: [{ text: error.message }]
            });
        }
    }

    await browser.close();

    // Generate HTML report
    const htmlReport = generateHtmlReport(results);
    fs.writeFileSync(path.join(__dirname, '../storybook-rendering-report.html'), htmlReport);

    console.log('\nTesting complete!');
    console.log(`Success: ${results.filter(r => r.status === 'success').length}`);
    console.log(`Failed: ${results.filter(r => r.status === 'error').length}`);
    console.log(`Report saved to: ${path.join(__dirname, '../storybook-rendering-report.html')}`);
}

function generateHtmlReport(results) {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Storybook Rendering Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    .success { color: green; }
    .error { color: red; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    tr.success { background-color: #f0fff0; }
    tr.error { background-color: #fff0f0; }
  </style>
</head>
<body>
  <h1>Storybook Rendering Test Report</h1>
  <p>Total stories: ${results.length}</p>
  <p>Success: ${results.filter(r => r.status === 'success').length}</p>
  <p>Failed: ${results.filter(r => r.status === 'error').length}</p>
  
  <h2>Results</h2>
  <table>
    <tr>
      <th>Component</th>
      <th>Story</th>
      <th>Status</th>
      <th>Link</th>
    </tr>
    ${results.map(result => `
      <tr class="${result.status}">
        <td>${result.component}</td>
        <td>${result.story}</td>
        <td class="${result.status}">${result.status.toUpperCase()}</td>
        <td><a href="${result.url}" target="_blank">View Story</a></td>
      </tr>
      ${result.errors.length > 0 ? `
      <tr class="${result.status}">
        <td colspan="4">
          <strong>Errors:</strong>
          <ul>
            ${result.errors.map(err => `<li>${err.text}</li>`).join('')}
          </ul>
        </td>
      </tr>
      ` : ''}
    `).join('')}
  </table>
</body>
</html>
  `;
}

console.log('Starting Storybook rendering tests...');
console.log('Make sure Storybook is running at http://localhost:6006');

testStories().catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
}); 