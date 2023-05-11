// @ts-check
import { test, expect } from '@playwright/test';
import {Eyes, Target} from '@applitools/eyes-playwright';



test('checking Login', async ({ page }) => {

  test.setTimeout(0)
  await page.goto('http://localhost:3000');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/ESA SIS - Login/);

  await page.getByTestId('username').fill('bbam@gmail.com');

  await page.getByTestId('password').fill('asdasdasd');

  await page.getByRole('button').click()

  await expect(page).toHaveURL(/admin/)

});

test('checking Validation', async ({ page }) => {

  test.setTimeout(0)
  await page.goto('http://localhost:3000');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/ESA SIS - Login/);

  await page.getByTestId('username').fill('');

  await page.getByTestId('password').fill('');

  await page.getByRole('button').click()

  await expect(page).not.toHaveURL(/admin/)

  const errorEmail = page.getByTestId('errorEmail')

  const errPassword = page.getByTestId('errorPassword')

  await expect(errorEmail).toBeTruthy()

  await expect(errPassword).toBeTruthy()

});

test('checking Logout', async ({ page }) => {

  test.setTimeout(0)
  await page.goto('http://localhost:3000');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/ESA SIS - Login/);

  await page.getByTestId('username').fill('bbam@gmail.com');

  await page.getByTestId('password').fill('asdasdasd');

  await page.getByRole('button').click()

  await expect(page).toHaveURL(/admin/)

  await page.getByTestId('img').click()

  await page.getByText('Logout').click();

  await expect(page).toHaveURL('http://localhost:3000')

});

test('checking Password Validation', async ({ page }) => {

  test.setTimeout(0)
  await page.goto('http://localhost:3000');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/ESA SIS - Login/);

  await page.getByTestId('username').fill('test@test.com');

  await page.getByTestId('password').fill('asd');

  await page.getByRole('button').click()

  await expect(page).not.toHaveURL(/admin/)

  const errorEmail = page.getByTestId('errorEmail')

  const errPassword = page.getByTestId('errorPassword')

  await expect(errPassword).toHaveText('password is more than 6 chars')

});

test('checking Info', async ({ page }) => {

  test.setTimeout(0)
  await page.goto('http://localhost:3000');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/ESA SIS - Login/);

  await page.getByTestId('username').fill('test@test.com');

  await page.getByTestId('password').fill('asdasdasd');

  await page.getByRole('button').click()

  await expect(page).not.toHaveURL(/admin/)

  const errorInfo = page.getByTestId('error')

  await expect(errorInfo).toHaveText('Invalid Email:the account is not found, submit a new application')

});