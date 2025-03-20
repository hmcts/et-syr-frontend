import { expect, Locator, Page } from '@playwright/test';
import axios from 'axios';
import { BasePage } from './basePage';
import { params } from "../utils/config";
import { faker } from '@faker-js/faker';

// const chance = require('chance');
const aatUrl = params.TestUrlForManageCaseAAT;
const idamUrl = params.TestIdamUrl;

declare global {
  var newUserEmail: string;
}

export default class LoginPage extends BasePage{
  elements={
    username: this.page.locator('#username'),
    password: this.page.locator('#password'),
    submit:this.page.locator('[type="submit"]')
  };



  async registerNewAccount() {
    try {
      let firstName = faker.name.firstName();
      let lastName = faker.name.lastName();
      var lastFour = Math.floor(1000 + Math.random() * 9000);
      let emailAddress = firstName + '.' + lastName + lastFour + '@justice.gov.uk';
      let idamData = JSON.stringify({
        forename: firstName,
        surname: lastName,
        email: emailAddress,
        password: params.TestEnvETPassword,
        active: true,
        roles: [
          {
            code: 'citizen',
          },
        ],
      });
      let headers = {
        'Content-Type': 'application/json',
      };
      console.log('url:', idamUrl);
      console.log('data:', idamData);
      let idamResponse = await axios.post(idamUrl, idamData, { headers });
      console.log('Response:', idamResponse.data);
      console.log('.... completed account registration');
      expect(idamResponse.status).toBe(201);
      global.newUserEmail = idamResponse.data.email;
      return global.newUserEmail;
    } catch (error) {
      return error.message;
    }
  }
  
  async processLoginWithNewAccount() {
    global.newUserEmail = await this.registerNewAccount();
    console.log('.... checking email address:', global.newUserEmail);
    await this.elements.username.fill(global.newUserEmail);
    await this.elements.password.fill(params.TestEnvETPassword);
    await this.elements.submit.click();
  }

  async processLogin(username: string, password: string) {
    await this.elements.username.fill(username);
    await this.elements.password.fill(password);
    await this.elements.submit.click();
  }

}
