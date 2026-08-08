import multer from 'multer'
import path from 'path'
import type { Request, RequestHandler } from 'express'

const ALLOWED_EXTENSIONS = ['.pdf', '.docx']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const storage = multer.memoryStorage()

/**
 * Multer upload config for CV files
 * Accepts: PDF, DOCX | Max: 5MB
 */
export const cvUpload: RequestHandler = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req: Request, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (ALLOWED_EXTENSIONS.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error(`Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`))
    }
  },
}).single('cv')
