import { Router } from 'express';
import { inspections, previousObservations, fleetObservations, crew, ships } from '../data/store.js';
import { calculateReadiness, buildRiskMatrix } from '../utils/scoring.js';
import { PIFS } from '../data/thematicAreas.js';

const router = Router();

function averageCrewCompetency() {
  if (crew.length === 0) return 0;
  const allScores = crew.flatMap((c) => Object.values(c.pifScores));
  if (allScores.length === 0) return 0;
  const avg = allScores.reduce((sum, s) => sum + s, 0) / allScores.length;
  return Math.round((avg / 5) * 100);
}

// GET /api/compliance/dashboard - overall vetting readiness KPIs
router.get('/dashboard', (req, res) => {
  const openObservations = fleetObservations.filter((o) => o.status !== 'Verified');
  const latestInspection = inspections[inspections.length - 1];
  const readiness = calculateReadiness({
    answers: latestInspection ? latestInspection.answers : [],
    openObservations,
  });

  const bySeverity = { Critical: 0, Major: 0, Minor: 0 };
  for (const obs of openObservations) {
    bySeverity[obs.severity] = (bySeverity[obs.severity] || 0) + 1;
  }

  res.json({
    ship: ships[0],
    readinessScore: readiness,
    gapsBySeverity: bySeverity,
    totalOpenGaps: openObservations.length,
    crewCompetencyAverage: averageCrewCompetency(),
    previousObservationsCount: previousObservations.length,
    inspectionsCompleted: inspections.length,
    pifs: PIFS,
  });
});

// GET /api/reports/:inspectionId - generate inspection readiness/gap report
router.get('/:inspectionId', (req, res) => {
  const inspection = inspections.find((i) => i.id === req.params.inspectionId);
  if (!inspection) return res.status(404).json({ error: 'Inspection not found' });

  const openObservations = fleetObservations.filter((o) => o.status !== 'Verified');
  const readiness = calculateReadiness({ answers: inspection.answers, openObservations });
  const riskMatrix = buildRiskMatrix({ answers: inspection.answers, observations: fleetObservations });

  res.json({
    inspectionId: inspection.id,
    readinessScore: readiness,
    totalQuestionsAnswered: inspection.answers.length,
    totalQuestions: inspection.questions.length,
    riskMatrix,
  });
});

export default router;
