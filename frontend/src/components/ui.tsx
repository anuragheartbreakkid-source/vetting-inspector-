import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-lg shadow border border-gray-200 p-4 ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <Card>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-semibold text-gray-900 mt-1">{value}</p>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </Card>
  );
}

const SEVERITY_COLORS: Record<string, string> = {
  Critical: 'bg-red-100 text-red-800 border border-red-300',
  Major: 'bg-orange-100 text-orange-800 border border-orange-300',
  Minor: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
};

export function SeverityBadge({ severity }: { severity: string }) {
  const cls = SEVERITY_COLORS[severity] || 'bg-gray-100 text-gray-800 border border-gray-300';
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>{severity}</span>;
}

const GRADE_COLORS: Record<string, string> = {
  'Exceeds Expectations': 'bg-green-100 text-green-800 border border-green-300',
  'As Expected': 'bg-blue-100 text-blue-800 border border-blue-300',
  'Largely as Expected': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  'Not as Expected': 'bg-red-100 text-red-800 border border-red-300',
};

export function GradeBadge({ grade }: { grade: string }) {
  const cls = GRADE_COLORS[grade] || 'bg-gray-100 text-gray-800 border border-gray-300';
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>{grade}</span>;
}

const STATUS_COLORS: Record<string, string> = {
  Identified: 'bg-gray-100 text-gray-800 border border-gray-300',
  'In Progress': 'bg-blue-100 text-blue-800 border border-blue-300',
  Completed: 'bg-teal-100 text-teal-800 border border-teal-300',
  Verified: 'bg-green-100 text-green-800 border border-green-300',
};

export function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800 border border-gray-300';
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>{status}</span>;
}
