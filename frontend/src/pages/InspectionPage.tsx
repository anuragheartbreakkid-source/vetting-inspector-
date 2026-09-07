import { useMemo, useState } from 'react';
import api from '../api/client';
import type { Grade, Inspection } from '../types';
import { Card, GradeBadge } from '../components/ui';

const GRADES: Grade[] = [
  'Exceeds Expectations',
  'As Expected',
  'Largely as Expected',
  'Not as Expected',
];

export function InspectionPage() {
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [notes, setNotes] = useState('');

  const startInspection = async () => {
    setLoading(true);
    try {
      const created = await api.createInspection({ count: 30, shipAgeYears: 13 });
      setInspection(created);
      setActiveIndex(0);
      setNotes('');
    } finally {
      setLoading(false);
    }
  };

  const activeQuestion = inspection?.questions[activeIndex];
  const answersByQuestion = useMemo(() => {
    const map = new Map<string, Inspection['answers'][number]>();
    inspection?.answers.forEach((a) => map.set(a.questionId, a));
    return map;
  }, [inspection]);

  const answeredCount = inspection?.answers.length ?? 0;
  const totalCount = inspection?.questions.length ?? 0;

  const submitGrade = async (grade: Grade) => {
    if (!inspection || !activeQuestion) return;
    const updated = await api.updateAnswer(inspection.id, {
      questionId: activeQuestion.id,
      grade,
      notes,
    });
    setInspection((prev) => (prev ? { ...prev, answers: updated.answers, readinessScore: updated.readinessScore } : prev));
    setNotes('');
    if (activeIndex < (inspection.questions.length ?? 0) - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  if (!inspection) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Start a New Inspection</h2>
        <p className="text-sm text-gray-600 mb-4">
          Generates a tailored Compiled Vessel Inspection Questionnaire (CVIQ) weighted by the
          probability a real SIRE 2.0 inspector would ask each question, factoring in ship age and
          prior observation history.
        </p>
        <button
          onClick={startInspection}
          disabled={loading}
          className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-medium"
        >
          {loading ? 'Generating CVIQ…' : 'Generate CVIQ & Start Inspection'}
        </button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">
              Question {activeIndex + 1} of {totalCount}
            </span>
            {inspection.readinessScore !== undefined && (
              <span className="text-xs font-medium text-sky-700">Readiness: {inspection.readinessScore}%</span>
            )}
          </div>
          {activeQuestion && (
            <>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {activeQuestion.thematicArea}
                </span>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                  {activeQuestion.dimension}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  {activeQuestion.questionType}
                </span>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                  Probability: {Math.round(activeQuestion.probability * 100)}%
                </span>
              </div>
              <p className="text-gray-900 font-medium mb-4">{activeQuestion.text}</p>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Evidence / notes for this question…"
                className="w-full border border-gray-300 rounded p-2 text-sm mb-4"
                rows={3}
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {GRADES.map((grade) => (
                  <button
                    key={grade}
                    onClick={() => submitGrade(grade)}
                    className="border rounded px-2 py-2 text-xs font-medium hover:bg-gray-50"
                  >
                    {grade}
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-4 text-sm">
                <button
                  disabled={activeIndex === 0}
                  onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                  className="text-sky-700 disabled:text-gray-300"
                >
                  ← Previous
                </button>
                <button
                  disabled={activeIndex >= totalCount - 1}
                  onClick={() => setActiveIndex((i) => Math.min(totalCount - 1, i + 1))}
                  className="text-sky-700 disabled:text-gray-300"
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <h3 className="font-medium text-gray-900 mb-2">Progress</h3>
          <p className="text-sm text-gray-600 mb-2">
            {answeredCount} / {totalCount} questions graded
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-sky-600 h-2 rounded-full"
              style={{ width: `${totalCount ? (answeredCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </Card>

        <Card className="max-h-96 overflow-y-auto">
          <h3 className="font-medium text-gray-900 mb-2">Question Navigator</h3>
          <ul className="space-y-1">
            {inspection.questions.map((q, idx) => {
              const answer = answersByQuestion.get(q.id);
              return (
                <li key={q.id}>
                  <button
                    onClick={() => setActiveIndex(idx)}
                    className={`w-full text-left text-xs px-2 py-1 rounded flex justify-between items-center gap-2 ${
                      idx === activeIndex ? 'bg-sky-50 text-sky-800' : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <span className="truncate">
                      {idx + 1}. {q.thematicArea}
                    </span>
                    {answer ? <GradeBadge grade={answer.grade} /> : <span className="text-gray-300">–</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}
