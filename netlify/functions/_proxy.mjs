import { json, readBody } from './_shared.mjs';
import { auth, panel, upstream, persist } from './_olm.mjs';
export async function handle(request, path) {
  if (request.method !== 'POST') return json(405, { ok: false, error: 'Method not allowed' }, { allow: 'POST' });
  const session = auth(request);
  if (!session) return json(401, { ok: false, error: 'Phiên đăng nhập hết hạn. Hãy đăng nhập lại.' });
  try {
    const current = await panel(session.cookies);
    if (!current.response.ok || !current.token) return json(401, { ok: false, error: 'Phiên OLM hết hạn hoặc thiếu CSRF. Hãy đăng nhập lại.' });
    const payload = await readBody(request);
    const result = await upstream(path, {
      method: 'POST', cookies: current.cookies, body: JSON.stringify(payload),
      headers: { 'content-type': 'application/json', accept: 'application/json', 'x-csrf-token': current.token }
    });
    const raw = await result.response.text();
    let data;
    try { data = JSON.parse(raw); }
    catch { data = { success: result.response.ok, message: raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 900) }; }
    const response = json(result.response.status, { ...data, success: data.success ?? result.response.ok }, persist(session, result.cookies));
    return response;
  } catch (error) {
    return json(502, { ok: false, success: false, error: 'Lỗi kết nối OLM: ' + (error?.message || String(error)) });
  }
}
