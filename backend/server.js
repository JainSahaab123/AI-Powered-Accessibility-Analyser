import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import analyseRoute from './routes/analyse.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
app.use(cors({
  origin: function (origin, callback) {
    const allowed = ['http://localhost:5173']
    if (!origin || allowed.includes(origin) ||
      origin.endsWith('.vercel.app')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}));
app.use(express.json())

// app.use((req, res, next) => {
//   console.log('REQUEST:', req.method, req.url)
//   console.log('ORIGIN:', req.headers.origin)
//   next()
// })
// Routes
app.use('/api/analyse', analyseRoute)

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Accessibility Analyser API is running' })
})

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.log('MongoDB connection failed:', error)
  })