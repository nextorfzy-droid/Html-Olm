import { json } from './_shared.mjs';
export default async function handler() {
  return json(403, { ok: false, success: false, error: 'Truy xuất đáp án riêng tư đã tắt. Dùng tab Học tập để tự hiểu và kiểm tra bài.' });
}
