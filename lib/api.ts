/**
 * Centralized API utility for Eventeev Admin Portal.
 * Uses native fetch with custom wrappers for auth and error handling.
 */

const BASE_URL = 'https://eventeevapi.onrender.com/api';

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

export const api = {
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { auth = true, ...fetchOptions } = options;
    
    const headers = new Headers(fetchOptions.headers || {});
    headers.set('Content-Type', 'application/json');
    
    if (auth) {
      const token = localStorage.getItem('eventeev_admin_token');
      if (token) {
        headers.set('x-auth-token', token);
      }
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
  },

  get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body: any, options?: RequestOptions) {
    return this.request<T>(endpoint, { 
      ...options, 
      method: 'POST', 
      body: JSON.stringify(body) 
    });
  },

  put<T>(endpoint: string, body: any, options?: RequestOptions) {
    return this.request<T>(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: JSON.stringify(body) 
    });
  },

  delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
