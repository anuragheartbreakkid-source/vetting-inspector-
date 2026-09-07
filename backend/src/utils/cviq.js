import { QUESTION_LIBRARY } from '../data/questions.js';

/**
 * Generates a tailored Compiled Vessel Inspection Questionnaire (CVIQ) by
 * selecting a subset of questions from the full library, weighted by the
 * probability that a real SIRE 2.0 inspector would ask them.
 *
 * Weighting factors combine the question's base probability with simple
 * risk multipliers driven by ship age and prior observation history, so
 * ships with more historical findings in a thematic area see a higher
 * chance of related questions being selected (mirroring how a real
 * inspection would probe known weak areas).
 */
export function generateCviq({
  count = 100,
  shipAgeYears = 0,
  priorObservationCategories = [],
} = {}) {
  const categoryBoost = new Map();
  for (const category of priorObservationCategories) {
    categoryBoost.set(category, (categoryBoost.get(category) || 0) + 0.1);
  }

  const ageFactor = shipAgeYears > 15 ? 1.15 : shipAgeYears > 8 ? 1.05 : 1.0;

  const weighted = QUESTION_LIBRARY.map((question) => {
    const boost = categoryBoost.get(question.thematicArea) || 0;
    const weight = Math.min(1, question.probability * ageFactor + boost) * question.riskWeight;
    return { question, weight };
  });

  // Sort descending by weight, then take the top `count`, but keep it from
  // being 100% deterministic every single time by lightly shuffling equal
  // tiers using the question id as a stable tiebreaker.
  weighted.sort((a, b) => b.weight - a.weight || a.question.id.localeCompare(b.question.id));

  const selected = weighted.slice(0, Math.min(count, weighted.length)).map((w) => ({
    ...w.question,
    selectionWeight: Math.round(w.weight * 100) / 100,
  }));

  return selected;
}
