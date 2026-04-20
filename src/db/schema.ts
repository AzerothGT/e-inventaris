import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: ['admin', 'kepala_program', 'teknisi'] }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const ruangan = sqliteTable('ruangan', {
  id: text('id').primaryKey(),
  kodeRuangan: text('kode_ruangan').notNull().unique(),
  nama: text('nama').notNull(),
  tipe: text('tipe').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const barang = sqliteTable('barang', {
  id: text('id').primaryKey(),
  kodeBarang: text('kode_barang').notNull().unique(),
  nama: text('nama').notNull(),
  kategori: text('kategori').notNull(),
  merek: text('merek').notNull(),
  noSeri: text('no_seri'),
  tahunPengadaan: integer('tahun_pengadaan').notNull(),
  ruanganId: text('ruangan_id').references(() => ruangan.id).notNull(),
  status: text('status', { enum: ['baik', 'rusak_ringan', 'rusak_berat'] }).notNull(),
  jumlah: integer('jumlah').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const permintaanPengadaan = sqliteTable('permintaan_pengadaan', {
  id: text('id').primaryKey(),
  judul: text('judul').notNull(),
  deskripsi: text('deskripsi').notNull(),
  status: text('status', { enum: ['menunggu', 'disetujui', 'ditolak', 'selesai'] }).notNull(),
  diajukanOleh: text('diajukan_oleh').references(() => users.id).notNull(),
  disetujuiOleh: text('disetujui_oleh').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const notifikasi = sqliteTable('notifikasi', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  tipe: text('tipe').notNull(),
  pesan: text('pesan').notNull(),
  dibaca: integer('dibaca', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
