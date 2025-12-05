import { Locator, Page, expect } from "@playwright/test";

export class HelperBase {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async inputTextByLabel(label: string, value: string) {
    const inputLocator = this.page.locator(
      `.oxd-input-group:has(label:text-is("${label}")) input`
    );
    await inputLocator.click();
    await inputLocator.press("Control+A");
    await inputLocator.fill(value);
  }

  async getValueByLabel(label: String) {
    return await this.page
      .locator(`//td[text()="${label}"]/following-sibling::td`)
      .textContent();
  }

  async clickUntilNextElementVisible(
    page: Page,
    locatorToClick: Locator,
    locatorToBeVisible: Locator
  ) {
    let attempts = 0;
    while (!(await locatorToBeVisible.isVisible()) && attempts < 5) {
      await locatorToClick.click();
      await page.waitForTimeout(2000);
      attempts++;
    }
  }

  async assertRedBorder(...fields: Locator[]) {
    for (const field of fields) {
      await expect(field).toHaveCSS("border-color", "rgb(232, 234, 239)");
    }
  }

  async inputUntilValue(locator: Locator, value: string) {
    await locator.fill(value);
    await expect(locator).toHaveValue(value, { timeout: 3000 });
  }

  async waitForLoaderToDisappear() {
    const loader = this.page.locator(".oxd-loading-spinner");
    if (await loader.isVisible()) {
      console.log("Loader is visible, waiting for it to disappear...");
      await loader.waitFor({ state: "detached", timeout: 20000 });
    }
  }

  async waitForElementToDisappear(locator: Locator) {
    await locator.waitFor({ state: "detached", timeout: 10000 });
  }
}
