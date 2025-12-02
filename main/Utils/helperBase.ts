import { Locator, Page, expect } from "@playwright/test";

export class HelperBase {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async inputTextByLabel(label: string, value: string) {
        let attempts = 0;
        const inputLocator = this.page.locator(
            `.oxd-input-group:has(label:text-is("${label}")) input`
        );
        await inputLocator.click();
        await inputLocator.press('Control+A');
        await inputLocator.fill(value);

        if (attempts === 5) {
            throw new Error(`Failed to fill input with value "${value}"`);
        }
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
        let attempts = 0;
        while (!(await locatorToBeVisible.isVisible()) && attempts < 5) {
            await locatorToClick.click();
            await page.waitForTimeout(2000);
            const count = await locatorToBeVisible.count();
            console.log("count =====" + count);
            attempts++;
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
        if (await loader.isVisible()) {
            console.log('Loader is visible, waiting for it to disappear...');
            await loader.waitFor({ state: 'detached', timeout: 20000 });
        }
    }

    async waitForElementToDisappear(locator: Locator) {
        await locator.waitFor({ state: 'detached', timeout: 10000 });
    }
}
