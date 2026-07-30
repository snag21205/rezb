// Server-specific types
// Shared types are in ../shared/

export interface PaginationQuery {
  page?: number
  limit?: number
}

export interface APIResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    page: number
    limit: number
    total: number
  }
}
