import { test } from "../fixtures/custom-fixtures";
import { parse } from "csv-parse/sync";
import fs from "fs";
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

const userInfo: Record<string, string>[] = [
  {
    UserName: "anna_12345",
    Password: "superadmin123A@",
    UserRole: "Admin",
    EmployeeName: "Anna  Vu",
    Status: "Enabled",
  },
  {
    UserName: "edit_anna_12345",
    Password: "superadmin123A@",
    UserRole: "Admin",
    EmployeeName: "Anna  Vu",
    Status: "Enabled",
  },
];

test.describe
  .serial("Verify users are created/edited/deleted successfully", () => {
  test("01 - Create and verify that the user is created successfully", async ({
    dashUserManagementPage,
    dashCreateUserPage,
  }) => {
    const userRow: Record<string, string> | undefined = userInfo.find(
      (user) => user.UserName === "anna_12345"
    );

    await test.step("Create a new admin user", async () => {
      await dashUserManagementPage.openCreateAdminPage();
      await dashCreateUserPage.createAdminUser(userRow);
    });
    await test.step("Verify that the new user is created successfully", async () => {
      await dashUserManagementPage.searchUserTillResultsVisible(
        userRow!.UserName
      );
      await dashUserManagementPage.verifyUserInSearchResults(userRow!.UserName);
    });
  });

  test("02 - Verify that the user is edited successfully", async ({
    dashUserManagementPage,
    dashCreateUserPage,
  }) => {
    const userRow: Record<string, string> | undefined = userInfo.find(
      (user) => user.UserName === "anna_12345"
    );
    const userEditRow: Record<string, string> | undefined = userInfo.find(
      (user) => user.UserName === "edit_anna_12345"
    );

    await test.step("Edit the existing user", async () => {
      await dashUserManagementPage.searchUserTillResultsVisible(
        userRow!.UserName
      );
      await dashUserManagementPage.openEditUserPageByUsername(
        userRow!.UserName
      );
      await dashCreateUserPage.editAdminUser(userEditRow);
    });
    await test.step("Verify that the user is edited successfully", async () => {
      await dashUserManagementPage.searchUserTillResultsVisible(
        userEditRow!.UserName
      );
      await dashUserManagementPage.verifyUserInSearchResults(
        userEditRow!.UserName
      );
    });
  });

  test("03 - Delete and verify that user is deleted successfully", async ({
    dashUserManagementPage,
  }) => {
    const userEditRow: Record<string, string> | undefined = userInfo.find(
      (user) => user.UserName === "edit_anna_12345"
    );
    await test.step("Delete the existing user", async () => {
      await dashUserManagementPage.searchUserTillResultsVisible(
        userEditRow!.UserName
      );
      await dashUserManagementPage.deleteUserByUsername(userEditRow!.UserName);
    });
    await test.step("Verify that the user is deleted successfully", async () => {
      await dashUserManagementPage.verifyUserNotInSearchResults(
        userEditRow!.UserName
      );
    });
  });
});
