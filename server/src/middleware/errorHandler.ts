import type { Request, Response, NextFunction } from 'express'

interface AppError extends Error {
  statusCode?: number
  details?: unknown
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'

  console.error(`[ERROR] ${statusCode}: ${message}`, err.stack)

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err.details,
    }),
  })
}
