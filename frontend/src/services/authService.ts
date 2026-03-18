import { api } from './api'

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    firstName?: string
    lastName?: string
    avatarUrl?: string
    roles: string[]
    permissions: string[]
  }
  token: string
  refreshToken?: string
}

export interface RefreshResponse {
  token: string
  refreshToken: string
}

class AuthService {
  private baseUrl = '/auth'

  /**
   * 用户登录
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    return api.post<AuthResponse>(`${this.baseUrl}/login`, data)
  }

  /**
   * 用户注册
   */
  async register(data: RegisterDto): Promise<AuthResponse> {
    return api.post<AuthResponse>(`${this.baseUrl}/register`, data)
  }

  /**
   * 刷新令牌
   */
  async refreshToken(refreshToken: string): Promise<RefreshResponse> {
    return api.post<RefreshResponse>(`${this.baseUrl}/refresh`, { refreshToken })
  }

  /**
   * 登出
   */
  async logout(): Promise<void> {
    return api.post(`${this.baseUrl}/logout`)
  }

  /**
   * 修改密码
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    return api.post(`${this.baseUrl}/change-password`, { oldPassword, newPassword })
  }

  /**
   * 忘记密码
   */
  async forgotPassword(email: string): Promise<void> {
    return api.post(`${this.baseUrl}/forgot-password`, { email })
  }

  /**
   * 重置密码
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    return api.post(`${this.baseUrl}/reset-password`, { token, newPassword })
  }
}

export const authService = new AuthService()
