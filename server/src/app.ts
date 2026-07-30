import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env'
import { errorHandler } from './middleware/errorHandler'
import routes from './routes'

const app = express()

// ===== Security =====
app.use(helmet())
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}))

// ===== Parsing =====
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ===== Logging =====
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// ===== Health check =====
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ===== API Routes =====
app.use('/api', routes)

// ===== Error handling =====
app.use(errorHandler)

export default app
