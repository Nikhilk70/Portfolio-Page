/**
 * Data access layer for the API.
 *
 * DATA_SOURCE=firebase (default when Firebase env vars are set): content is read from Firestore.
 * DATA_SOURCE=json: content is read from /data/portfolio.json.
 * If Firestore fails (rules, network, not seeded) the JSON file is used so the API keeps working.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isFirebaseConfigured, loadPortfolioFromFirestore, addMessageToFirestore } from './firestore.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.resolve(__dirname, '../../../data/portfolio.json');
const MESSAGES_FILE = path.resolve(__dirname, '../../data/messages.json');

const useFirebase = () => (process.env.DATA_SOURCE || 'firebase') === 'firebase' && isFirebaseConfigured();

let cache = null;
let cacheTime = 0;
let lastSource = null;
const CACHE_TTL_MS = 30_000;

async function loadJson() {
  return JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
}

export async function loadPortfolio() {
  const now = Date.now();
  if (cache && now - cacheTime < CACHE_TTL_MS) return cache;

  let data;
  if (useFirebase()) {
    try {
      data = await loadPortfolioFromFirestore();
      if (lastSource !== 'firebase') console.log('✔ Content source: Firestore');
      lastSource = 'firebase';
    } catch (err) {
      if (lastSource !== 'json-fallback') console.warn(`⚠ Firestore read failed (${err.code || err.message}). Falling back to data/portfolio.json.`);
      lastSource = 'json-fallback';
    }
  }
  if (!data) {
    data = await loadJson();
    if (!lastSource) lastSource = 'json';
  }

  cache = data;
  cacheTime = now;
  return cache;
}

export const getDataSource = () => lastSource;

export async function getSection(key) {
  const data = await loadPortfolio();
  return data[key];
}

export async function getProjects({ featured } = {}) {
  const projects = (await getSection('projects')) ?? [];
  if (featured === undefined) return projects;
  return projects.filter((p) => Boolean(p.featured) === featured);
}

export async function getProjectBySlug(slug) {
  const projects = (await getSection('projects')) ?? [];
  return projects.find((p) => p.slug === slug) ?? null;
}

export async function saveMessage(message) {
  if (useFirebase()) {
    try {
      return await addMessageToFirestore(message);
    } catch (err) {
      console.warn(`⚠ Firestore message save failed (${err.code || err.message}). Saving locally instead.`);
    }
  }
  let messages = [];
  try {
    messages = JSON.parse(await fs.readFile(MESSAGES_FILE, 'utf8'));
  } catch {
    messages = [];
  }
  const entry = { id: `msg_${Date.now()}`, receivedAt: new Date().toISOString(), ...message };
  messages.push(entry);
  await fs.mkdir(path.dirname(MESSAGES_FILE), { recursive: true });
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf8');
  return entry;
}
