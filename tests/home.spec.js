const { test, expect } = require('@playwright/test');
const { loginPage } = require("../pages/login");
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