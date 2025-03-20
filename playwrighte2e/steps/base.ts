import { Page } from '@playwright/test';

import CaseListPage from '../pages/caseListPage';
import CreateCaseThroughApi from '../pages/createCaseThroughApi';
import Et1CaseServingPage from '../pages/et1CaseServingPage';
import ET3ProcessPage from '../pages/et3ProcessPage';
import LoginPage from '../pages/loginPage';

export abstract class BaseStep {
  protected loginPage: LoginPage;
  protected caseListPage: CaseListPage;
  protected createCaseThroughApi: CreateCaseThroughApi;
  protected et1CaseServingPage: Et1CaseServingPage;
  protected et3ProcessPage: ET3ProcessPage;

  constructor(protected page: Page) {
    this.loginPage = new LoginPage(page);
    this.caseListPage = new CaseListPage(page);
    this.createCaseThroughApi = new CreateCaseThroughApi(page);
    this.et1CaseServingPage = new Et1CaseServingPage(page);
    this.et3ProcessPage = new ET3ProcessPage(page);
  }
}
