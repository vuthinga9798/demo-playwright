import { Page } from "@playwright/test";
import { HelperBase } from "../Utils/helperBase";
import { DashUserManagementPage } from "./DashUserManagementPage";

export class DashCreateUserPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  get employeeNameInput() {
    return this.page.locator('[name="employeeName"]');
  }
  get employeeNameList() {
    return this.page.locator('[role="listbox"]');
  }
  get usernameInput() {
    return this.page.locator('[name="username"]');
  }
  get statusDropdown() {
    return this.page.locator('[name="status"]');
  }
  get saveButton() {
    return this.page.locator('button:has-text("Save")');
  }
  get container() {
    return this.page.locator(".orangehrm-card-container");
  }

  async createAdminUser(userInfo: Record<string, string>) {
    await this.selectDropdownByLabel("User Role", userInfo.userRole);
    await this.selectDropdownByLabel("Status", userInfo.status);
    await this.inputTextByLabel("Employee Name", userInfo.employeeName);
    await this.employeeNameList
      .locator(`text=${userInfo.employeeName}`)
      .click();
    await this.inputTextByLabel("Username", userInfo.username);
    await this.inputTextByLabel("Password", userInfo.password);
    await this.inputTextByLabel("Confirm Password", userInfo.password);
    await this.saveButton.click();
    await this.waitForLoaderToDisappear();
    return new DashUserManagementPage(this.page);
  }

  async editAdminUser(userInfo: Record<string, string>) {
    await this.container.isVisible();
    await this.inputTextByLabel("Username", userInfo.username);
    await this.saveButton.click();
    await this.waitForLoaderToDisappear();
    await this.waitForElementToDisappear(this.saveButton);
  }

  async selectDropdownByLabel(label: string, value: string) {
    await this.page
      .locator(
        `.oxd-input-group:has(label:has-text("${label}")) .oxd-select-text-input`
      )
      .click();
    await this.page.locator(`.oxd-select-option:has-text("${value}")`).click();
  }
}
