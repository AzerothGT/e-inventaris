import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: ['admin', 'kaprog', 'penjaga_lab', 'orang_tu', 'wakasek', 'kepala_sekolah', 'tu_admin'] }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const kategori = sqliteTable('kategori', {
  id: text('id').primaryKey(),
  nama: text('nama').notNull().unique(),
  deskripsi: text('deskripsi'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const ruangan = sqliteTable('ruangan', {
  id: text('id').primaryKey(),
  kodeRuangan: text('kode_ruangan').notNull().unique(),
  nama: text('nama').notNull(),
  tipe: text('tipe').notNull(),
  gedung: text('gedung'),
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
  lemari: text('lemari'),
  status: text('status', { enum: ['baik', 'rusak_ringan', 'rusak_berat'] }).notNull(),
  jumlah: integer('jumlah').notNull(),
  satuan: text('satuan').notNull().default('Unit'),
  imageUrl: text('image_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Legacy table — kept for DB compatibility, no longer used by UI
export const permintaanPengadaan = sqliteTable('permintaan_pengadaan', {
  id: text('id').primaryKey(),
  namaBarang: text('nama_barang').notNull(),
  merek: text('merek'),
  kategori: text('kategori'),
  jumlah: integer('jumlah').notNull(),
  deskripsi: text('deskripsi').notNull(),
  prioritas: text('prioritas', { enum: ['rendah', 'sedang', 'tinggi'] }).notNull(),
  status: text('status', { enum: [
    'menunggu_kaprog',
    'menunggu_wakasek',
    'menunggu_kepsek',
    'disetujui',
    'proses_pembelian',
    'selesai',
    'ditolak'
  ] }).notNull(),
  diajukanOleh: text('diajukan_oleh').references(() => users.id).notNull(),
  targetRuanganId: text('target_ruangan_id').references(() => ruangan.id),
  targetLemari: text('target_lemari'),
  kondisiDiterima: text('kondisi_diterima', { enum: ['baik', 'rusak_ringan', 'rusak_berat'] }),
  disetujuiOleh: text('disetujui_oleh').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// New event-based procurement
export const pengadaanEvent = sqliteTable('pengadaan_event', {
  id: text('id').primaryKey(),
  namaEvent: text('nama_event').notNull(),
  deskripsi: text('deskripsi').notNull(),
  prioritas: text('prioritas', { enum: ['rendah', 'sedang', 'tinggi'] }).notNull(),
  status: text('status', { enum: [
    'menunggu_kaprog',
    'menunggu_wakasek',
    'menunggu_kepsek',
    'disetujui',
    'proses_pembelian',
    'selesai',
    'ditolak'
  ] }).notNull(),
  diajukanOleh: text('diajukan_oleh').references(() => users.id).notNull(),
  disetujuiOleh: text('disetujui_oleh').references(() => users.id),
  kodePengadaan: text('kode_pengadaan').unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Line items for each event
export const pengadaanItem = sqliteTable('pengadaan_item', {
  id: text('id').primaryKey(),
  eventId: text('event_id').references(() => pengadaanEvent.id).notNull(),
  namaBarang: text('nama_barang').notNull(),
  merek: text('merek'),
  kategori: text('kategori'),
  jumlah: integer('jumlah').notNull(),
  satuan: text('satuan').notNull().default('Unit'),
  // Filled when event is completed (selesai)
  targetRuanganId: text('target_ruangan_id').references(() => ruangan.id),
  targetLemari: text('target_lemari'),
  kondisiDiterima: text('kondisi_diterima', { enum: ['baik', 'rusak_ringan', 'rusak_berat'] }),
  imageUrl: text('image_url'),
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

// approvalLogs now references pengadaanEvent (eventId stored in permintaanId column for compat)
export const approvalLogs = sqliteTable('approval_logs', {
  id: text('id').primaryKey(),
  permintaanId: text('permintaan_id').notNull(), // references pengadaanEvent.id
  userId: text('user_id').references(() => users.id).notNull(),
  action: text('action').notNull(),
  previousStatus: text('previous_status'),
  newStatus: text('new_status').notNull(),
  catatan: text('catatan'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
