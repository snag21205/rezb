import type { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../config/supabase'

// Extend Express Request with user info
declare global {
  namespace Express {
    interface Request {
      userId?: string
      accessToken?: string
    }
  }
}

/**
 * Middleware to verify Supabase JWT from Authorization header
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid authorization header' })
    return
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'Missing token' })
    return
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      res.status(401).json({ error: 'Invalid or expired token' })
      return
    }

    req.userId = user.id
    req.accessToken = token
    next()
  } catch {
    res.status(401).json({ error: 'Authentication failed' })
  }
}
