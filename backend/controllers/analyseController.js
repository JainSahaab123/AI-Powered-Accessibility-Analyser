import { scanWebsite } from '../services/axeService.js'
import { getAIFixes } from '../services/aiService.js'
import Report from '../models/Report.js'


// Queue to prevent concurrent Chrome instances
let isScanning = false
const scanQueue = []

const processQueue = async () => {
    if (isScanning || scanQueue.length === 0) return
    isScanning = true
    const { resolve, reject, task } = scanQueue.shift()
    try {
        const result = await task()
        resolve(result)
    } catch (error) {
        reject(error)
    } finally {
        isScanning = false
        processQueue()
    }
}

const queueScan = (task, res) => {
    return new Promise((resolve, reject) => {
        const position = scanQueue.length + (isScanning ? 1 : 0)
        if (position > 0) {
            console.log(`Request queued at position ${position}`)
        }
        scanQueue.push({ resolve, reject, task })
        processQueue()
    })
}

const calculateScore = (violations) => {
    if (violations.length === 0) return 100
    let deductions = 0
    violations.forEach(v => {
        if (v.impact === 'critical') deductions += 10
        if (v.impact === 'serious') deductions += 7
        if (v.impact === 'moderate') deductions += 4
        if (v.impact === 'minor') deductions += 1
    })
    return Math.max(0, 100 - deductions)
}

export const analyseWebsite = async (req, res) => {
    try {
        const { url } = req.body

        if (!url) {
            return res.status(400).json({ error: 'URL is required' })
        }

        let formattedURL = url
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            formattedURL = 'https://' + url
        }

        try {
            new URL(formattedURL)
        } catch {
            return res.status(400).json({ error: 'Please enter a valid URL' })
        }

        // Easter egg
        if (formattedURL.includes('parasagarwal.com') ||
            formattedURL.includes('paras.dev')) {
            return res.status(400).json({
                error: "Coaches don't play 😉"
            })
        }

        // Block internal URLs but allow demo page
        if ((formattedURL.includes('localhost') ||
            formattedURL.includes('127.0.0.1') ||
            formattedURL.includes('192.168.')) &&
            !formattedURL.includes('demo.html')) {
            return res.status(400).json({
                error: 'Scanning internal or local URLs is not allowed.'
            })
        }

        // Must have a dot in hostname
        const urlObj = new URL(formattedURL)
        if (!urlObj.hostname.includes('.')) {
            return res.status(400).json({
                error: 'Please enter a complete URL like example.com'
            })
        }

        console.log(`Scanning: ${formattedURL}`)

        // Tell frontend if request is queued
        const queuePosition = scanQueue.length + (isScanning ? 1 : 0)
        if (queuePosition > 0) {
            res.setHeader('X-Queue-Position', queuePosition)
        }

        const violations = await queueScan(() => scanWebsite(formattedURL)) ;
        console.log(`Found ${violations.length} violations`)



        // Calculate score from ALL violations
        const score = calculateScore(violations)

        // Count by severity from ALL violations
        const severityCounts = {
            critical: violations.filter(v => v.impact === 'critical').length,
            serious: violations.filter(v => v.impact === 'serious').length,
            moderate: violations.filter(v => v.impact === 'moderate').length,
            minor: violations.filter(v => v.impact === 'minor').length,
        }

        // Process only first 10 with AI
        const firstBatch = violations.slice(0, 10)
        const fixes = await getAIFixes(firstBatch)
        console.log('AI fixes generated')

        const violationsWithLocation = fixes.map((fix, index) => {
            const original = violations[index]
            const rawSelector = original?.nodes?.[0]?.target
            const selector = Array.isArray(rawSelector)
                ? rawSelector[0]
                : (rawSelector || null)
            return {
                ...fix,
                selector: typeof selector === 'string' ? selector : null
            }
        })

        const report = {
            url: formattedURL,
            scanDate: new Date(),
            score,
            totalViolations: violations.length,
            severityCounts,
            loadedCount: violationsWithLocation.length,
            rawViolations: violations,
            violations: violationsWithLocation
        }

        const savedReport = await Report.create(report)
        res.status(200).json(savedReport)

    } catch (error) {
        console.log('Error:', error.message)
        const msg = error.message || ''

        if (msg.includes('Website not found')) {
            return res.status(404).json({ error: msg })
        }
        if (msg.includes('blocks automated')) {
            return res.status(403).json({ error: msg })
        }
        if (msg.includes('too long')) {
            return res.status(408).json({ error: msg })
        }

        res.status(500).json({ error: msg })
    }
}

export const explainViolation = async (req, res) => {
    try {
        const { violation, messages } = req.body

        if (!violation) {
            return res.status(400).json({ error: 'Violation data is required' })
        }

        const systemContext = `
      You are a friendly web accessibility expert helping a developer 
      understand a specific accessibility violation.
      
      Violation details:
      - Rule: ${violation.id}
      - Description: ${violation.description}
      - Severity: ${violation.impact}
      - Broken code: ${violation.element}
      - Fixed code: ${violation.fix}
      - Location on page: ${violation.location}
      
      Rules:
      - Keep answers under 4 sentences
      - Use simple language, no jargon without explanation
      - Use real world analogies when helpful
      - Always relate answers back to this specific violation
      - If first message, explain the violation simply
    `

        const conversationHistory = messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content
        }))

        const Groq = (await import('groq-sdk')).default
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemContext },
                ...conversationHistory,
                ...(messages.length === 0 ? [{
                    role: 'user',
                    content: 'Explain this violation to me simply.'
                }] : [])
            ],
            temperature: 0.7,
            max_tokens: 200
        })

        const reply = response.choices[0].message.content
        res.status(200).json({ message: reply })

    } catch (error) {
        res.status(500).json({
            error: 'Could not generate explanation. Please try again.'
        })
    }
}

export const loadMoreViolations = async (req, res) => {
    try {
        const { reportId, offset } = req.body

        if (!reportId) {
            return res.status(400).json({ error: 'Report ID is required' })
        }

        const report = await Report.findById(reportId)
        if (!report) {
            return res.status(404).json({ error: 'Report not found' })
        }

        const rawViolations = report.rawViolations || []
        const nextBatch = rawViolations.slice(offset, offset + 10)

        if (nextBatch.length === 0) {
            return res.status(200).json({ violations: [], hasMore: false })
        }

        const fixes = await getAIFixes(nextBatch)

        const violationsWithLocation = fixes.map((fix, index) => {
            const original = nextBatch[index]
            return {
                ...fix,
                //selector: original?.nodes?.[0]?.target?.[0] || null
                selector: original?.nodes?.[0]?.target || null
            }
        })

        res.status(200).json({
            violations: violationsWithLocation,
            hasMore: offset + 10 < rawViolations.length,
            remaining: Math.max(0, rawViolations.length - (offset + 10))
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}