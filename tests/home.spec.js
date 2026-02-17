const { test, expect } = require('@playwright/test');
const { loginPage } = require("../pages/login");


test("Login with valid credentials", async ({ page }) => {
    
    
    await page.goto ("https://www.daraz.com.bd/#?")
    const loginpage = new loginPage(page);
    await loginpage.login("01856565345","Daraz2026@");
    await page.waitForLoadState('networkidle');
    const userProfile = page.locator("#myAccountTrigger");
    await expect(userProfile).toBeVisible();
    console.log(userProfile);
    


    });