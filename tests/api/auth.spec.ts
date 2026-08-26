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
