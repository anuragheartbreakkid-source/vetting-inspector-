import { GRADES, SEVERITIES } from '../data/thematicAreas.js';

const GRADE_SCORES = {
  'Exceeds Expectations': 100,
  'As Expected': 85,
  'Largely as Expected': 60,
  'Not as Expected': 20,
};

const SEVERITY_RISK_WEIGHT = {
  Critical: 3,
  Major: 2,
  Minor: 1,
};

/**
 * Calculates a pre-inspection readiness score (0-100%) from an inspection's
 * graded answers plus open fleet observations, combining question-answer
 * performance with outstanding gap severity - matching the "Readiness Score"
 * and "Gap Identification & Risk Assessment" requirements.
 */
export function calculateReadiness({ answers = [], openObservations = [] }) {
  let answerScore = 100;
  if (answers.length > 0) {
    const total = answers.reduce((sum, answer) => sum + (GRADE_SCORES[answer.grade] ?? 60), 0);
    answerScore = total / answers.length;
  }

  const observationPenalty = openObservations.reduce((sum, obs) => {
    return sum + (SEVERITY_RISK_WEIGHT[obs.severity] ?? 1) * 3;
  }, 0);

  const readiness = Math.max(0, Math.min(100, Math.round(answerScore - observationPenalty)));
  return readiness;
}

/**
 * Buckets graded answers and observations into a High/Medium/Low risk
 * priority matrix.
 */
export function buildRiskMatrix({ answers = [], observations = [] }) {
  const matrix = { high: [], medium: [], low: [] };

  for (const answer of answers) {
    const entry = {
      type: 'question',
      id: answer.questionId,
      thematicArea: answer.thematicArea,
      dimension: answer.dimension,
      grade: answer.grade,
    };
    if (answer.grade === 'Not as Expected') {
      matrix.high.push(entry);
    } else if (answer.grade === 'Largely as Expected') {
      matrix.medium.push(entry);
    } else if (answer.grade === 'As Expected') {
      matrix.low.push(entry);
    }
  }

  for (const obs of observations) {
    const entry = {
      type: 'observation',
      id: obs.id,
      category: obs.category,
      severity: obs.severity,
      status: obs.status,
    };
    if (obs.status === 'Verified') continue;
    if (obs.severity === 'Critical') {
      matrix.high.push(entry);
    } else if (obs.severity === 'Major') {
      matrix.medium.push(entry);
    } else {
      matrix.low.push(entry);
    }
  }

  return matrix;
}

export function isValidGrade(grade) {
  return GRADES.includes(grade);
}

export function isValidSeverity(severity) {
  return SEVERITIES.includes(severity);
}
