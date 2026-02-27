
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
    await this.AddToCartbutton.click();

    await this.popupCloseButton.waitFor({ state: 'visible', timeout: 3000 }).catch(() => { });

    if (await this.popupCloseButton.isVisible().catch(() => false))
      await this.popupCloseButton.click();

  }

  async goToCart() {

    await this.cartIcon.waitFor({ state: "attached", timeout: 15000 });
    await this.cartIcon.scrollIntoViewIfNeeded();
    // click the icon to open overlay, then navigate directly to the cart page to avoid dealing
    // with the floating mini‑cart which doesn't expose the usual checkout button.
    await this.cartIcon.click({ force: true });
    // some flows open an overlay instead of navigating; ensure we end up on the real cart URL
    await this.page.goto('https://cart.daraz.com.bd/cart', { waitUntil: 'networkidle' });
  }

  async verifyCartProduct(expectedText) {
    await this.cartProductName.first(0).waitFor({ state: 'visible' });
    await expect(this.cartProductName.first()).toContainText(expectedText);
    console.log("Verified product in cart:", expectedText);
  }




}

module.exports = { AddToCart };