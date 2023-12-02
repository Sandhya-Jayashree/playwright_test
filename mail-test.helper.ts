import { expect } from "@playwright/test";
import { resolve } from "path";
import cheerio from "cheerio";
import gmailTester from 'gmail-tester';

export const mailHelper = {
  async messageChecker(fromEmail: string, toEmail: string, subject: string) {
    console.log(fromEmail, toEmail, subject);
    const email = await gmailTester.get_messages(
      resolve(__dirname, "credentials.json"),
      resolve(__dirname, "token.json"),
      {
        from: fromEmail,
        to: toEmail,
        subject: subject,
        include_body: true,
      }
    );
    return email;
  },

  async readEmail(page: any, senderEmail: string, receiverEmail: string, subject: string) {

    let emails;
    const startTime = Date.now();
    const pollingTimeout = 2000;
    const pollingInterval = 5000;

    while (!emails || emails.length === 0 && Date.now() - startTime < pollingTimeout) {
      console.log(`Polling mail from: ${senderEmail}...`);
      await page.waitForTimeout(2000);
      emails = await mailHelper.messageChecker(senderEmail, receiverEmail, subject);
    }

    if (!emails || emails.length === 0) {
      throw new Error(`No emails with subject '${subject}' received within the timeout.`);
    }

    return emails[0].body.text;
  },

  async getBodyText(html: string) {
    const $ = cheerio.load(html);
    $("body").find("br").replaceWith(" ");
    return $("body").text();
  },

  async getVerificationCode(text: string) {
    console.log("Getting the verification code from the email...");
    return parseInt(text.replace(/[^0-9\.]/g, ""), 10);
  },

  async extractVerificationCode(emailBodyHtml: string) {
    const actualMessage = await this.getBodyText(emailBodyHtml);
    return await this.getVerificationCode(actualMessage);
  },

  async getPasswordResetLink(html: string) {
    const $ = cheerio.load(html);
    let link = $('a:contains("click here")');
    return link.attr("href");
  },

  async getOTPCode(emailBody: string) {
    console.log("body", emailBody);
    var inputString = emailBody;
    var regex = /Login code: (\d+\s\d+)/;
    var match = regex.exec(inputString);
    let otpCode = match[1].replace(' ', '');
    let otpCodearr = otpCode.split('');
    return otpCodearr;
  },

  async getAuthLink(emailBody: string) {
    let htmlString = emailBody;
    const startIndex = htmlString.indexOf('Approve this login:') + 'Approve this login:'.length;
    const endIndex = htmlString.indexOf('Link expires in 20 minutes');

    const extractedText = htmlString.substring(startIndex, endIndex).trim();
    return extractedText;
  }
};
