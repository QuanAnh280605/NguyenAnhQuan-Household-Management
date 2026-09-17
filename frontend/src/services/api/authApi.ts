import { httpClient } from './httpClient';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  role: string;
  fullName: string;
  email?: string;
  phone?: string;
  residentId?: string;
  isActive: boolean;
}

export interface LoginResult {
  accessToken: string;
  tokenType: string;
  user: AuthUser;
}

export const authApi = {
  async login(payload: LoginPayload): Promise<{ success: boolean; data?: LoginResult; message?: string }> {
    const res = await httpClient.post<LoginResult>('/auth/login', payload);
    if (res.success && res.data?.accessToken) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('residenthub_token', res.data.accessToken);
        localStorage.setItem('residenthub_user', JSON.stringify(res.data.user));
      }
    }
    return {
      success: res.success,
      data: res.data,
      message: res.error?.detail || 'Login successful',
    };
  },

  async getMe(): Promise<{ success: boolean; data?: AuthUser; message?: string }> {
    const res = await httpClient.get<AuthUser>('/auth/me');
    return {
      success: res.success,
      data: res.data,
      message: res.error?.detail,
    };
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('residenthub_token');
      localStorage.removeItem('residenthub_user');
    }
  },
};
