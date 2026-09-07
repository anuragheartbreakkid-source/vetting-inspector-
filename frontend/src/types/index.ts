export type Dimension = 'Hardware' | 'Procedures' | 'Human Factors';

export type Grade =
  | 'Exceeds Expectations'
  | 'As Expected'
  | 'Largely as Expected'
  | 'Not as Expected';

export type Severity = 'Critical' | 'Major' | 'Minor';

export type CorrectiveActionStatus = 'Identified' | 'In Progress' | 'Completed' | 'Verified';

export interface Question {
  id: string;
  thematicArea: string;
  dimension: Dimension;
  text: string;
  questionType: string;
  probability: number;
  riskWeight: number;
  selectionWeight?: number;
}

export interface Answer {
  questionId: string;
  thematicArea: string;
  dimension: Dimension;
  grade: Grade;
  notes: string;
  evidenceIds: string[];
  answeredAt: string;
}

export interface Inspection {
  id: string;
  shipId: string;
  createdAt: string;
  status: string;
  questions: Question[];
  answers: Answer[];
  readinessScore?: number;
}

export interface Observation {
  id: string;
  shipId: string;
  category: string;
  severity: Severity;
  description: string;
  status: CorrectiveActionStatus | string;
  correctiveAction: string;
  inspectionDate?: string;
  createdAt?: string;
  dimension?: Dimension;
  questionId?: string | null;
  evidenceIds?: string[];
}

export interface CrewMember {
  id: string;
  shipId: string;
  name: string;
  role: string;
  yearsOfExperience: number;
  pifScores: Record<string, number>;
  trainingNeeds: string[];
}

export interface DashboardSummary {
  ship: { id: string; name: string; imoNumber: string; type: string; yearBuilt: number; flag: string };
  readinessScore: number;
  gapsBySeverity: Record<Severity, number>;
  totalOpenGaps: number;
  crewCompetencyAverage: number;
  previousObservationsCount: number;
  inspectionsCompleted: number;
  pifs: string[];
}
