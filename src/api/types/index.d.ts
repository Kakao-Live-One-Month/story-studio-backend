// src/types/index.d.ts
import { UserRecord } from 'firebase-admin/auth';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: UserRecord;
    }
  }
}