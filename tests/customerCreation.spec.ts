import { test, expect, chromium, Browser } from '@playwright/test';
import { login } from '../loginHelper';

let browser: Browser;

test.beforeAll(async () => {
    browser = await chromium.launch();
});

test.afterAll(async () => {
    await browser.close();
});

test('should create customer', async ({ page }) => {
    const userEmail: string = 'cypressuseracc@gmail.com';
    await login(page, userEmail);
    await page.waitForTimeout(10000);
    await page.getByText('Add New').click();
    await page.getByTestId('add-new-main-menu').locator('div').filter({ hasText: 'Add New Customer' }).click();
    await page.locator('[data-test="selection-button-Un-Registered"]').click();
    await page.getByPlaceholder('Enter Customer/Company').click();
    let randomName = Math.random() * 100 + "";
    await page.getByPlaceholder('Enter Customer/Company').fill(randomName);
    await page.getByPlaceholder('First line of address (Door name, street name, etc.)').click();
    await page.getByPlaceholder('First line of address (Door name, street name, etc.)').fill('Line 1');
    await page.getByPlaceholder('City').click();
    await page.getByPlaceholder('City').fill('City');
    await page.getByPlaceholder('State').click();
    await page.getByText('[AN]-Andaman and Nicobar Islands').click();
    await page.getByPlaceholder('Pincode').click();
    await page.getByPlaceholder('Pincode').fill('744201');
    await page.getByPlaceholder('Choose Payment Term').click();
    await page.getByText('Due on Receipt').click();
    await page.getByText('Save').click();
    await page.waitForTimeout(5000);
    const currentUrl = page.url();
    const isUrlContainsCustomers = currentUrl.includes('customers');
    expect(isUrlContainsCustomers).toBe(true);
});
