CREATE TABLE `phone_lockout` (
	`phone` text PRIMARY KEY NOT NULL,
	`failed_attempts` integer DEFAULT 0 NOT NULL,
	`locked_until` integer,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `access` ADD `phone` text;--> statement-breakpoint
CREATE INDEX `access_phone_idx` ON `access` (`phone`);