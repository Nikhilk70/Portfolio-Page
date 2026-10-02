/**
 * Firestore layout (shared by the seed script, the API server and the React client):
 *
 *   site/{profile}                     -> the profile object
 *   site/{socials|stats|marquee|heroCards} -> { items: [...] }
 *   skills | services | experience | projects | education | certificates
 *                                      -> one document per item, id = item.id, plus an `order` field
 *   messages                           -> contact form submissions (create-only from the web)
 */
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

export const SITE_DOCS = ['profile', 'socials', 'stats', 'marquee', 'heroCards'];
export const LIST_COLLECTIONS = ['skills', 'services', 'experience', 'projects', 'education', 'certificates'];

export function firebaseConfigFromEnv(env = process.env) {
  return {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
    appId: env.FIREBASE_APP_ID,
  };
}

export const isFirebaseConfigured = (env = process.env) => Boolean(env.FIREBASE_API_KEY && env.FIREBASE_PROJECT_ID);

let db;
export function getDb() {
  if (!db) {
    const app = getApps()[0] ?? initializeApp(firebaseConfigFromEnv());
    db = getFirestore(app);
  }
  return db;
}

/** Rebuilds the same object shape as data/portfolio.json from Firestore. */
export async function loadPortfolioFromFirestore() {
  const database = getDb();
  const [siteSnap, ...listSnaps] = await Promise.all([
    getDocs(collection(database, 'site')),
    ...LIST_COLLECTIONS.map((c) => getDocs(collection(database, c))),
  ]);
  if (siteSnap.empty) throw new Error('Firestore has no "site" documents yet. Run: npm run seed --prefix server');

  const data = {};
  siteSnap.forEach((d) => {
    const v = d.data();
    data[d.id] = d.id === 'profile' ? v : v.items ?? [];
  });
  LIST_COLLECTIONS.forEach((name, i) => {
    data[name] = listSnaps[i].docs
      .map((d) => d.data())
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(({ order, ...rest }) => rest);
  });
  return data;
}

export async function addMessageToFirestore(message) {
  const ref = await addDoc(collection(getDb(), 'messages'), { ...message, source: 'api', createdAt: serverTimestamp() });
  return { id: ref.id, ...message };
}
