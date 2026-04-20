import { createServerFn } from '@tanstack/react-start';
import { db } from '../../db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { setAuthSession, clearAuthSession, getAuthSession } from '../../lib/auth';
import { z } from 'zod';

export const loginUser = createServerFn({ method: 'POST' })
  .validator(z.object({
    username: z.string(),
    password: z.string(),
  }))
  .handler(async ({ data }) => {
    const { username, password } = data;
    
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    const user = result[0];
    
    // Simple password check (Hash should be used in production)
    if (!user || user.password !== password) {
      throw new Error('Username atau password salah');
    }
    
    await setAuthSession(user.id);
    return { success: true, user: { id: user.id, username: user.username, role: user.role, name: user.name } };
  });

export const logoutUser = createServerFn({ method: 'POST' })
  .handler(async () => {
    await clearAuthSession();
    return { success: true };
  });

export const getCurrentUser = createServerFn({ method: 'GET' })
  .handler(async () => {
    const user = await getAuthSession();
    if (!user) return null;
    return { id: user.id, username: user.username, role: user.role, name: user.name };
  });
