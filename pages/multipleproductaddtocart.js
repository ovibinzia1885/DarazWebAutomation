const { expect } = require("@playwright/test");
const { loginPage } = require('./login');
const { SearchPage } = require("./searchProduct");

class MultipleProductAddToCart extends loginPage {
    constructor(page) {
        super(page);
        this.loginPage = new loginPage(page);
        this.sp = new SearchPage(page);
        this.inputvalue = page.locator('[name="q"]');
        this.product = page.locator("[type='product']").nth(0);
        this.popupCloseButton = page.locator(".next-dialog-close");
        this.AddToCartbutton = page.locator("//span[text()='Add to Cart']");
        this.popupCloseButton = page.locator(".next-dialog-close");
        this.popupCloseButton = page.locator(".next-dialog-close");
        this.darazlogo=page.getByRole('img', { name: 'Online Shopping Daraz Logo' });


    }

    async addOneproduct(productName) {
        await this.inputvalue.fill(productName);
        await this.inputvalue.press('Enter');
        await this.page.waitForLoadState('networkidle');
        await this.product.click();
        await this.AddToCartbutton.click();
        await this.popupCloseButton.waitFor({ state: 'visible', timeout: 3000 }).catch(() => { });

        if (await this.popupCloseButton.isVisible().catch(() => false)){
            await this.popupCloseButton.click();
            await this.darazlogo.click();
            await this.page.waitForLoadState('networkidle');
        

        }
        await this.page.goto("https://www.daraz.com.bd/", { waitUntil: "domcontentloaded" });
            

    }


    async addManyProducts(productName) {
        for (const item of productName) {
            await this.addOneproduct(item);
        }


    }

}



module.exports = { MultipleProductAddToCart };