/**
 * Create a custom error with status code
 */
export class AppError extends Error {
  statusCode: number
  details?: unknown

  constructor(message: string, statusCode: number = 500, details?: unknown) {
    super(message)
    this.statusCode = statusCode
    this.details = details
    this.name = 'AppError'
  }
}

/**
 * Wrap async route handlers to catch errors
 */
export function asyncHandler(
  fn: (req: any, res: any, next: any) => Promise<any>
) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
