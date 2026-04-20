CREATE TABLE `approval_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`permintaan_id` text NOT NULL,
	`user_id` text NOT NULL,
	`action` text NOT NULL,
	`previous_status` text,
	`new_status` text NOT NULL,
	`catatan` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`permintaan_id`) REFERENCES `permintaan_pengadaan`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `barang` (
	`id` text PRIMARY KEY NOT NULL,
	`kode_barang` text NOT NULL,
	`nama` text NOT NULL,
	`kategori` text NOT NULL,
	`merek` text NOT NULL,
	`no_seri` text,
	`tahun_pengadaan` integer NOT NULL,
	`ruangan_id` text NOT NULL,
	`lemari` text,
	`status` text NOT NULL,
	`jumlah` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`ruangan_id`) REFERENCES `ruangan`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `barang_kode_barang_unique` ON `barang` (`kode_barang`);--> statement-breakpoint
CREATE TABLE `notifikasi` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`tipe` text NOT NULL,
	`pesan` text NOT NULL,
	`dibaca` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `permintaan_pengadaan` (
	`id` text PRIMARY KEY NOT NULL,
	`nama_barang` text NOT NULL,
	`merek` text,
	`kategori` text,
	`jumlah` integer NOT NULL,
	`deskripsi` text NOT NULL,
	`prioritas` text NOT NULL,
	`status` text NOT NULL,
	`diajukan_oleh` text NOT NULL,
	`target_ruangan_id` text,
	`target_lemari` text,
	`kondisi_diterima` text,
	`disetujui_oleh` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`diajukan_oleh`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`target_ruangan_id`) REFERENCES `ruangan`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`disetujui_oleh`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ruangan` (
	`id` text PRIMARY KEY NOT NULL,
	`kode_ruangan` text NOT NULL,
	`nama` text NOT NULL,
	`tipe` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ruangan_kode_ruangan_unique` ON `ruangan` (`kode_ruangan`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);