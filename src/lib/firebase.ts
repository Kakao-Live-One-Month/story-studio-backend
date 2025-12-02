import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { getFirebaseServiceAccount } from '../utils/env';

dotenv.config();
const rawServiceAccount = getFirebaseServiceAccount();
console.log('[firebase] FIREBASE_SERVICE_ACCOUNT raw:', rawServiceAccount?.slice(0, 60));

const serviceAccount = JSON.parse(rawServiceAccount || '{}');


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export default admin;