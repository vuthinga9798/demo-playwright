import { Page, expect } from "@playwright/test";
import { HelperBase } from "../Utils/helperBase";
import { DashUserManagementPage } from "./DashUserManagementPage";

export class DashCreateUserPage extends HelperBase {
    constructor(page: Page) {
        super(page);
    }

    get employeeNameInput() { return this.page.locator('[name="employeeName"]') }
    get employeeNameList() { return this.page.locator('[role="listbox"]') }
    get usernameInput() { return this.page.locator('[name="username"]') }
    get statusDropdown() { return this.page.locator('[name="status"]') }
    get saveButton() { return this.page.locator('button:has-text("Save")') }
    get container() { return this.page.locator('.orangehrm-card-container') }

    async createAdminUser(userInfo: Record<string, string>| undefined) {
        if (!userInfo) return;
        await this.selectDropdownByLabel('User Role', userInfo.UserRole);
        await this.selectDropdownByLabel('Status', userInfo.Status);
        await this.inputTextByLabel('Employee Name', userInfo.EmployeeName);
        await this.employeeNameList.locator(`text=${userInfo.EmployeeName}`).click();
        await this.inputTextByLabel('Username', userInfo.UserName);
        await this.inputTextByLabel('Password', userInfo.Password);
        await this.inputTextByLabel('Confirm Password', userInfo.Password);
        await this.saveButton.click();
        await this.waitForLoaderToDisappear();
        return new DashUserManagementPage(this.page);
    }

    async editAdminUser(userInfo: Record<string, string>| undefined) {
        await this.container.isVisible();
        await this.inputTextByLabel('Username', userInfo!.UserName);
        await this.saveButton.click();
        await this.waitForLoaderToDisappear();
        await this.waitForElementToDisappear(this.saveButton)
    }

    async selectDropdownByLabel(label: string, value: string) {
        await this.page.locator(`.oxd-input-group:has(label:has-text("${label}")) .oxd-select-text-input`).click();
        await this.page.locator(`.oxd-select-option:has-text("${value}")`).click();
    }

}