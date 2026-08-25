import {
  APIRequestContext,
  APIResponse,
} from '@playwright/test';

type RequestOptions = Parameters<APIRequestContext['get']>[1];

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  get(path: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.get(path, options);
  }

  post(path: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.post(path, options);
  }

  put(path: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.put(path, options);
  }

  patch(path: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.patch(path, options);
  }

  delete(path: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.delete(path, options);
  }
}
