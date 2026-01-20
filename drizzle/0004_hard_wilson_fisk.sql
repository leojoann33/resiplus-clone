CREATE TABLE `ulcerCures` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ulcerId` int NOT NULL,
	`performedAt` timestamp NOT NULL DEFAULT (now()),
	`performedBy` int NOT NULL,
	`treatment` text,
	`observations` text,
	`nextCure` date,
	`status` enum('pending','completed') NOT NULL DEFAULT 'completed',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ulcerCures_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ulcers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`residentId` int NOT NULL,
	`code` varchar(50),
	`onsetDate` date NOT NULL,
	`healDate` date,
	`location` varchar(200) NOT NULL,
	`stage` varchar(100) NOT NULL,
	`size` varchar(100),
	`riskFactors` text,
	`observations` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ulcers_id` PRIMARY KEY(`id`)
);
