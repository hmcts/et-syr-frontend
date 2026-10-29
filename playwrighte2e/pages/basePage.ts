import { Locator, Page } from '@playwright/test';

import { WebAction } from '../common/web.action';

export abstract class BasePage {
  readonly page: Page;
  readonly continueButton: Locator;
  readonly saveAsDraftButton: Locator;
  readonly closeAndReturnButton: Locator;
  readonly submit: Locator;
  readonly postcode: Locator;
  readonly findAddress: Locator;
  readonly signout: Locator;
  readonly startNow: Locator;
  readonly saveAndContinue: Locator;
  readonly nextButton: Locator;
  readonly applyFilterButton: Locator;
  readonly addNewBtn: Locator;
  readonly newhearingBtn: string;
  readonly newUploadDocBtn: Locator;
  readonly webActions: WebAction;

  constructor(page: Page) {
    this.page = page;
    this.saveAsDraftButton = page.getByRole('button', { name: 'Save as draft' });
    this.closeAndReturnButton = this.page.getByRole('button', { name: 'Close and Return to case' });
    this.applyFilterButton = this.page.getByRole('button', { name: 'Apply filter' });
    this.addNewBtn = page.getByRole('button', { name: 'Add new' });
    this.newhearingBtn = '#hearingCollection > div > button.button.write-collection-add-item__bottom.ng-star-inserted';
    this.newUploadDocBtn = page.locator('//*[@id="documentCollection"]/div/button[2]');
    this.webActions = new WebAction(this.page);
  }

  async wait(time: number): Promise<void> {
    await this.page.waitForTimeout(time);
  }

  async clickContinue(): Promise<void> {
    await this.webActions.clickElementByRole('button', { name: 'Continue' });
  }

  async saveAsDraft(): Promise<void> {
    await this.saveAsDraftButton.click();
  }

  async closeAndReturn(): Promise<void> {
    await this.closeAndReturnButton.click();
  }

  async submitButton(): Promise<void> {
    await this.webActions.clickElementByRole('button', { name: 'Submit' });
  }

  async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async clickNextButton(): Promise<void> {
    await this.webActions.clickElementByRole('button', { name: 'Next' });
  }

  async clickElement(elementLocator: string): Promise<void> {
    await this.page.click(elementLocator);
  }

  async signoutButton(): Promise<void> {
    await this.webActions.clickElementByText('Sign out');
  }

  // async clickStartNow(): Promise<void> {
  //   await this.webActions.clickElementByRole('button', { name: 'Start now' });
  // }

  // async saveAndContinueButton(): Promise<void> {
  //   await this.webActions.clickElementByRole('button', { name: 'Save and continue' });
  // }

  async addNewButtonClick(): Promise<void> {
    await this.addNewBtn.click();
  }

  async addNewHearingButtonClick(): Promise<void> {
    await this.webActions.clickElementByCss(this.newhearingBtn);
  }

  async addNewUploadDocButtonClick(): Promise<void> {
    await this.newUploadDocBtn.click();
  }
}
