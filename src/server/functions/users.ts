import { createServerFn } from "@tanstack/react-start";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { getAuthSession } from "../../lib/auth";

// Middleware-like check for admin role
async function ensureAdmin() {
  const session = await getAuthSession();
  if (!session || session.role !== 'admin') {
    throw new Error("Unauthorized: Only admins can manage users");
  }
  return session;
}

export const getUsers = createServerFn({ method: "GET" }).handler(
  async () => {
    await ensureAdmin();
    const list = await db
      .select({
        id: users.id,
        username: users.username,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    return list;
  }
);

export const getUserById = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await ensureAdmin();
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, data.id))
      .limit(1);
    
    if (!result.length) throw new Error("User tidak ditemukan");
    
    // Omit password from response
    const { password: _, ...userWithoutPassword } = result[0];
    return userWithoutPassword;
  });

export const createUser = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      username: z.string().min(3, "Username minimal 3 karakter"),
      password: z.string().min(6, "Password minimal 6 karakter"),
      name: z.string().min(1, "Nama harus diisi"),
      role: z.enum(['admin', 'kaprog', 'penjaga_lab', 'orang_tu', 'wakasek', 'kepala_sekolah', 'tu_admin']),
    })
  )
  .handler(async ({ data }) => {
    await ensureAdmin();
    
    const existing = await db.select().from(users).where(eq(users.username, data.username)).limit(1);
    if (existing.length > 0) {
      throw new Error("Username sudah digunakan");
    }

    const newUser = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(users).values(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    return { success: true, data: userWithoutPassword };
  });

export const updateUser = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      username: z.string().min(3, "Username minimal 3 karakter"),
      name: z.string().min(1, "Nama harus diisi"),
      role: z.enum(['admin', 'kaprog', 'penjaga_lab', 'orang_tu', 'wakasek', 'kepala_sekolah', 'tu_admin']),
    })
  )
  .handler(async ({ data }) => {
    await ensureAdmin();
    const { id, ...updateData } = data;

    // Check if username is taken by another user
    const existing = await db.select().from(users).where(eq(users.username, data.username)).limit(2);
    if (existing.some(u => u.id !== id)) {
      throw new Error("Username sudah digunakan");
    }

    await db
      .update(users)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));

    return { success: true };
  });

export const deleteUser = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const session = await ensureAdmin();
    
    if (data.id === session.id) {
      throw new Error("Anda tidak bisa menghapus akun sendiri");
    }

    await db.delete(users).where(eq(users.id, data.id));

    return { success: true };
  });

export const resetPassword = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      newPassword: z.string().min(6, "Password minimal 6 karakter"),
    })
  )
  .handler(async ({ data }) => {
    await ensureAdmin();
    
    await db
      .update(users)
      .set({
        password: data.newPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, data.id));

    return { success: true };
  });
