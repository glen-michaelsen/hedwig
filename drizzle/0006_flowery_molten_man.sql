CREATE TABLE `idea_vote` (
	`idea_id` text NOT NULL,
	`voter_key` text NOT NULL,
	`ip_hash` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`idea_id`, `voter_key`),
	FOREIGN KEY (`idea_id`) REFERENCES `idea`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idea_vote_ip_idx` ON `idea_vote` (`ip_hash`,`created_at`);