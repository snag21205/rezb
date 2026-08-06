import type { Request, Response } from 'express'
import {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviewHistory,
  getInterviewSession,
} from '../services/interview.service'
import { asyncHandler, AppError } from '../utils/helpers'

/**
 * POST /api/interview/start
 */
export const start = asyncHandler(async (req: Request, res: Response) => {
  const { jdId, type } = req.body
  const userId = req.userId!

  if (!jdId || !type) {
    throw new AppError('Vui lòng cung cấp jdId và type (technical/behavioral/mixed).', 400)
  }

  const validTypes = ['technical', 'behavioral', 'mixed']
  if (!validTypes.includes(type)) {
    throw new AppError(`type phải là một trong: ${validTypes.join(', ')}`, 400)
  }

  const result = await startInterview(userId, jdId, type)

  res.status(201).json({
    success: true,
    data: result,
  })
})

/**
 * POST /api/interview/:sessionId/answer
 */
export const answer = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params
  const { questionId, answer: userAnswer } = req.body
  const userId = req.userId!

  if (!questionId || !userAnswer) {
    throw new AppError('Vui lòng cung cấp questionId và answer.', 400)
  }

  const result = await submitAnswer(sessionId!, userId, questionId, userAnswer)

  res.json({
    success: true,
    data: result,
  })
})

/**
 * POST /api/interview/:sessionId/complete
 */
export const complete = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params
  const userId = req.userId!

  const result = await completeInterview(sessionId!, userId)

  res.json({
    success: true,
    data: result,
  })
})

/**
 * GET /api/interview/history
 */
export const history = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!
  const sessions = await getInterviewHistory(userId)

  res.json({
    success: true,
    data: sessions,
  })
})

/**
 * GET /api/interview/:sessionId
 */
export const getSession = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params
  const userId = req.userId!

  const session = await getInterviewSession(sessionId!, userId)

  res.json({
    success: true,
    data: session,
  })
})
