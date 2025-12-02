import { Page, expect } from "@playwright/test";
import { HelperBase } from "../Utils/helperBase";
import { DashCreateUserPage } from "./DashCreateUserPage";

export class DashUserManagementPage extends HelperBase {
    constructor(page: Page) {
        super(page);
    }

    get createAdminButton() { return this.page.locator('button:has-text("Add")') }
    get searchButton() { return this.page.locator('button:has-text("Search")') }
    get searchUsernameInput() { return this.page.locator('.oxd-input-group', { has: this.page.locator('label:has-text("anna12345")'), }).locator('input') }
    get titleText() { return this.page.locator('div.oxd-table-filter-header-title h5') }
    get userTableRows() { return this.page.locator('.orangehrm-container') }
    get userRows() { return this.page.locator('.oxd-table-card') }

    async verifyPageTitle() {
        await this.userTableRows.isVisible();
        await this.titleText.isVisible();
    }

    async openCreateAdminPage() {
        await this.createAdminButton.click();
        return new DashCreateUserPage(this.page);
    }

    async searchUserByUsername(username: string) {
        this.verifyPageTitle()
        this.waitForLoaderToDisappear();
        await this.inputTextByLabel('Username', username);
        await this.searchButton.click();
        await this.waitForLoaderToDisappear();
    }

    async searchUserTillResultsVisible(username: string) {
        await this.waitForLoaderToDisappear();
        await this.inputTextByLabel('Username', username);
        const userLocator = this.page.locator('.oxd-table-row', {
            has: this.page.locator(`.oxd-table-cell:has-text("${username}")`),
        });
        await this.clickUntilNextElementVisible(this.page, this.searchButton, userLocator);
        await this.waitForLoaderToDisappear();
    }

    async verifyUserInSearchResults(userName: string): Promise<boolean> {
        await this.userTableRows.isVisible();
        const userLocator = this.page.locator('.oxd-table-row', {
            has: this.page.locator(`.oxd-table-cell:has-text("${userName}")`),
        });
        return await userLocator.count() > 0;
    }

    async openEditUserPageByUsername(username: string) {
        await this.page.locator('.oxd-table-card').filter({
            has: this.page.locator(`div:has-text("${username}")`)
        }).locator('i.bi-pencil-fill').click();
        await this.waitForLoaderToDisappear();
    }

    async deleteUserByUsername(username: string) {
        // await this.page.locator('.oxd-table-card').filter({
        //     has: this.page.locator(`div:has-text("${username}")`)
        // }).locator('i.bi-pencil-fill').click();
        const rowLocator = this.page.locator('.oxd-table-card').filter({
            has: this.page.locator(`div:has-text("${username}")`)
        });
        await rowLocator.isVisible();
        await rowLocator.locator('i.bi-trash').click();

        const confirmDeleteButton = await this.page.locator('button:has-text("Yes, Delete")');
        await confirmDeleteButton.click();
    }
}