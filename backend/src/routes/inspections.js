import { Router } from 'express';
import { inspections, createId, getQuestionById } from '../data/store.js';
import { generateCviq } from '../utils/cviq.js';
import { calculateReadiness, isValidGrade } from '../utils/scoring.js';

const router = Router();

// POST /api/inspections/create - create new inspection with generated CVIQ
router.post('/create', (req, res) => {
  const { shipId = 'ship-1', shipAgeYears = 0, priorObservationCategories = [], count } = req.body || {};
  const cviq = generateCviq({ count, shipAgeYears, priorObservationCategories });

  const inspection = {
    id: createId(),
    shipId,
    createdAt: new Date().toISOString(),
    status: 'In Progress',
    questions: cviq.map((q) => q.id),
    answers: [],
  };
  inspections.push(inspection);
  res.status(201).json({ ...inspection, questions: cviq });
});

// GET /api/inspections/:id - retrieve inspection
router.get('/:id', (req, res) => {
  const inspection = inspections.find((i) => i.id === req.params.id);
  if (!inspection) return res.status(404).json({ error: 'Inspection not found' });

  const questions = inspection.questions.map((qid) => getQuestionById(qid)).filter(Boolean);
  res.json({ ...inspection, questions });
});

// PUT /api/inspections/:id/update - submit/update an answer for a question
router.put('/:id/update', (req, res) => {
  const inspection = inspections.find((i) => i.id === req.params.id);
  if (!inspection) return res.status(404).json({ error: 'Inspection not found' });

  const { questionId, grade, notes = '', evidenceIds = [] } = req.body || {};
  const question = getQuestionById(questionId);
  if (!question) return res.status(400).json({ error: 'Unknown questionId' });
  if (!isValidGrade(grade)) return res.status(400).json({ error: 'Invalid grade' });

  const existing = inspection.answers.find((a) => a.questionId === questionId);
  const answer = {
    questionId,
    thematicArea: question.thematicArea,
    dimension: question.dimension,
    grade,
    notes,
    evidenceIds,
    answeredAt: new Date().toISOString(),
  };

  if (existing) {
    Object.assign(existing, answer);
  } else {
    inspection.answers.push(answer);
  }

  const readiness = calculateReadiness({ answers: inspection.answers, openObservations: [] });
  inspection.readinessScore = readiness;

  res.json(inspection);
});

// GET /api/inspections/:id/cviq - retrieve the generated CVIQ for an inspection
router.get('/:id/cviq', (req, res) => {
  const inspection = inspections.find((i) => i.id === req.params.id);
  if (!inspection) return res.status(404).json({ error: 'Inspection not found' });
  const questions = inspection.questions.map((qid) => getQuestionById(qid)).filter(Boolean);
  res.json({ count: questions.length, questions });
});

export default router;
