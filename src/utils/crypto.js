// Web Crypto API helpers for AES-256-GCM encryption and PBKDF2 key derivation

// Helper: Convert ArrayBuffer to Base64 string
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Helper: Convert Base64 string to ArrayBuffer
function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Derive a 256-bit AES-GCM key from a user password and random salt using PBKDF2
async function getEncryptionKey(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt plain text using AES-256-GCM and PBKDF2.
 * @param {string} plainText 
 * @param {string} password 
 * @returns {Promise<{cipherText: string, salt: string, iv: string}>}
 */
export async function encryptText(plainText, password) {
  const enc = new TextEncoder();
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const key = await getEncryptionKey(password, salt);
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    enc.encode(plainText)
  );

  return {
    cipherText: arrayBufferToBase64(encryptedBuffer),
    salt: arrayBufferToBase64(salt.buffer),
    iv: arrayBufferToBase64(iv.buffer)
  };
}

/**
 * Decrypt cipher text using AES-256-GCM and PBKDF2.
 * @param {string} cipherTextBase64 
 * @param {string} saltBase64 
 * @param {string} ivBase64 
 * @param {string} password 
 * @returns {Promise<string>}
 */
export async function decryptText(cipherTextBase64, saltBase64, ivBase64, password) {
  const dec = new TextDecoder();
  const salt = base64ToArrayBuffer(saltBase64);
  const iv = base64ToArrayBuffer(ivBase64);
  const cipherBuffer = base64ToArrayBuffer(cipherTextBase64);

  const key = await getEncryptionKey(password, salt);

  try {
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      cipherBuffer
    );
    return dec.decode(decryptedBuffer);
  } catch (err) {
    throw new Error('Password salah atau data catatan rusak!');
  }
}

/**
 * Hash a secret (password / security answer) with PBKDF2-SHA256 and a random salt.
 * Only the hash and salt are stored — never the secret itself.
 * @param {string} secret
 * @returns {Promise<{hash: string, salt: string}>}
 */
export async function hashSecret(secret) {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const hash = await deriveHash(secret, salt);
  return { hash, salt: arrayBufferToBase64(salt.buffer) };
}

/**
 * Check a secret against a hash produced by hashSecret.
 * @param {string} secret
 * @param {string} hashBase64
 * @param {string} saltBase64
 * @returns {Promise<boolean>}
 */
export async function verifySecret(secret, hashBase64, saltBase64) {
  const hash = await deriveHash(secret, base64ToArrayBuffer(saltBase64));
  if (hash.length !== hashBase64.length) return false;
  let diff = 0;
  for (let i = 0; i < hash.length; i++) {
    diff |= hash.charCodeAt(i) ^ hashBase64.charCodeAt(i);
  }
  return diff === 0;
}

async function deriveHash(secret, salt) {
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const bits = await window.crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return arrayBufferToBase64(bits);
}
