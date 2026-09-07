import { Router } from 'express';
import { QUESTION_LIBRARY } from '../data/questions.js';
import { THEMATIC_AREAS, DIMENSIONS, QUESTION_TYPES } from '../data/thematicAreas.js';
import { generateCviq } from '../utils/cviq.js';

const router = Router();

// GET /api/questions/library - full question database
router.get('/library', (req, res) => {
  res.json({
    total: QUESTION_LIBRARY.length,
    thematicAreas: THEMATIC_AREAS,
    dimensions: DIMENSIONS,
    questionTypes: QUESTION_TYPES,
    questions: QUESTION_LIBRARY,
  });
});

// POST /api/questions/cviq-generate - generate a tailored CVIQ
router.post('/cviq-generate', (req, res) => {
  const { count, shipAgeYears, priorObservationCategories } = req.body || {};
  const cviq = generateCviq({
    count: count ? Number(count) : undefined,
    shipAgeYears: shipAgeYears ? Number(shipAgeYears) : 0,
    priorObservationCategories: priorObservationCategories || [],
  });
  res.json({ count: cviq.length, questions: cviq });
});

export default router;
