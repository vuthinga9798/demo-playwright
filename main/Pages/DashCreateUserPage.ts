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

    async createAdminUser(userInfo: Record<string, string>[], index: number) {
        await this.selectDropdownByLabel('User Role', userInfo[index].UserRole);
        await this.selectDropdownByLabel('Status', userInfo[index].Status);
        await this.inputTextByLabel('Employee Name', userInfo[index].EmployeeName);
        await this.employeeNameList.locator(`text=${userInfo[index].EmployeeName}`).click();
        await this.inputTextByLabel('Username', userInfo[index].UserName);
        await this.inputTextByLabel('Password', userInfo[index].Password);
        await this.inputTextByLabel('Confirm Password', userInfo[index].Password);
        await this.saveButton.click();
        await this.waitForLoaderToDisappear();
    }

    async editAdminUser(userInfo: Record<string, string>[], index: number) {
        await this.inputTextByLabel('Username', userInfo[index].UserName);
        await this.saveButton.click();
    }

    async selectDropdownByLabel(label: string, value: string) {
        await this.page.locator(`.oxd-input-group:has(label:has-text("${label}")) .oxd-select-text-input`).click();
        await this.page.locator(`.oxd-select-option:has-text("${value}")`).click();
    }

}