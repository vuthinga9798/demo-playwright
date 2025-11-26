import { test, expect } from '../fixtures/custom-fixtures';
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import { NavigationMenu } from '../main/Utils/enums';

test.beforeEach(async ({ page, loginPage, dashHomePage }) => {
    await page.goto('/web/index.php/auth/login')
    await loginPage.login(userInfo[0].UserName, userInfo[0].Password)
    await dashHomePage.navigateToMenu(NavigationMenu.Admin)
});


const userInfo = parse<Record<string, string>>(fs.readFileSync('test_data/UserInfo.csv', 'utf-8'), {
    columns: true,
    skip_empty_lines: true
});

test.describe('Verify users are created/edited/deleted successfully', () => {
    test('01 - Create and verify that the user is created successfully', async ({ dashUserManagementPage, dashCreateUserPage }) => {
        await dashUserManagementPage.openCreateAdminPage()
        await dashCreateUserPage.createAdminUser(userInfo, 1)
        await dashUserManagementPage.searchUserByUsername(userInfo[1].UserName)
        await dashUserManagementPage.verifyUserInSearchResults(userInfo[1].UserName)
    })

    test('02 - Verify that the user is edited successfully', async ({ dashUserManagementPage, dashCreateUserPage }) => {
        await dashUserManagementPage.searchUserByUsername(userInfo[1].UserName)
        await dashUserManagementPage.openEditUserPageByUsername(userInfo[1].UserName)
        await dashCreateUserPage.editAdminUser(userInfo, 2);
        await dashUserManagementPage.searchUserByUsername(userInfo[2].UserName);
        await dashUserManagementPage.verifyUserInSearchResults(userInfo[2].UserNamee);
    })

    test('03 - Delete and verify that user is deleted successfully', async ({ dashUserManagementPage }) => {
        await dashUserManagementPage.searchUserByUsername(userInfo[2].UserName)
        await dashUserManagementPage.deleteUserByUsername(userInfo[2].UserName);
        await dashUserManagementPage.searchUserByUsername(userInfo[2].UserName);
        await dashUserManagementPage.verifyNoRecordsFound();
    })
})