import { readFile } from 'node:fs/promises';

const SEED_PATH = new URL('../../data/initialRequests.json', import.meta.url);

/** ข้อมูลอยู่ในหน่วยความจำของเซิร์ฟเวอร์ — หน่วย 4 จะเปลี่ยนเป็นฐานข้อมูล */
let requests = [];

/** โหลดข้อมูลตัวอย่างตอนเซิร์ฟเวอร์เริ่มทำงาน — ให้มาแล้ว ไม่ต้องแก้ */
export async function loadSeed() {
  const raw = await readFile(SEED_PATH, 'utf8');
  requests = JSON.parse(raw);
  return requests;
}

export function findAll({ status } = {}) {
  if (!status) return structuredClone(requests);

  return structuredClone(
    requests.filter((r) => r.status === status)
  );
}

/**
 * TODO W06-S2 (CP02) · คืนคำร้องใบเดียวตามรหัส
 * - ถ้าไม่พบให้คืน null (ห้าม throw — controller จะเป็นคนตัดสินว่าตอบ 404)
 */
export function findById(id) {
  const found = requests.find((r) => r.id === id);
  return found ? structuredClone(found) : null;
}

/** สร้างรหัสไม่ซ้ำ — ให้มาแล้ว ไม่ต้องแก้ */
function createId() {
  let id;
  do {
    const time = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    id = `REQ-${time}-${rand}`;
  } while (requests.some((r) => r.id === id));
  return id;
}

export function create(data) {
  const newRequest = {
    id: createId(),
    ...data,
    status: 'pending'
  };

  requests.push(newRequest);
  return structuredClone(newRequest);
}

export function updateStatus(id, status) {
  const found = requests.find((r) => r.id === id);

  if (!found) {
    return null;
  }

  found.status = status;

  return structuredClone(found);
}

export function remove(id) {
  const exists = requests.some((r) => r.id === id);

  if (!exists) {
    return false;
  }

  requests = requests.filter((r) => r.id !== id);
  return true;
}
