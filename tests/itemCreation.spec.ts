// import { test, expect, chromium, Browser } from '@playwright/test';
// import { login } from '../loginHelper';

// let browser: Browser;

// test.beforeAll(async () => {
//     browser = await chromium.launch();
// });

// test.afterAll(async () => {
//     await browser.close();
// });

// test('should create items', async ({ page }) => {
//     const userEmail: string = 'cypressuseracc@gmail.com';
//     await login(page, userEmail);
//     await page.waitForTimeout(10000);
//     await page.getByText('Add New').click();
//     await page.getByTestId('add-new-main-menu').locator('div').filter({ hasText: 'Add New Item' }).click();
//     await page.locator('[name="itemName"]').click();
//     let randomName = Math.random() * 100 + "";
//     await page.locator('[name="itemName"]').fill(randomName);
//     await page.getByPlaceholder('Enter GST Percentage').click();
//     await page.getByTestId('item-1').click();
//     await page.getByPlaceholder('Enter/Search SAC Code').click();
//     await page.getByPlaceholder('Enter/Search SAC Code').fill('999711');
//     await page.waitForTimeout(1000);
//     await page.getByRole('button', { name: "Add" }).click();
//     await page.locator("[name='sellingPrice']").click();
//     await page.locator("[name='sellingPrice']").fill('123');
//     await page.getByText('Save').click();
//     await page.waitForTimeout(5000);
//     const currentUrl = page.url();
//     const isUrlContainsItems = currentUrl.includes('items');
//     expect(isUrlContainsItems).toBe(true);
// });
