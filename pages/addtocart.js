const { expect } = require("@playwright/test");
const { loginPage } = require("./login");

class AddToCart extends loginPage {
  constructor(page) {
    super(page);
    this.page = page;

    // 🔍 Search
    this.searchInput = page.locator('[name="q"]');

    // 📦 Product
    this.productItem = page.getByRole("link", { name: /Galaxy S25 Ultra/i });

    // 🛒 Add to Cart
    this.addToCartButton = page.locator("//span[text()='Add to Cart']");

    // ❌ Popup Close
    this.popupCloseButton = page.locator("a.next-dialog-close");

    // 🛍️ Cart
    this.cartIcon = page.locator("a[href*='cart']");
    this.cartProductName = page.locator(".automation-link-from-title-to-prod.title");
  }

  // =========================
  // 📦 Open Product
  // =========================
  async openFirstMatchedProduct() {
    await this.productItem.first().click();
  }

  // =========================
  // ➕ Add To Cart
  // =========================
  async addToCart() {
    await this.addToCartButton.waitFor({ state: "visible", timeout: 15000 });
    await this.addToCartButton.click();

    await this.closePopupIfPresent();

    await this.page.waitForTimeout(2000);
  }

  // =========================
  // ❌ Close Popup
  // =========================
  async closePopupIfPresent() {
    try {
      await this.popupCloseButton.waitFor({ state: "visible", timeout: 5000 });
      await this.popupCloseButton.click();
      console.log("✅ Popup closed");
    } catch {
      console.log("ℹ️ No popup");
    }
  }

  // =========================
  // 🛒 GO TO CART (FINAL FIX)
  // =========================
  async goToCart() {

    await this.closePopupIfPresent();

    // 🔥 BEST SOLUTION → Direct navigation (no UI dependency)
    await this.page.goto("https://cart.daraz.com.bd/cart", {
      waitUntil: "domcontentloaded"
    });

    await this.page.waitForTimeout(2000);
  }

  // =========================
  // ✅ VERIFY
  // =========================
  async verifyCartProduct(expectedText) {
    await expect(this.cartProductName).toContainText(expectedText);
    console.log("✅ Verified product:", expectedText);
  }
}

module.exports = { AddToCart };