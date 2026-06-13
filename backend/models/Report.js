import mongoose from 'mongoose'

const violationSchema = new mongoose.Schema({
  id: String,
  description: String,
  impact: String,
  element: String,
  fix: String,
  explanation: String,
  location: String,
  helpUrl: String,
  selector: String
})

const reportSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  scanDate: {
    type: Date,
    default: Date.now
  },
  totalViolations: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  rawViolations: {
    type: Array,
    default: []
  },
  loadedCount: {
    type: Number,
    default: 0
  },
  violations: [violationSchema]
})

export default mongoose.model('Report', reportSchema)