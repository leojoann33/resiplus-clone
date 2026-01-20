CREATE TABLE `careGroupResidents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`careGroupId` int NOT NULL,
	`residentId` int NOT NULL,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	`addedBy` int NOT NULL,
	CONSTRAINT `careGroupResidents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `careGroups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`groupType` enum('control','actividad') NOT NULL DEFAULT 'control',
	`careTypeId` int,
	`code` varchar(50),
	`codeUnificado` varchar(100),
	`professionalArea` varchar(100),
	`scheduledHour` varchar(10),
	`recurrencePattern` text,
	`assignedUserId` int,
	`durationHours` decimal(4,2),
	`indication` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `careGroups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `careTasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`residentId` int NOT NULL,
	`careTypeId` int NOT NULL,
	`subtype` varchar(200),
	`startDate` date NOT NULL,
	`endDate` date,
	`scheduledHour` varchar(10),
	`recurrenceType` enum('none','daily','weekly','monthly','custom') DEFAULT 'none',
	`recurrencePattern` text,
	`professionalArea` varchar(100),
	`assignedUserId` int,
	`indication` text,
	`notes` text,
	`status` enum('active','paused','completed','cancelled') NOT NULL DEFAULT 'active',
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `careTasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `careTypes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`name` varchar(200) NOT NULL,
	`category` enum('control','actividad','registro') NOT NULL,
	`professionalArea` enum('enfermeria','trabajador_social','psicologo','fisioterapeuta','terapeuta_ocupacional','animador','educador','dietista','logopeda','medico') NOT NULL DEFAULT 'enfermeria',
	`requiresResult` boolean DEFAULT false,
	`resultType` enum('numeric','text','boolean','scale'),
	`resultUnit` varchar(50),
	`isActive` boolean NOT NULL DEFAULT true,
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `careTypes_id` PRIMARY KEY(`id`),
	CONSTRAINT `careTypes_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `scheduledTasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`careTaskId` int,
	`careGroupId` int,
	`residentId` int NOT NULL,
	`careTypeId` int NOT NULL,
	`scheduledDateTime` timestamp NOT NULL,
	`taskType` enum('individual','group') NOT NULL DEFAULT 'individual',
	`status` enum('pending','completed','not_done','absent','cancelled') NOT NULL DEFAULT 'pending',
	`executionDateTime` timestamp,
	`executedByUserId` int,
	`resultValue` text,
	`resultNumeric` decimal(10,2),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scheduledTasks_id` PRIMARY KEY(`id`)
);
