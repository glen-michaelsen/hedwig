CREATE TABLE `discover_page` (
	`slug` text PRIMARY KEY NOT NULL,
	`live_since` integer DEFAULT (unixepoch()) NOT NULL
);
