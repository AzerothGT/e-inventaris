import { createServerFn } from '@tanstack/react-start';
import { db } from '../../db';
import { kategori, barang, pengadaanItem } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { requireSession, requireRole } from '../../lib/auth';

const MANAGE_ROLES = ['admin', 'penjaga_lab', 'kaprog'] as const;

export const getKategoriList = createServerFn({ method: 'GET' })
  .handler(async () => {
    await requireSession();
    const list = await db.select().from(kategori).orderBy(kategori.createdAt);
    return list;
  });

export const createKategori = createServerFn({ method: 'POST' })
  .inputValidator(z.object({
    nama: z.string().min(1, 'Nama kategori harus diisi'),
    deskripsi: z.string().optional(),
  }))
  .handler(async ({ data }) => {
    await requireRole(MANAGE_ROLES);
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
    await requireRole(MANAGE_ROLES);
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
    await requireRole(MANAGE_ROLES);

    const [target] = await db
      .select({ nama: kategori.nama })
      .from(kategori)
      .where(eq(kategori.id, data.id))
      .limit(1);

    if (!target) throw new Error('Kategori tidak ditemukan');

    const barangUsing = await db
      .select({ id: barang.id })
      .from(barang)
      .where(eq(barang.kategori, target.nama));

    const itemUsing = await db
      .select({ id: pengadaanItem.id })
      .from(pengadaanItem)
      .where(eq(pengadaanItem.kategori, target.nama));

    if (barangUsing.length > 0 || itemUsing.length > 0) {
      throw new Error(
        `Kategori "${target.nama}" masih digunakan oleh ${barangUsing.length} barang dan ${itemUsing.length} item pengadaan, tidak dapat dihapus`,
      );
    }

    await db.delete(kategori).where(eq(kategori.id, data.id));

    return { success: true };
  });

