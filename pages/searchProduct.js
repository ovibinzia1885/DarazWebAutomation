
const { expect } = require("@playwright/test");
const {loginPage} = require('./login');


class SearchPage extends loginPage {
    constructor(page) {
    super(page); 
        this.searchInput = page.locator('[name="q"]');
        this.productTitle = page.locator('.xYcXp h1');
        
       
    
}

    async search(productName) {
        await this.searchInput.fill(productName);
        await this.searchInput.press('Enter');
        await this.page.waitForLoadState("domcontentloaded");
    }


    async verifyProduct(expectedText) {
    await this.page.waitForSelector('.xYcXp h1');
    const firstProduct = this.productTitle.first();
    await expect(firstProduct).toContainText(expectedText);
  }

}

module.exports = { SearchPage };