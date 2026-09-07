import { Router } from 'express';
import { crew, createId } from '../data/store.js';
import { PIFS } from '../data/thematicAreas.js';

const router = Router();

// GET /api/crew - list crew profiles for a ship
router.get('/', (req, res) => {
  const { shipId } = req.query;
  const list = shipId ? crew.filter((c) => c.shipId === shipId) : crew;
  res.json({ total: list.length, crew: list });
});

// POST /api/crew - add a crew member profile
router.post('/', (req, res) => {
  const { shipId = 'ship-1', name, role, yearsOfExperience = 0 } = req.body || {};
  if (!name || !role) return res.status(400).json({ error: 'name and role are required' });

  const defaultPifScores = {};
  for (const pif of PIFS) defaultPifScores[pif] = 4;

  const member = {
    id: createId(),
    shipId,
    name,
    role,
    yearsOfExperience,
    pifScores: defaultPifScores,
    trainingNeeds: [],
  };
  crew.push(member);
  res.status(201).json(member);
});

// PUT /api/crew/:id/pif - update the Performance Influencing Factor scores (1-5 scale)
router.put('/:id/pif', (req, res) => {
  const member = crew.find((c) => c.id === req.params.id);
  if (!member) return res.status(404).json({ error: 'Crew member not found' });

  const { pifScores = {} } = req.body || {};
  for (const [pif, score] of Object.entries(pifScores)) {
    if (!PIFS.includes(pif)) continue;
    const numeric = Number(score);
    if (Number.isNaN(numeric) || numeric < 1 || numeric > 5) continue;
    member.pifScores[pif] = numeric;
  }

  // Any PIF scored 2 or below is flagged as a training need.
  member.trainingNeeds = Object.entries(member.pifScores)
    .filter(([, score]) => score <= 2)
    .map(([pif]) => pif);

  res.json(member);
});

export default router;
