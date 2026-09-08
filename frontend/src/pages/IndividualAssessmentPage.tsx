import { useEffect, useState } from 'react';
import api from '../api/client';
import type { CrewMember, Grade, Inspection } from '../types';
import { Card, GradeBadge } from '../components/ui';

const GRADES: Grade[] = [
  'Exceeds Expectations',
  'As Expected',
  'Largely as Expected',
  'Not as Expected',
];

const ROLES = [
  'Master',
  'Chief Officer',
  'Junior Officer',
  'Chief Engineer',
  'Junior Engineer',
  'Deck Rating',
  'Engine Room Rating',
];

export function IndividualAssessmentPage() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [assessment, setAssessment] = useState<Inspection | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [addingCrew, setAddingCrew] = useState(false);
  const [newCrewMember, setNewCrewMember] = useState({
    name: '',
    role: 'Junior Officer',
    joiningDate: '',
  });

  useEffect(() => {
    api.getCrew().then(({ crew: members }) => {
      setCrew(members.filter((member) => member.joiningDate));
    });
  }, []);

  const startAssessment = async () => {
    if (!selectedMemberId) return;
    setLoading(true);
    try {
      const created = await api.createCrewAssessment(selectedMemberId);
      setAssessment(created);
      setActiveIndex(0);
      setNotes('');
    } finally {
      setLoading(false);
    }
  };

  const addCrewMember = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newCrewMember.name.trim() || !newCrewMember.joiningDate) return;

    setAddingCrew(true);
    try {
      const created = await api.createCrewMember({
        name: newCrewMember.name.trim(),
        role: newCrewMember.role,
        joiningDate: newCrewMember.joiningDate,
      });
      setCrew((members) => [...members, created]);
      setSelectedMemberId(created.id);
      setNewCrewMember({ name: '', role: 'Junior Officer', joiningDate: '' });
    } finally {
      setAddingCrew(false);
    }
  };

  const activeQuestion = assessment?.questions[activeIndex];
  const submitGrade = async (grade: Grade) => {
    if (!assessment || !activeQuestion) return;

    const updated = await api.updateAnswer(assessment.id, {
      questionId: activeQuestion.id,
      grade,
      notes,
    });
    setAssessment((current) => current ? { ...current, answers: updated.answers, readinessScore: updated.readinessScore } : current);
    setNotes('');
    setActiveIndex((index) => Math.min(index + 1, assessment.questions.length - 1));
  };

  if (!assessment) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Individual Crew Assessment</h2>
          <p className="text-sm text-gray-500">
            Select a crew member to ask questions targeted to that person&apos;s rank and responsibilities.
          </p>
        </div>
        <Card className="max-w-xl">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="crew-member">
            Crew member and rank
          </label>
          <select
            id="crew-member"
            className="w-full border rounded px-3 py-2 text-sm"
            value={selectedMemberId}
            onChange={(event) => setSelectedMemberId(event.target.value)}
          >
            <option value="" disabled>Select a crew member after adding their details</option>
            {crew.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} — {member.role}
              </option>
            ))}
          </select>
          {crew.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">
              Add an onboard crew member below before starting an assessment.
            </p>
          )}
          <button
            type="button"
            disabled={!selectedMemberId || loading}
            onClick={startAssessment}
            className="mt-4 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-medium"
          >
            {loading ? 'Generating…' : 'Start 10-Question Assessment'}
          </button>
        </Card>
        <Card className="max-w-xl">
          <h3 className="font-medium text-gray-900 mb-1">Add Onboard Crew Member</h3>
          <p className="text-sm text-gray-500 mb-3">
            Add an officer, engineer, or rating before starting their individual assessment.
          </p>
          <form onSubmit={addCrewMember} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              aria-label="Crew member name"
              className="border rounded px-3 py-2 text-sm"
              placeholder="Full name"
              value={newCrewMember.name}
              onChange={(event) => setNewCrewMember((member) => ({ ...member, name: event.target.value }))}
              required
            />
            <select
              aria-label="Crew member rank"
              className="border rounded px-3 py-2 text-sm"
              value={newCrewMember.role}
              onChange={(event) => setNewCrewMember((member) => ({ ...member, role: event.target.value }))}
            >
              {ROLES.map((role) => <option key={role}>{role}</option>)}
            </select>
            <input
              aria-label="Date joined vessel"
              className="border rounded px-3 py-2 text-sm"
              type="date"
              value={newCrewMember.joiningDate}
              onChange={(event) => setNewCrewMember((member) => ({ ...member, joiningDate: event.target.value }))}
              required
            />
            <button
              type="submit"
              disabled={addingCrew}
              className="sm:col-span-3 justify-self-start bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-medium"
            >
              {addingCrew ? 'Adding…' : 'Add Crew Member'}
            </button>
          </form>
        </Card>
      </div>
    );
  }

  const answeredCount = assessment.answers.length;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-semibold text-gray-900">{assessment.crewMemberName}</h2>
              <p className="text-xs text-gray-500">{assessment.crewMemberRole} · Question {activeIndex + 1} of {assessment.questions.length}</p>
            </div>
            {assessment.readinessScore !== undefined && <span className="text-sm font-medium text-sky-700">Score: {assessment.readinessScore}%</span>}
          </div>
          {activeQuestion && (
            <>
              <div className="flex gap-2 mb-3">
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{activeQuestion.thematicArea}</span>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">{activeQuestion.dimension}</span>
              </div>
              <p className="font-medium text-gray-900 mb-4">{activeQuestion.text}</p>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Response notes or evidence…" className="w-full border rounded p-2 text-sm mb-4" rows={3} />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {GRADES.map((grade) => <button key={grade} type="button" onClick={() => submitGrade(grade)} className="border rounded px-2 py-2 text-xs font-medium hover:bg-gray-50">{grade}</button>)}
              </div>
            </>
          )}
        </Card>
      </div>
      <Card>
        <h3 className="font-medium text-gray-900 mb-2">Assessment Progress</h3>
        <p className="text-sm text-gray-600">{answeredCount} / {assessment.questions.length} questions graded</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div className="bg-sky-600 h-2 rounded-full" style={{ width: `${(answeredCount / assessment.questions.length) * 100}%` }} />
        </div>
        <div className="mt-4 space-y-1">
          {assessment.questions.map((question, index) => {
            const answer = assessment.answers.find((item) => item.questionId === question.id);
            return <button key={question.id} type="button" onClick={() => setActiveIndex(index)} className="w-full text-left text-xs p-1 rounded hover:bg-gray-50 flex justify-between gap-2"><span>{index + 1}. {question.thematicArea}</span>{answer && <GradeBadge grade={answer.grade} />}</button>;
          })}
        </div>
      </Card>
    </div>
  );
}
