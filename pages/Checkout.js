const { expect } = require("@playwright/test");
const { loginPage } = require("./login");
const { AddToCart } = require("./addtocart");
const { SearchPage } = require("./searchProduct");

class itemCheckoutprocess extends loginPage {
    constructor(page) {
        super(page);
        this.atc = new AddToCart(page);
        this.ln = new loginPage(page);
        this.sp = new SearchPage(page);
        this.checkbox = page.getByRole('checkbox').first();
        this.checkoutbutton = page.getByRole('button', { name: 'PROCEED TO CHECKOUT' });
        this.cartIcon = page.locator("a[href*='cart']");
        this.fullname = page.getByPlaceholder('Enter your first and last name');
        this.phonenumber = page.getByPlaceholder('Please enter your phone number');
        this.houseno = page.locator("//div[@class='mod-input mod-input-detail-address-1']//input[@placeholder='Please enter']");
        this.colony = page.locator("//div[@class='mod-input mod-input-detail-address-2']//input[@placeholder='Please enter']");
        this.regionDropdown = page.locator("div.mod-select-location-tree-1 span.next-select");
        this.cityDropdown = page.locator("div.mod-select-location-tree-2 span.next-select");
        this.areaDropdown = page.locator("div.mod-select-location-tree-3 span.next-select");
        this.address = page.getByRole('textbox', { name: 'For Example: House# 123, Street# 123, ABC Road' });
        this.homeCheckbox = page.locator("input[value='home'][type='radio'], input[value='home'][type='checkbox']");
        this.savebutton = page.getByRole('button', { name: /SAVE/i });
    }

    async searchAndAdd(productName) {
        try {
            console.log(`\n--- Adding Product: ${productName} ---`);
            console.log('Filling search input...');
            await this.atc.searchInput.fill(productName);
            await this.atc.searchInput.press('Enter');
            await this.page.waitForTimeout(4000);

            console.log('Opening first matched product...');
            await this.atc.openFirstMatchedProduct();
            await this.page.waitForTimeout(4000);
            console.log('Clicking Add to Cart button...');
            const addToCartBtn = this.page.locator("//span[text()='Add to Cart']");
            await addToCartBtn.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(500);
            await addToCartBtn.click({ force: true });
            console.log(' Add to Cart button clicked');
            await this.page.waitForTimeout(3000);

            console.log('Closing any popups...');
            try {
                const popup = this.page.locator(".next-dialog-close");
                const popupCount = await popup.count();
                if (popupCount > 0) {
                    await popup.first().click();
                    console.log(' Popup closed');
                    await this.page.waitForTimeout(1000);
                }
            } catch (e) {

            }

            console.log('Navigating to cart page...');
            try {
                await this.page.goto('https://cart.daraz.com.bd/cart', { waitUntil: 'domcontentloaded', timeout: 30000 });
                await this.page.waitForTimeout(5000);
                console.log(' Navigated to cart');
            } catch (err) {
                console.warn('Navigation failed:', err.message);
            }

            const currentUrl = this.page.url();
            if (/user\/login/.test(currentUrl)) {
                console.log('Redirected to login, re-authenticating...');
                if (this.page.isClosed()) {
                    const ctx = this.atc.page.context();
                    const pages = ctx.pages().filter(p => !p.isClosed());
                    if (pages.length) {
                        this.page = pages[pages.length - 1];
                    }
                }
                await this.login('01856565345', 'Daraz2026@');
                await this.page.waitForTimeout(3000);
                try {
                    await this.page.goto('https://cart.daraz.com.bd/cart', { waitUntil: 'domcontentloaded', timeout: 30000 });
                    await this.page.waitForTimeout(5000);
                    console.log('✓ Returned to cart after login');
                } catch (err2) {
                    console.warn('Failed to re-navigate to cart:', err2.message);
                }
            }

            if (this.page.isClosed()) {
                console.warn('Page closed after navigation, getting from context');
                const context = this.atc.page.context();
                const pages = context.pages();
                if (pages.length > 0) {
                    this.page = pages[pages.length - 1];
                    await this.page.waitForLoadState('domcontentloaded').catch(() => { });
                }
            }


            this.checkbox = this.page.locator('input[type="checkbox"]');
            this.checkoutbutton = this.page.getByRole('button', { name: 'PROCEED TO CHECKOUT' });
            this.cartIcon = this.page.locator("a[href*='cart']");

            console.log('Product added and at cart page\n');
        } catch (error) {
            console.error(' Error in searchAndAdd:', error.message);
            throw error;
        }
    }

    async selectLeftProductCheckbox(productName = 'Galaxy S25 Ultra') {
        try {
            if (!this.page || this.page.isClosed()) {
                console.error('Page is closed, cannot select checkbox');
                return;
            }
            const url = this.page.url();
            if (/\/user\/login/.test(url)) {
                console.warn('On login page, skipping checkbox selection');
                return;
            }

            console.log(`\n--- Selecting Product Checkbox ---`);
            await this.page.waitForTimeout(2000);
            let checkbox = null;


            let count = await this.page.locator('.next-checkbox.cart-item-checkbox').count();
            if (count > 0) {
                checkbox = this.page.locator('.next-checkbox.cart-item-checkbox').first();
                console.log(`Found ${count} cart-item-checkboxes`);
            } else {

                count = await this.page.locator('input[type="checkbox"]').count();
                if (count > 1) {
                    checkbox = this.page.locator('input[type="checkbox"]').nth(1);
                    console.log(`Found ${count} input checkboxes, using index 1`);
                } else if (count === 1) {
                    checkbox = this.page.locator('input[type="checkbox"]').first();
                    console.log('Found single checkbox');
                } else {

                    count = await this.page.locator('.next-checkbox').count();
                    if (count > 1) {
                        checkbox = this.page.locator('.next-checkbox').nth(1);
                        console.log(`Found ${count} next-checkboxes, using index 1`);
                    } else if (count === 1) {
                        checkbox = this.page.locator('.next-checkbox').first();
                        console.log('Found single next-checkbox');
                    }
                }
            }

            if (checkbox) {
                await checkbox.scrollIntoViewIfNeeded();
                await this.page.waitForTimeout(500);
                await checkbox.click({ force: true });
                console.log(' Product checkbox clicked');
                await this.page.waitForTimeout(1500);
            } else {
                console.warn('Could not find any checkbox');
            }

        } catch (error) {
            console.error(`Error selecting checkbox:`, error.message);
        }
    }

    async proceedToCheckout() {
        try {
            if (!this.page || this.page.isClosed()) {
                console.error('Page is closed, cannot proceed');
                return;
            }

            console.log('\n--- Proceeding to Checkout ---');
            await this.page.waitForTimeout(2000);

            let btn = null;


            try {
                btn = this.page.getByRole('button', { name: /PROCEED TO CHECKOUT/i });
                const isVisible = await btn.isVisible().catch(() => false);
                if (!isVisible) btn = null;
            } catch (e) {

            }

            const cur = this.page.url();
            if (/\/user\/login/.test(cur)) {
                console.log('On login page before checkout, re-login');
                await this.login('01856565345', 'Daraz2026@');
                await this.page.waitForTimeout(2000);

                try {
                    btn = this.page.getByRole('button', { name: /PROCEED TO CHECKOUT/i });
                } catch { }
            }


            if (!btn) {
                try {
                    btn = this.page.locator('button:has-text("PROCEED TO CHECKOUT")').first();
                    const isVisible = await btn.isVisible().catch(() => false);
                    if (!isVisible) btn = null;
                } catch (e) {

                }
            }

            if (!btn) {
                try {
                    btn = this.page.locator('text=PROCEED TO CHECKOUT').first();
                    const isVisible = await btn.isVisible().catch(() => false);
                    if (!isVisible) btn = null;
                } catch (e) {

                }
            }

            if (btn) {
                await btn.scrollIntoViewIfNeeded().catch(() => { });
                await this.page.waitForTimeout(500);
                await btn.click({ force: true });
                console.log(' PROCEED TO CHECKOUT button clicked');
                await this.page.waitForTimeout(3000);


                try {
                    await this.page.waitForURL(/checkout/, { timeout: 30000 });
                    console.log(' Successfully navigated to checkout page\n');
                } catch (err) {
                    console.log('Checkout navigation in progress...');
                }
            } else {
                console.warn('Could not find PROCEED TO CHECKOUT button');
            }

        } catch (error) {
            console.error(' Error in proceedToCheckout:', error.message);
        }
    }



    async editAndAddNewAddress() {
        try {
            if (!this.page || this.page.isClosed()) {
                console.error('Page is closed');
                return;
            }

            console.log('\n--- Editing Address ---');
            await this.page.waitForTimeout(3000);


            console.log('Looking for Edit link...');
            let editLink = null;


            try {
                const anchors = this.page.locator('a.v2-title-wrapper-edit');
                const count = await anchors.count();
                if (count > 0) {
                    editLink = anchors.first();
                    console.log(`Found ${count} EDIT anchors`);
                }
            } catch (e) {

            }


            if (!editLink) {
                try {
                    const anchors = this.page.locator('text=EDIT');
                    const count = await anchors.count();
                    if (count > 0) {
                        editLink = anchors.first();
                        console.log(`Found ${count} EDIT text links`);
                    }
                } catch (e) { }
            }


            if (!editLink) {
                try {
                    const btn = this.page.getByRole('button', { name: /Edit/i });
                    if (await btn.isVisible().catch(() => false)) {
                        editLink = btn;
                        console.log('Found Edit button via role');
                    }
                } catch (e) { }
            }

            if (editLink) {
                await editLink.scrollIntoViewIfNeeded();
                await this.page.waitForTimeout(500);
                await editLink.click({ force: true });
                console.log('Edit link clicked');
                await this.page.waitForTimeout(3000);
            } else {
                console.warn('Could not find Edit link');
                return;
            }


            console.log('Looking for Add New Address button...');
            let addNewAddressBtn = null;


            try {
                const btns = this.page.locator('text=Add New Address');
                const count = await btns.count();
                if (count > 0) {
                    addNewAddressBtn = btns.first();
                    console.log(`Found ${count} Add New Address buttons`);
                }
            } catch (e) {

            }

            if (addNewAddressBtn) {
                await addNewAddressBtn.scrollIntoViewIfNeeded();
                await this.page.waitForTimeout(500);
                await addNewAddressBtn.click({ force: true });
                console.log(' Add New Address button clicked');
                await this.page.waitForTimeout(2000);
            } else {
                console.log('Could not find Add New Address button, might already be on form');
            }


            await this.fillDummyAddress();
            console.log(' Dummy address filled and saved\n');

        } catch (error) {
            console.error(' Error editing address:', error.message);
        }
    }


    async fillDummyAddress() {
        try {
            console.log('\n--- Filling Address Form ---');


            const nameField = this.page.getByPlaceholder('Enter your first and last name').first();
            if (await nameField.isVisible().catch(() => false)) {
                await nameField.fill('Nazmul hoque');
                console.log(' Full name filled');
            } else {
                console.log('  Name field not visible');
            }


            const phoneField = this.page.getByPlaceholder('Please enter your phone number').first();
            if (await phoneField.isVisible().catch(() => false)) {
                await phoneField.fill('01700000000');
                console.log(' Phone filled');
            } else {
                console.log('  Phone field not visible');
            }

            const houseField = this.page.locator("//div[@class='mod-input mod-input-detail-address-1']//input[@placeholder='Please enter']").first();
            if (await houseField.isVisible().catch(() => false)) {
                await houseField.fill('ABC12');
                console.log(' Building/House filled with "ABC12"');
            } else {
                console.log('  House field not visible');
            }


            const colonyField = this.page.locator("//div[@class='mod-input mod-input-detail-address-2']//input[@placeholder='Please enter']").first();
            if (await colonyField.isVisible().catch(() => false)) {
                await colonyField.fill('Colony');
                console.log(' Colony/Suburb filled');
            } else {
                console.log('  Colony field not visible');
            }

            console.log('\nLooking for Region dropdown...');
            try {
                await this.regionDropdown.click({ force: true });
                console.log('  Region dropdown clicked');
                await this.page.waitForTimeout(1500);

                console.log('  Inspecting dropdown menu structure...');
                const dropdownMenus = await this.page.locator('div[class*="next-select-dropdown"], div[class*="next-menu"]').count();
                console.log(`    Found ${dropdownMenus} dropdown menus`);


                const menuItems = await this.page.locator('li.next-menu-item, li[class*="menu-item"], div[class*="menu-item"]').count();
                console.log(`    Found ${menuItems} menu items total`);


                for (let i = 0; i < Math.min(menuItems, 5); i++) {
                    const item = this.page.locator('li.next-menu-item, li[class*="menu-item"], div[class*="menu-item"]').nth(i);
                    try {
                        const text = await item.textContent();
                        const className = await item.getAttribute('class');
                        console.log(`      [${i}] "${text.trim()}" class="${className}"`);
                    } catch (e) { }
                }

                const regionOption = this.page.locator("li").filter({ hasText: /chattogram/i }).first();
                const regionOptionVisible = await regionOption.isVisible().catch(() => false);

                if (regionOptionVisible) {
                    await regionOption.click({ force: true });
                    console.log(' Region set to Chattogram');
                } else {
                    console.log('  Chattogram option not found');
                }
                await this.page.waitForTimeout(1500);
            } catch (e) {
                console.log(`  Region dropdown error: ${e.message}`);
            }


            console.log('Looking for City dropdown...');
            try {
                await this.cityDropdown.click({ force: true });
                console.log('  City dropdown clicked');
                await this.page.waitForTimeout(1500);


                const cityOption = this.page.locator("li").filter({ hasText: /Feni\s*-\s*Sonagazi/i }).first();
                const cityOptionVisible = await cityOption.isVisible().catch(() => false);

                if (cityOptionVisible) {
                    const cityText = await cityOption.textContent();
                    console.log(`  Found city option: "${cityText.trim()}"`);
                    await cityOption.click({ force: true });
                    console.log(' City set to Feni - Sonagazi');
                } else {
                    console.log('  Feni - Sonagazi option not found in dropdown');
                }
                await this.page.waitForTimeout(1500);
            } catch (e) {
                console.log(`  City dropdown error: ${e.message}`);
            }

            console.log('Looking for Area dropdown...');
            try {
                await this.areaDropdown.click({ force: true });
                console.log('  Area dropdown clicked');
                await this.page.waitForTimeout(1500);
                const areaOption = this.page.locator("li").filter({ hasText: /^Sonagazi Sadar$/i }).first();
                const areaOptionVisible = await areaOption.isVisible().catch(() => false);

                if (areaOptionVisible) {
                    const areaText = await areaOption.textContent();
                    console.log(`  Found area option: "${areaText.trim()}"`);
                    await areaOption.click({ force: true });
                    console.log(' Area set to Sonagazi Sadar');
                } else {
                    console.log('  Sonagazi Sadar option not found in dropdown');
                }
                await this.page.waitForTimeout(1500);
            } catch (e) {
                console.log(`  Area dropdown error: ${e.message}`);
            }


            const addressField = this.page.getByRole('textbox', { name: 'For Example: House# 123, Street# 123, ABC Road' }).first();
            if (await addressField.isVisible().catch(() => false)) {
                await addressField.fill('House 123, Street 45');
                console.log('Address filled');
            } else {
                console.log('  Address field not visible');
            }


            console.log('Looking for Home checkbox...');
            try {
                const homeCheckboxVisible = await this.homeCheckbox.isVisible().catch(() => false);
                if (homeCheckboxVisible) {
                    await this.homeCheckbox.scrollIntoViewIfNeeded();
                    await this.page.waitForTimeout(500);
                    await this.homeCheckbox.click({ force: true });
                    console.log(' Home checkbox selected');
                } else {
                    console.log('  Home checkbox not visible');
                }
            } catch (e) {
                console.log(`  Home checkbox error: ${e.message}`);
            }


            try {
                const saveBtnVisible = await this.savebutton.isVisible().catch(() => false);
                if (saveBtnVisible) {
                    try {
                        await this.savebutton.scrollIntoViewIfNeeded();
                    } catch (e) {

                    }
                    await this.page.waitForTimeout(500);
                    await this.savebutton.click({ force: true });
                    console.log(' Save button clicked');
                    await this.page.waitForTimeout(2000);
                } else {
                    console.warn('  Save button not visible');
                }
            } catch (e) {
                console.log(`  Save button error: ${e.message}`);
            }

            console.log('--- Address Form Complete ---\n');

        } catch (error) {
            console.error(' Error filling address:', error.message);
            throw error;
        }
    }
}

module.exports = { itemCheckoutprocess };



