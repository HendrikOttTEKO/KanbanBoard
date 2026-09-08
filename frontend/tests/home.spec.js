import { test, expect } from "@playwright/test";

test("Startseite wird korrekt angezeigt", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Meine Boards" }),
  ).toBeVisible();

  await expect(page.getByPlaceholder("Board-Titel")).toBeVisible();

  await expect(
    page.getByRole("button", { name: "+ Neues Board" }),
  ).toBeVisible();
});

test("Board kann erstellt und wieder gelöscht werden", async ({ page }) => {
  await page.goto("/");

  const boardTitle = `Playwright Test ${Date.now()}`;

  await page.getByPlaceholder("Board-Titel").fill(boardTitle);

  await page
    .getByPlaceholder("Beschreibung (optional)")
    .fill("Automatisch erstelltes Testboard");

  await page.getByRole("button", { name: "+ Neues Board" }).click();

  const boardCard = page.locator(".board-card").filter({ hasText: boardTitle });

  await expect(boardCard).toBeVisible();

  page.once("dialog", async (dialog) => {
    await dialog.accept();
  });

  await boardCard.getByRole("button", { name: "Löschen" }).click();

  await expect(boardCard).not.toBeVisible();
});
