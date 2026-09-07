import { v4 as uuid } from 'uuid';
import { QUESTION_LIBRARY } from './questions.js';
import { PIFS } from './thematicAreas.js';

/**
 * Simple in-memory data store standing in for the PostgreSQL/MongoDB layer
 * described in the project README. It is intentionally simple (no external
 * DB dependency) so the app can be run and tested without any infrastructure,
 * while keeping the same shape/collections the real schema would use.
 */

export const ships = [
  {
    id: 'ship-1',
    name: 'MT Ocean Voyager',
    imoNumber: '9123456',
    type: 'Crude Oil Tanker',
    yearBuilt: 2012,
    flag: 'Marshall Islands',
  },
];

export const previousObservations = [
  {
    id: uuid(),
    shipId: 'ship-1',
    inspectionDate: '2025-03-14',
    category: 'Navigation and Bridge Management',
    severity: 'Major',
    description: 'ECDIS backup arrangements not clearly demonstrated by OOW.',
    status: 'Completed',
    correctiveAction: 'Retrained bridge officers on ECDIS backup/failure procedure.',
  },
  {
    id: uuid(),
    shipId: 'ship-1',
    inspectionDate: '2025-03-14',
    category: 'Machinery and Engine Room',
    severity: 'Minor',
    description: 'Minor oil weeping observed from purifier room bilge.',
    status: 'Verified',
    correctiveAction: 'Gasket replaced and area cleaned; verified by chief engineer.',
  },
  {
    id: uuid(),
    shipId: 'ship-1',
    inspectionDate: '2024-09-02',
    category: 'Safety and Security',
    severity: 'Critical',
    description: 'Fixed CO2 system release mechanism seals missing on two cylinders.',
    status: 'Completed',
    correctiveAction: 'Seals replaced and system re-tested with class attendance.',
  },
  {
    id: uuid(),
    shipId: 'ship-1',
    inspectionDate: '2024-09-02',
    category: 'Pollution Prevention (MARPOL)',
    severity: 'Major',
    description: 'Oil record book entries inconsistent with OWS operating hours.',
    status: 'In Progress',
    correctiveAction: 'Retraining of officers on ORB entries; internal audit scheduled.',
  },
];

export const fleetObservations = [];

export const crew = [
  {
    id: uuid(),
    shipId: 'ship-1',
    name: 'Capt. J. Alonzo',
    role: 'Master',
    yearsOfExperience: 18,
    pifScores: buildDefaultPifScores(),
    trainingNeeds: [],
  },
  {
    id: uuid(),
    shipId: 'ship-1',
    name: 'C/O R. Santos',
    role: 'Chief Officer',
    yearsOfExperience: 9,
    pifScores: buildDefaultPifScores(),
    trainingNeeds: [],
  },
  {
    id: uuid(),
    shipId: 'ship-1',
    name: 'C/E M. Petrov',
    role: 'Chief Engineer',
    yearsOfExperience: 14,
    pifScores: buildDefaultPifScores(),
    trainingNeeds: [],
  },
];

export const inspections = [];

export const evidence = [];

function buildDefaultPifScores() {
  const scores = {};
  for (const pif of PIFS) {
    scores[pif] = 4; // default "As Expected" on a 1-5 scale
  }
  return scores;
}

export function getQuestionById(id) {
  return QUESTION_LIBRARY.find((q) => q.id === id);
}

export function createId() {
  return uuid();
}
