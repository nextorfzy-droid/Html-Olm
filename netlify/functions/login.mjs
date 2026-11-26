import { json, readBody, clearCookie } from './_shared.mjs';
import { upstream, csrf, panel, authenticated, persist } from './_olm.mjs';
export default async function handler(request) {
  if (request.method !== 'POST') return json(405, { ok: false, error: 'Method not allowed' }, { allow: 'POST' });
  const { username, password } = await readBody(request);
  if (!username || !password) return json(400, { ok: false, error: 'Vui lòng nhập tài khoản và mật khẩu.' });
  try {
    const first = await upstream('/login');
    const html = await first.response.text();
    const token = csrf(html);
    if (!token) return json(502, { ok: false, error: 'Không lấy được CSRF token từ máy chủ OLM.' });
    const form = new URLSearchParams({ _token: token, username: String(username), password: String(password) });
    const post = await upstream('/login', { method: 'POST', cookies: first.cookies, body: form, headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'text/html' } });
    const check = await panel(post.cookies);
    if (!authenticated(check.html, check.response)) {
      return new Response(null, { status: 303, headers: { location: '/?error=login', 'set-cookie': clearCookie() } });
    }
    return new Response(null, { status: 303, headers: { location: '/dashboard.html', ...persist({}, check.cookies) } });
  } catch (error) {
    return json(502, { ok: false, error: 'Không kết nối được máy chủ OLM: ' + (error?.message || String(error)) });
  }
}
