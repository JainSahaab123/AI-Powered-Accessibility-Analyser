import Groq from 'groq-sdk'
import dotenv from 'dotenv'

dotenv.config()

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

export const getAIFixes = async (violations) => {
    try {
        if (violations.length === 0) {
            return []
        }

        const prompt = `
  You are an expert web accessibility developer.
  
  For each violation below, provide a fix.

  IMPORTANT RULES:
  - Keep element and fix fields SHORT — max 100 characters
  - Never repeat the same thing in element and fix fields
  - Always make the fix meaningfully different from the element
  - For location: be VERY specific about WHERE on the page. 
  Don't just say "the page" — say exactly which section, 
  which position, which component. Use the element HTML 
  to make an educated guess about its location.

  Return ONLY a valid JSON array. No markdown, no backticks, just raw JSON.

  [
    {
      "id": "violation id",
      "description": "what the problem is",
      "impact": "critical or serious or moderate or minor",
      "element": "the SHORT broken code",
      "fix": "the SHORT corrected code",
      "explanation": "one sentence why this matters for disabled users",
      "location": "specific plain English description of WHERE this element is on the page. Be very specific. Examples: 'The search input box in the top navigation bar', 'The logo image in the top left header', 'The sign in button in the top right corner', 'There is no H1 heading on the entire page - add one inside your main content area', 'The first product image in the search results grid'. Base this on the element HTML provided.",
      "helpUrl": "help url if available"
    }
  ]

  Here are the violations:
  ${JSON.stringify(violations.map(v => ({
            id: v.id,
            description: v.description,
            impact: v.impact,
            helpUrl: v.helpUrl,
            element: v.nodes?.[0]?.html?.slice(0, 150) || ''
        })), null, 2)}
`

        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3
        })

        const text = response.choices[0].message.content

        const cleaned = text
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim()

        const fixes = JSON.parse(cleaned)
        return fixes

    } catch (error) {
        const msg = error.message || ''

        if (msg.includes('JSON')) {
            throw new Error('Too many violations found. Try scanning a simpler page.')
        }
        if (msg.includes('429') || msg.includes('quota') ||
            msg.includes('rate')) {
            throw new Error('AI service is busy. Please wait a moment and try again.')
        }
        if (msg.includes('401') || msg.includes('API key')) {
            throw new Error('AI service configuration error. Please contact support.')
        }

        throw new Error('Could not generate fixes. Please try again.')
    }
}