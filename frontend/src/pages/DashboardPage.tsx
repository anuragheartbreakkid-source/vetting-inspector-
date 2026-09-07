import { useEffect, useState } from 'react';
import api from '../api/client';
import type { DashboardSummary } from '../types';
import { Card, StatCard } from '../components/ui';

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getDashboard()
      .then(setSummary)
      .catch(() => setError('Unable to load dashboard data. Is the backend running?'));
  }, []);

  if (error) {
    return <Card className="text-red-600">{error}</Card>;
  }

  if (!summary) {
    return <p className="text-gray-500">Loading dashboard…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          {summary.ship.name} <span className="text-gray-400 font-normal">· IMO {summary.ship.imoNumber}</span>
        </h2>
        <p className="text-sm text-gray-500">
          {summary.ship.type} · Built {summary.ship.yearBuilt} · Flag: {summary.ship.flag}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Vetting Readiness Score" value={`${summary.readinessScore}%`} hint="Pre-inspection readiness" />
        <StatCard label="Open Gaps" value={summary.totalOpenGaps} hint="Across all severities" />
        <StatCard label="Crew Competency Average" value={`${summary.crewCompetencyAverage}%`} hint="9 PIF assessment" />
        <StatCard label="Inspections Completed" value={summary.inspectionsCompleted} />
      </div>

      <Card>
        <h3 className="font-medium text-gray-900 mb-3">Gaps by Severity</h3>
        <div className="grid grid-cols-3 gap-4">
          {(['Critical', 'Major', 'Minor'] as const).map((sev) => (
            <div key={sev} className="text-center">
              <p className="text-2xl font-semibold text-gray-900">{summary.gapsBySeverity[sev] ?? 0}</p>
              <p className="text-xs text-gray-500">{sev}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-medium text-gray-900 mb-2">Previous Vetting History</h3>
        <p className="text-sm text-gray-600">
          {summary.previousObservationsCount} historical observation(s) on record. Review the
          &quot;Ship Previous Observations&quot; section to compare current condition against past findings.
        </p>
      </Card>
    </div>
  );
}
