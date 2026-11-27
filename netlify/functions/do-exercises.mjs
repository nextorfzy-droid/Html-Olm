import { json } from './_shared.mjs';
export default async function handler() {
  return json(403, { ok: false, success: false, error: 'Tự động điền hoặc nộp bài thay người học đã tắt.' });
}
