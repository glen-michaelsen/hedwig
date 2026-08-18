CREATE TABLE `spotlight` (
	`id` text PRIMARY KEY NOT NULL,
	`release_id` text NOT NULL,
	`slug` text NOT NULL,
	`headline` text NOT NULL,
	`body` text NOT NULL,
	`rating` integer NOT NULL,
	`header_asset_id` text,
	`published` integer DEFAULT false NOT NULL,
	`published_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`release_id`) REFERENCES `press_release`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`header_asset_id`) REFERENCES `release_asset`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `spotlight_release_id_unique` ON `spotlight` (`release_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `spotlight_slug_idx` ON `spotlight` (`slug`);--> statement-breakpoint
CREATE INDEX `spotlight_published_idx` ON `spotlight` (`published`,`published_at`);