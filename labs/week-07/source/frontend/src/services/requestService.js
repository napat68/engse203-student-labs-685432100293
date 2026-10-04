import { apiFetch, ApiError } from './apiClient.js';

/**
 * Week 07 — เปลี่ยนจากอ่าน localStorage เป็นเรียก API จริง
 *
 * ⚠ กฎสำคัญ: signature ของทุกฟังก์ชันต้องเหมือนเดิมทุกตัว
 *   → DashboardPage, RequestDetailPage, NewRequestPage จะได้ไม่ต้องแก้เลย
 *   นี่คือประโยชน์ของ Service Layer ที่สร้างไว้ตั้งแต่ Week 05
 */

export { ApiError };

export async function getRequests(options = {}) {
  if (options.scenario === 'error') {
    throw new Error('เกิดข้อผิดพลาดจำลอง');
  }

  if (options.scenario === 'empty') {
    return [];
  }

  let path = '/api/requests';

  if (options.status) {
    path += `?status=${encodeURIComponent(options.status)}`;
  }

  return apiFetch(path);
}

export async function getRequestById(requestId) {
  try {
    return await apiFetch(`/api/requests/${encodeURIComponent(requestId)}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function addRequest(requestInput) {
  return apiFetch('/api/requests', {
    method: 'POST',
    body: JSON.stringify(requestInput),
  });
}

export async function updateRequestStatus(requestId, status) {
  return apiFetch(`/api/requests/${encodeURIComponent(requestId)}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export async function deleteRequest(requestId) {
  await apiFetch(`/api/requests/${encodeURIComponent(requestId)}`, {
    method: 'DELETE',
  });

  return getRequests();
}

/** Week 07 ยังไม่มี endpoint reset — โหลดรายการปัจจุบันกลับมาแทน */
export async function resetRequests() {
  return getRequests();
}
