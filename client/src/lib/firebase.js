/**
 * Firestore access for the browser. Loaded lazily from api.js so the Firebase SDK
 * does not block the first paint.
 *
 * Layout (same as server/src/services/firestore.js and the seed script):
 *   site/profile, site/{socials|stats|marquee|heroCards} = { items: [...] }
 *   skills | services | experience | projects | education | certificates  (ordered by `order`)
 *   messages  (contact form, create-only)
 */
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const env = import.meta.env;
const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

const LIST_COLLECTIONS = ['skills', 'services', 'experience', 'projects', 'education', 'certificates'];

let db;
function getDb() {
  if (!db) db = getFirestore(getApps()[0] ?? initializeApp(config));
  return db;
}

export async function loadPortfolioFromFirestore() {
  const database = getDb();
  const [siteSnap, ...listSnaps] = await Promise.all([
    getDocs(collection(database, 'site')),
    ...LIST_COLLECTIONS.map((c) => getDocs(collection(database, c))),
  ]);
  if (siteSnap.empty) throw new Error('Firestore is not seeded yet');

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

export async function addContactMessage({ name, email, subject, message }) {
  const ref = await addDoc(collection(getDb(), 'messages'), {
    name,
    email,
    subject,
    message,
    source: 'web',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}
