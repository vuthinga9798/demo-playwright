import { Page } from "@playwright/test";
import { HelperBase } from "../Utils/helperBase";
import { NavigationMenu } from "../Utils/enums";

export class DashHomePage extends HelperBase {
  constructor(page: Page) {
    super(page);
    this.verifyDashboardVisible();
  }

  get dashHomePageTitle() {
    return this.page.locator('[class*="oxd-topbar-header-breadcrumb-module"]');
  }

  async verifyDashboardVisible() {
    // await expect(this.dashHomePageTitle).toHaveText('Dashboard')
  }

  async navigateToMenu(menuName: string) {
    const menuLocator = this.page.locator(`nav >> text=${menuName}`);
    await menuLocator.click();

    switch (menuName) {
      case NavigationMenu.Admin:
        return import("./DashUserManagementPage.ts").then(
          (p) => new p.DashUserManagementPage(this.page)
        );

      // case NavigationMenu.PIM:
      //     return import('./DashPimPage').then(p => new p.DashPimPage(this.page));

      // case NavigationMenu.Leave:
      //     return import('./DashLeavePage').then(p => new p.DashLeavePage(this.page));

      default:
        throw new Error(`No page object defined for menu: ${menuName}`);
    }
  }
}
