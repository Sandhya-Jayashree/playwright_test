const { expect } = require('@playwright/test');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to your login page
  await page.goto('https://stagingv3.bizpilot.in/');

  // Find the email field using the placeholder
  const emailField = await page.$('input[placeholder="Enter the email address to login"]');

  // Check if the email field is found
  if (emailField) {
    // Type the email address
    await emailField.fill('sandhya@bizpilot.in');
    // const currURL = page.url();
    // expect(page.toContain(currURL))
  } else {
    console.error('Email field not found!');
  }

  // Find the login button using the button text
  const loginButton = await page.$('button:has-text("Log in")');

  // Check if the login button is found
  if (loginButton) {
    // Click the login button
    await loginButton.click();
  } else {
    console.error('Login button not found!');
  }

  // Wait for some time or handle the next steps of your test

  // Close the browser
  await browser.close();
})();
