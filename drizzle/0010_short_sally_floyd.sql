ALTER TABLE `press_release` ADD `slug` text;--> statement-breakpoint
ALTER TABLE `press_release` ADD `published` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `press_release` ADD `published_at` integer;--> statement-breakpoint
CREATE UNIQUE INDEX `press_release_slug_idx` ON `press_release` (`slug`);