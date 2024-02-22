// loginHelper.ts

import { Page } from '@playwright/test';
import { mailHelper } from './mail-test.helper';

export async function login(page: Page, userEmail: string): Promise<void> {
    await page.goto('https://stagingv3.bizpilot.in/');
    await page.waitForTimeout(7000);


    // Perform login steps
    const email = page.locator('[name="email"]');
    await email.fill(userEmail);
    await page.locator('[data-testid="login-screen-button"]').click();
    const outerIframe = await page.frameLocator('iframe[title="Secure Modal"]');
    await outerIframe.frameLocator('iframe[title="auth-relayer"]').getByText('This quick one-time approval will help keep your account secure').click();

    const emailContent = await mailHelper.readEmail(page, 'noreply@trymagic.com', userEmail, 'Approve [Staging]BizPilot login?');
    let emailBody: string = await mailHelper.getBodyText(emailContent);
    const newPage = await page.context().newPage();
    const extractedText: string = await mailHelper.getAuthLink(emailBody);

    await newPage.goto(extractedText);
    await newPage.getByText('Approve login?').click();

    await newPage.getByRole('button', { name: 'Approve' }).click();
    await newPage.getByText('Login approved').click();
    await newPage.close();

    const emailOTP = await mailHelper.readEmail(page, 'noreply@trymagic.com', userEmail, 'Log in to [Staging]BizPilot');
    let emailBody1: string = await mailHelper.getBodyText(emailOTP);
    let otpCodearr: string[] = await mailHelper.getOTPCode(emailBody1);

    const outerIframeOTP = await page.frameLocator('iframe[title="Secure Modal"]');
    await outerIframeOTP.frameLocator('iframe[title="auth-relayer"]').locator(`[name="email one time password input 1"]`).fill(otpCodearr[0]);
    await outerIframeOTP.frameLocator('iframe[title="auth-relayer"]').locator(`[name="email one time password input 2"]`).fill(otpCodearr[1]);
    await outerIframeOTP.frameLocator('iframe[title="auth-relayer"]').locator(`[name="email one time password input 3"]`).fill(otpCodearr[2]);
    await outerIframeOTP.frameLocator('iframe[title="auth-relayer"]').locator(`[name="email one time password input 4"]`).fill(otpCodearr[3]);
    await outerIframeOTP.frameLocator('iframe[title="auth-relayer"]').locator(`[name="email one time password input 5"]`).fill(otpCodearr[4]);
    await outerIframeOTP.frameLocator('iframe[title="auth-relayer"]').locator(`[name="email one time password input 6"]`).fill(otpCodearr[5]);

    await page.waitForTimeout(7000);
}
