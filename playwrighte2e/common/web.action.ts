import { Locator, Page, expect } from '@playwright/test';

export class WebAction {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickElementByText(expText: string): Promise<void> {
    await this.page.getByText(expText).click();
  }

  async clickElementByRole(role: 'button', options: { name: string; exact?: boolean }): Promise<void> {
    await this.page.getByRole(role, { name: options.name, exact: options.exact }).click();
  }

  async clickElementByLabel(expLabel: string): Promise<void> {
    await this.page.getByLabel(expLabel).click();
  }

  async clickElementByCss(element: string): Promise<void> {
    await this.page.locator(element).click();
  }

  async verifyElementContainsText(elementLocator: Locator, elementText: string, timeout?: number): Promise<void> {
    await expect(elementLocator).toContainText(elementText, { timeout });
  }

  async verifyElementToBeVisible(elementLocator: Locator, timeout?: number): Promise<void> {
    await expect(elementLocator).toBeVisible({ timeout });
  }

  async checkElementById(elementId: string): Promise<void> {
    await this.page.locator(elementId).click();
  }

  async checkElementByLabel(label: string): Promise<void> {
    await this.page.getByLabel(label).check();
  }

  async fillField(element: string, text: string): Promise<void> {
    await this.page.locator(element).fill(text);
  }

  async waitForElementToBeVisible(element: string): Promise<void> {
    await this.page.locator(element).waitFor({ state: 'visible' });
  }

  async selectByLabelFromDropDown(element: string, option: string): Promise<void> {
    await this.page.locator(element).selectOption({ label: option });
  }

  async selectByOptionFromDropDown(element: string, option: string): Promise<void> {
    await this.page.locator(element).selectOption(option);
  }

  async waitForLabelToBeVisible(labelName: string): Promise<void> {
    this.page.getByLabel(labelName).waitFor();
  }
}
