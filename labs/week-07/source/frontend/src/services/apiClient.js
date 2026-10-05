const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
const DEMO_STORAGE_KEY = 'engse203-week07-pages-demo';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function parseError(response) {
  try {
    const body = await response.json();
    return body.error ?? `คำขอไม่สำเร็จ (${response.status})`;
  } catch {
    return `คำขอไม่สำเร็จ (${response.status})`;
  }
}

async function loadDemoRequests() {
  const stored = localStorage.getItem(DEMO_STORAGE_KEY);

  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem(DEMO_STORAGE_KEY);
    }
  }

  const baseUrl = import.meta.env.BASE_URL || './';
  const response = await fetch(`${baseUrl}data/initialRequests.json`);

  if (!response.ok) {
    throw new ApiError('ไม่สามารถโหลดข้อมูลตัวอย่างได้', response.status);
  }

  const requests = await response.json();
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(requests));

  return requests;
}

function saveDemoRequests(requests) {
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(requests));
}

async function demoApiFetch(path, options = {}) {
  let requests = await loadDemoRequests();

  const method = (options.method || 'GET').toUpperCase();

  const url = new URL(path, 'https://demo.local');
  const pathname = url.pathname;
  const statusFilter = url.searchParams.get('status');

  if (pathname === '/api/requests' && method === 'GET') {
    if (statusFilter) {
      return structuredClone(
        requests.filter((request) => request.status === statusFilter)
      );
    }

    return structuredClone(requests);
  }

  if (pathname === '/api/requests' && method === 'POST') {
    const input = JSON.parse(options.body || '{}');

    const newRequest = {
      ...input,
      id: `REQ-${Date.now()}`,
      status: 'pending',
    };

    requests = [...requests, newRequest];
    saveDemoRequests(requests);

    return structuredClone(newRequest);
  }

  const match = pathname.match(/^\/api\/requests\/([^/]+)$/);

  if (match) {
    const requestId = decodeURIComponent(match[1]);
    const index = requests.findIndex((request) => request.id === requestId);

    if (method === 'GET') {
      if (index === -1) {
        throw new ApiError('ไม่พบคำร้องที่ต้องการ', 404);
      }

      return structuredClone(requests[index]);
    }

    if (method === 'PUT') {
      if (index === -1) {
        throw new ApiError('ไม่พบคำร้องที่ต้องการ', 404);
      }

      const input = JSON.parse(options.body || '{}');

      requests[index] = {
        ...requests[index],
        ...input,
      };

      saveDemoRequests(requests);

      return structuredClone(requests[index]);
    }

    if (method === 'DELETE') {
      if (index === -1) {
        throw new ApiError('ไม่พบคำร้องที่ต้องการ', 404);
      }

      requests = requests.filter((request) => request.id !== requestId);
      saveDemoRequests(requests);

      return null;
    }
  }

  throw new ApiError('Demo API ไม่รองรับคำขอนี้', 404);
}

export async function apiFetch(path, options = {}) {
  if (DEMO_MODE) {
    return demoApiFetch(path, options);
  }

  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(
      'ไม่สามารถเชื่อมต่อ API ได้ กรุณาตรวจสอบว่าเปิด API Server แล้ว',
      0
    );
  }

  if (!response.ok) {
    throw new ApiError(await parseError(response), response.status);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}