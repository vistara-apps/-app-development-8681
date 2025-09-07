import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ApiError, ApiConfig, RateLimitConfig } from '../../types/api';

export class BaseApiService {
  protected client: AxiosInstance;
  protected rateLimit?: RateLimitConfig;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;

  constructor(config: ApiConfig) {
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` })
      }
    });

    this.rateLimit = config.rateLimit;
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for rate limiting
    this.client.interceptors.request.use(
      async (config) => {
        if (this.rateLimit) {
          await this.handleRateLimit();
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'Unknown error',
          code: error.response?.data?.code || error.code || 'UNKNOWN_ERROR',
          status: error.response?.status || 500
        };
        return Promise.reject(apiError);
      }
    );
  }

  private async handleRateLimit(): Promise<void> {
    if (!this.rateLimit) return;

    return new Promise((resolve) => {
      this.requestQueue.push(() => Promise.resolve(resolve()));
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;

    this.isProcessingQueue = true;
    const request = this.requestQueue.shift();
    
    if (request) {
      await request();
      
      if (this.rateLimit) {
        setTimeout(() => {
          this.isProcessingQueue = false;
          this.processQueue();
        }, this.rateLimit.window / this.rateLimit.requests);
      } else {
        this.isProcessingQueue = false;
        this.processQueue();
      }
    }
  }

  protected async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.request(config);
      return {
        data: response.data,
        success: true,
        timestamp: Date.now()
      };
    } catch (error) {
      const apiError = error as ApiError;
      return {
        data: {} as T,
        success: false,
        error: apiError.message,
        timestamp: Date.now()
      };
    }
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  protected async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }
}
