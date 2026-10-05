import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(HERE, '../..', 'data', 'campus.db');

let db;

export async function loadSeed() {
  db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA foreign_keys = ON');
}

const SELECT_SHAPE = `
  SELECT
    r.id,
    u.name AS requesterName,
    r.request_type AS requestType,
    r.location,
    r.details,
    r.priority,
    r.status
  FROM requests r
  JOIN users u ON r.requester_id = u.id
`;

export function findAll({ status } = {}) {
  if (status) {
    return db
      .prepare(`${SELECT_SHAPE} WHERE r.status = ? ORDER BY r.id`)
      .all(status);
  }

  return db
    .prepare(`${SELECT_SHAPE} ORDER BY r.id`)
    .all();
}

export function findById(id) {
  return db
    .prepare(`${SELECT_SHAPE} WHERE r.id = ?`)
    .get(id) ?? null;
}

function resolveUserId(name) {
  const found = db
    .prepare('SELECT id FROM users WHERE name = ?')
    .get(name);

  if (found) return found.id;

  const slug = Date.now().toString(36);

  return db
    .prepare(
      'INSERT INTO users (name, department, email) VALUES (?, ?, ?)'
    )
    .run(
      name,
      'ไม่ระบุ',
      `user-${slug}@rmutl.ac.th`
    ).lastInsertRowid;
}

function nextId() {
  const row = db
    .prepare(
      "SELECT id FROM requests WHERE id LIKE 'REQ-%' ORDER BY id DESC LIMIT 1"
    )
    .get();

  const n = row
    ? Number(String(row.id).replace('REQ-', '')) + 1
    : 1;

  return `REQ-${String(n).padStart(3, '0')}`;
}

export function create(input) {
  const id = nextId();

  db.prepare(
    `INSERT INTO requests
      (id, requester_id, request_type, location, details, priority)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    resolveUserId(input.requesterName.trim()),
    input.requestType,
    input.location.trim(),
    input.details.trim(),
    input.priority ?? 'normal'
  );

  return findById(id);
}

export function updateStatus(id, status) {
  const result = db
    .prepare('UPDATE requests SET status = ? WHERE id = ?')
    .run(status, id);

  if (result.changes === 0) {
    return null;
  }

  return findById(id);
}

export function remove(id) {
  const result = db
    .prepare('DELETE FROM requests WHERE id = ?')
    .run(id);

  return result.changes > 0;
}
