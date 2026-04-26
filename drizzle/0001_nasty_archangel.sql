CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference` varchar(32) NOT NULL,
	`serviceId` int,
	`serviceName` varchar(128) NOT NULL,
	`servicePrice` decimal(10,2) NOT NULL,
	`bookingDate` varchar(32) NOT NULL,
	`bookingTime` varchar(32) NOT NULL,
	`status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
	`fullName` varchar(128) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`dob` varchar(32),
	`consentData` json DEFAULT (json_object()),
	`medicalHistory` json DEFAULT (json_array()),
	`medications` json DEFAULT (json_array()),
	`ivntHistory` json DEFAULT (json_object()),
	`wellbeing` json DEFAULT (json_array()),
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`),
	CONSTRAINT `bookings_reference_unique` UNIQUE(`reference`)
);
--> statement-breakpoint
CREATE TABLE `contactMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(128) NOT NULL,
	`email` varchar(320),
	`inquiry` text NOT NULL,
	`status` enum('unread','read','replied') NOT NULL DEFAULT 'unread',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contactMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(128) NOT NULL,
	`name` varchar(128) NOT NULL,
	`tagline` varchar(255),
	`category` varchar(64) NOT NULL DEFAULT 'Wellness',
	`tag` varchar(64),
	`price` decimal(10,2) NOT NULL,
	`duration` varchar(64) DEFAULT '45 Min Session',
	`description` text,
	`ingredients` json DEFAULT (json_array()),
	`benefits` json DEFAULT (json_array()),
	`idealFor` json DEFAULT (json_array()),
	`icon` varchar(8) DEFAULT '💧',
	`isActive` boolean NOT NULL DEFAULT true,
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`),
	CONSTRAINT `services_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `siteSettings` (
	`key` varchar(128) NOT NULL,
	`value` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `siteSettings_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientName` varchar(128) NOT NULL,
	`initials` varchar(4),
	`rating` int DEFAULT 5,
	`text` text NOT NULL,
	`serviceName` varchar(128),
	`isActive` boolean NOT NULL DEFAULT true,
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
