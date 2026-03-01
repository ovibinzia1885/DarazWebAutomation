const { test, expect } = require('@playwright/test');
const { loginPage } = require("../pages/login");
const { SearchPage } = require("../pages/searchProduct");
const { AddToCart } = require("../pages/addtocart");
const { MultipleSearch } = require("../pages/multipleSearch");
const { ValueFilter } = require("../pages/valuefilter");
const { MultipleProductAddToCart } = require("../pages/multipleproductaddtocart");
const { itemCheckoutprocess } = require("../pages/Checkout");

const fs = require('fs');


test.skip("Login with valid credentials", async ({ page }) => {


  await page.goto("https://www.daraz.com.bd/#?")
  const loginpage = new loginPage(page);
  await loginpage.login("01856565345", "Daraz2026@");
  await page.waitForLoadState('networkidle');
  const userProfile = page.locator("#myAccountTrigger");
  await expect(userProfile).toBeVisible();
  const accountName = await userProfile.textContent();
  console.log("Logged in User Name:", accountName);
  // Save the account name to a json file
  const userData = {
    username: accountName?.trim(),
    loginTime: new Date().toISOString()
  };
  fs.writeFileSync('accountName.json', JSON.stringify(userData, null, 2));


});


test.skip('Login then search samsung s3', async ({ page }) => {

  const searchPage = new SearchPage(page);
  await page.goto('https://www.daraz.com.bd/', { waitUntil: 'domcontentloaded' });

  await searchPage.login('01856565345', 'Daraz2026@');  // login reuse
  await page.waitForLoadState('networkidle');
  await searchPage.searchInput.fill('samsung s3');
  await searchPage.searchInput.press('Enter');
  await searchPage.verifyProduct('samsung s3');
  await page.waitForTimeout(5000);

});

test.skip('Login then search samsung s25 ultra and add to cart', async ({ page }) => {
  const addToCartPage = new AddToCart(page)

  await page.goto('https://www.daraz.com.bd/', { waitUntil: 'domcontentloaded' });

  await addToCartPage.login('01856565345', 'Daraz2026@');
  await page.waitForLoadState('networkidle');
  await addToCartPage.searchInput.fill("samsung s25 ultra");
  await addToCartPage.searchInput.press('Enter');
  await addToCartPage.openFirstMatchedProduct();
  await addToCartPage.addToCart();
  // await page.waitForLoadState('networkidle');
  await addToCartPage.goToCart();
  await addToCartPage.verifyCartProduct('Galaxy S25 Ultra');
  await page.waitForTimeout(5000);
});


test.skip('use multiple filter for search item ', async ({ page }) => {
  const multiplefilter = new MultipleSearch(page);
  await page.goto('https://www.daraz.com.bd/', { waitUntil: 'domcontentloaded' });
  await multiplefilter.searchMultiple();



});


test.skip('use value filter for search item ', async ({ page }) => {
  const valuefilter = new ValueFilter(page);
  await page.goto('https://www.daraz.com.bd/', { waitUntil: 'domcontentloaded' });
  await valuefilter.filterByValue("1000", "2000");
});


test.skip('Multi Product Add to Cart', async ({ page }) => {
  const ms = new MultipleProductAddToCart(page);
  await page.goto('https://www.daraz.com.bd/', { waitUntil: 'domcontentloaded' });
  await ms.loginPage.login("01856565345", "Daraz2026@");
  await page.waitForLoadState('networkidle');
  //await ms.addOneproduct(" T shirt ");
  const products = ["T shirt", "Jeans", "Shoes"];
  await ms.addManyProducts(products);


});

test.only('Add to cart and checkout process', async ({ page }) => {
  const checkout = new itemCheckoutprocess(page);
  await page.goto('https://www.daraz.com.bd/', { waitUntil: 'domcontentloaded' });
  await checkout.login("01856565345", "Daraz2026@");
  await page.waitForLoadState('networkidle');

  // search for a product and add to cart
  await checkout.searchAndAdd('samsung s25 ultra');

  // select checkbox from left product (first product)
  await checkout.selectLeftProductCheckbox();

  // proceed into checkout page and verify
  await checkout.proceedToCheckout();

  // Verify we are on checkout page by URL
  await expect(page).toHaveURL(/checkout/);
  console.log('On checkout page');

  // Edit address and add new dummy address
  await checkout.editAndAddNewAddress();

  console.log(' Test completed successfully!');
});




