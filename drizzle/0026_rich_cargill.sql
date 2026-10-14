CREATE TABLE `spotlight_nudge` (
	`release_id` text PRIMARY KEY NOT NULL,
	`sent_at` integer NOT NULL,
	FOREIGN KEY (`release_id`) REFERENCES `press_release`(`id`) ON UPDATE no action ON DELETE cascade
);
