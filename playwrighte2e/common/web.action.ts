import { expect, Locator, Page } from "@playwright/test";

export class WebAction {
   
    readonly page:Page;

    constructor(page:Page){
        this.page = page;
    }

    async clickElementByText(expText: string) {
        await this.page.getByText(expText).click();
    }

    async clickElementByRole(role: any, options: {name: string, exact?: boolean} ) {
        await this.page.getByRole(role, {name: options.name, exact: options.exact}).click();
    }

    async clickElementByLabel(expLabel: string) {
        await this.page.getByLabel(expLabel).click();
    }

    async clickElementByCss(element: string) {
        await this.page.locator(element).click();
    }

    async verifyElementContainsText(elementLocator: Locator, elementText: string, timeout?: number){
        await expect(elementLocator).toContainText(elementText, {timeout: timeout});
    }

    async verifyElementToBeVisible(elementLocator: Locator, timeout?: number){
        await expect(elementLocator).toBeVisible({timeout: timeout});
    }

    async checkElementById(elementId: string){
        await this.page.locator(elementId).click();
    }

    async checkElementByLabel(label: string){
        await this.page.getByLabel(label).check();
    }

    async fillField(element: string, text: string){
        await this.page.locator(element).fill(text);
    }

    async waitForElementToBeVisible(element: string){
        await this.page.locator(element).waitFor({ state: 'visible' });
    }

    async selectByLabelFromDropDown(element: string, option: string){
        await this.page.locator(element).selectOption({label: option});
    }

    async selectByOptionFromDropDown(element: string, option: string){
        await this.page.locator(element).selectOption(option);
    }

    async waitForLabelToBeVisible(labelName: string){
        this.page.getByLabel(labelName).waitFor()
    }
}