/**
 * Standard API HTTP Client for ResidentHub
 * Communicates with FastAPI backend (/api/v1) proxied through Next.js rewrite
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  error?: {
    type?: string;
    title?: string;
    status: number;
    detail: string;
    errorCode?: string;
  };
}

class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/v1') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    // Retrieve auth token if in browser environment
    let authHeader: Record<string, string> = {};
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('residenthub_token');
      if (token) {
        authHeader = { Authorization: `Bearer ${token}` };
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...authHeader,
      ...(options?.headers as Record<string, string>),
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data as ApiResponse<T>;
      }

      return {
        success: response.ok,
        data: null as unknown as T,
        timestamp: new Date().toISOString(),
        error: response.ok ? undefined : {
          status: response.status,
          detail: `HTTP Error ${response.status}: ${response.statusText}`,
        },
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Network request failed';
      return {
        success: false,
        data: null as unknown as T,
        timestamp: new Date().toISOString(),
        error: {
          status: 503,
          detail: `Backend API unreachable (${errorMsg}). Falling back to local data store.`,
        },
      };
    }
  }

  public get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const httpClient = new HttpClient();
