
const { expect } = require("@playwright/test");
const { loginPage } = require('./login');


class AddToCart extends loginPage {
  constructor(page) {
    super(page);
    this.page = page;
    this.searchInput = page.locator('[name="q"]');
    // this.searchButton= page.locator(".search-box__search--2fC5");
    this.productItem = page.getByRole('link', { name: 'Galaxy S25 Ultra' });
    this.AddToCartbutton = page.locator("//span[text()='Add to Cart']");
    this.popupCloseButton = page.locator(".next-dialog-close");
    this.cartIcon = page.locator("a[href*='cart']");
    this.cartProductName = page.locator(".automation-link-from-title-to-prod.title");

  }


  async openFirstMatchedProduct() {


    await this.productItem.nth(0).click();

  }

  async addToCart() {
    await this.cartIcon.waitFor({ state: "attached", timeout: 15000 });
    await this.cartIcon.scrollIntoViewIfNeeded();

    // click the icon; some versions of the site open the cart in a new tab/page.
    const [possibleNewPage] = await Promise.all([
      // listen for any new page that might open as a result of the click
      this.page.context().waitForEvent('page').catch(() => null),
      this.cartIcon.click({ force: true })
    ]);

    if (possibleNewPage) {
      // switch our working page to the newly opened one
      this.page = possibleNewPage;
      this._initLocators();
    }

  }

  async goToCart() {
    
    await this.cartIcon.click();
    await this.page.waitForLoadState('networkidle');
  
  }

  async verifyCartProduct(expectedText) {

    await expect(this.cartProductName).toContainText(expectedText);
    console.log("Verified product in cart:", expectedText);
  }
}

module.exports = { AddToCart };