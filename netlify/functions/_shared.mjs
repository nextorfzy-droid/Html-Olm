export function json(status, data, headers = {}) {
  const h = new Headers(headers);
  h.set('content-type', 'application/json; charset=utf-8');
  h.set('cache-control', 'no-store');
  return new Response(JSON.stringify(data), { status, headers: h });
}

export async function readBody(request) {
  const raw = await request.text();
  const type = request.headers.get('content-type') || '';
  if (type.includes('application/json')) {
    try { return JSON.parse(raw || '{}'); } catch { return {}; }
  }
  return Object.fromEntries(new URLSearchParams(raw));
}

export function getSession(request) {
  const cookie = request.headers.get('cookie') || '';
  const value = cookie.split(';').map(x => x.trim()).find(x => x.startsWith('olm_session='))?.slice('olm_session='.length);
  if (!value) return {};
  try { return JSON.parse(Buffer.from(decodeURIComponent(value), 'base64url').toString()); }
  catch { return {}; }
}

export function setSessionCookie(session, maxAge = 86400) {
  const value = encodeURIComponent(Buffer.from(JSON.stringify(session)).toString('base64url'));
  return `olm_session=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}
export const clearCookie = () => 'olm_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0';
