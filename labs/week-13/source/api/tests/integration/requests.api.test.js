
import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import { createApp } from '../../src/app.js';
import { config } from '../../src/config.js';
import { loadSeed } from '../../src/services/requestService.js';

/**
 * Integration Test — Week 13
 *
 * ทดสอบ HTTP จริงผ่าน:
 * Route → Middleware → Controller → Service → SQLite
 *
 * beforeEach() โหลดข้อมูลตั้งต้นใหม่ทุก Test
 * เพื่อไม่ให้การเพิ่ม แก้ไข หรือลบข้อมูลกระทบ Test อื่น
 *
 * CP51:
 * PUT และ DELETE ต้องแนบ JWT ของเจ้าหน้าที่
 * GET และ POST ยังคงเข้าถึงได้โดยไม่ต้อง Login
 */

const app = createApp();

// CP51 — สร้าง JWT สำหรับ Integration Test เท่านั้น
const staffToken = jwt.sign(
  {
    sub: '5',
    name: 'Test Staff',
    role: 'staff',
  },
  config.jwtSecret,
  { expiresIn: '1h' }
);

const staffAuth = `Bearer ${staffToken}`;

// โหลดข้อมูลตั้งต้นก่อนทุก Test
beforeEach(async () => {
  await loadSeed();
});

// ข้อมูลคำร้องที่ถูกต้องสำหรับใช้ทดสอบ
const valid = {
  requesterName: 'ทดสอบ อัตโนมัติ',
  requestType: 'แจ้งซ่อม',
  location: 'C3-401',
  details: 'รายละเอียดยาวพอสมควรจริง',
  priority: 'normal',
};

// =====================================================
// GET /api/requests
// =====================================================

describe('GET /api/requests', () => {
  test('คืน array 5 รายการจากข้อมูลตั้งต้น พร้อม 200', async () => {
    const r = await request(app).get('/api/requests');

    expect(r.status).toBe(200);
    expect(r.body).toHaveLength(5);
  });

  test('คืน requesterName ไม่ใช่ requester_id', async () => {
    const r = await request(app).get('/api/requests');

    expect(r.body[0]).toHaveProperty('requesterName');
    expect(r.body[0]).not.toHaveProperty('requester_id');
  });

  test('กรอง ?status= ทำงาน', async () => {
    const r = await request(app).get('/api/requests?status=pending');

    expect(r.body.length).toBeGreaterThan(0);
    expect(
      r.body.every((x) => x.status === 'pending')
    ).toBe(true);
  });

  test('SQL injection ผ่าน ?status= ไม่หลุด', async () => {
    const r = await request(app)
      .get("/api/requests?status=' OR '1'='1");

    expect(r.status).toBe(200);
    expect(r.body).toHaveLength(0);
  });
});

// =====================================================
// GET /api/requests/:id
// =====================================================

describe('GET /api/requests/:id', () => {
  test('พบ → 200', async () => {
    const r = await request(app)
      .get('/api/requests/REQ-001');

    expect(r.status).toBe(200);
    expect(r.body.id).toBe('REQ-001');
  });

  test('ไม่พบ → 404', async () => {
    const r = await request(app)
      .get('/api/requests/REQ-999');

    expect(r.status).toBe(404);
  });
});

// =====================================================
// POST /api/requests
// =====================================================

describe('POST /api/requests', () => {
  test('ข้อมูลถูกต้อง → 201 · ได้รหัสถัดไป', async () => {
    const r = await request(app)
      .post('/api/requests')
      .send(valid);

    expect(r.status).toBe(201);
    expect(r.body.id).toBe('REQ-006');
    expect(r.body.requesterName).toBe('ทดสอบ อัตโนมัติ');
  });

  test('ข้อมูลไม่ครบ → 400 พร้อมรายการ error', async () => {
    const r = await request(app)
      .post('/api/requests')
      .send({ requesterName: 'x' });

    expect(r.status).toBe(400);
    expect(Array.isArray(r.body.details)).toBe(true);
  });

  // Regression Test — BUG #1
  // ลบรายการกลางแล้วเพิ่มใหม่ ต้องไม่เกิดรหัสซ้ำ
  test('ลบรายการกลาง แล้วเพิ่มใหม่ → 201 และรหัสไม่ซ้ำของเดิม', async () => {
    // CP51 — DELETE ต้องใช้ JWT เจ้าหน้าที่
    await request(app)
      .delete('/api/requests/REQ-002')
      .set('Authorization', staffAuth)
      .expect(204);

    // POST ยังเป็น Public Route
    const r = await request(app)
      .post('/api/requests')
      .send(valid);

    expect(r.status).toBe(201);

    const ids = (
      await request(app).get('/api/requests')
    ).body.map((x) => x.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});

// =====================================================
// PUT /api/requests/:id
// CP51 — ต้องเป็นเจ้าหน้าที่ที่มี JWT ถูกต้อง
// =====================================================

describe('PUT /api/requests/:id', () => {
  test('เปลี่ยนสถานะ → 200 และค่าใหม่ถูกบันทึก', async () => {
    const r = await request(app)
      .put('/api/requests/REQ-001')
      .set('Authorization', staffAuth)
      .send({ status: 'completed' });

    expect(r.status).toBe(200);
    expect(r.body.status).toBe('completed');
  });

  test('สถานะนอกรายการ → 400', async () => {
    const r = await request(app)
      .put('/api/requests/REQ-001')
      .set('Authorization', staffAuth)
      .send({ status: 'done' });

    expect(r.status).toBe(400);
  });

  // Regression Test — BUG #3
  // คำร้องที่ไม่มีอยู่ต้องตอบ 404 ไม่ใช่ 500
  test('คำร้องที่ไม่มีอยู่ → 404 (ไม่ใช่ 500)', async () => {
    const r = await request(app)
      .put('/api/requests/REQ-999')
      .set('Authorization', staffAuth)
      .send({ status: 'completed' });

    expect(r.status).toBe(404);
  });
});

// =====================================================
// DELETE /api/requests/:id
// CP51 — ต้องเป็นเจ้าหน้าที่ที่มี JWT ถูกต้อง
// =====================================================

describe('DELETE /api/requests/:id', () => {
  test('ลบแล้ว GET ซ้ำ → 404', async () => {
    await request(app)
      .delete('/api/requests/REQ-003')
      .set('Authorization', staffAuth)
      .expect(204);

    // GET ยังคงเป็น Public Route
    await request(app)
      .get('/api/requests/REQ-003')
      .expect(404);
  });

  test('ลบรายการที่ไม่มี → 404', async () => {
    await request(app)
      .delete('/api/requests/REQ-999')
      .set('Authorization', staffAuth)
      .expect(404);
  });
});

// =====================================================
// GET /api/health และ /api/users
// =====================================================

describe('GET /api/health และ /api/users', () => {
  test('health บอกว่าต่อฐานข้อมูลได้', async () => {
    const r = await request(app).get('/api/health');

    expect(r.status).toBe(200);
    expect(r.body.database.connected).toBe(true);
  });

  test('/api/users ใช้ฐานข้อมูลชุดเดียวกับ service', async () => {
    const r = await request(app).get('/api/users');

    // 4 ผู้แจ้ง + เจ้าหน้าที่ 1 คน
    expect(r.body).toHaveLength(5);
    expect(r.body[0]).not.toHaveProperty('email');
  });
});

// =====================================================
// เส้นทางที่ไม่มีอยู่
// =====================================================

describe('เส้นทางที่ไม่มีอยู่', () => {
  test('GET /api/nope → 404 เป็น JSON', async () => {
    const r = await request(app).get('/api/nope');

    expect(r.status).toBe(404);
    expect(r.body.error).toMatch(/ไม่พบเส้นทาง/);
  });
});

// =====================================================
// ข้อมูลผิดรูปแบบและ Endpoint ผู้ใช้
// =====================================================

describe('ข้อมูลผิดรูปแบบและ endpoint ผู้ใช้', () => {
  test('ส่ง JSON ที่เสีย → 400 เป็น JSON ไม่ใช่ 500', async () => {
    const r = await request(app)
      .post('/api/requests')
      .set('Content-Type', 'application/json')
      .send('{"requesterName": ');

    expect(r.status).toBe(400);
    expect(r.body).toHaveProperty('error');
  });

  test('GET /api/users/1/requests → คำร้องของผู้ใช้คนนั้น', async () => {
    const r = await request(app)
      .get('/api/users/1/requests');

    expect(r.status).toBe(200);
    expect(r.body.map((x) => x.id)).toEqual([
      'REQ-001',
      'REQ-004',
    ]);
  });
});
