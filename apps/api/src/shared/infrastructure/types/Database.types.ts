export interface DatabaseConfig {
  url: string
  timeout?: number
  maxConnections?: number
  retryAttempts?: number
}

export interface RepositoryOptions {
  enableLogging?: boolean
  timeout?: number
}

export interface QueryOptions {
  limit?: number
  offset?: number
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
}
