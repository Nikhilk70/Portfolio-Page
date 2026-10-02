/**
 * Pushes data/portfolio.json into Firestore.
 *
 *   npm run seed:firebase                 (from the repo root)
 *   npm run seed --prefix server          (same thing)
 *
 * Safe to re-run: documents are overwritten, and list items you removed from the JSON are deleted
 * from Firestore. Contact messages are never touched.
 *
 * Firestore must allow writes while this runs: paste firestore.seed.rules into the console first,
 * then switch back to firestore.rules afterwards.
 */
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import { getDb, isFirebaseConfigured, SITE_DOCS, LIST_COLLECTIONS } from '../src/services/firestore.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.resolve(__dirname, '../../data/portfolio.json');

if (!isFirebaseConfigured()) {
  console.error('✖ Firebase env vars missing. Copy server/.env.example to server/.env and fill it in.');
  process.exit(1);
}

async function seed() {
  const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
  const db = getDb();
  const batch = writeBatch(db);
  let writes = 0;
  let deletes = 0;

  for (const key of SITE_DOCS) {
    if (data[key] === undefined) continue;
    batch.set(doc(db, 'site', key), key === 'profile' ? data[key] : { items: data[key] });
    writes++;
  }

  for (const name of LIST_COLLECTIONS) {
    const items = data[name] ?? [];
    const ids = new Set();
    items.forEach((item, order) => {
      const id = String(item.id ?? item.slug ?? order);
      ids.add(id);
      batch.set(doc(db, name, id), { ...item, order });
      writes++;
    });
    // remove items that were deleted from the JSON
    const existing = await getDocs(collection(db, name));
    existing.forEach((d) => {
      if (!ids.has(d.id)) {
        batch.delete(d.ref);
        deletes++;
      }
    });
  }

  await batch.commit();
  return { writes, deletes };
}

try {
  const { writes, deletes } = await seed();
  console.log(`✔ Seeded Firestore project "${process.env.FIREBASE_PROJECT_ID}": ${writes} documents written, ${deletes} removed.`);
  console.log('  Now switch the console rules back to firestore.rules.');
  process.exit(0);
} catch (err) {
  console.error('✖ Seeding failed:', err.code || '', '-', err.message);
  if (err.code === 'permission-denied') {
    console.error('  Firestore rules are blocking access. Paste firestore.seed.rules into');
    console.error('  Firebase console > Firestore Database > Rules > Publish, then run this again.');
  } else if (err.code === 'not-found' || /does not exist/i.test(err.message)) {
    console.error('  Create the database first: Firebase console > Build > Firestore Database > Create database.');
  }
  process.exit(1);
}
