
const { expect } = require("@playwright/test");
const { loginPage } = require('./login');

class Logout extends loginPage {
    constructor(page) {
        super(page);
        this.accountname= page.locator("#myAccountTrigger");
        this.loginBtn=page.locator("#account-popup-logout");
        this.loginLink = page.locator("text=Login");

    }

    async verifyLogin() {
        await expect(this.accountname).toBeVisible();
        console.log("Login successful, account name visible.");
    }

    async logout() {
        await this.accountname.hover();
        await this.accountname.click();
        await this.page.waitForTimeout(500);
        await this.loginBtn.click();
    }

    async verifyLogout() {
        await expect(this.loginLink).toBeVisible();
        console.log("Logout successful, login link visible.");
         
    }
}

module.exports = { Logout };