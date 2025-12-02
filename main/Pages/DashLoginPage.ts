import { Page, Locator, expect } from '@playwright/test';
import { HelperBase } from '../Utils/helperBase';
import { DashHomePage } from './DashHomePage';

export class LoginPage extends HelperBase {
    constructor(page: Page) {
        super(page);
    }

    get usernameInput() { return this.page.locator('[name="username"]') }
    get passwordInput() { return this.page.locator('[name="password"]') }
    get loginButton() { return this.page.locator('[type="submit"]') }
    get errorMessage() { return this.page.locator('p.oxd-alert-content-text') }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        return new DashHomePage(this.page);
    }

    async loginWithEnterKey(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.passwordInput.press('Enter');
    }

    async assertInvalidCredentials() {
        await expect(this.errorMessage).toHaveText('Invalid credentials');
    }
}