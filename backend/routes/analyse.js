import express from 'express'
import { 
  analyseWebsite, 
  explainViolation,
  loadMoreViolations
} from '../controllers/analyseController.js'

const router = express.Router()

router.post('/', analyseWebsite)
router.post('/explain', explainViolation)
router.post('/more', loadMoreViolations)

export default router