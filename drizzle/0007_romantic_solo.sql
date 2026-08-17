CREATE TABLE `artist` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `artist_account_name_idx` ON `artist` (`account_id`,`name`);--> statement-breakpoint
CREATE TABLE `press_release` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`artist_id` text NOT NULL,
	`title` text NOT NULL,
	`kind` text NOT NULL,
	`url` text,
	`release_date` text,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`artist_id`) REFERENCES `artist`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `press_release_account_idx` ON `press_release` (`account_id`);--> statement-breakpoint
CREATE TABLE `release_asset` (
	`id` text PRIMARY KEY NOT NULL,
	`release_id` text NOT NULL,
	`kind` text NOT NULL,
	`r2_key` text NOT NULL,
	`filename` text NOT NULL,
	`content_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`caption` text,
	`position` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`release_id`) REFERENCES `press_release`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `release_asset_release_idx` ON `release_asset` (`release_id`,`kind`,`position`);