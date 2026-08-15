CREATE TABLE `bio_block` (
	`id` text PRIMARY KEY NOT NULL,
	`page_id` text NOT NULL,
	`kind` text NOT NULL,
	`position` integer NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`config` text NOT NULL,
	FOREIGN KEY (`page_id`) REFERENCES `bio_page`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `bio_block_page_idx` ON `bio_block` (`page_id`,`position`);--> statement-breakpoint
CREATE TABLE `bio_click` (
	`block_id` text NOT NULL,
	`day` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`block_id`, `day`),
	FOREIGN KEY (`block_id`) REFERENCES `bio_block`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `bio_handle_history` (
	`handle` text PRIMARY KEY NOT NULL,
	`page_id` text NOT NULL,
	`changed_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`page_id`) REFERENCES `bio_page`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `bio_page` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`handle` text NOT NULL,
	`title` text NOT NULL,
	`tagline` text,
	`avatar_key` text,
	`theme_preset` text DEFAULT 'midnight' NOT NULL,
	`accent_color` text,
	`background_kind` text DEFAULT 'preset' NOT NULL,
	`background_value` text,
	`published` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bio_page_account_id_unique` ON `bio_page` (`account_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `bio_page_handle_idx` ON `bio_page` (`handle`);--> statement-breakpoint
CREATE TABLE `bio_social` (
	`id` text PRIMARY KEY NOT NULL,
	`page_id` text NOT NULL,
	`platform` text NOT NULL,
	`url` text NOT NULL,
	`position` integer NOT NULL,
	FOREIGN KEY (`page_id`) REFERENCES `bio_page`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `bio_social_page_idx` ON `bio_social` (`page_id`,`position`);--> statement-breakpoint
CREATE TABLE `bio_view` (
	`page_id` text NOT NULL,
	`day` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`page_id`, `day`),
	FOREIGN KEY (`page_id`) REFERENCES `bio_page`(`id`) ON UPDATE no action ON DELETE cascade
);
