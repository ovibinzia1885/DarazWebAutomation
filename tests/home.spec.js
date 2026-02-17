const { test, expect } = require('@playwright/test');
const { loginPage } = require("../pages/login");
const { SearchPage } = require("../pages/searchProduct");

const fs = require('fs');


test("Login with valid credentials", async ({ page }) => {
    
    
    await page.goto ("https://www.daraz.com.bd/#?")
    const loginpage = new loginPage(page);
    await loginpage.login("01856565345","Daraz2026@");
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
  await searchPage.searchInput.fill('samsung s3');
  await searchPage.searchInput.press('Enter');
  await searchPage.verifyProduct('samsung s3');



});


