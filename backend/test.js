const request = require('supertest');
const app = require('./app');

describe('NariSakti API', () => {
  test('returns health check status', async () => {
    const response = await request(app).get('/api/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('NariSakti API is running!');
  });

  test('returns a clear 404 for unknown routes', async () => {
    const response = await request(app).get('/api/unknown-route');

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Route not found');
  });
});
