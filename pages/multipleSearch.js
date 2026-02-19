const { expect } = require("@playwright/test");
const { loginPage } = require('./login');
const { SearchPage } = require("./searchProduct");

class MultipleSearch extends loginPage {
    constructor(page) {
        super(page);
        this.SearchPage = new SearchPage(page);
        this.loginPage = new loginPage(page);
        this.searchInput = page.locator('[name="q"]');
        this.checkSearchResult = page.getByLabel('MOBICASE', { exact: true })
        this.serivedBy = page.getByLabel('Free Delivery', { exact: true })
        this.shippedBy = page.getByLabel('Dhaka', { exact: true })

    }

    async searchMultiple() {
        await this.SearchPage.loginAndSearch("01856565345", "Daraz2026@", "mobile cover");
        await expect(this.checkSearchResult).toBeVisible();
        await this.checkSearchResult.click();
        await this.serivedBy.click();
        await this.shippedBy.click();
        await expect(this.shippedBy).toBeVisible();


    }
}

module.exports = { MultipleSearch };