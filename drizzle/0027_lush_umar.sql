CREATE TABLE `oauthAccessToken` (
	`id` text PRIMARY KEY NOT NULL,
	`accessToken` text NOT NULL,
	`refreshToken` text NOT NULL,
	`accessTokenExpiresAt` integer NOT NULL,
	`refreshTokenExpiresAt` integer NOT NULL,
	`clientId` text NOT NULL,
	`userId` text,
	`scopes` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`clientId`) REFERENCES `oauthApplication`(`clientId`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `oauthAccessToken_accessToken_unique` ON `oauthAccessToken` (`accessToken`);--> statement-breakpoint
CREATE UNIQUE INDEX `oauthAccessToken_refreshToken_unique` ON `oauthAccessToken` (`refreshToken`);--> statement-breakpoint
CREATE INDEX `oauth_access_token_client_idx` ON `oauthAccessToken` (`clientId`);--> statement-breakpoint
CREATE INDEX `oauth_access_token_user_idx` ON `oauthAccessToken` (`userId`);--> statement-breakpoint
CREATE TABLE `oauthApplication` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text,
	`metadata` text,
	`clientId` text NOT NULL,
	`clientSecret` text,
	`redirectUrls` text NOT NULL,
	`type` text NOT NULL,
	`disabled` integer DEFAULT false,
	`userId` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `oauthApplication_clientId_unique` ON `oauthApplication` (`clientId`);--> statement-breakpoint
CREATE INDEX `oauth_application_user_idx` ON `oauthApplication` (`userId`);--> statement-breakpoint
CREATE TABLE `oauthConsent` (
	`id` text PRIMARY KEY NOT NULL,
	`clientId` text NOT NULL,
	`userId` text NOT NULL,
	`scopes` text NOT NULL,
	`consentGiven` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`clientId`) REFERENCES `oauthApplication`(`clientId`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `oauth_consent_client_idx` ON `oauthConsent` (`clientId`);--> statement-breakpoint
CREATE INDEX `oauth_consent_user_idx` ON `oauthConsent` (`userId`);