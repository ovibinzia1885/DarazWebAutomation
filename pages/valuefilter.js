const { expect } = require("@playwright/test");
const { loginPage } = require('./login');
const { SearchPage } = require("./searchProduct");
const { MultipleSearch } = require("./multipleSearch");

class ValueFilter extends loginPage {
    constructor(page) {
        super(page);

        this.loginPage = new loginPage(page);
        this.sp = new SearchPage(page);
        this.minvalue = page.locator("[placeholder='Min']");
        this.maxvlaue = page.locator("[placeholder='Max']");
        this.buttonfliter = page.locator('button.ant-btn.css-1bkhbmc.app.ant-btn-primary.ant-btn-icon-only.yUcnk');


    }

    async filterByValue(min, max) {
        await this.sp.loginAndSearch("01856565345", "Daraz2026@", "mobile cover");
        await this.minvalue.scrollIntoViewIfNeeded();
        await this.minvalue.fill(min);
        await this.maxvlaue.fill(max);
        await this.buttonfliter.click();
        await this.page.waitForLoadState('networkidle');
        const timestamp = Date.now();
        await this.page.screenshot({
            path: `resources/search-${timestamp}.png`,
            fullPage: true
        });
    }
}
module.exports = { ValueFilter };