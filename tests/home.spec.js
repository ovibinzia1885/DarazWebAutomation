const { test, expect } = require('@playwright/test');
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


test("Login with valid credentials", async ({ page }) => {


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


test('Login then search samsung s3', async ({ page }) => {

  const searchPage = new SearchPage(page);
  await page.goto('https://www.daraz.com.bd/', { waitUntil: 'domcontentloaded' });

  await searchPage.login('01856565345', 'Daraz2026@');  // login reuse
  await page.waitForLoadState('networkidle');
  await searchPage.searchInput.fill('samsung s3');
  await searchPage.searchInput.press('Enter');
  await searchPage.verifyProduct('samsung s3');
  await page.waitForTimeout(5000);

});

test("Login → Search → Add to Cart → Verify", async ({ page }) => {

  const addToCartPage = new AddToCart(page);

  await page.goto("https://www.daraz.com.bd/", {
    waitUntil: "domcontentloaded"
  });

  await addToCartPage.login("01856565345", "Daraz2026@");
  await page.waitForLoadState("networkidle");
  await addToCartPage.searchInput.fill("samsung s25 ultra");
  await addToCartPage.searchInput.press("Enter");
  await addToCartPage.openFirstMatchedProduct();
  await addToCartPage.addToCart();
  await addToCartPage.goToCart();
  await addToCartPage.verifyCartProduct("S25 Ultra");

});


test('use multiple filter for search item ', async ({ page }) => {
  const multiplefilter = new MultipleSearch(page);
  await page.goto('https://www.daraz.com.bd/', { waitUntil: 'domcontentloaded' });
  await multiplefilter.searchMultiple();

});


test('use value filter for search item ', async ({ page }) => {
  const valuefilter = new ValueFilter(page);
  await page.goto('https://www.daraz.com.bd/', { waitUntil: 'domcontentloaded' });
  await valuefilter.filterByValue("1000", "2000");
});


test('Multi Product Add to Cart', async ({ page }) => {
  const ms = new MultipleProductAddToCart(page);
  await page.goto('https://www.daraz.com.bd/', { waitUntil: 'domcontentloaded' });
  await ms.loginPage.login("01856565345", "Daraz2026@");
  await page.waitForLoadState('networkidle');
  const products = ["T shirt", "Jeans", "Shoes"];
  await ms.addManyProducts(products);


});

test('Add to cart and checkout process', async ({ page }) => {
  const checkout = new itemCheckoutprocess(page);
  await page.goto('https://www.daraz.com.bd/', { waitUntil: 'domcontentloaded' });
  await checkout.login("01856565345", "Daraz2026@");
  await page.waitForLoadState('networkidle');
  await checkout.searchAndAdd('samsung s25 ultra');
  await checkout.selectLeftProductCheckbox();
  await checkout.proceedToCheckout();
  await expect(page).toHaveURL(/checkout/);
  await checkout.editAndAddNewAddress();
});

test('Remove item from cart', async ({ page }) => {
  const removeItem = new Removeitem(page);

  try {
    await page.goto('https://www.daraz.com.bd/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    console.log('Logging in...');
    await removeItem.login("01856565345", "Daraz2026@");
    await page.waitForTimeout(3000);
    await removeItem.openCart();
    await removeItem.page.waitForTimeout(2000);
    await removeItem.selectProductCheckbox('Galaxy S25 Ultra');
    await removeItem.page.waitForTimeout(2000);
    await removeItem.removeProduct('Galaxy S25 Ultra');
    await removeItem.verifyRemoved('Galaxy S25 Ultra');
  } catch (error) {
    console.error('Test failed:', error.message);
    throw error;
  }
});


test('Logout after login', async ({ page }) => {
  const logout = new Logout(page);
  await page.goto('https://www.daraz.com.bd/', { waitUntil: 'domcontentloaded' }); 
  await logout.login("01856565345", "Daraz2026@");
  await page.waitForLoadState('networkidle');
  await logout.verifyLogin();
  await logout.logout();
  await logout.verifyLogout(); 
});





