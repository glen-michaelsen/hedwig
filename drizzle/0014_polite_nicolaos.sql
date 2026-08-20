CREATE TABLE `gig` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`name` text NOT NULL,
	`date` text,
	`location` text,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `gig_account_idx` ON `gig` (`account_id`,`date`);--> statement-breakpoint
CREATE TABLE `gig_set` (
	`id` text PRIMARY KEY NOT NULL,
	`gig_id` text NOT NULL,
	`name` text NOT NULL,
	`target_minutes` integer DEFAULT 45 NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`gig_id`) REFERENCES `gig`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `gig_set_gig_idx` ON `gig_set` (`gig_id`,`position`);--> statement-breakpoint
CREATE TABLE `set_song` (
	`id` text PRIMARY KEY NOT NULL,
	`set_id` text NOT NULL,
	`title` text NOT NULL,
	`artist` text,
	`duration_seconds` integer,
	`note` text,
	`position` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`set_id`) REFERENCES `gig_set`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `set_song_set_idx` ON `set_song` (`set_id`,`position`);