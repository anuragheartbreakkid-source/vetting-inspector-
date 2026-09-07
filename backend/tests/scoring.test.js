import { describe, it, expect } from 'vitest';
import { generateCviq } from '../src/utils/cviq.js';
import { calculateReadiness, buildRiskMatrix } from '../src/utils/scoring.js';
import { QUESTION_LIBRARY } from '../src/data/questions.js';

describe('generateCviq', () => {
  it('returns the requested number of questions when available', () => {
    const cviq = generateCviq({ count: 20 });
    expect(cviq).toHaveLength(20);
  });

  it('never returns more questions than exist in the library', () => {
    const cviq = generateCviq({ count: 10000 });
    expect(cviq.length).toBe(QUESTION_LIBRARY.length);
  });

  it('prioritises thematic areas with prior observation history', () => {
    const cviq = generateCviq({
      count: 30,
      priorObservationCategories: ['Machinery and Engine Room'],
    });
    const machineryCount = cviq.filter((q) => q.thematicArea === 'Machinery and Engine Room').length;
    const baseline = generateCviq({ count: 30 }).filter(
      (q) => q.thematicArea === 'Machinery and Engine Room'
    ).length;
    expect(machineryCount).toBeGreaterThanOrEqual(baseline);
  });

  it('includes a selectionWeight on every question', () => {
    const cviq = generateCviq({ count: 5 });
    for (const q of cviq) {
      expect(typeof q.selectionWeight).toBe('number');
    }
  });
});

describe('calculateReadiness', () => {
  it('returns 100 when there are no answers or observations', () => {
    expect(calculateReadiness({ answers: [], openObservations: [] })).toBe(100);
  });

  it('lowers the score for "Not as Expected" answers', () => {
    const score = calculateReadiness({
      answers: [
        { grade: 'Not as Expected' },
        { grade: 'Exceeds Expectations' },
      ],
      openObservations: [],
    });
    expect(score).toBeLessThan(100);
  });

  it('applies a penalty for open critical observations', () => {
    const withCritical = calculateReadiness({
      answers: [{ grade: 'As Expected' }],
      openObservations: [{ severity: 'Critical' }],
    });
    const withoutObs = calculateReadiness({
      answers: [{ grade: 'As Expected' }],
      openObservations: [],
    });
    expect(withCritical).toBeLessThan(withoutObs);
  });

  it('never goes below 0 or above 100', () => {
    const score = calculateReadiness({
      answers: Array(10).fill({ grade: 'Not as Expected' }),
      openObservations: Array(20).fill({ severity: 'Critical' }),
    });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe('buildRiskMatrix', () => {
  it('places "Not as Expected" answers in the high risk bucket', () => {
    const matrix = buildRiskMatrix({
      answers: [{ questionId: 'Q0001', grade: 'Not as Expected' }],
      observations: [],
    });
    expect(matrix.high).toHaveLength(1);
  });

  it('excludes verified observations from the matrix', () => {
    const matrix = buildRiskMatrix({
      answers: [],
      observations: [{ id: 'o1', severity: 'Critical', status: 'Verified' }],
    });
    expect(matrix.high).toHaveLength(0);
  });

  it('places critical open observations in the high risk bucket', () => {
    const matrix = buildRiskMatrix({
      answers: [],
      observations: [{ id: 'o1', severity: 'Critical', status: 'Identified' }],
    });
    expect(matrix.high).toHaveLength(1);
  });
});
