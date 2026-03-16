import express from 'express'
import cors from 'cors'
import { chatRouter } from './routes/chat.js'
import { dataRouter } from './routes/data.js'
import { healthRouter } from './routes/health.js'

// Build DATABASE_URL from ECS secret env vars if not already set
if (!process.env.DATABASE_URL && process.env.DB_HOST) {
  const user = process.env.DB_USERNAME ?? 'rgm'
  const pass = process.env.DB_PASSWORD ?? ''
  const host = process.env.DB_HOST
  const port = process.env.DB_PORT ?? '5432'
  const name = process.env.DB_NAME ?? 'rgm_command_centre'
  process.env.DATABASE_URL = `postgresql://${user}:${encodeURIComponent(pass)}@${host}:${port}/${name}?schema=public`
}

const app = express()
const PORT = parseInt(process.env.PORT ?? '3001', 10)

app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5174' }))
app.use(express.json())

// Routes
app.use('/api', healthRouter)
app.use('/api', dataRouter)
app.use('/api', chatRouter)

app.listen(PORT, () => {
  console.log(`RGM API running on http://localhost:${PORT}`)
})
