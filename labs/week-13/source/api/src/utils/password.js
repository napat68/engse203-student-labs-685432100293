/**
 * password.js — เก็บรหัสผ่านอย่างปลอดภัยด้วย scrypt (มากับ Node ใน node:crypto)
 *
 * 🏫 TODO W13-HASH (CP49) — ทำให้ tests/unit/password.test.js ผ่านทุกข้อ
 *
 *   รูปแบบที่ต้องเก็บ:  scrypt$<salt>$<hash>
 *     salt = randomBytes(16) แปลงเป็น hex  (32 ตัวอักษร)
 *     hash = scryptSync(รหัสผ่าน, salt, 64) แปลงเป็น hex  (128 ตัวอักษร)
 *
 *   ⚠ รูปแบบต้องตรงเป๊ะ — schema.sql มี hash ของบัญชีเจ้าหน้าที่ (รหัสผ่าน staff1234)
 *     ที่สร้างด้วยรูปแบบนี้ ถ้าเขียนต่างไป จะเข้าสู่ระบบด้วยบัญชีนี้ไม่ได้
 */
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const KEY_LENGTH = 64;

export function hashPassword(plain) {
  // สุ่ม salt 16 bytes แล้วแปลงเป็น Hex 32 ตัวอักษร
  const salt = randomBytes(16).toString('hex');

  // สร้าง Hash ขนาด 64 bytes แล้วแปลงเป็น Hex 128 ตัวอักษร
  const hash = scryptSync(plain, salt, KEY_LENGTH).toString('hex');

  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(plain, stored) {
  // ข้อมูลที่ไม่ใช่ String ถือว่าไม่ถูกต้อง
  if (typeof plain !== 'string' || typeof stored !== 'string') {
    return false;
  }

  const parts = stored.split('$');

  // ต้องมี 3 ส่วน: scrypt, salt, hash
  if (parts.length !== 3 || parts[0] !== 'scrypt') {
    return false;
  }

  const [, salt, hashHex] = parts;

  // ตรวจรูปแบบ Salt และ Hash ก่อนนำไปใช้งาน
  if (!/^[0-9a-f]{32}$/.test(salt)) {
    return false;
  }

  if (!/^[0-9a-f]{128}$/.test(hashHex)) {
    return false;
  }

  try {
    const storedHash = Buffer.from(hashHex, 'hex');
    const inputHash = scryptSync(plain, salt, storedHash.length);

    // เปรียบเทียบโดยลดความเสี่ยงจาก Timing Attack
    return timingSafeEqual(inputHash, storedHash);
  } catch {
    // Hash ผิดรูปแบบหรือเกิดข้อผิดพลาด ต้องไม่ทำให้ระบบพัง
    return false;
  }
}
