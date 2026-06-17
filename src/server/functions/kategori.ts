import { createServerFn } from '@tanstack/react-start';
import { db } from '../../db';
import { kategori, barang, pengadaanItem } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const getKategoriList = createServerFn({ method: 'GET' })
  .handler(async () => {
    const list = await db.select().from(kategori).orderBy(kategori.createdAt);
    return list;
  });

export const createKategori = createServerFn({ method: 'POST' })
  .inputValidator(z.object({
    nama: z.string().min(1, 'Nama kategori harus diisi'),
    deskripsi: z.string().optional(),
  }))
  .handler(async ({ data }) => {
    const newKategori = {
      id: crypto.randomUUID(),
      nama: data.nama,
      deskripsi: data.deskripsi,
      createdAt: new Date(),
    };
    
    await db.insert(kategori).values(newKategori);

    return { success: true, data: newKategori };
  });

export const updateKategori = createServerFn({ method: 'POST' })
  .inputValidator(z.object({
    id: z.string(),
    nama: z.string().min(1, 'Nama kategori harus diisi'),
    deskripsi: z.string().optional(),
  }))
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    
    await db.transaction(async (tx) => {
      const existing = await tx
        .select({ nama: kategori.nama })
        .from(kategori)
        .where(eq(kategori.id, id))
        .limit(1);

      if (existing.length > 0) {
        const oldNama = existing[0].nama;
        const newNama = updateData.nama;

        await tx.update(kategori).set(updateData).where(eq(kategori.id, id));

        if (oldNama !== newNama) {
          await tx
            .update(barang)
            .set({ kategori: newNama })
            .where(eq(barang.kategori, oldNama));

          await tx
            .update(pengadaanItem)
            .set({ kategori: newNama })
            .where(eq(pengadaanItem.kategori, oldNama));
        }
      } else {
        await tx.update(kategori).set(updateData).where(eq(kategori.id, id));
      }
    });

    return { success: true };
  });

export const deleteKategori = createServerFn({ method: 'POST' })
  .inputValidator(z.object({
    id: z.string(),
  }))
  .handler(async ({ data }) => {
    await db.delete(kategori).where(eq(kategori.id, data.id));

    return { success: true };
  });

