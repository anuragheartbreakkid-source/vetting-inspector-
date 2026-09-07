import { useEffect, useState } from 'react';
import api from '../api/client';
import type { Dimension, Observation, Severity } from '../types';
import { Card, SeverityBadge, StatusBadge } from '../components/ui';

const CATEGORIES = [
  'Navigation and Bridge Management',
  'Cargo and Ballast Operations',
  'Machinery and Engine Room',
  'Safety and Security',
  'Pollution Prevention (MARPOL)',
  'Crew Management & Training',
  'Ship Maintenance',
  'Certification & Documentation',
];

const DIMENSIONS = ['Hardware', 'Procedures', 'Human Factors'];
const STATUSES = ['Identified', 'In Progress', 'Completed', 'Verified'];

export function FleetObservationsPage() {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [form, setForm] = useState<{
    category: string;
    dimension: Dimension;
    severity: Severity;
    description: string;
  }>({
    category: CATEGORIES[0],
    dimension: DIMENSIONS[0] as Dimension,
    severity: 'Minor',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    api.getFleetObservations().then((res) => setObservations(res.observations));
  };

  useEffect(load, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim()) return;
    setSubmitting(true);
    try {
      await api.createFleetObservation(form);
      setForm((f) => ({ ...f, description: '' }));
      load();
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    await api.updateFleetObservation(id, { status });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Fleet Observation Tracking</h2>
        <p className="text-sm text-gray-500">
          Log new observations for the current ship and track corrective action status through to closure.
        </p>
      </div>

      <Card>
        <h3 className="font-medium text-gray-900 mb-3">Log New Observation</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              className="border rounded px-2 py-1 text-sm"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={form.dimension}
              onChange={(e) => setForm((f) => ({ ...f, dimension: e.target.value as Dimension }))}
            >
              {DIMENSIONS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={form.severity}
              onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value as Severity }))}
            >
              <option>Critical</option>
              <option>Major</option>
              <option>Minor</option>
            </select>
          </div>
          <textarea
            className="w-full border rounded px-2 py-1 text-sm"
            rows={3}
            placeholder="Describe the observation…"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-medium"
          >
            {submitting ? 'Saving…' : 'Log Observation'}
          </button>
        </form>
      </Card>

      <div className="space-y-3">
        {observations.map((obs) => (
          <Card key={obs.id}>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <SeverityBadge severity={obs.severity} />
              <StatusBadge status={obs.status} />
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{obs.category}</span>
              {obs.dimension && (
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">{obs.dimension}</span>
              )}
            </div>
            <p className="text-sm text-gray-900">{obs.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <label className="text-xs text-gray-500">Corrective action status:</label>
              <select
                className="border rounded px-2 py-0.5 text-xs"
                value={obs.status}
                onChange={(e) => handleStatusChange(obs.id, e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </Card>
        ))}
        {observations.length === 0 && (
          <p className="text-sm text-gray-500">No fleet observations logged yet for this ship.</p>
        )}
      </div>
    </div>
  );
}
