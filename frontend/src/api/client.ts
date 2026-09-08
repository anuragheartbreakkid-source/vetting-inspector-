import axios from 'axios';
import type {
  CrewMember,
  DashboardSummary,
  Inspection,
  Observation,
  Question,
} from '../types';

const client = axios.create({
  baseURL: '/api',
});

export const api = {
  async getQuestionLibrary(): Promise<{ total: number; questions: Question[]; thematicAreas: string[] }> {
    const { data } = await client.get('/questions/library');
    return data;
  },

  async createInspection(params: {
    shipId?: string;
    shipAgeYears?: number;
    priorObservationCategories?: string[];
    count?: number;
  }): Promise<Inspection> {
    const { data } = await client.post('/inspections/create', params);
    return data;
  },

  async getInspection(id: string): Promise<Inspection> {
    const { data } = await client.get(`/inspections/${id}`);
    return data;
  },

  async updateAnswer(
    inspectionId: string,
    payload: { questionId: string; grade: string; notes?: string; evidenceIds?: string[] }
  ): Promise<Inspection> {
    const { data } = await client.put(`/inspections/${inspectionId}/update`, payload);
    return data;
  },

  async getPreviousObservations(filters: Record<string, string> = {}): Promise<{ total: number; observations: Observation[] }> {
    const { data } = await client.get('/observations/previous', { params: filters });
    return data;
  },

  async getPreviousTrends(): Promise<{ trends: { category: string; count: number }[] }> {
    const { data } = await client.get('/observations/previous/trends');
    return data;
  },

  async getFleetObservations(filters: Record<string, string> = {}): Promise<{ total: number; observations: Observation[] }> {
    const { data } = await client.get('/observations/fleet', { params: filters });
    return data;
  },

  async createFleetObservation(payload: Partial<Observation>): Promise<Observation> {
    const { data } = await client.post('/observations/fleet', payload);
    return data;
  },

  async updateFleetObservation(
    id: string,
    payload: { status?: string; correctiveAction?: string }
  ): Promise<Observation> {
    const { data } = await client.put(`/observations/fleet/${id}`, payload);
    return data;
  },

  async getCrew(shipId?: string): Promise<{ total: number; crew: CrewMember[] }> {
    const { data } = await client.get('/crew', { params: shipId ? { shipId } : {} });
    return data;
  },

  async createCrewMember(payload: { shipId?: string; name: string; role: string; yearsOfExperience?: number }): Promise<CrewMember> {
    const { data } = await client.post('/crew', payload);
    return data;
  },

  async updateCrewPif(id: string, pifScores: Record<string, number>): Promise<CrewMember> {
    const { data } = await client.put(`/crew/${id}/pif`, { pifScores });
    return data;
  },

  async createCrewAssessment(id: string, count = 10): Promise<Inspection> {
    const { data } = await client.post(`/crew/${id}/assessment`, { count });
    return data;
  },

  async getDashboard(): Promise<DashboardSummary> {
    const { data } = await client.get('/compliance/dashboard');
    return data;
  },

  async getInspectionReport(inspectionId: string) {
    const { data } = await client.get(`/reports/${inspectionId}`);
    return data;
  },
};

export default api;
