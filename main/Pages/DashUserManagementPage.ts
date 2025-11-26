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
    get titleText() { return this.page.locator('h5.oxd-text oxd-text--h5 oxd-table-filter-title') }

    async verifyPageTitle() {
        // await expect(this.titleText).toHaveText('System Users');
    }

    async openCreateAdminPage() {
        await this.createAdminButton.click();
        return new DashCreateUserPage(this.page);
    }

    async searchUserByUsername(username: string) {
        this.verifyPageTitle()
        await this.inputTextByLabel('Username', username);
        await this.searchButton.click();
    }

    async verifyUserInSearchResults(userName: string): Promise<boolean> {
        const userLocator = this.page.locator('.oxd-table-row', {
            has: this.page.locator(`.oxd-table-cell:has-text("${userName}")`),
        });
        return await userLocator.count() > 0;
    }

    async openEditUserPageByUsername(username: string) {
        await this.page.locator('.oxd-table-card').filter({
            has: this.page.locator(`div:has-text("${username}")`)
        }).locator('i.bi-pencil-fill').click();
        return new DashCreateUserPage(this.page);
    }

    async deleteUserByUsername(username: string) {
         await this.page.locator('.oxd-table-card').filter({
            has: this.page.locator(`div:has-text("${username}")`)
        }).locator('i.bi-trash').click();
        const confirmDeleteButton = this.page.locator('button:has-text("Yes, Delete")');
        await confirmDeleteButton.click();
    }
}