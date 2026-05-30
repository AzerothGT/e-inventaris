CREATE TABLE `kategori` (
	`id` text PRIMARY KEY NOT NULL,
	`nama` text NOT NULL,
	`deskripsi` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `kategori_nama_unique` ON `kategori` (`nama`);--> statement-breakpoint
CREATE TABLE `pengadaan_event` (
	`id` text PRIMARY KEY NOT NULL,
	`nama_event` text NOT NULL,
	`deskripsi` text NOT NULL,
	`prioritas` text NOT NULL,
	`status` text NOT NULL,
	`diajukan_oleh` text NOT NULL,
	`disetujui_oleh` text,
	`kode_pengadaan` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`diajukan_oleh`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`disetujui_oleh`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pengadaan_event_kode_pengadaan_unique` ON `pengadaan_event` (`kode_pengadaan`);--> statement-breakpoint
CREATE TABLE `pengadaan_item` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`nama_barang` text NOT NULL,
	`merek` text,
	`kategori` text,
	`jumlah` integer NOT NULL,
	`satuan` text DEFAULT 'Unit' NOT NULL,
	`target_ruangan_id` text,
	`target_lemari` text,
	`kondisi_diterima` text,
	`image_url` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `pengadaan_event`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`target_ruangan_id`) REFERENCES `ruangan`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `push_subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`endpoint` text NOT NULL,
	`p256dh` text NOT NULL,
	`auth` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `push_subscriptions_endpoint_unique` ON `push_subscriptions` (`endpoint`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_approval_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`permintaan_id` text NOT NULL,
	`user_id` text NOT NULL,
	`action` text NOT NULL,
	`previous_status` text,
	`new_status` text NOT NULL,
	`catatan` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_approval_logs`("id", "permintaan_id", "user_id", "action", "previous_status", "new_status", "catatan", "created_at") SELECT "id", "permintaan_id", "user_id", "action", "previous_status", "new_status", "catatan", "created_at" FROM `approval_logs`;--> statement-breakpoint
DROP TABLE `approval_logs`;--> statement-breakpoint
ALTER TABLE `__new_approval_logs` RENAME TO `approval_logs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `barang` ADD `satuan` text DEFAULT 'Unit' NOT NULL;--> statement-breakpoint
ALTER TABLE `barang` ADD `image_url` text;--> statement-breakpoint
ALTER TABLE `ruangan` ADD `gedung` text;