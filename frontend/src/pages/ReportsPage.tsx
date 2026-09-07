import { useEffect, useState } from 'react';
import api from '../api/client';
import type { DashboardSummary } from '../types';
import { Card, StatCard } from '../components/ui';

export function ReportsPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    api.getDashboard().then(setSummary);
  }, []);

  if (!summary) return <p className="text-gray-500">Loading reports…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Reporting &amp; Analytics</h2>
        <p className="text-sm text-gray-500">
          Pre-inspection readiness summary for management and shore team review.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Pre-Inspection Readiness Score" value={`${summary.readinessScore}%`} />
        <StatCard label="Crew Competency Average" value={`${summary.crewCompetencyAverage}%`} />
        <StatCard label="Open Gaps" value={summary.totalOpenGaps} />
      </div>

      <Card>
        <h3 className="font-medium text-gray-900 mb-3">Observation Summary by Severity</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-1">Severity</th>
              <th className="py-1">Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(summary.gapsBySeverity).map(([severity, count]) => (
              <tr key={severity} className="border-t">
                <td className="py-1">{severity}</td>
                <td className="py-1">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card>
        <h3 className="font-medium text-gray-900 mb-2">Export</h3>
        <p className="text-sm text-gray-600 mb-3">
          Export this readiness summary for the shore team / management review.
        </p>
        <button
          onClick={() => window.print()}
          className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium"
        >
          Print / Export as PDF
        </button>
      </Card>
    </div>
  );
}
