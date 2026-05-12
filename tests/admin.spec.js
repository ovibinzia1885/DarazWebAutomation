const { test, expect, chromium } = require('@playwright/test');

const { loginPage } = require("../pages/login");
const { SearchPage } = require("../pages/searchProduct");
const { AddToCart } = require("../pages/addtocart");
const { MultipleSearch } = require("../pages/multipleSearch");
const { ValueFilter } = require("../pages/valuefilter");
const { MultipleProductAddToCart } = require("../pages/multipleproductaddtocart");
const { itemCheckoutprocess } = require("../pages/Checkout");
const { Removeitem } = require("../pages/Removeitem");
const { Logout } = require("../pages/logout");

const fs = require('fs');

let browser;
let context;
let page;


   //BEFORE ALL


test.beforeAll(async () => {

  browser = await chromium.launch({
    headless: false
  });

  context = await browser.newContext();

  page = await context.newPage();

  await page.goto('https://www.daraz.com.bd/');

  const login = new loginPage(page);

  console.log("Login Started...");

  await login.login("01856565345", "Daraz2026@");

  await page.waitForLoadState('networkidle');

  console.log("Login Successful");

});



  // LOGIN VERIFICATION


test("Login Verification", async () => {

  const userProfile = page.locator("#myAccountTrigger");

  await expect(userProfile).toBeVisible();

  const accountName = await userProfile.textContent();

  console.log("Logged in User Name:", accountName);

  const userData = {
    username: accountName?.trim(),
    loginTime: new Date().toISOString()
  };

  fs.writeFileSync(
    'accountName.json',
    JSON.stringify(userData, null, 2)
  );

});



   //SEARCH PRODUCT


test('Search samsung s3', async () => {

  const searchPage = new SearchPage(page);

  await searchPage.searchInput.fill('samsung s3');

  await searchPage.searchInput.press('Enter');

  await searchPage.verifyProduct('samsung s3');

});



   //ADD TO CART


test("Search → Add to Cart → Verify", async () => {

  const addToCartPage = new AddToCart(page);

  await addToCartPage.searchInput.fill("samsung s25 ultra");

  await addToCartPage.searchInput.press("Enter");

  await addToCartPage.openFirstMatchedProduct();

  await addToCartPage.addToCart();

  await addToCartPage.goToCart();

  await addToCartPage.verifyCartProduct("S25 Ultra");

});


   //MULTIPLE FILTER SEARCH


test('Use multiple filter for search item', async () => {

  const multiplefilter = new MultipleSearch(page);

  await multiplefilter.searchMultiple();

});



   //VALUE FILTER


test('Use value filter for search item', async () => {

  const valuefilter = new ValueFilter(page);

  await valuefilter.filterByValue("1000", "2000");

});



   //MULTIPLE PRODUCT ADD


test('Multi Product Add to Cart', async () => {

  const ms = new MultipleProductAddToCart(page);

  const products = ["T shirt", "Jeans", "Shoes"];

  await ms.addManyProducts(products);

});



   //CHECKOUT PROCESS


test('Add to cart and checkout process', async () => {

  const checkout = new itemCheckoutprocess(page);

  await checkout.searchAndAdd('samsung s25 ultra');

  await checkout.selectLeftProductCheckbox();

  await checkout.proceedToCheckout();

  await expect(page).toHaveURL(/checkout/);

  await checkout.editAndAddNewAddress();

});



   //REMOVE ITEM


test('Remove item from cart', async () => {

  const removeItem = new Removeitem(page);

  await removeItem.openCart();

  await removeItem.selectProductCheckbox('Galaxy S25 Ultra');

  await removeItem.removeProduct('Galaxy S25 Ultra');

  await removeItem.verifyRemoved('Galaxy S25 Ultra');

});



   //AFTER ALL


test.afterAll(async () => {

  console.log("Logout Started...");

  const logout = new Logout(page);

  await logout.logout();

  await logout.verifyLogout();

  console.log("Logout Successful");

  await browser.close();

});