import type { Request, Response } from 'express'
import { uploadCV, getUserResumes, analyzeCV, getAnalysisHistory } from '../services/cv.service'
import { asyncHandler, AppError } from '../utils/helpers'

/**
 * POST /api/cv/upload
 * Upload và parse CV file
 */
export const upload = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('Vui lòng chọn file CV (PDF hoặc DOCX)', 400)
  }

  const userId = req.userId!

  const result = await uploadCV(userId, req.file)

  res.status(201).json({
    success: true,
    data: {
      id: result.id,
      fileName: result.fileName,
      textLength: result.rawText.length,
      message: 'Upload CV thành công!',
    },
  })
})

/**
 * GET /api/cv
 * Lấy danh sách CV của user
 */
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!
  const resumes = await getUserResumes(userId)

  res.json({
    success: true,
    data: resumes,
  })
})

/**
 * POST /api/cv/analyze/:resumeId
 * Gọi Gemini AI phân tích CV
 */
export const analyze = asyncHandler(async (req: Request, res: Response) => {
  const resumeId = String(req.params.resumeId)
  const userId = req.userId!

  const result = await analyzeCV(resumeId, userId)

  res.json({
    success: true,
    data: result,
  })
})

/**
 * GET /api/cv/analyses/:resumeId
 * Lấy lịch sử phân tích
 */
export const getHistory = asyncHandler(async (req: Request, res: Response) => {
  const resumeId = String(req.params.resumeId)
  const userId = req.userId!

  const history = await getAnalysisHistory(resumeId, userId)

  res.json({
    success: true,
    data: history,
  })
})
