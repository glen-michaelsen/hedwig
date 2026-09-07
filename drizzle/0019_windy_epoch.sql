ALTER TABLE `spotlight` ADD `preview_token` text;--> statement-breakpoint
CREATE UNIQUE INDEX `spotlight_preview_token_idx` ON `spotlight` (`preview_token`);