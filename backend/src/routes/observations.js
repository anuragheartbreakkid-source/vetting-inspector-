import { Router } from 'express';
import { previousObservations, fleetObservations, createId, evidence } from '../data/store.js';
import { isValidSeverity } from '../utils/scoring.js';
import { CORRECTIVE_ACTION_STATUSES } from '../data/thematicAreas.js';

const router = Router();

function applyFilters(list, query) {
  let result = [...list];
  const { from, to, severity, category, status } = query;

  if (from) result = result.filter((o) => o.inspectionDate ? o.inspectionDate >= from : o.createdAt >= from);
  if (to) result = result.filter((o) => (o.inspectionDate || o.createdAt) <= to);
  if (severity) result = result.filter((o) => o.severity === severity);
  if (category) result = result.filter((o) => o.category === category);
  if (status) result = result.filter((o) => o.status === status);

  return result;
}

// GET /api/observations/previous - ship's previous vetting observations (with filters)
router.get('/previous', (req, res) => {
  const filtered = applyFilters(previousObservations, req.query);
  res.json({ total: filtered.length, observations: filtered });
});

// GET /api/observations/previous/trends - simple trend analysis by category
router.get('/previous/trends', (req, res) => {
  const counts = {};
  for (const obs of previousObservations) {
    counts[obs.category] = (counts[obs.category] || 0) + 1;
  }
  const trends = Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
  res.json({ trends });
});

// GET /api/observations/fleet - current ship's logged fleet observations
router.get('/fleet', (req, res) => {
  const filtered = applyFilters(fleetObservations, req.query);
  res.json({ total: filtered.length, observations: filtered });
});

// POST /api/observations/fleet - log a new fleet observation
router.post('/fleet', (req, res) => {
  const {
    shipId = 'ship-1',
    category,
    severity,
    dimension,
    description,
    questionId,
    evidenceIds = [],
  } = req.body || {};

  if (!description || !category) {
    return res.status(400).json({ error: 'category and description are required' });
  }
  if (severity && !isValidSeverity(severity)) {
    return res.status(400).json({ error: 'Invalid severity' });
  }

  const observation = {
    id: createId(),
    shipId,
    category,
    dimension: dimension || 'Hardware',
    severity: severity || 'Minor',
    description,
    questionId: questionId || null,
    evidenceIds,
    status: 'Identified',
    createdAt: new Date().toISOString(),
    correctiveAction: '',
  };

  fleetObservations.push(observation);
  res.status(201).json(observation);
});

// PUT /api/observations/fleet/:id - update corrective action status
router.put('/fleet/:id', (req, res) => {
  const observation = fleetObservations.find((o) => o.id === req.params.id);
  if (!observation) return res.status(404).json({ error: 'Observation not found' });

  const { status, correctiveAction } = req.body || {};
  if (status && !CORRECTIVE_ACTION_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  if (status) observation.status = status;
  if (correctiveAction !== undefined) observation.correctiveAction = correctiveAction;
  observation.updatedAt = new Date().toISOString();

  res.json(observation);
});

// POST /api/observations/fleet/:id/evidence - attach evidence metadata to an observation
router.post('/fleet/:id/evidence', (req, res) => {
  const observation = fleetObservations.find((o) => o.id === req.params.id);
  if (!observation) return res.status(404).json({ error: 'Observation not found' });

  const { fileName, gps, capturedAt, type = 'photo' } = req.body || {};
  if (!fileName) return res.status(400).json({ error: 'fileName is required' });

  const item = {
    id: createId(),
    observationId: observation.id,
    fileName,
    type,
    gps: gps || null,
    capturedAt: capturedAt || new Date().toISOString(),
    uploadedAt: new Date().toISOString(),
  };
  evidence.push(item);
  observation.evidenceIds.push(item.id);

  res.status(201).json(item);
});

export default router;
