import { parse } from "csv-parse/sync";
import fs from "fs";
import { test } from "../fixtures/custom-fixtures";
import { NavigationMenu } from "../main/Utils/enums";

test.beforeEach(async ({ page, loginPage, dashHomePage }) => {
  await page.goto("/orangehrm/web/index.php/auth/login");
  await loginPage.login(user[0].UserName, user[0].Password);
  await dashHomePage.navigateToMenu(NavigationMenu.Admin);
});

const user = parse<Record<string, string>>(
  fs.readFileSync("test_data/UserInfo.csv", "utf-8"),
  {
    columns: true,
    skip_empty_lines: true,
  }
);

const userAddInfo: Record<string, string> = {
  username: "anna_12345",
  password: "superadmin123A@",
  userRole: "Admin",
  employeeName: "Anna  Vu",
  status: "Enabled",
};

const userEditInfo: Record<string, string> = {
  username: "edit_anna_12345",
  password: "superadmin123A@",
  userRole: "Admin",
  employeeName: "Anna  Vu",
  status: "Enabled",
};

test.describe
  .serial("Verify users are created/edited/deleted successfully", () => {
  test("01 - Create and verify that the user is created successfully", async ({
    dashUserManagementPage,
    dashCreateUserPage,
  }) => {
    await test.step("Create a new admin user", async () => {
      await dashUserManagementPage.openCreateAdminPage();
      await dashCreateUserPage.createAdminUser(userAddInfo);
      userAddInfo.username;
    });
    await test.step("Verify that the new user is created successfully", async () => {
      await dashUserManagementPage.searchUserTillResultsVisible(
        userAddInfo.username
      );
      await dashUserManagementPage.verifyUserInSearchResults(
        userAddInfo.username
      );
    });
  });

  test("02 - Verify that the user is edited successfully", async ({
    dashUserManagementPage,
    dashCreateUserPage,
  }) => {
    await test.step("Edit the existing user", async () => {
      await dashUserManagementPage.searchUserTillResultsVisible(
        userAddInfo.username
      );
      await dashUserManagementPage.openEditUserPageByUsername(
        userAddInfo.username
      );
      await dashCreateUserPage.editAdminUser(userEditInfo);
    });
    await test.step("Verify that the user is edited successfully", async () => {
      await dashUserManagementPage.searchUserTillResultsVisible(
        userEditInfo.username
      );
      await dashUserManagementPage.verifyUserInSearchResults(
        userEditInfo.username
      );
    });
  });

  test("03 - Delete and verify that user is deleted successfully", async ({
    dashUserManagementPage,
  }) => {
    await test.step("Delete the existing user", async () => {
      await dashUserManagementPage.searchUserTillResultsVisible(
        userEditInfo.username
      );
      await dashUserManagementPage.deleteUserByUsername(userEditInfo.username);
    });
    await test.step("Verify that the user is deleted successfully", async () => {
      await dashUserManagementPage.verifyUserNotInSearchResults(
        userEditInfo.username
      );
    });
  });
});
