import { expect, Page, test } from '@playwright/test';
import { seed } from '../../prisma/seed/seed';

test.describe('Task page', () => {
  test.beforeEach(async ({ page }) => {
    // fresh seed before each test
    //await seed();

    // sign in as the task user and then redirect to the task page
    await page.goto('/proxy?net_id=task&next_uri=%2Ftasks');
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
  });
});
