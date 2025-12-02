import { test as base } from '@playwright/test';
import { LoginPage } from '../main/Pages/DashLoginPage';
import { DashHomePage } from '../main/Pages/DashHomePage';
import { DashUserManagementPage } from '../main/Pages/DashUserManagementPage';
import { DashCreateUserPage } from '../main/Pages/DashCreateUserPage';
import { HelperBase } from '../main/Utils/helperBase';

export type UserInfo = Record<string, string>
export const test = base.extend<{
    loginPage: LoginPage;
    dashHomePage: DashHomePage
    dashUserManagementPage: DashUserManagementPage
    dashCreateUserPage: DashCreateUserPage
    helperBase: HelperBase

}>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    dashHomePage: async ({ page }, use) => {
        const dashHomePage = new DashHomePage(page);
        await use(dashHomePage);
    },
    dashUserManagementPage: async ({ page }, use) => {
        const dashAdminPage = new DashUserManagementPage(page);
        await use(dashAdminPage);
    },
    dashCreateUserPage: async ({ page }, use) => {
        const createAdminPage = new DashCreateUserPage(page);
        await use(createAdminPage);
    },
    helperBase: async ({ page }, use) => {
        const helperBase = new HelperBase(page);
        await use(helperBase);
    }
});

export const expect = base.expect;
