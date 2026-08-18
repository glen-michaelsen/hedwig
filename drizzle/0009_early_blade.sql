CREATE TABLE `spotlight_skip` (
	`release_id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`release_id`) REFERENCES `press_release`(`id`) ON UPDATE no action ON DELETE cascade
);
