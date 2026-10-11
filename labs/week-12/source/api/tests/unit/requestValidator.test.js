import { describe, test, expect } from 'vitest';
import { validateRequestInput, isValidStatus } from '../../src/validators/requestValidator.js';

/**
 * Unit test — ทดสอบ pure function โดยตรง ไม่ต้องเปิด server ไม่ต้องมีฐานข้อมูล
 * กรณีทดสอบมาจากตาราง TEST_CASES.md (CP44)
 *
 * รัน:  npm test            (ครั้งเดียว)
 *       npm run test:watch  (รันใหม่ทุกครั้งที่บันทึกไฟล์)
 */

// ข้อมูลที่ถูกต้องทุกช่อง — แต่ละ test เปลี่ยนทีละช่องเพื่อให้รู้ว่าพังเพราะอะไร
const valid = {
  requesterName: 'สมชาย ใจดี',
  requestType: 'แจ้งซ่อม',
  location: 'ห้อง 301',
  details: 'แอร์ไม่เย็นตั้งแต่เช้า',
  priority: 'normal',
};
const withField = (patch) => ({ ...valid, ...patch });

describe('validateRequestInput — ข้อมูลถูกต้อง', () => {
  test('ทุกช่องถูกต้อง → ไม่มี error', () => {
    expect(validateRequestInput(valid)).toEqual([]);
  });
});

describe('validateRequestInput — รายละเอียด (ค่าขอบ 10 ตัวอักษร)', () => {
  test('9 ตัวอักษร → error (ต่ำกว่าขอบ 1)', () => {
    expect(validateRequestInput(withField({ details: '123456789' }))).toHaveLength(1);
  });

  test('10 ตัวอักษร → ผ่าน (ตรงขอบพอดี)', () => {
    expect(validateRequestInput(withField({ details: '1234567890' }))).toEqual([]);
  });

});

// TC-04: รายละเอียด 11 ตัวอักษร
test('11 ตัวอักษร → ผ่าน', () => {
  expect(validateRequestInput(withField({
    details: '12345678901'
  }))).toEqual([]);
});

// TC-05 และ TC-06: ค่าขอบชื่อผู้แจ้ง
describe('validateRequestInput — ชื่อผู้แจ้ง', () => {
  test('ชื่อ 1 ตัวอักษร → error', () => {
    expect(validateRequestInput(withField({
      requesterName: 'ก'
    }))).toHaveLength(1);
  });

  test('ชื่อ 2 ตัวอักษร → ผ่าน', () => {
    expect(validateRequestInput(withField({
      requesterName: 'กข'
    }))).toEqual([]);
  });
});

// TC-07: ความเร่งด่วนผิดรายการ
test('priority high → error', () => {
  expect(validateRequestInput(withField({
    priority: 'high'
  }))).toContain('ความเร่งด่วนต้องเป็น normal หรือ urgent');
});

// TC-08: ข้อมูลผิดรูปแบบ
test.each([null, undefined, 'text', 42, []])(
  'input = %j → error',
  (input) => {
    expect(validateRequestInput(input)).toEqual([
      'ต้องส่งข้อมูลคำร้องมาด้วย'
    ]);
  }
);

describe('isValidStatus', () => {
  test('"pending" → true', () => {
    expect(isValidStatus('pending')).toBe(true);
  });
});
