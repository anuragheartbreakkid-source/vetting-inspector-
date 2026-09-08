import { Router } from 'express';
import { crew, createId, inspections } from '../data/store.js';
import { PIFS } from '../data/thematicAreas.js';
import { generateCviq } from '../utils/cviq.js';

const ROLE_THEMATIC_AREAS = {
  Master: ['Navigation and Bridge Management', 'Safety and Security', 'Certification & Documentation'],
  'Chief Officer': ['Navigation and Bridge Management', 'Cargo and Ballast Operations', 'Pollution Prevention (MARPOL)'],
  'Chief Engineer': ['Machinery and Engine Room', 'Safety and Security', 'Pollution Prevention (MARPOL)'],
  'Junior Officer': ['Navigation and Bridge Management', 'Safety and Security', 'Crew Management & Training'],
  'Junior Engineer': ['Machinery and Engine Room', 'Safety and Security', 'Pollution Prevention (MARPOL)'],
  'Deck Rating': ['Navigation and Bridge Management', 'Safety and Security', 'Ship Maintenance'],
  'Engine Room Rating': ['Machinery and Engine Room', 'Safety and Security', 'Pollution Prevention (MARPOL)'],
};

function thematicAreasForRole(role) {
  return ROLE_THEMATIC_AREAS[role] || ['Crew Management & Training', 'Safety and Security'];
}

function isIsoDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

const router = Router();

// GET /api/crew - list crew profiles for a ship
router.get('/', (req, res) => {
  const { shipId } = req.query;
  const list = shipId ? crew.filter((c) => c.shipId === shipId) : crew;
  res.json({ total: list.length, crew: list });
});

// POST /api/crew - add a crew member profile
router.post('/', (req, res) => {
  const { shipId = 'ship-1', name, role, yearsOfExperience = 0, joiningDate } = req.body || {};
  if (!name || !role) return res.status(400).json({ error: 'name and role are required' });
  if (joiningDate && !isIsoDate(joiningDate)) {
    return res.status(400).json({ error: 'joiningDate must be a valid YYYY-MM-DD date' });
  }

  const defaultPifScores = {};
  for (const pif of PIFS) defaultPifScores[pif] = 4;

  const member = {
    id: createId(),
    shipId,
    name,
    role,
    yearsOfExperience,
    joiningDate: joiningDate || null,
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

// POST /api/crew/:id/assessment - generate an individual, rank-targeted CVIQ
router.post('/:id/assessment', (req, res) => {
  const member = crew.find((c) => c.id === req.params.id);
  if (!member) return res.status(404).json({ error: 'Crew member not found' });

  const { count = 10 } = req.body || {};
  const questions = generateCviq({
    count,
    thematicAreas: thematicAreasForRole(member.role),
    ensureThematicCoverage: true,
  });
  const assessment = {
    id: createId(),
    shipId: member.shipId,
    crewMemberId: member.id,
    crewMemberName: member.name,
    crewMemberRole: member.role,
    assessmentType: 'Individual Crew Assessment',
    createdAt: new Date().toISOString(),
    status: 'In Progress',
    questions: questions.map((question) => question.id),
    answers: [],
  };

  inspections.push(assessment);
  res.status(201).json({ ...assessment, questions });
});

export default router;
