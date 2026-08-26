import { expect, test } from '@playwright/test';
import { AuthHelper } from '../../helpers/auth-helper';

test('should return an authentication token with valid credentials', async ({ request }) => {
  const authHelper = new AuthHelper(request);
  const username = process.env.RESTFUL_BOOKER_USERNAME;
  const password = process.env.RESTFUL_BOOKER_PASSWORD;

  if (!username) {
    throw new Error('Missing required environment variable: RESTFUL_BOOKER_USERNAME');
  }

  if (!password) {
    throw new Error('Missing required environment variable: RESTFUL_BOOKER_PASSWORD');
  }

  const token = await authHelper.authenticate(
    username,
    password,
  );

  expect(typeof token).toBe('string');
  expect(token).not.toHaveLength(0);
});

test('should reject an invalid username', async ({ request }) => {
  const authHelper = new AuthHelper(request);
  const password = process.env.RESTFUL_BOOKER_PASSWORD;

  if (!password) {
    throw new Error('Missing required environment variable: RESTFUL_BOOKER_PASSWORD');
  }

  await expect(authHelper.authenticate('invalid-username', password)).rejects.toThrow(
    'Bad credentials',
  );
});
