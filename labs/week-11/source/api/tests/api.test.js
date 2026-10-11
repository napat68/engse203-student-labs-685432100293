
import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import { createApp } from '../src/app.js';
import { loadSeed } from '../src/services/requestService.js';

let app;

before(async () => {
  await loadSeed();
  app = createApp();
});

describe('Campus Service API Tests', () => {

  test('1. GET /api/requests returns 200 and array', async () => {
    const res = await request(app).get('/api/requests');

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  test('2. GET /api/requests includes requesterName', async () => {
    const res = await request(app).get('/api/requests');

    assert.equal(res.status, 200);
    assert.ok(res.body.length > 0);
    assert.ok('requesterName' in res.body[0]);
  });

  test('3. GET /api/requests/:id returns 200', async () => {
    const list = await request(app).get('/api/requests');
    const id = list.body[0].id;

    const res = await request(app).get(`/api/requests/${id}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.id, id);
  });

  test('4. GET unknown request returns 404', async () => {
    const res = await request(app)
      .get('/api/requests/REQ-NOT-FOUND');

    assert.equal(res.status, 404);
  });

  test('5. POST invalid request returns 400', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send({});

    assert.equal(res.status, 400);
  });

  test('6. GET requests with SQL injection does not crash', async () => {
    const res = await request(app)
      .get('/api/requests')
      .query({ status: "' OR 1=1 --" });

    assert.ok([200, 400].includes(res.status));
    assert.ok(Array.isArray(res.body) || res.body.error);
  });

});
