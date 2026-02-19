const test = require("node:test");

const { expect } = require("@playwright/test");

class loginPage {
    constructor(page) {
        this.page = page;
        this.loginLink = page.locator("text=Login");
        this.phone = page.locator('[type="text"]');
        this.passwordInput = page.locator('[type="password"]');
        this.loginButton = page.locator(".iweb-button-mask");


    }


    async login(phone, password) {
        await this.loginLink.click();
        await this.phone.fill(phone);
        await this.passwordInput.fill(password);
        await this.loginButton.click();

    }
}

module.exports = { loginPage };