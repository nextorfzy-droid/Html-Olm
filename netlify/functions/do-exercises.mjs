import { json } from './_shared.mjs';
export default async function handler() { return json(403, { ok: false, success: false, error: 'Chức năng tự động lấy đáp án hoặc nộp bài đã bị tắt. Dùng công cụ học tập để tự ôn và kiểm tra.' }); }
