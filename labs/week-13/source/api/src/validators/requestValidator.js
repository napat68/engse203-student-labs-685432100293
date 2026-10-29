/**
 * requestValidator.js — กฎตรวจข้อมูลคำร้อง เป็น "pure function"
 *
 * TODO W13-VALID (CP48)
 * 1. ตรวจชนิดข้อมูล requesterName, location, details
 * 2. ตรวจความยาวสูงสุด 100, 100, 1000 ตัวอักษร
 * 3. ทดสอบค่าขอบด้วย Unit Test
 */

export const REQUEST_TYPES = [
  'แจ้งซ่อม',
  'บริการบัญชีผู้ใช้',
  'ขอใช้อุปกรณ์',
  'อื่น ๆ',
];

export const PRIORITIES = ['normal', 'urgent'];
export const STATUSES = ['pending', 'in-progress', 'completed'];

export const MIN_NAME = 2;
export const MIN_DETAILS = 10;

export const MAX_NAME = 100;
export const MAX_LOCATION = 100;
export const MAX_DETAILS = 1000;

// CP48 — ตรวจสอบข้อมูลคำร้อง
export function validateRequestInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return ['ต้องส่งข้อมูลคำร้องมาด้วย'];
  }

  const errors = [];

  // ตรวจสอบชื่อผู้แจ้ง
  if (typeof input.requesterName !== 'string') {
    errors.push('ชื่อผู้แจ้งต้องเป็นข้อความ');
  } else {
    const name = input.requesterName.trim();

    if (name.length < MIN_NAME) {
      errors.push(`ชื่อผู้แจ้งต้องมีอย่างน้อย ${MIN_NAME} ตัวอักษร`);
    } else if (name.length > MAX_NAME) {
      errors.push(`ชื่อผู้แจ้งต้องไม่เกิน ${MAX_NAME} ตัวอักษร`);
    }
  }

  // ตรวจสอบประเภทคำร้อง
  if (!REQUEST_TYPES.includes(input.requestType)) {
    errors.push('ประเภทคำร้องไม่ถูกต้อง');
  }

  // ตรวจสอบสถานที่
  if (typeof input.location !== 'string') {
    errors.push('สถานที่ต้องเป็นข้อความ');
  } else {
    const location = input.location.trim();

    if (!location) {
      errors.push('กรุณาระบุสถานที่');
    } else if (location.length > MAX_LOCATION) {
      errors.push(`สถานที่ต้องไม่เกิน ${MAX_LOCATION} ตัวอักษร`);
    }
  }

  // ตรวจสอบรายละเอียด
  if (typeof input.details !== 'string') {
    errors.push('รายละเอียดต้องเป็นข้อความ');
  } else {
    const details = input.details.trim();

    if (details.length < MIN_DETAILS) {
      errors.push(`รายละเอียดต้องมีอย่างน้อย ${MIN_DETAILS} ตัวอักษร`);
    } else if (details.length > MAX_DETAILS) {
      errors.push(`รายละเอียดต้องไม่เกิน ${MAX_DETAILS} ตัวอักษร`);
    }
  }

  // ตรวจสอบความเร่งด่วน
  if (!PRIORITIES.includes(input.priority)) {
    errors.push('ความเร่งด่วนต้องเป็น normal หรือ urgent');
  }

  return errors;
}

// ตรวจสอบสถานะคำร้อง
export function isValidStatus(status) {
  return STATUSES.includes(status);
}

// ตรวจสอบข้อมูลเข้าสู่ระบบ
export function validateLoginInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return ['ต้องส่งอีเมลและรหัสผ่าน'];
  }

  const errors = [];

  if (
    typeof input.email !== 'string' ||
    !input.email.includes('@') ||
    input.email.length > 254
  ) {
    errors.push('รูปแบบอีเมลไม่ถูกต้อง');
  }

  if (
    typeof input.password !== 'string' ||
    input.password.length === 0 ||
    input.password.length > 200
  ) {
    errors.push('กรุณาระบุรหัสผ่าน');
  }

  return errors;
}