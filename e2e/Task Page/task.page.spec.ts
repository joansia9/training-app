import { expect, Page, test } from '@playwright/test';
import { seed } from '../../prisma/seed/seed';

test.describe('Task page', () => {
  test.beforeEach(async ({ page }) => {
    // fresh seed before each test
    await seed();

    // sign in as the task user and then redirect to the task page
    await page.goto('/proxy?net_id=jm123&next_uri=%2Ftask');
  });

  test('create task', async ({ page }) => {
    //things to find
    const card = page.locator('mat-card');
    const createButton = page.getByRole('button', { name: 'Create task' });
    const titleInput = page.getByRole('textbox', { name: 'Title' });
    const descriptionInput = page.getByRole('textbox', { name: 'Description' });
    const cancelButton = page.getByRole('button', { name: 'cancel' });
    const saveButton = page.getByRole('button', { name: 'save' });

    //no tasks
    await expect(card).not.toBeAttached(); //think: we are waiting to expect the card to not be attached

    //opening the creating dialog makes the button seen/enabled and waits for the click
    await expect(createButton).toBeVisible();
    await expect(createButton).toBeEnabled();
    await createButton.click();

    //testing what if empty fields -> save button disabled
    await titleInput.fill('');
    await descriptionInput.fill('');
    await expect(saveButton).toBeDisabled();

    await titleInput.fill('Title');
    await descriptionInput.fill('');
    await expect(saveButton).toBeDisabled();

    await titleInput.fill('');
    await descriptionInput.fill('Description');
    await expect(saveButton).toBeDisabled();

    //testing white space in fields
    await titleInput.fill('    ');
    await descriptionInput.fill('Description');
    await expect(saveButton).toBeDisabled();

    await titleInput.fill('Title');
    await descriptionInput.fill('    ');
    await expect(saveButton).toBeDisabled();

    await titleInput.fill('Title');
    await descriptionInput.fill('Description');
    await expect(saveButton).toBeEnabled();

    // Cancel
    await cancelButton.click();
    await expect(card).not.toBeAttached();

    // Save
    await expect(createButton).toBeVisible();
    await expect(createButton).toBeEnabled();
    await createButton.click();
    await titleInput.fill('Title');
    await descriptionInput.fill('Description');
    await saveButton.click();
    await expect(card).toBeAttached();
  });

  test('edit mode', async ({ page }) => {
    //finding the highlighted elements again
    //title and description elemnts
    const oldTitle = 'Old title';
    const oldDescription = 'Old description';
    const newTitle = 'New title';
    const newDescription = 'New description';

    // card elements
    const card = page.locator('mat-card');
    const editButton = card.getByLabel('toggle edit mode');
    const cardTitle = card.locator('mat-card-title');
    const cardDescription = card.locator('mat-card-content');

    // edit elements
    const createButton = page.getByRole('button', { name: 'Create task' });
    const titleInput = page.getByRole('textbox', { name: 'Title' });
    const descriptionInput = page.getByRole('textbox', { name: 'Description' });
    const cancelButton = page.getByRole('button', { name: 'cancel' });
    const saveButton = page.getByRole('button', { name: 'save' });

    // create a task where we click the create Button and fill the title and description and save
    //expect it to save
    await createButton.click();
    await titleInput.fill(oldTitle);
    await descriptionInput.fill(oldDescription);
    await saveButton.click();

    // click the edit button, fill in the title and description and we click the CANCEL button
    //expect htis to have the old title and old description so this did NOT save
    await editButton.click();
    await titleInput.fill(newTitle);
    await descriptionInput.fill(newDescription);
    await cancelButton.click();
    await expect(cardTitle).toHaveText(oldTitle);
    await expect(cardDescription).toHaveText(oldDescription);

    // editing and saving so we click the edit button, fill title and description, and click SAVE button
    //we expect to have NEW title and NEW description
    await editButton.click();
    await titleInput.fill(newTitle);
    await descriptionInput.fill(newDescription);
    await saveButton.click();
    await expect(cardTitle).toHaveText(newTitle);
    await expect(cardDescription).toHaveText(newDescription);
  });

  test('status menu', async ({ page }) => {
    // status elements
    const card = page.locator('mat-card');
    const cardActions = card.locator('mat-card-actions');
    const statusMenu = card.getByRole('button', { name: 'status selector' });
    const incomplete = page.getByRole('menuitem', { name: 'Incomplete' });
    const inProgress = page.getByRole('menuitem', { name: 'In Progress' });
    const complete = page.getByRole('menuitem', {
      name: 'Complete',
      exact: true,
    });

    // edit elements
    const createButton = page.getByRole('button', { name: 'Create task' });
    const titleInput = page.getByRole('textbox', { name: 'Title' });
    const descriptionInput = page.getByRole('textbox', { name: 'Description' });
    const saveButton = page.getByRole('button', { name: 'save' });

    // same as create a task and saving
    await createButton.click();
    await titleInput.fill('Title');
    await descriptionInput.fill('Description');
    await saveButton.click();

    // click on the status icon and expect to change the background color to its corresponding status
    await statusMenu.click();
    await inProgress.click();
    await expect(statusMenu).toHaveCSS('background-color', 'rgb(255, 183, 0)');
    await statusMenu.click();
    await incomplete.click();
    await expect(statusMenu).toHaveCSS('background-color', 'rgb(230, 23, 68)');
    await statusMenu.click();
    await complete.click();
    await expect(statusMenu).toHaveCSS('background-color', 'rgb(16, 161, 112)');

    // check for completed date to RIgHT NOW
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    await expect(cardActions).toContainText(`Completed: ${formattedDate}`);
  });

  test('delete task', async ({ page }) => {
    // card elements
    const card = page.locator('mat-card');
    const deleteButton = page.getByLabel('delete task');
    const noButton = page.getByRole('button', { name: 'No' });
    const yesButton = page.getByRole('button', { name: 'Yes' });

    // edit elements
    const createButton = page.getByRole('button', { name: 'Create task' });
    const titleInput = page.getByRole('textbox', { name: 'Title' });
    const descriptionInput = page.getByRole('textbox', { name: 'Description' });
    const saveButton = page.getByRole('button', { name: 'save' });

    // create a task and we expect it to save perfectly
    await createButton.click();
    await titleInput.fill('Title');
    await descriptionInput.fill('Description');
    await saveButton.click();

    //when we click delete and this should not delete the task
    await deleteButton.click();
    await noButton.click();
    await expect(card).toBeAttached();

    // delete
    await deleteButton.click();
    await yesButton.click();
    await expect(card).not.toBeAttached();
  });

  // test('pagination', async ({ page }) => {
  //   await seed({ count: '100' });
  //   await page.reload();

  //   const cards = page.locator('app-task-card');
  //   const display = page.getByRole('group');
  //   const firstButton = page.getByRole('button', { name: 'First page' });
  //   const previousButton = page.getByRole('button', { name: 'Previous page' });
  //   const nextButton = page.getByRole('button', { name: 'Next page' });
  //   const lastButton = page.getByRole('button', { name: 'Last page' });

  //   await expect(display).toContainText('1 – 12 of 100');
  //   await nextButton.click();
  //   await expect(cards).toHaveCount(12);
  //   await expect(display).toContainText('13 – 24 of 100');
  //   await nextButton.click();
  //   await expect(cards).toHaveCount(12);
  //   await expect(display).toContainText('25 – 36 of 100');
  //   await nextButton.click();
  //   await expect(cards).toHaveCount(12);
  //   await expect(display).toContainText('37 – 48 of 100');
  //   await nextButton.click();
  //   await expect(cards).toHaveCount(12);
  //   await expect(display).toContainText('49 – 60 of 100');
  //   await nextButton.click();
  //   await expect(cards).toHaveCount(12);
  //   await expect(display).toContainText('61 – 72 of 100');
  //   await nextButton.click();
  //   await expect(cards).toHaveCount(12);
  //   await expect(display).toContainText('73 – 84 of 100');
  //   await nextButton.click();
  //   await expect(cards).toHaveCount(12);
  //   await expect(display).toContainText('85 – 96 of 100');
  //   await nextButton.click();
  //   await expect(cards).toHaveCount(4);
  //   await expect(display).toContainText('97 – 100 of 100');

  //   await previousButton.click();
  //   await expect(display).toContainText('85 – 96 of 100');
  //   await expect(cards).toHaveCount(12);
  //   await firstButton.click();
  //   await expect(display).toContainText('1 – 12 of 100');
  //   await expect(cards).toHaveCount(12);
  //   await lastButton.click();
  //   await expect(display).toContainText('97 – 100 of 100');
  //   await expect(cards).toHaveCount(4);
  // });
});
