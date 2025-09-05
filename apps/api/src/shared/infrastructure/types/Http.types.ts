import type { Request } from 'express'

export interface ApiResponse<T = any> {
  data?: T
  message?: string
  success: boolean
  errors?: string[]
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface AuthenticatedRequest extends Request {
  user: {
    sub: string
    email: string
    username: string
    iat?: number
    exp?: number
  }
}

export interface ErrorResponse {
  message: string
  error: string
  statusCode: number
}
