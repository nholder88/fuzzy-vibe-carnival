#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directory containing story files
const STORIES_DIR = path.join(__dirname, '../stories');

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

// Get all story files
const storyFiles = fs.readdirSync(STORIES_DIR)
    .filter(file => file.endsWith('.stories.tsx'))
    .map(file => path.join(STORIES_DIR, file));

console.log(`Found ${storyFiles.length} story files.`);

// Extract all stories
const allStories = [];
storyFiles.forEach(file => {
    const stories = extractStoriesFromFile(file);
    allStories.push(...stories);
});

console.log(`Found ${allStories.length} stories in ${storyFiles.length} files.`);

// Create a simple HTML file to log results
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Storybook Verification Results</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    .success { color: green; }
    .error { color: red; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h1>Storybook Story Verification</h1>
  <p>Total story files: ${storyFiles.length}</p>
  <p>Total stories: ${allStories.length}</p>
  
  <h2>Stories List</h2>
  <table>
    <tr>
      <th>Component</th>
      <th>Story</th>
      <th>URL</th>
    </tr>
    ${allStories.map(story => `
      <tr>
        <td>${story.componentName}</td>
        <td>${story.storyName}</td>
        <td><a href="http://localhost:6006/?path=/story/${story.componentName.toLowerCase()}-${story.storyName.toLowerCase()}" target="_blank">View Story</a></td>
      </tr>
    `).join('')}
  </table>
  
  <h2>Verification Instructions</h2>
  <ol>
    <li>Make sure Storybook is running (npm run storybook)</li>
    <li>Visit each story URL to verify it renders correctly</li>
    <li>Look for any JavaScript errors in the browser console</li>
    <li>Check for UI issues or layout problems</li>
  </ol>
</body>
</html>
`;

// Save the HTML file
const outputPath = path.join(__dirname, '../storybook-verification.html');
fs.writeFileSync(outputPath, htmlContent);

console.log(`Verification page generated at: ${outputPath}`);
console.log(`Please make sure Storybook is running, then open this file in your browser.`); 