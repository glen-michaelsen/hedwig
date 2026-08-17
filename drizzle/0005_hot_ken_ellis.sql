CREATE TABLE `idea` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`detail` text,
	`name` text,
	`email` text,
	`area` text DEFAULT 'platform' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`ip_hash` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idea_published_idx` ON `idea` (`published`,`created_at`);--> statement-breakpoint
CREATE INDEX `idea_ip_idx` ON `idea` (`ip_hash`,`created_at`);