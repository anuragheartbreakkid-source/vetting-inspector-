import { useCallback, useEffect, useState } from 'react'
import './App.css'

function App() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
  const [vessels, setVessels] = useState([])
  const [inspections, setInspections] = useState([])
  const [checklist, setChecklist] = useState([])
  const [activeInspection, setActiveInspection] = useState(null)
  const [message, setMessage] = useState('')

  const loadData = useCallback(async () => {
    try {
      const results = await Promise.all(
        ['vessels', 'inspections', 'checklist'].map((path) =>
          fetch(`${apiUrl}/${path}`).then((response) => response.json()),
        ),
      )
      setVessels(results[0])
      setInspections(results[1])
      setChecklist(results[2])
    } catch {
      setMessage('Cannot reach the API. Start the backend or verify VITE_API_URL.')
    }
  }, [apiUrl])

  useEffect(() => { void loadData() }, [loadData])

  async function createInspection(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const response = await fetch(`${apiUrl}/inspections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vesselId: form.get('vesselId'), inspector: form.get('inspector'), date: form.get('date') }),
    })
    const data = await response.json()
    if (!response.ok) return setMessage(data.error)
    setActiveInspection(data)
    setMessage('Inspection created. Complete the checklist below.')
    event.currentTarget.reset()
    loadData()
  }

  async function openInspection(id) {
    const response = await fetch(`${apiUrl}/inspections/${id}`)
    setActiveInspection(await response.json())
  }

  async function saveResponse(questionId, form) {
    const response = await fetch(`${apiUrl}/inspections/${activeInspection.id}/responses/${questionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: form.get('rating'), notes: form.get('notes') }),
    })
    const data = await response.json()
    if (!response.ok) return setMessage(data.error)
    setActiveInspection(data)
    setMessage('Checklist response saved.')
    loadData()
  }

  return (
    <main>
      <header>
        <p className="eyebrow">SIRE 2.0</p>
        <h1>Vetting Inspector</h1>
        <p>Plan, conduct, and record vessel inspections.</p>
      </header>
      {message && <p className="message" role="status">{message}</p>}
      <section>
        <h2>Start an inspection</h2>
        <form onSubmit={createInspection} className="form-grid">
          <label>Vessel
            <select name="vesselId" required defaultValue="">
              <option value="" disabled>Select vessel</option>
              {vessels.map((vessel) => <option key={vessel.id} value={vessel.id}>{vessel.name} · IMO {vessel.imo}</option>)}
            </select>
          </label>
          <label>Inspector<input name="inspector" placeholder="Inspector name" required /></label>
          <label>Date<input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required /></label>
          <button type="submit">Create inspection</button>
        </form>
      </section>
      <section>
        <h2>Active inspections</h2>
        <div className="cards">
          {inspections.map((inspection) => (
            <button className="card" key={inspection.id} onClick={() => openInspection(inspection.id)}>
              <strong>{vessels.find((vessel) => vessel.id === inspection.vesselId)?.name || 'Vessel'}</strong>
              <span>{inspection.date} · {inspection.status}</span>
              <span>{inspection.answeredQuestions}/{inspection.totalQuestions} questions answered</span>
            </button>
          ))}
        </div>
      </section>
      {activeInspection && <section>
        <h2>Inspection checklist</h2>
        {checklist.map((question) => {
          const saved = activeInspection.responses?.[question.id]
          return <form className="question" key={question.id} onSubmit={(event) => {
            event.preventDefault()
            saveResponse(question.id, new FormData(event.currentTarget))
          }}>
            <p className="eyebrow">{question.section}</p>
            <h3>{question.question}</h3>
            <select name="rating" defaultValue={saved?.rating || ''} required>
              <option value="" disabled>Select assessment</option>
              {['Exceeds Expectations', 'As Expected', 'Largely as Expected', 'Not as Expected'].map((rating) => <option key={rating}>{rating}</option>)}
            </select>
            <textarea name="notes" defaultValue={saved?.notes || ''} placeholder="Evidence or observation notes" />
            <button>Save response</button>
          </form>
        })}
      </section>}
    </main>
  )
}

export default App
