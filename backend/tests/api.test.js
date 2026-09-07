import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { fleetObservations, inspections } from '../src/data/store.js';

describe('API routes', () => {
  let app;

  beforeEach(() => {
    app = createApp();
    fleetObservations.length = 0;
    inspections.length = 0;
  });

  it('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/questions/library returns the question library', async () => {
    const res = await request(app).get('/api/questions/library');
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThan(0);
    expect(res.body.questions.length).toBe(res.body.total);
  });

  it('POST /api/inspections/create generates a CVIQ inspection', async () => {
    const res = await request(app).post('/api/inspections/create').send({ count: 15 });
    expect(res.status).toBe(201);
    expect(res.body.questions).toHaveLength(15);
    expect(res.body.status).toBe('In Progress');
  });

  it('PUT /api/inspections/:id/update records a graded answer', async () => {
    const created = await request(app).post('/api/inspections/create').send({ count: 5 });
    const questionId = created.body.questions[0].id;

    const res = await request(app)
      .put(`/api/inspections/${created.body.id}/update`)
      .send({ questionId, grade: 'As Expected', notes: 'Looks fine' });

    expect(res.status).toBe(200);
    expect(res.body.answers).toHaveLength(1);
    expect(res.body.readinessScore).toBeDefined();
  });

  it('rejects an invalid grade', async () => {
    const created = await request(app).post('/api/inspections/create').send({ count: 5 });
    const questionId = created.body.questions[0].id;

    const res = await request(app)
      .put(`/api/inspections/${created.body.id}/update`)
      .send({ questionId, grade: 'Bogus Grade' });

    expect(res.status).toBe(400);
  });

  it('GET /api/observations/previous returns seeded observations', async () => {
    const res = await request(app).get('/api/observations/previous');
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThan(0);
  });

  it('filters previous observations by severity', async () => {
    const res = await request(app).get('/api/observations/previous').query({ severity: 'Critical' });
    expect(res.status).toBe(200);
    for (const obs of res.body.observations) {
      expect(obs.severity).toBe('Critical');
    }
  });

  it('POST /api/observations/fleet creates a new observation', async () => {
    const res = await request(app).post('/api/observations/fleet').send({
      category: 'Cargo and Ballast Operations',
      severity: 'Major',
      description: 'Cargo valve remote indicator mismatch found.',
    });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('Identified');
  });

  it('PUT /api/observations/fleet/:id updates corrective action status', async () => {
    const created = await request(app).post('/api/observations/fleet').send({
      category: 'Safety and Security',
      severity: 'Minor',
      description: 'Fire extinguisher pressure gauge in amber zone.',
    });

    const res = await request(app)
      .put(`/api/observations/fleet/${created.body.id}`)
      .send({ status: 'In Progress', correctiveAction: 'Extinguisher scheduled for replacement.' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('In Progress');
  });

  it('GET /api/crew returns crew profiles', async () => {
    const res = await request(app).get('/api/crew');
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThan(0);
  });

  it('GET /api/compliance/dashboard returns KPI summary', async () => {
    const res = await request(app).get('/api/compliance/dashboard');
    expect(res.status).toBe(200);
    expect(res.body.readinessScore).toBeDefined();
    expect(res.body.gapsBySeverity).toBeDefined();
  });
});
