
import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';

import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/requestService.js';
import { STAFF, loginAsStaff, tokenFor } from '../helpers/auth.js';

/**
 * Week 13 — Authentication และ Authorization
 *
 * CP50: Login ด้วยอีเมลและรหัสผ่าน
 * CP51: ตรวจสอบ JWT และสิทธิ์การเข้าถึง
 *
 * 401 Unauthorized = ไม่มี Token หรือ Token ไม่ถูกต้อง
 * 403 Forbidden    = Token ถูกต้อง แต่ไม่มีสิทธิ์เจ้าหน้าที่
 */

const app = createApp();

beforeEach(async () => {
  await loadSeed();
});

// =====================================================
// CP50 — POST /api/auth/login
// =====================================================

describe('POST /api/auth/login', () => {

  test('อีเมลและรหัสผ่านถูก → 200 พร้อม token', async () => {
    const r = await request(app)
      .post('/api/auth/login')
      .send(STAFF);

    expect(r.status).toBe(200);
    expect(r.body.token.split('.')).toHaveLength(3);
  });

  test('รหัสผ่านผิด → 401', async () => {
    const r = await request(app)
      .post('/api/auth/login')
      .send({
        ...STAFF,
        password: 'nope1234',
      });

    expect(r.status).toBe(401);
  });

  // CP50 — ป้องกันการเปิดเผยว่าอีเมลใดมีอยู่ในระบบ
  test('อีเมลไม่มีในระบบ → 401 และข้อความเหมือนรหัสผ่านผิด', async () => {
    const wrongPassword = await request(app)
      .post('/api/auth/login')
      .send({
        ...STAFF,
        password: 'nope1234',
      });

    const unknownEmail = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'unknown@example.com',
        password: 'nope1234',
      });

    expect(unknownEmail.status).toBe(401);
    expect(unknownEmail.body.error).toBe(
      wrongPassword.body.error
    );
  });
});

// =====================================================
// CP51 — Authorization สำหรับ PUT / DELETE
// =====================================================

describe('สิทธิ์ของ PUT / DELETE', () => {

  // 401 — ไม่ได้เข้าสู่ระบบ
  test('ไม่มี token → 401', async () => {
    const r = await request(app)
      .put('/api/requests/REQ-001')
      .send({ status: 'completed' });

    expect(r.status).toBe(401);
  });

  // 403 — มี JWT ถูกต้อง แต่ role ไม่ใช่ staff
  test('token ที่ไม่ใช่เจ้าหน้าที่ → 403', async () => {
    const token = tokenFor('requester');

    const r = await request(app)
      .put('/api/requests/REQ-001')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'completed' });

    expect(r.status).toBe(403);
  });

  // 401 — JWT ถูกเซ็นด้วย Secret ที่ไม่ถูกต้อง
  test('token ปลอม → 401', async () => {
    const token = tokenFor(
      'staff',
      'not-the-real-secret'
    );

    const r = await request(app)
      .put('/api/requests/REQ-001')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'completed' });

    expect(r.status).toBe(401);
  });

  // เจ้าหน้าที่ Login จริงและใช้งาน PUT / DELETE ได้
  test('เจ้าหน้าที่ → PUT 200 และ DELETE 204', async () => {
    const token = await loginAsStaff(app);

    const putResponse = await request(app)
      .put('/api/requests/REQ-001')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'completed' });

    expect(putResponse.status).toBe(200);
    expect(putResponse.body.status).toBe('completed');

    const deleteResponse = await request(app)
      .delete('/api/requests/REQ-001')
      .set('Authorization', `Bearer ${token}`);

    expect(deleteResponse.status).toBe(204);
  });
});
