import cors from 'cors'
import express from 'express'

const app = express()
const port = Number(process.env.PORT) || 4000

const vessels = [
  { id: 'vessel-1', name: 'MV Ocean Guardian', imo: '9876543', flag: 'Marshall Islands' },
]

const inspections = [
  {
    id: 'inspection-1',
    vesselId: 'vessel-1',
    inspector: 'Unassigned',
    date: new Date().toISOString().slice(0, 10),
    status: 'In progress',
    responses: {},
  },
]

const checklist = [
  { id: 'navigation', section: 'Navigation', question: 'Are navigation charts and publications current?' },
  { id: 'fire-safety', section: 'Fire safety', question: 'Are fire-fighting systems ready for use?' },
  { id: 'cargo', section: 'Cargo operations', question: 'Are cargo procedures available and understood?' },
  { id: 'crew', section: 'Crew welfare', question: 'Are crew rest-hour records maintained?' },
]

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.get('/api/dashboard', (_request, response) => {
  response.json({
    vesselCount: vessels.length,
    inspectionCount: inspections.length,
    openFindings: inspections.flatMap((inspection) => Object.values(inspection.responses))
      .filter((entry) => entry.rating === 'Not as Expected').length,
  })
})

app.get('/api/vessels', (_request, response) => {
  response.json(vessels)
})

app.post('/api/vessels', (request, response) => {
  const { name, imo, flag } = request.body
  if (!name?.trim() || !imo?.trim()) {
    return response.status(400).json({ error: 'Vessel name and IMO number are required.' })
  }

  const vessel = { id: crypto.randomUUID(), name: name.trim(), imo: imo.trim(), flag: flag?.trim() || 'Not specified' }
  vessels.push(vessel)
  return response.status(201).json(vessel)
})

app.get('/api/checklist', (_request, response) => {
  response.json(checklist)
})

app.get('/api/inspections', (_request, response) => {
  response.json(inspections.map(({ responses, ...inspection }) => ({
    ...inspection,
    answeredQuestions: Object.keys(responses).length,
    totalQuestions: checklist.length,
  })))
})

app.get('/api/inspections/:id', (request, response) => {
  const inspection = inspections.find((item) => item.id === request.params.id)
  if (!inspection) return response.status(404).json({ error: 'Inspection not found.' })
  return response.json(inspection)
})

app.post('/api/inspections', (request, response) => {
  const { vesselId, inspector, date } = request.body
  if (!vessels.some((vessel) => vessel.id === vesselId)) {
    return response.status(400).json({ error: 'Select a valid vessel.' })
  }

  const inspection = {
    id: crypto.randomUUID(),
    vesselId,
    inspector: inspector?.trim() || 'Unassigned',
    date: date || new Date().toISOString().slice(0, 10),
    status: 'In progress',
    responses: {},
  }
  inspections.push(inspection)
  return response.status(201).json(inspection)
})

app.put('/api/inspections/:id/responses/:questionId', (request, response) => {
  const inspection = inspections.find((item) => item.id === request.params.id)
  const questionExists = checklist.some((item) => item.id === request.params.questionId)
  const { rating, notes = '' } = request.body
  const ratings = ['Exceeds Expectations', 'As Expected', 'Largely as Expected', 'Not as Expected']

  if (!inspection || !questionExists) return response.status(404).json({ error: 'Inspection or question not found.' })
  if (!ratings.includes(rating)) return response.status(400).json({ error: 'Select a valid rating.' })
  if (rating === 'Not as Expected' && !notes.trim()) {
    return response.status(400).json({ error: 'Notes are required for a negative finding.' })
  }

  inspection.responses[request.params.questionId] = { rating, notes: notes.trim() }
  return response.json(inspection)
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Vetting API listening on port ${port}`)
})
