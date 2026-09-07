import { useEffect, useState } from 'react';
import api from '../api/client';
import type { CrewMember } from '../types';
import { Card } from '../components/ui';

export function CrewPage() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = () => {
    api.getCrew().then((res) => setCrew(res.crew));
  };

  useEffect(load, []);

  const handleScoreChange = async (member: CrewMember, pif: string, score: number) => {
    const updated = await api.updateCrewPif(member.id, { ...member.pifScores, [pif]: score });
    setCrew((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Crew Competency Assessment</h2>
        <p className="text-sm text-gray-500">
          Nine Performance Influencing Factors (PIFs) evaluation. Scores of 2 or below flag a training need.
        </p>
      </div>

      <div className="space-y-3">
        {crew.map((member) => {
          const avg =
            Object.values(member.pifScores).reduce((s, v) => s + v, 0) /
            (Object.values(member.pifScores).length || 1);
          return (
            <Card key={member.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-500">
                    {member.role} · {member.yearsOfExperience} yrs experience
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-sky-700">{((avg / 5) * 100).toFixed(0)}%</p>
                  <button
                    className="text-xs text-sky-600 underline"
                    onClick={() => setExpanded(expanded === member.id ? null : member.id)}
                  >
                    {expanded === member.id ? 'Hide PIFs' : 'View PIFs'}
                  </button>
                </div>
              </div>

              {member.trainingNeeds.length > 0 && (
                <p className="text-xs text-red-600 mt-2">
                  Training needed: {member.trainingNeeds.join(', ')}
                </p>
              )}

              {expanded === member.id && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(member.pifScores).map(([pif, score]) => (
                    <div key={pif} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-600">{pif}</span>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={score}
                        onChange={(e) => handleScoreChange(member, pif, Number(e.target.value))}
                        className="w-32"
                      />
                      <span className="text-xs font-medium w-4 text-right">{score}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
