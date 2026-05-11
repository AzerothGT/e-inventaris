import { createServerFn } from '@tanstack/react-start';
import { db } from '../../db';
import { ruangan } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const getRuanganList = createServerFn({ method: 'GET' })
  .handler(async () => {
    const list = await db.select().from(ruangan).orderBy(ruangan.createdAt);
    return list;
  });

export const getRuanganById = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const result = await db.select().from(ruangan).where(eq(ruangan.id, data.id)).limit(1);
    if (!result.length) throw new Error('Ruangan tidak ditemukan');
    return result[0];
  });

export const createRuangan = createServerFn({ method: 'POST' })
  .inputValidator(z.object({
    kodeRuangan: z.string().min(1, 'Kode ruangan harus diisi'),
    nama: z.string().min(1, 'Nama ruangan harus diisi'),
    tipe: z.string().min(1, 'Tipe ruangan harus diisi'),
    gedung: z.string().min(1, 'Gedung harus diisi'),
  }))
  .handler(async ({ data }) => {
    const newRuangan = {
      id: crypto.randomUUID(),
      kodeRuangan: data.kodeRuangan,
      nama: data.nama,
      tipe: data.tipe,
      gedung: data.gedung,
      createdAt: new Date(),
    };
    
    await db.insert(ruangan).values(newRuangan);

    return { success: true, data: newRuangan };
  });

export const updateRuangan = createServerFn({ method: 'POST' })
  .inputValidator(z.object({
    id: z.string(),
    kodeRuangan: z.string().min(1, 'Kode ruangan harus diisi'),
    nama: z.string().min(1, 'Nama ruangan harus diisi'),
    tipe: z.string().min(1, 'Tipe ruangan harus diisi'),
    gedung: z.string().min(1, 'Gedung harus diisi'),
  }))
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    
    await db.update(ruangan).set(updateData).where(eq(ruangan.id, id));

    return { success: true };
  });

export const deleteRuangan = createServerFn({ method: 'POST' })
  .inputValidator(z.object({
    id: z.string(),
  }))
  .handler(async ({ data }) => {
    await db.delete(ruangan).where(eq(ruangan.id, data.id));

    return { success: true };
  });
