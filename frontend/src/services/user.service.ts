import api from './api'

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  emailVerified: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
  roles?: Array<{
    id: string
    name: string
    displayName: string
  }>
  permissions?: string[]
}

export interface CreateUserDto {
  email: string
  password: string
  firstName?: string
  lastName?: string
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  roleIds?: string[]
}

export interface UpdateUserDto {
  email?: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
}

export interface UserListResponse {
  items: User[]
  total: number
  page: number
  limit: number
}

class UserService {
  private baseUrl = '/users'

  async getCurrentUser(): Promise<User> {
    return api.get(this.baseUrl + '/me')
  }

  async getList(params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
  }): Promise<UserListResponse> {
    return api.get(this.baseUrl, { params })
  }

  async getById(id: string): Promise<User> {
    return api.get(`${this.baseUrl}/${id}`)
  }

  async create(data: CreateUserDto): Promise<User> {
    return api.post(this.baseUrl, data)
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    return api.patch(`${this.baseUrl}/${id}`, data)
  }

  async delete(id: string): Promise<void> {
    return api.delete(`${this.baseUrl}/${id}`)
  }

  async assignRoles(userId: string, roleIds: string[]): Promise<User> {
    return api.post(`${this.baseUrl}/${userId}/roles`, { roleIds })
  }

  async checkPermission(userId: string, resource: string, action: string) {
    return api.get(`${this.baseUrl}/${userId}/permissions/check`, {
      params: { resource, action }
    })
  }
}

export const userService = new UserService()
