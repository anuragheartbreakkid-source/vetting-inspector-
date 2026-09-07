import { useEffect, useState } from 'react';
import api from '../api/client';
import type { Observation } from '../types';
import { Card, SeverityBadge, StatusBadge } from '../components/ui';

export function PreviousObservationsPage() {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [trends, setTrends] = useState<{ category: string; count: number }[]>([]);
  const [filters, setFilters] = useState({ severity: '', category: '', status: '', from: '', to: '' });

  const load = () => {
    const query: Record<string, string> = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v) query[k] = v;
    });
    api.getPreviousObservations(query).then((res) => setObservations(res.observations));
  };

  useEffect(() => {
    load();
    api.getPreviousTrends().then((res) => setTrends(res.trends));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Ship Previous Observations</h2>
        <p className="text-sm text-gray-500">
          Historical vetting observations for this vessel — compare current condition against past findings.
        </p>
      </div>

      <Card>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <select
            className="border rounded px-2 py-1 text-sm"
            value={filters.severity}
            onChange={(e) => setFilters((f) => ({ ...f, severity: e.target.value }))}
          >
            <option value="">All Severities</option>
            <option>Critical</option>
            <option>Major</option>
            <option>Minor</option>
          </select>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="">All Statuses</option>
            <option>Identified</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Verified</option>
          </select>
          <input
            type="text"
            placeholder="Category"
            className="border rounded px-2 py-1 text-sm"
            value={filters.category}
            onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
          />
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm"
            value={filters.from}
            onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
          />
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm"
            value={filters.to}
            onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
          />
        </div>
      </Card>

      <Card>
        <h3 className="font-medium text-gray-900 mb-3">Recurring Issue Trends by Category</h3>
        <ul className="space-y-1">
          {trends.map((t) => (
            <li key={t.category} className="flex justify-between text-sm text-gray-700">
              <span>{t.category}</span>
              <span className="font-medium">{t.count}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="space-y-3">
        {observations.map((obs) => (
          <Card key={obs.id}>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <SeverityBadge severity={obs.severity} />
              <StatusBadge status={obs.status} />
              <span className="text-xs text-gray-400">{obs.inspectionDate}</span>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{obs.category}</span>
            </div>
            <p className="text-sm text-gray-900">{obs.description}</p>
            {obs.correctiveAction && (
              <p className="text-xs text-gray-500 mt-1">Corrective action: {obs.correctiveAction}</p>
            )}
          </Card>
        ))}
        {observations.length === 0 && <p className="text-sm text-gray-500">No observations match the current filters.</p>}
      </div>
    </div>
  );
}
