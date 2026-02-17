const test = require("node:test");

const { expect } = require("@playwright/test");

class loginPage{
    constructor(page){
        this.page= page;
        this.loginLink= page.locator("text=Login");
        this.emailInput= page.locator('[type="text"]');
        this.passwordInput= page.locator('[type="password"]');
        this.loginButton= page.locator(".iweb-button-mask");


}


async login(email, password){
    await this.loginLink.click();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click(); 

}
}

module.exports = { loginPage };