CREATE TABLE `access` (
	`student_id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`pin_hash` text NOT NULL,
	`failed_attempts` integer DEFAULT 0 NOT NULL,
	`locked_until` integer,
	`generation` integer DEFAULT 1 NOT NULL,
	`rotated_at` integer,
	`last_seen_at` integer,
	FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `access_code_idx` ON `access` (`code`);--> statement-breakpoint
CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`userId` text NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`idToken` text,
	`accessTokenExpiresAt` integer,
	`refreshTokenExpiresAt` integer,
	`scope` text,
	`password` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `lesson_note` (
	`id` text PRIMARY KEY NOT NULL,
	`tutor_id` text NOT NULL,
	`student_id` text NOT NULL,
	`date` text NOT NULL,
	`summary_shared` text,
	`homework` text,
	`notes_private` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`tutor_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `lesson_note_student_idx` ON `lesson_note` (`student_id`,`date`);--> statement-breakpoint
CREATE TABLE `material` (
	`id` text PRIMARY KEY NOT NULL,
	`tutor_id` text NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`r2_key` text,
	`size_bytes` integer,
	`url` text,
	`embed_provider` text,
	`link_ok` integer,
	`link_checked_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`tutor_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `material_tutor_idx` ON `material` (`tutor_id`);--> statement-breakpoint
CREATE TABLE `material_tag` (
	`material_id` text NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`material_id`, `tag_id`),
	FOREIGN KEY (`material_id`) REFERENCES `material`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `material_tag_tag_idx` ON `material_tag` (`tag_id`);--> statement-breakpoint
CREATE TABLE `note_material` (
	`note_id` text NOT NULL,
	`material_id` text NOT NULL,
	PRIMARY KEY(`note_id`, `material_id`),
	FOREIGN KEY (`note_id`) REFERENCES `lesson_note`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`material_id`) REFERENCES `material`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expiresAt` integer NOT NULL,
	`token` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `shelf` (
	`student_id` text NOT NULL,
	`material_id` text NOT NULL,
	`pinned_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`student_id`, `material_id`),
	FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`material_id`) REFERENCES `material`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `student` (
	`id` text PRIMARY KEY NOT NULL,
	`tutor_id` text NOT NULL,
	`name` text NOT NULL,
	`instrument` text,
	`level` text,
	`parent_email` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`tutor_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `student_tutor_idx` ON `student` (`tutor_id`);--> statement-breakpoint
CREATE TABLE `tag` (
	`id` text PRIMARY KEY NOT NULL,
	`tutor_id` text NOT NULL,
	`name` text NOT NULL,
	FOREIGN KEY (`tutor_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tag_tutor_name_idx` ON `tag` (`tutor_id`,`name`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`emailVerified` integer DEFAULT false NOT NULL,
	`image` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`studioName` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
