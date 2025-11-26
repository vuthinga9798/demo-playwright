import { test, expect } from '../fixtures/custom-fixtures';
import { parse } from 'csv-parse/sync'
import fs from 'fs'

const userInfo = parse<Record<string, string>>(fs.readFileSync('test_data/UserInfo.csv', 'utf-8'), {
    columns: true,
    skip_empty_lines: true
});

test.beforeEach(async ({ page }) => {
    await page.goto('/web/index.php/auth/login')
});

test.describe('Verify login with valid credentials', () => {
    test('User should be able to login successfully', async ({ loginPage, dashHomePage}) => {
        await loginPage.login(userInfo[0].UserName, userInfo[0].Password)
        await dashHomePage.verifyDashboardVisible;
    })
    test('Verify pressing Enter triggers login', async ({ loginPage, dashHomePage }) => {
        await loginPage.loginWithEnterKey(userInfo[0].UserName, userInfo[0].Password)
        await dashHomePage.verifyDashboardVisible
    })
})

test.describe('Verify that login validation messages are displayed correctly', () => {
    test('User should see error message when username is empty', async ({ loginPage }) => {
        await loginPage.login('', userInfo[0].Password)
        await loginPage.assertRedBorder(loginPage.passwordInput);
    })
    test('User should see error message when password is empty', async ({ loginPage }) => {
        await loginPage.login(userInfo[0].UserName, '')
        await loginPage.assertRedBorder(loginPage.usernameInput);
    })
    test('User should see error message with invalid username', async ({ loginPage }) => {
        await loginPage.login('invalidUser', userInfo[0].Password)
        await loginPage.assertInvalidCredentials();
    })
    test('User should see error message with invalid password', async ({ loginPage }) => {
        await loginPage.login(userInfo[0].UserName, 'invalidPass')
        await loginPage.assertInvalidCredentials();
    })
})