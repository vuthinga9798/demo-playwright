import { Locator, Page, expect } from "@playwright/test";

export class HelperBase {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async inputTextByLabel(label: string, value: string) {
        const inputLocator = this.page.locator(`.oxd-input-group:has(label:text-is("${label}")) input`);
        await inputLocator.isVisible
        await inputLocator.clear
        await inputLocator.fill(value)
    }

    async getValueByLabel(label: String) {
        return await this.page.locator(`//td[text()="${label}"]/following-sibling::td`).textContent()
    }

    async scrollUntilVisible(page: Page, locator: Locator) {
        while (!(await locator.isVisible())) {
            await page.evaluate(() => window.scrollBy(0, 500));
            await page.waitForTimeout(200);
        }
    }

    async clickUntilNextElementVisible(page: Page, locatorToClick: Locator, locatorToBeVisible: Locator) {
        while (!(await locatorToBeVisible.isVisible())) {
            await locatorToClick.click();
            await page.waitForTimeout(200);
        }
    }

    async formatDate(dateString: string) {
        const date = new Date(dateString);
        const day = date.toLocaleString('en-GB', { day: '2-digit' });
        const month = date.toLocaleString('en-GB', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    }


    async assertRedBorder(...fields: Locator[]) {
        for (const field of fields) {
            await expect(field).toHaveCSS('border-color', 'rgb(232, 234, 239)');
        }
    }

    async inputUntilValue(locator: Locator, value: string) {
        await locator.fill(value);
        await expect(locator).toHaveValue(value, { timeout: 3000 });
    }

    async waitForLoaderToDisappear() {
        const loader = this.page.locator('.oxd-loading-spinner');
        await loader.waitFor({ state: 'detached', timeout: 10000 });
        // await this.spinner.waitFor({ state: 'hidden', timeout: 5000 });
        // this.spinner.isHidden;
    }
}
