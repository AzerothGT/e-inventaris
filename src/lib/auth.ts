import { getCookie, setCookie, deleteCookie } from '@tanstack/react-start/server';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

const SESSION_COOKIE_NAME = 'e-inventaris-session';

export async function getAuthSession() {
  const sessionId = getCookie(SESSION_COOKIE_NAME);
  if (!sessionId) return null;
  
  try {
    const result = await db.select().from(users).where(eq(users.id, sessionId)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("Session fetch error:", error);
    return null;
  }
}

export async function setAuthSession(userId: string) {
  setCookie(SESSION_COOKIE_NAME, userId, {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
}

export async function clearAuthSession() {
  deleteCookie(SESSION_COOKIE_NAME, { path: '/' });
}
