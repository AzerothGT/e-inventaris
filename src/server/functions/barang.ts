import { createServerFn } from '@tanstack/react-start';
import { db } from '../../db';
import { barang, ruangan } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const getBarangList = createServerFn({ method: "GET" }).handler(async () => {
  const list = await db
    .select({
      id: barang.id,
      kodeBarang: barang.kodeBarang,
      nama: barang.nama,
      kategori: barang.kategori,
      merek: barang.merek,
      noSeri: barang.noSeri,
      tahunPengadaan: barang.tahunPengadaan,
      jumlah: barang.jumlah,
      status: barang.status,
      createdAt: barang.createdAt,
      ruanganId: barang.ruanganId,
      namaRuangan: ruangan.nama,
    })
    .from(barang)
    .leftJoin(ruangan, eq(barang.ruanganId, ruangan.id))
    .orderBy(barang.createdAt);
  return list;
});

export const getBarangById = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const result = await db.select().from(barang).where(eq(barang.id, data.id)).limit(1);
    if (!result.length) throw new Error('Barang tidak ditemukan');
    return result[0];
  });

export const createBarang = createServerFn({ method: 'POST' })
  .inputValidator(z.object({
    kodeBarang: z.string().min(1, 'Kode barang harus diisi'),
    nama: z.string().min(1, 'Nama barang harus diisi'),
    kategori: z.string().min(1, 'Kategori harus diisi'),
    merek: z.string().min(1, 'Merek harus diisi'),
    noSeri: z.string().optional(),
    tahunPengadaan: z.number().int(),
    ruanganId: z.string().min(1, 'Ruangan harus dipilih'),
    status: z.enum(['baik', 'rusak_ringan', 'rusak_berat']),
    jumlah: z.number().int().min(1),
  }))
  .handler(async ({ data }) => {
    const newBarang = {
      id: crypto.randomUUID(),
      ...data,
      noSeri: data.noSeri || null,
      createdAt: new Date(),
    };
    
    await db.insert(barang).values(newBarang);
    return { success: true, data: newBarang };
  });

export const updateBarang = createServerFn({ method: 'POST' })
  .inputValidator(z.object({
    id: z.string(),
    kodeBarang: z.string().min(1, 'Kode barang harus diisi'),
    nama: z.string().min(1, 'Nama barang harus diisi'),
    kategori: z.string().min(1, 'Kategori harus diisi'),
    merek: z.string().min(1, 'Merek harus diisi'),
    noSeri: z.string().optional(),
    tahunPengadaan: z.number().int(),
    ruanganId: z.string().min(1, 'Ruangan harus dipilih'),
    status: z.enum(['baik', 'rusak_ringan', 'rusak_berat']),
    jumlah: z.number().int().min(1),
  }))
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    
    await db.update(barang)
      .set({
        ...updateData,
        noSeri: updateData.noSeri || null,
      })
      .where(eq(barang.id, id));
      
    return { success: true };
  });

export const deleteBarang = createServerFn({ method: 'POST' })
  .inputValidator(z.object({
    id: z.string(),
  }))
  .handler(async ({ data }) => {
    await db.delete(barang).where(eq(barang.id, data.id));
    return { success: true };
  });
