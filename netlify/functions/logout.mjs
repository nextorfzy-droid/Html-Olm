import { json, clearCookie } from './_shared.mjs';
import { auth, panel, upstream } from './_olm.mjs';
export default async function handler(request) {
  if (request.method !== 'POST') return json(405, { ok: false, loggedOut: false, error: 'Method not allowed' }, { allow: 'POST' });
  const session = auth(request);
  if (session) {
    try {
      const current = await panel(session.cookies);
      const body = new URLSearchParams(current.token ? { _token: current.token } : {});
      await upstream('/logout', { method: 'POST', cookies: current.cookies, body, headers: { 'content-type': 'application/x-www-form-urlencoded' } });
    } catch { /* Clear local session even if upstream logout is unavailable. */ }
  }
  return json(200, { ok: true, loggedOut: true }, { 'set-cookie': clearCookie() });
}
