// Kunci aplikasi: hanya hash password & jawaban keamanan yang disimpan di settings.appLock
import { hashSecret, verifySecret } from './crypto';

export const MIN_PASSWORD_LENGTH = 4;

// "Jakarta " dan "jakarta" dianggap jawaban yang sama
const normalizeAnswer = (answer) => answer.trim().toLowerCase().replace(/\s+/g, ' ');

export async function createAppLock({ password, question, answer }) {
  const pw = await hashSecret(password);
  const ans = await hashSecret(normalizeAnswer(answer));
  return {
    passwordHash: pw.hash,
    passwordSalt: pw.salt,
    question: question.trim(),
    answerHash: ans.hash,
    answerSalt: ans.salt
  };
}

export async function withNewPassword(lock, password) {
  const pw = await hashSecret(password);
  return { ...lock, passwordHash: pw.hash, passwordSalt: pw.salt };
}

export const verifyPassword = (lock, password) =>
  verifySecret(password, lock.passwordHash, lock.passwordSalt);

export const verifyAnswer = (lock, answer) =>
  verifySecret(normalizeAnswer(answer), lock.answerHash, lock.answerSalt);

// Mengembalikan pesan error, atau null jika valid
export function validateNewPassword(password, confirm) {
  if (password.length < MIN_PASSWORD_LENGTH) return `Password minimal ${MIN_PASSWORD_LENGTH} karakter.`;
  if (password !== confirm) return 'Konfirmasi password tidak sama.';
  return null;
}
