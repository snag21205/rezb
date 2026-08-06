import type { Request, Response } from 'express'
import { createJD, getUserJDs, matchCVWithJD } from '../services/jd.service'
import { asyncHandler, AppError } from '../utils/helpers'

/**
 * POST /api/jd
 * Lưu JD mới
 */
export const create = asyncHandler(async (req: Request, res: Response) => {
  const { title, company, rawText } = req.body
  const userId = req.userId!

  if (!title || !rawText) {
    throw new AppError('Vui lòng cung cấp title và rawText của JD.', 400)
  }

  const jd = await createJD(userId, { title, company, rawText })

  res.status(201).json({
    success: true,
    data: jd,
  })
})

/**
 * GET /api/jd
 * Lấy danh sách JD của user
 */
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!
  const jds = await getUserJDs(userId)

  res.json({
    success: true,
    data: jds,
  })
})

/**
 * POST /api/jd/match
 * So khớp CV với JD bằng AI
 */
export const match = asyncHandler(async (req: Request, res: Response) => {
  const { resumeId, jdId } = req.body
  const userId = req.userId!

  if (!resumeId || !jdId) {
    throw new AppError('Vui lòng cung cấp resumeId và jdId.', 400)
  }

  const result = await matchCVWithJD(userId, resumeId, jdId)

  res.json({
    success: true,
    data: result,
  })
})
