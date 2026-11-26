import { json, clearCookie } from './_shared.mjs';
import { auth, panel, authenticated, persist } from './_olm.mjs';
export default async function handler(request) {
  if (request.method !== 'GET') return json(405, { ok: false, error: 'Method not allowed' }, { allow: 'GET' });
  const session = auth(request);
  if (!session) return json(200, { ok: true, authenticated: false });
  try {
    const current = await panel(session.cookies);
    const ok = authenticated(current.html, current.response);
    return json(200, { ok: true, authenticated: ok }, ok ? persist(session, current.cookies) : { 'set-cookie': clearCookie() });
  } catch {
    return json(200, { ok: true, authenticated: false }, { 'set-cookie': clearCookie() });
  }
}
