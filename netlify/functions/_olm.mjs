import { getSession, setSessionCookie, json } from './_shared.mjs';
const configuredBase = (process.env.OLM_PANEL_BASE_URL || '').trim();
if (configuredBase) {
  const parsed = new URL(configuredBase);
  if (parsed.protocol !== 'https:') throw new Error('OLM_PANEL_BASE_URL must use HTTPS.');
  if (parsed.hostname !== 'olm.vn' && !parsed.hostname.endsWith('.olm.vn')) {
    throw new Error('Only the official olm.vn domain is accepted by this default adapter. Use a separately reviewed integration for other hosts.');
  }
}
export const BASE = configuredBase.replace(/\/$/, '');
function ensureConfigured() {
  if (!BASE) throw new Error('Chưa cấu hình OLM_PANEL_BASE_URL. Hãy xác minh API chính thức trước khi đăng nhập.');
}
function cookiesFrom(headers) {
  if (typeof headers.getSetCookie === 'function') return headers.getSetCookie();
  const value = headers.get('set-cookie');
  return value ? [value] : [];
}
function merge(old = {}, lines = []) {
  const cookies = { ...old };
  for (const line of lines) {
    const first = String(line).split(';')[0];
    const i = first.indexOf('=');
    if (i > 0) cookies[first.slice(0, i).trim()] = first.slice(i + 1).trim();
  }
  return cookies;
}
export const cookieHeader = cookies => Object.entries(cookies || {}).map(([k, v]) => `${k}=${v}`).join('; ');
export async function upstream(path, { method = 'GET', cookies = {}, body, headers = {} } = {}) {
  ensureConfigured();
  const h = new Headers(headers);
  const cookie = cookieHeader(cookies);
  if (cookie) h.set('cookie', cookie);
  const response = await fetch(BASE + path, { method, headers: h, body, redirect: 'manual' });
  return { response, cookies: merge(cookies, cookiesFrom(response.headers)) };
}
export function csrf(html) {
  return String(html).match(/name=["']_token["'][^>]*value=["']([^"']+)/i)?.[1]
    || String(html).match(/<meta[^>]+name=["']csrf-token["'][^>]+content=["']([^"']+)/i)?.[1] || '';
}
export async function panel(cookies) {
  const result = await upstream('/panel', { cookies });
  const html = await result.response.text();
  return { ...result, html, token: csrf(html) };
}
export function authenticated(html, response) {
  return response.ok && !/name=["']password["']/i.test(html) && (/logout|đăng xuất/i.test(html) || response.url.includes('/panel'));
}
export function auth(request) {
  const session = getSession(request);
  return session.cookies && Object.keys(session.cookies).length ? session : null;
}
export function persist(session, cookies) {
  return { 'set-cookie': setSessionCookie({ ...session, cookies, updatedAt: Date.now() }) };
}
export function fail(message, status = 502) {
  return json(status, { ok: false, success: false, error: message });
}
