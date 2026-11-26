import { json, clearCookie } from './_shared.mjs';
import { auth, panel, upstream } from './_olm.mjs';
export default async function handler(request) {
  if (request.method !== 'POST') return json(405, { ok: false, error: 'Method not allowed' }, { allow: 'POST' });
  const session = auth(request);
  if (session) {
    try {
      const current = await panel(session.cookies);
      const body = new URLSearchParams(current.token ? { _token: current.token } : {});
      await upstream('/logout', { method: 'POST', cookies: current.cookies, body, headers: { 'content-type': 'application/x-www-form-urlencoded' } });
    } catch { /* Always clear the local session. */ }
  }
  return new Response(null, { status: 303, headers: { location: '/', 'set-cookie': clearCookie() } });
}
