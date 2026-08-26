import { APIRequestContext } from '@playwright/test';

type AuthResponse = {
  token?: unknown;
  reason?: unknown;
};

export class AuthHelper {
  constructor(private readonly request: APIRequestContext) {}

  async authenticate(username: string, password: string): Promise<string> {
    const response = await this.request.post('/auth', {
      data: { username, password },
    });

    if (!response.ok()) {
      throw new Error(`Authentication failed with status ${response.status()}`);
    }

    const body = (await response.json()) as AuthResponse;
    if (typeof body.token !== 'string' || body.token.trim() === '') {
      if (typeof body.reason === 'string') {
        throw new Error(`Authentication failed: ${body.reason}`);
      }

      throw new Error('Authentication response did not include a valid token');
    }

    return body.token;
  }
}
