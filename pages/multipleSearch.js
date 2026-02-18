const { expect } = require("@playwright/test");
const {loginPage} = require('./login');
const { SearchPage } = require("./searchProduct");

class MultipleSearch extends loginPage {
    constructor(page) {
    super(page);  
    this.SearchPage = new SearchPage(page);  
    this.loginPage= new loginPage(page);
    this.searchInput = page.locator('[name="q"]');

}

async searchMultiple(){
    await this.SearchPage.loginAndSearch("01856565345", "Daraz2026@", "mobile cover");
}
}

module.exports = { MultipleSearch };