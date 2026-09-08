import { test, expect } from "@playwright/test";

test("Task kann erstellt, verschoben und gelöscht werden", async ({ page }) => {
  await page.goto("/");

  const boardTitle = `Task Test Board ${Date.now()}`;
  const taskTitle = `Playwright Task ${Date.now()}`;

  // 1. Test-Board erstellen
  await page.getByPlaceholder("Board-Titel").fill(boardTitle);

  await page
    .getByPlaceholder("Beschreibung (optional)")
    .fill("Board für automatischen Task-Test");

  await page.getByRole("button", { name: "+ Neues Board" }).click();

  // 2. Neues Board finden
  const boardCard = page.locator(".board-card").filter({ hasText: boardTitle });

  await expect(boardCard).toBeVisible();

  // 3. Board öffnen
  await boardCard.click();

  await expect(page.getByRole("heading", { name: boardTitle })).toBeVisible();

  // 4. Task erstellen
  await page.getByPlaceholder("Titel der Aufgabe").fill(taskTitle);

  await page
    .getByPlaceholder("Beschreibung")
    .fill("Automatisch erstellter Playwright Task");

  await page.getByRole("button", { name: "+ Neue Aufgabe" }).click();

  // 5. Task in TO DO prüfen
  const todoColumn = page.locator(".column").filter({
    has: page.getByRole("heading", { name: "TO DO" }),
  });

  const taskCard = todoColumn
    .locator(".task-card")
    .filter({ hasText: taskTitle });

  await expect(taskCard).toBeVisible();

  // 6. Task nach IN PROGRESS verschieben
  await taskCard.getByRole("button", { name: "In Progress" }).click();

  const progressColumn = page.locator(".column").filter({
    has: page.getByRole("heading", { name: "IN PROGRESS" }),
  });

  const movedTask = progressColumn
    .locator(".task-card")
    .filter({ hasText: taskTitle });

  await expect(movedTask).toBeVisible();

  // 7. Task löschen
  page.once("dialog", async (dialog) => {
    await dialog.accept();
  });

  await movedTask.getByRole("button", { name: "Löschen" }).click();

  await expect(movedTask).not.toBeVisible();

  // 8. Zurück zur Übersicht
  await page.getByRole("link", { name: "← Zurück zur Übersicht" }).click();

  // 9. Test-Board löschen
  const testBoard = page.locator(".board-card").filter({ hasText: boardTitle });

  page.once("dialog", async (dialog) => {
    await dialog.accept();
  });

  await testBoard.getByRole("button", { name: "Löschen" }).click();

  await expect(testBoard).not.toBeVisible();
});

test("Task kann bearbeitet werden und bleibt nach Reload gespeichert", async ({
  page,
}) => {
  await page.goto("/");

  const boardTitle = `Edit Test Board ${Date.now()}`;
  const taskTitle = `Edit Task ${Date.now()}`;
  const newTaskTitle = `Bearbeiteter Task ${Date.now()}`;

  // 1. Test-Board erstellen
  await page.getByPlaceholder("Board-Titel").fill(boardTitle);

  await page
    .getByPlaceholder("Beschreibung (optional)")
    .fill("Board für Bearbeitungstest");

  await page.getByRole("button", { name: "+ Neues Board" }).click();

  const boardCard = page.locator(".board-card").filter({ hasText: boardTitle });

  await expect(boardCard).toBeVisible();

  // 2. Board öffnen
  await boardCard.click();

  await expect(page.getByRole("heading", { name: boardTitle })).toBeVisible();

  // 3. Task erstellen
  await page.getByPlaceholder("Titel der Aufgabe").fill(taskTitle);

  await page.getByPlaceholder("Beschreibung").fill("Alte Beschreibung");

  await page.getByRole("button", { name: "+ Neue Aufgabe" }).click();

  let taskCard = page.locator(".task-card").filter({ hasText: taskTitle });

  await expect(taskCard).toBeVisible();

  // 4. Bearbeitungsmodus öffnen
  await taskCard.getByRole("button", { name: "Bearbeiten" }).click();

  // Sobald Bearbeiten aktiv ist, suchen wir die Karte
  // über den Speichern-Button und nicht mehr über den Titel.
  const editingCard = page.locator(".task-card").filter({
    has: page.getByRole("button", { name: "Speichern" }),
  });

  await expect(editingCard).toBeVisible();

  // 5. Titel und Beschreibung ändern
  const textInputs = editingCard.locator('input[type="text"]');

  await textInputs.nth(0).fill(newTaskTitle);
  await textInputs.nth(1).fill("Neue Beschreibung");

  // 6. Priorität auf Hoch setzen
  await editingCard.locator("select").selectOption("Hoch");

  // 7. Änderungen speichern
  await editingCard.getByRole("button", { name: "Speichern" }).click();

  // 8. Änderungen direkt prüfen
  taskCard = page.locator(".task-card").filter({ hasText: newTaskTitle });

  await expect(taskCard).toBeVisible();
  await expect(taskCard).toContainText("Neue Beschreibung");
  await expect(taskCard).toContainText("Hoch");

  // 9. Seite neu laden
  await page.reload();

  // 10. Prüfen, ob Änderung nach Reload noch gespeichert ist
  taskCard = page.locator(".task-card").filter({ hasText: newTaskTitle });

  await expect(taskCard).toBeVisible();
  await expect(taskCard).toContainText("Neue Beschreibung");
  await expect(taskCard).toContainText("Hoch");

  // 11. Test-Task löschen
  page.once("dialog", async (dialog) => {
    await dialog.accept();
  });

  await taskCard.getByRole("button", { name: "Löschen" }).click();

  await expect(taskCard).not.toBeVisible();

  // 12. Zurück zur Übersicht
  await page.getByRole("link", { name: "← Zurück zur Übersicht" }).click();

  // 13. Test-Board wieder löschen
  const testBoard = page.locator(".board-card").filter({ hasText: boardTitle });

  await expect(testBoard).toBeVisible();

  page.once("dialog", async (dialog) => {
    await dialog.accept();
  });

  await testBoard.getByRole("button", { name: "Löschen" }).click();

  await expect(testBoard).not.toBeVisible();
});
