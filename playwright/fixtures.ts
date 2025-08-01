import { test as baseTest, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { mailHelper } from '../mail-test.helper';

export * from '@playwright/test';
export const test = baseTest.extend<{}, { workerStorageState: string }>({
  // Use the same storage state for all tests in this worker.
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  // Authenticate once per worker with a worker-scoped fixture.
  workerStorageState: [async ({ browser }, use) => {
    const fileName = path.resolve(test.info().project.outputDir, `.auth/auth.json`);

    if (fs.existsSync(fileName)) {
      // Reuse existing authentication state if any.
      await use(fileName);
      return;
    }
    let context = await browser.newContext({ recordVideo: { dir: 'videos/' } });
    // Important: make sure we authenticate in a clean environment by unsetting storage state.
    const page = await browser.newPage({ storageState: undefined });
    const userEmail: string = 'cypressuseracc@gmail.com';
    
    await page.goto('https://stagingv3.bizpilot.in/');
    await page.waitForTimeout(7000);
    //Navigate to your login page
    const email = page.locator('[name="email"]');
    await email.fill(userEmail);
    await page.locator('[data-testid="login-screen-button"]').click();
    const outerIframe = await page.frameLocator('iframe[title="Secure Modal"]');
    // await page.frameLocator('iframe[title="Secure Modal"]').getByText('Please register this device to continue').click();
    // await page.frameLocator('iframe[title="Secure Modal"]').getByText('We sent a device registration instructions to').click();
    // await page.frameLocator('iframe[title="Secure Modal"]').getByText('This quick one-time approval will help keep your account secure').click();
    await outerIframe.frameLocator('iframe[title="auth-relayer"]').getByText('This quick one-time approval will help keep your account secure').click();

    const emailContent = await mailHelper.readEmail(page, 'noreply@trymagic.com', userEmail, 'Approve [Staging]BizPilot login?');
    let emailBody: string = await mailHelper.getBodyText(emailContent);
    const newPage = await context.newPage();
    const extractedText: string = await mailHelper.getAuthLink(emailBody);

    await newPage.goto(extractedText);
    await newPage.getByText('Approve login?').click();

    await newPage.getByRole('button', { name: 'Approve' }).click();
    await newPage.getByText('Login approved').click();
    await newPage.close();

    const emailOTP = await mailHelper.readEmail(page, 'noreply@trymagic.com', userEmail, 'Log in to [Staging]BizPilot');
    let emailBody1: string = await mailHelper.getBodyText(emailOTP);
    let otpCodearr: string[] = await mailHelper.getOTPCode(emailBody1);
    console.log(otpCodearr);

    const outerIframeOTP = await page.frameLocator('iframe[title="Secure Modal"]');
    await outerIframeOTP.frameLocator('iframe[title="auth-relayer"]').locator(`[name="email one time password input 1"]`).fill(otpCodearr[0]);
    await outerIframeOTP.frameLocator('iframe[title="auth-relayer"]').locator(`[name="email one time password input 2"]`).fill(otpCodearr[1]);
    await outerIframeOTP.frameLocator('iframe[title="auth-relayer"]').locator(`[name="email one time password input 3"]`).fill(otpCodearr[2]);
    await outerIframeOTP.frameLocator('iframe[title="auth-relayer"]').locator(`[name="email one time password input 4"]`).fill(otpCodearr[3]);
    await outerIframeOTP.frameLocator('iframe[title="auth-relayer"]').locator(`[name="email one time password input 5"]`).fill(otpCodearr[4]);
    await outerIframeOTP.frameLocator('iframe[title="auth-relayer"]').locator(`[name="email one time password input 6"]`).fill(otpCodearr[5]);

    await page.waitForTimeout(7000);
    const currentUrl = page.url();
    const isUrlContainsHome = currentUrl.includes('home');
    expect(isUrlContainsHome).toBe(true);


    // End of authentication steps.

    await page.context().storageState({ path: fileName });
    await page.close();
    await use(fileName);
  }, { scope: 'worker' }],
});