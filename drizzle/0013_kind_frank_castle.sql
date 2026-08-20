CREATE TABLE `coverage` (
	`id` text PRIMARY KEY NOT NULL,
	`release_id` text NOT NULL,
	`url` text NOT NULL,
	`title` text,
	`outlet` text,
	`kind` text DEFAULT 'other' NOT NULL,
	`note` text,
	`published_on` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`release_id`) REFERENCES `press_release`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `coverage_release_idx` ON `coverage` (`release_id`,`published_on`);--> statement-breakpoint
CREATE TABLE `kit_event` (
	`release_id` text NOT NULL,
	`asset_id` text DEFAULT '' NOT NULL,
	`kind` text NOT NULL,
	`day` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`release_id`, `asset_id`, `kind`, `day`),
	FOREIGN KEY (`release_id`) REFERENCES `press_release`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `kit_event_release_idx` ON `kit_event` (`release_id`,`day`);