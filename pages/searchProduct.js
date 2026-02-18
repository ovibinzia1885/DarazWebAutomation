
const { expect } = require("@playwright/test");
const {loginPage} = require('./login');


class SearchPage extends loginPage {
    constructor(page) {
    super(page); 
         this .loginPage = new loginPage(page);
        this.searchInput = page.locator('[name="q"]');
        this.productTitle = page.locator('.xYcXp h1');
        
       
    
}

    async  loginAndSearch(phone, password, productName) {

    const loginPage = new loginPage(this.page);
    await loginPage.login(phone, password);
    await this.searchInput.fill(productName);
    await this.searchInput.press('Enter');
  }


  async verifyProduct(expectedText) {
    await this.page.waitForSelector('.xYcXp h1');
    const firstProduct = this.productTitle.first();
    await expect(firstProduct).toContainText(expectedText);
  }

}

module.exports = { SearchPage };