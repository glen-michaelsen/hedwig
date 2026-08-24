CREATE TABLE `waitlist` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`features` text NOT NULL,
	`ip_hash` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `waitlist_email_unique` ON `waitlist` (`email`);--> statement-breakpoint
CREATE INDEX `waitlist_ip_idx` ON `waitlist` (`ip_hash`,`created_at`);