import { test, expect, chromium, Browser } from '@playwright/test';
import { login } from '../loginHelper';

let browser: Browser;

test.beforeAll(async () => {
    browser = await chromium.launch();
});

test.afterAll(async () => {
    await browser.close();
});

test('should create quotation', async ({ page }) => {
    const userEmail: string = 'cypressuseracc@gmail.com';
    await login(page, userEmail);
    await page.waitForTimeout(10000);
    await page.getByText('Add New').click();
    await page.getByTestId('add-new-main-menu').locator('div').filter({ hasText: 'Add New Quotation' }).click();
    await page.getByPlaceholder('Choose Customer').click();
    await page.getByTestId('item-0').click();
    await page.getByPlaceholder('Choose Item').click();
    await page.getByTestId('item-0').click();
    await page.getByText('Save').click();
    await page.waitForTimeout(5000);
    const currentUrl = page.url();
    const isUrlContainsQuotations = currentUrl.includes('quotations');
    expect(isUrlContainsQuotations).toBe(true);
});
