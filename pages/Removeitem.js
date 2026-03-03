const { expect } = require("@playwright/test");
const { loginPage } = require("./login");

class Removeitem extends loginPage {
    constructor(page) {
        super(page);
        this.page = page;
        this.cartIcon = page.locator("a[href*='cart']");
        this.removeConfirmButton = page.getByRole('button', { name: /REMOVE|DELETE/i });
        this.productTextSelector = "//*[contains(text(), '{name}')]";
        this.containerSelector = 'xpath=ancestor::*[contains(@class, "cart") or contains(@class, "item")]';
        this.checkboxSelector = 'input[type="checkbox"]';
        this.deleteIconSelector = "[class*='delete'], [aria-label*='delete' i]";

    }

    async openCart() {
        try {
            await this.cartIcon.click({ force: true, timeout: 5000 });
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            console.error(`Error in openCart: ${error.message}`);
            throw error;
        }
    }


    async selectProductCheckbox(productName) {
        try {
            console.log(`\n--- Selecting Checkbox for: ${productName} ---`);
            if (this.page.isClosed && this.page.isClosed()) {
                const pages = this.page.context().pages().filter(p => !p.isClosed());
                if (pages.length) this.page = pages[pages.length - 1];
                console.log('Recovered closed page reference');
            }

            await this.page.waitForTimeout(1000);
            const productLocator = this.page.locator(this.productTextSelector.replace('{name}', productName)).first();
            try {
                await productLocator.waitFor({ state: 'visible', timeout: 5000 });
                console.log(`✓ Found product: ${productName}`);
            } catch (e) {
                console.warn('Product not immediately visible, proceeding anyway');
            }
            let containerLocator = productLocator.locator(this.containerSelector).first();
            if (await containerLocator.count() === 0) {
                console.warn('Container lookup failed, falling back to broader search');
                containerLocator = this.page.locator(`xpath=//*[contains(text(), '${productName}')]/ancestor::*[contains(@class,'cart') or contains(@class,'item')]`).first();
                if (await containerLocator.count() === 0) {
                    console.warn('Fallback container also not found, skipping checkbox');
                    return;
                }
            }

            try {
                await containerLocator.scrollIntoViewIfNeeded({ timeout: 5000 });
                await this.page.waitForTimeout(300);
            } catch (e) {
                console.warn('scrollIntoView failed or timed out');
            }

            const checkboxLocator = containerLocator.locator(this.checkboxSelector).first();
            if (await checkboxLocator.count() === 0) {

                return;
            }

            await checkboxLocator.click({ force: true });
            await this.page.waitForTimeout(500);

        } catch (error) {
            console.warn(`Warning in selectProductCheckbox: ${error.message}`);
        }
    }

    async removeProduct(productName) {
        try {
            console.log(`\n--- Removing Product: ${productName} ---`);

            if (this.page.isClosed && this.page.isClosed()) {
                const pages = this.page.context().pages().filter(p => !p.isClosed());
                if (pages.length) this.page = pages[pages.length - 1];
                console.log('Recovered closed page reference');
            }

            await this.page.waitForTimeout(1000);

            const productLocator = this.page.locator(this.productTextSelector.replace('{name}', productName)).first();

            try {
                await productLocator.waitFor({ state: 'visible', timeout: 3000 });
            } catch (e) {
                console.log('Product not visible, trying click anyway');
            }
            console.log(`Located product: ${productName}`);
            let containerLocator = productLocator.locator(this.containerSelector).first();
            if (await containerLocator.count() === 0) {
                console.warn('Container not found via product link, trying fallback');
                containerLocator = this.page.locator(`xpath=//*[contains(text(), '${productName}')]/ancestor::*[contains(@class,'cart') or contains(@class,'item')]`).first();
                if (await containerLocator.count() === 0) {
                    throw new Error('Could not locate product container for removal');
                }
            }

            try {
                await containerLocator.scrollIntoViewIfNeeded({ timeout: 5000 });
                await this.page.waitForTimeout(300);
            } catch (e) {
                console.warn('scrollIntoView failed or timed out');
            }

            try { await containerLocator.hover(); } catch (e) { /* ignore */ }
            await this.page.waitForTimeout(500);
            const deleteIconLocator = containerLocator.locator(this.deleteIconSelector).first();
            if (await deleteIconLocator.count() === 0) {
                throw new Error('Delete icon not found in product container');
            }
            await deleteIconLocator.click({ force: true });
            await this.page.waitForTimeout(1000);
            const confirmButton = this.page.getByRole('button', { name: /REMOVE|DELETE/i });
            try {
                await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
                await confirmButton.click({ force: true });
                console.log('Remove confirmation clicked');
            } catch (e) {
                console.warn('confirmation button not found or not visible, continuing');
            }
            await this.page.waitForTimeout(2000);

        } catch (error) {
            console.error(`Error in removeProduct: ${error.message}`);
            throw error;
        }
    }

    async verifyRemoved(productName) {
        try {
            console.log(`\n--- Verifying Removal of: ${productName} ---`);
            await this.page.reload({ waitUntil: 'domcontentloaded' });
            await this.page.waitForTimeout(2000);
            const productLocator = this.page.locator(this.productTextSelector.replace('{name}', productName)).first();
            await expect(productLocator).toHaveCount(0, { timeout: 10000 });
            console.log(` Verified: ${productName} has been removed from cart`);
            return true;
        } catch (error) {
            console.error(`Error in verifyRemoved: ${error.message}`);
            throw error;
        }
    }
}

module.exports = { Removeitem };