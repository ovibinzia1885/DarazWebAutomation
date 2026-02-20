const { expect } = require("@playwright/test");
const { loginPage } = require("./login");
const {AddToCart} = require("./addtocart");
const { SearchPage } = require("./searchProduct");

class itemCheckoutprocess  extends loginPage{
    constructor(page) {
        super(page);
        this.atc= new AddToCart(page);
        this.ln=new loginPage(page);
        this.sp=new SearchPage(page);
        this .chcekbox= page.locator("//label[@class='next-checkbox cart-item-checkbox ']//span[@class='next-checkbox-inner']").nth(0);
        this .checkoutbutton=page.getByRole('button', { name: 'PROCEED TO CHECKOUT' });
        this.edit=page.getByRole('button', { name: 'Edit' });
        this.newaddress=page.getByRole('link', { name: 'Add new address' });
        this.fullname= page.getByPlaceholder('Enter your first and last name Name');
        this.phonenumber=page.getByPlaceholder('Please enter your phone number');
        this.houseno=page.locator("//div[@class='mod-input mod-input-detail-address-1']//input[@placeholder='Please enter']");
        this.colony=page.locator("//div[@class='mod-input mod-input-detail-address-2']//input[@placeholder='Please enter']");
        this.rigionbox=page.locator('.next-select-placeholder');
        this.divisionselect = page.getByText('Chattogram', { exact: true });
        this.citybox=page.getByText('Please choose your city', { exact: true });
        this.selectcity=page.locator("#R80300531");
        this.areabox=page.locator(".next-select-placeholder");
        this.areadrpdwn=page.locator("#R80300961");
        this.address=page.getByRole('textbox', { name: 'For Example: House# 123, Street# 123, ABC Road' });
        this.addresstype=page.getByText('HOME', { exact: true });
        this.savebutton=page.getByRole('button', { name: 'Save' });


}

async checkoutprocess(){
    await this.atc.openFirstMatchedProduct("samsung s25 ultra");
    await this.atc.addToCart();
    await this.atc.goToCart();
    await this.atc.verifyCartProduct("Galaxy S25 Ultra");
    await this.chcekbox.click();
    await this.checkoutbutton.click();
    await this.edit.click();
    await this.newaddress.click();
    await this.fullname.fill("Ovy Sultana");    
    await this.phonenumber.fill("01856565345");
    await this.houseno.fill("House# 123");
    await this.colony.fill("ABC Road");
    await this.rigionbox.click();
    await this.divisionselect.click();
    await this.citybox.click();
    await this.selectcity.click();
    await this.areabox.click();
    await this.areadrpdwn.click();
    await this.address.fill("House# 123, Street# 123, ABC Road");
    await this.addresstype.click();
    await this.savebutton.click();
    await this.page.waitForLoadState('networkidle');


}





}
 module.exports = {itemCheckoutprocess};