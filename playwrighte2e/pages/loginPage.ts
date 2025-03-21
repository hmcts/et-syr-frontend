
import { BasePage } from './basePage';

declare global {
  let newUserEmail: string;
}

export default class LoginPage extends BasePage {
  elements = {
    username: this.page.locator('#username'),
    password: this.page.locator('#password'),
    submit: this.page.locator('[type="submit"]'),
  };

  async processLogin(username: string, password: string): Promise<void> {
    await this.elements.username.fill(username);
    await this.elements.password.fill(password);
    await this.elements.submit.click();
  }
}
