import { test as setup, expect } from '@playwright/test';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { mailHelper } from '../mail-test.helper';

const authFile = 'playwright/.auth/user.json';
let browser: Browser;
let context: BrowserContext;
let page: Page;

setup('authenticate', async () => {
  
    browser = await chromium.launch();
    context = await browser.newContext({ recordVideo: { dir: 'videos/' } });
    page = await context.newPage();
   
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
    await page.context().storageState({ path: authFile });
  });