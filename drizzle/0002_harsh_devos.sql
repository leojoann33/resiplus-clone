ALTER TABLE `nursingNotes` ADD `createdBy` int NOT NULL;--> statement-breakpoint
ALTER TABLE `residents` ADD `medicalNotes` text;--> statement-breakpoint
ALTER TABLE `residents` ADD `allergies` text;--> statement-breakpoint
ALTER TABLE `residents` ADD `specialNeeds` text;--> statement-breakpoint
ALTER TABLE `nursingNotes` DROP COLUMN `recordedBy`;