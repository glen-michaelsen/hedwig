DROP INDEX `access_code_idx`;--> statement-breakpoint
ALTER TABLE `access` DROP COLUMN `code`;--> statement-breakpoint
ALTER TABLE `access` DROP COLUMN `failed_attempts`;--> statement-breakpoint
ALTER TABLE `access` DROP COLUMN `locked_until`;