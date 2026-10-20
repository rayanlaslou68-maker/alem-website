// Central API client. Every request goes same-origin with cookies for the
// session, and every state-changing request carries the CSRF token issued
// by the backend.
const API_BASE = '/api';

function getCsrfToken() {
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const isWrite = method !== 'GET' && method !== 'HEAD';
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include', // sends the httpOnly session cookie
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(isWrite && getCsrfToken() ? { 'X-CSRF-Token': getCsrfToken() } : {}),
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON response (e.g. a file stream) — caller handles res directly.
  }

  if (!res.ok) {
    const message = (data && data.error) || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.code = data && data.code;
    throw err;
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  del: (path) => request(path, { method: 'DELETE' })
};