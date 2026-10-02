/**
 * Data client. Content is loaded in this order:
 *   1. Firestore (when VITE_FIREBASE_* env vars are set)
 *   2. Node API at VITE_API_URL (or /api via the Vite dev proxy)
 *   3. The bundled copy of data/portfolio.json, so the site always renders
 *
 * Contact messages go to Firestore first, then to the Node API.
 */
import fallbackData from '@data/portfolio.json';

const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const TIMEOUT_MS = 8000;
export const firebaseEnabled = Boolean(import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID);

const withTimeout = (promise, ms = TIMEOUT_MS) =>
  Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms))]);

async function request(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}/api${path}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...options,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(json.message || `Request failed (${res.status})`);
      err.status = res.status;
      err.errors = json.errors;
      throw err;
    }
    return json;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchPortfolio() {
  if (firebaseEnabled) {
    try {
      const { loadPortfolioFromFirestore } = await import('./firebase');
      const data = await withTimeout(loadPortfolioFromFirestore());
      return { data, source: 'firebase' };
    } catch (err) {
      console.warn('[portfolio] Firestore unavailable, trying the API.', err?.code || err?.message);
    }
  }
  try {
    const json = await request('/portfolio');
    return { data: json.data, source: 'api' };
  } catch (err) {
    console.warn('[portfolio] API unavailable, using bundled JSON fallback.', err?.message);
    return { data: fallbackData, source: 'fallback' };
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Same rules as the server and firestore.rules, so the user sees field errors before sending. */
function validateContact({ name = '', email = '', subject = '', message = '' }) {
  const errors = {};
  if (name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL_RE.test(email.trim())) errors.email = 'Please enter a valid email address.';
  if (message.trim().length < 10) errors.message = 'Message should be at least 10 characters.';
  if (message.trim().length > 5000) errors.message = 'Message is too long (max 5000 characters).';
  return {
    errors,
    clean: { name: name.trim().slice(0, 100), email: email.trim(), subject: subject.trim().slice(0, 200), message: message.trim() },
  };
}

export async function sendContact(payload) {
  const { errors, clean } = validateContact(payload);
  if (Object.keys(errors).length) {
    const err = new Error('Validation failed');
    err.errors = errors;
    throw err;
  }
  if (firebaseEnabled) {
    try {
      const { addContactMessage } = await import('./firebase');
      const id = await withTimeout(addContactMessage(clean));
      return { success: true, id, message: 'Thanks! Your message has been received.' };
    } catch (err) {
      console.warn('[contact] Firestore write failed, trying the API.', err?.code || err?.message);
    }
  }
  return request('/contact', { method: 'POST', body: JSON.stringify(clean) });
}
