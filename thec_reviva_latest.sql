/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.16-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: thec_reviva
-- ------------------------------------------------------
-- Server version	10.11.16-MariaDB-ubu2204

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES
('26cb0ce9-5223-4101-a386-cb72012da030','defd42bd3dc4b74268a0303b6567123d08613b8fa61597cad1a05e2be9b63b3a','2026-01-12 04:31:43.387','20251202114005_add_refund_and_history_tables',NULL,NULL,'2026-01-12 04:31:43.269',1),
('2cd44db0-07d9-4abf-b7cb-31bf3af69749','a3b49776f6f4d7e50bfbc772114f65758e8ed28943f2b4881d411f682c82e465','2026-01-12 04:31:43.701','20251208064930_add_additional_notes_to_booking',NULL,NULL,'2026-01-12 04:31:43.676',1),
('2dbecfc5-7676-4d5d-b500-873fc1c9aae8','059e998aedd5670e1811cf91974fec0dfe8b89b669024a0b81fd2d125734eb18','2025-11-26 10:06:04.157','20251117060210_init',NULL,NULL,'2025-11-26 10:06:04.128',1),
('37b55531-f107-4ed5-8fcd-d498b4c87ea0','6ea78d4c20107b8b7a55a2f234fd584d056196091c24950209b140e886bd5eb9','2026-01-12 04:31:43.553','20251205111006_update_leader_role_enum',NULL,NULL,'2026-01-12 04:31:43.461',1),
('4764b68c-e822-4ffe-82bd-0e5ee6f26abe','017aebf2914c69ebb8fe8402cbcdf7a1748211b3d943d9a43c38a851182f5a3a','2026-01-12 04:31:43.452','20251205093538_add_special_price',NULL,NULL,'2026-01-12 04:31:43.390',1),
('684ebe15-af7a-4758-8d45-58ff42ba6ff5','e1d8e728617f9f0cf035ad1af75686074472ad9c3ff618fded01c5f5a1fe248d','2026-01-12 04:31:43.853','20251229103631_allow_duplicate_customer_emails',NULL,NULL,'2026-01-12 04:31:43.827',1),
('69c0e518-0bfd-4845-96ab-df21033829a7','c429c601e375644ad932225a2625079a4ef4444b0c34eabb270c7975cbb7c6ec','2026-01-12 04:31:43.608','20251208051209_add_partial_payment_type',NULL,NULL,'2026-01-12 04:31:43.588',1),
('76a7f657-f994-4aff-9134-97b417853500','1395e07e8ae24bd0a788c45c3352675a0d7638628146c39015f3b7f0ec3a9b0c','2026-01-12 04:31:43.671','20251208053436_update_payment_type_enum',NULL,NULL,'2026-01-12 04:31:43.609',1),
('c885387e-e935-4542-bc7b-2d8e2f85a311','1f90099a1f563d0547ef4577201dd6bf509067c3f3f6f9b57740bf8978dbe6ba','2026-01-12 04:31:43.822','20251223151645_add_commission_system',NULL,NULL,'2026-01-12 04:31:43.706',1),
('c982306c-be32-40f1-85ec-ad965fa2f092','80ac86fd207d803cfca1ff19d9690f3d180f8ef6b6fbb84a627f4b04fb35a7ca','2026-01-12 04:31:43.949','20260107154338_add_session_discount_rules',NULL,NULL,'2026-01-12 04:31:43.859',1),
('d96b9cf5-256b-4093-844e-a854c0301fb8','0e0b378795e32944d48d60abacfee23e804379f86dfaaec20d06ded4a06d2772','2025-11-26 10:06:04.401','20251124120723_add_payhere_payment_fields',NULL,NULL,'2025-11-26 10:06:04.374',1),
('e2208567-18e3-49ce-b8e9-751ccd970beb','6e29bdd8719388ebc3604afc89e055063d6c3764f7c979dffd3d91608bcd7d73','2025-11-26 10:06:04.373','20251124050231_add_quantity_to_booking',NULL,NULL,'2025-11-26 10:06:04.365',1),
('e32dce71-59f7-45a3-9b75-2a28c5434934','5965576894a7301223ae23e6d9ea7231df5dd7428a5733e4e427ae3f0c36d038','2025-11-26 10:06:04.365','20251118104353_create_booking_tables',NULL,NULL,'2025-11-26 10:06:04.158',1),
('e40817f5-fc6d-46e2-b611-f1b86548f4b0','4c1b01a66b3a0a59b3bbc1b5e21783b7e109c8ea62ae9ddd630c04332e77b04d','2026-01-20 17:49:43.047','20260120083331_add_payment_type_later',NULL,NULL,'2026-01-20 17:49:43.024',1),
('f2dc0f8c-95d1-422d-9199-842cb7eb417f','d7fea4b80e67d8aaf3e57dce0093abd2d5fdcebf6427edfffed2b87b12516c63','2026-01-12 04:31:43.586','20251208045427_add_payment_balance_fields',NULL,NULL,'2026-01-12 04:31:43.560',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `availability`
--

DROP TABLE IF EXISTS `availability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `availability` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sessionId` int(11) NOT NULL,
  `availableSeats` int(11) NOT NULL,
  `date` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `availability_sessionId_fkey` (`sessionId`),
  CONSTRAINT `availability_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `availability`
--

LOCK TABLES `availability` WRITE;
/*!40000 ALTER TABLE `availability` DISABLE KEYS */;
/*!40000 ALTER TABLE `availability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_history`
--

DROP TABLE IF EXISTS `booking_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingId` int(11) NOT NULL,
  `action` varchar(191) NOT NULL,
  `previousDate` datetime(3) DEFAULT NULL,
  `newDate` datetime(3) DEFAULT NULL,
  `previousStatus` enum('PENDING','PAID','CONFIRMED','CANCELLED') DEFAULT NULL,
  `newStatus` enum('PENDING','PAID','CONFIRMED','CANCELLED') DEFAULT NULL,
  `reason` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `booking_history_bookingId_fkey` (`bookingId`),
  CONSTRAINT `booking_history_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_history`
--

LOCK TABLES `booking_history` WRITE;
/*!40000 ALTER TABLE `booking_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_items`
--

DROP TABLE IF EXISTS `booking_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingId` int(11) NOT NULL,
  `sessionId` int(11) NOT NULL,
  `sessionTypeId` int(11) DEFAULT NULL,
  `customerId` int(11) DEFAULT NULL,
  `date` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `booking_items_bookingId_fkey` (`bookingId`),
  KEY `booking_items_sessionId_fkey` (`sessionId`),
  KEY `booking_items_sessionTypeId_fkey` (`sessionTypeId`),
  KEY `booking_items_customerId_fkey` (`customerId`),
  CONSTRAINT `booking_items_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `booking_items_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `booking_items_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `booking_items_sessionTypeId_fkey` FOREIGN KEY (`sessionTypeId`) REFERENCES `session_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_items`
--

LOCK TABLES `booking_items` WRITE;
/*!40000 ALTER TABLE `booking_items` DISABLE KEYS */;
INSERT INTO `booking_items` VALUES
(37,16,3,NULL,37,'2026-01-22 00:00:00.000','2026-01-21 07:42:45.761','2026-01-21 07:42:45.761',1),
(38,17,3,NULL,38,'2026-01-29 00:00:00.000','2026-01-21 07:48:38.907','2026-01-21 07:48:38.907',1),
(39,18,3,NULL,39,'2026-01-28 00:00:00.000','2026-01-21 07:57:15.507','2026-01-21 07:57:15.507',1),
(40,19,3,NULL,40,'2026-01-22 00:00:00.000','2026-01-21 09:50:08.898','2026-01-21 09:50:08.898',1),
(41,19,8,3,41,'2026-01-22 00:00:00.000','2026-01-21 09:50:09.293','2026-01-21 09:50:09.293',1),
(42,19,13,NULL,42,'2026-01-22 00:00:00.000','2026-01-21 09:50:09.298','2026-01-21 09:50:09.298',1),
(43,20,3,NULL,43,'2026-02-01 00:00:00.000','2026-01-21 14:58:12.614','2026-01-21 14:58:12.614',1),
(44,20,8,3,44,'2026-02-01 00:00:00.000','2026-01-21 14:58:12.620','2026-01-21 14:58:12.620',1),
(45,20,8,4,45,'2026-02-01 00:00:00.000','2026-01-21 14:58:12.622','2026-01-21 14:58:12.622',1),
(46,20,13,NULL,46,'2026-02-01 00:00:00.000','2026-01-21 14:58:12.626','2026-01-21 14:58:12.626',1),
(47,21,3,NULL,47,'2026-01-22 00:00:00.000','2026-01-21 15:39:24.656','2026-01-21 15:39:24.656',1),
(48,21,3,NULL,48,'2026-01-22 00:00:00.000','2026-01-21 15:39:24.661','2026-01-21 15:39:24.661',1),
(49,21,8,3,49,'2026-01-22 00:00:00.000','2026-01-21 15:39:24.665','2026-01-21 15:39:24.665',1),
(50,21,8,4,50,'2026-01-22 00:00:00.000','2026-01-21 15:39:24.668','2026-01-21 15:39:24.668',1),
(51,21,13,NULL,51,'2026-01-22 00:00:00.000','2026-01-21 15:39:24.670','2026-01-21 15:39:24.670',1),
(52,21,13,NULL,52,'2026-01-22 00:00:00.000','2026-01-21 15:39:24.673','2026-01-21 15:39:24.673',1),
(53,22,3,NULL,53,'2026-02-13 00:00:00.000','2026-02-12 08:12:29.648','2026-02-12 08:12:29.648',1),
(54,23,3,NULL,54,'2026-02-21 00:00:00.000','2026-02-20 08:21:34.699','2026-02-20 08:21:34.699',1);
/*!40000 ALTER TABLE `booking_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `leaderId` int(11) NOT NULL,
  `bookedDate` datetime(3) NOT NULL,
  `paymentType` enum('Full','Partial','Later') NOT NULL DEFAULT 'Full',
  `amount` double NOT NULL,
  `balance` double NOT NULL,
  `paymentId` int(11) NOT NULL,
  `status` enum('PENDING','PAID','CONFIRMED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `additionalNotes` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bookings_leaderId_fkey` (`leaderId`),
  KEY `bookings_paymentId_fkey` (`paymentId`),
  CONSTRAINT `bookings_leaderId_fkey` FOREIGN KEY (`leaderId`) REFERENCES `leaders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bookings_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `payments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES
(16,9,'2026-01-22 00:00:00.000','Full',15,0,23,'PENDING','2026-01-21 07:42:45.749','2026-01-21 07:43:51.306',NULL,''),
(17,9,'2026-01-29 00:00:00.000','Full',15,0,25,'PENDING','2026-01-21 07:48:38.888','2026-01-21 07:49:11.171',NULL,''),
(18,9,'2026-01-28 00:00:00.000','Full',15,0,27,'PENDING','2026-01-21 07:57:15.482','2026-01-21 07:57:47.577',NULL,''),
(19,10,'2026-01-22 00:00:00.000','Partial',26,24,29,'PENDING','2026-01-21 09:50:08.843','2026-01-21 09:50:08.843',NULL,''),
(20,9,'2026-02-01 00:00:00.000','Full',26,0,30,'CANCELLED','2026-01-21 14:58:12.579','2026-01-21 14:58:27.363',NULL,''),
(21,10,'2026-01-22 00:00:00.000','Partial',52,50,31,'CONFIRMED','2026-01-21 15:39:24.630','2026-01-21 15:44:40.634',NULL,'Need Jacket'),
(22,13,'2026-02-13 00:00:00.000','Full',15,0,32,'PENDING','2026-02-12 08:12:29.641','2026-02-12 08:14:25.626',NULL,''),
(23,15,'2026-02-21 00:00:00.000','Later',15,15,34,'PENDING','2026-02-20 08:21:34.690','2026-02-20 08:21:34.690',NULL,'');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commission_rules`
--

DROP TABLE IF EXISTS `commission_rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `commission_rules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `minSeats` int(11) NOT NULL,
  `maxSeats` int(11) DEFAULT NULL,
  `commissionRate` double NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commission_rules`
--

LOCK TABLES `commission_rules` WRITE;
/*!40000 ALTER TABLE `commission_rules` DISABLE KEYS */;
INSERT INTO `commission_rules` VALUES
(1,1,49,20,1,'2026-01-12 13:54:57.503','2026-01-12 13:54:57.503',NULL),
(2,50,NULL,30,1,'2026-01-12 13:55:20.720','2026-01-12 13:55:20.720',NULL);
/*!40000 ALTER TABLE `commission_rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commissions`
--

DROP TABLE IF EXISTS `commissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `commissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingId` int(11) NOT NULL,
  `leaderId` int(11) NOT NULL,
  `totalSeats` int(11) NOT NULL,
  `bookingAmount` double NOT NULL,
  `commissionRate` double NOT NULL,
  `commissionAmount` double NOT NULL,
  `paymentStatus` enum('PENDING','PAID','PARTIALLY_PAID') NOT NULL DEFAULT 'PENDING',
  `paidAt` datetime(3) DEFAULT NULL,
  `paidAmount` double DEFAULT NULL,
  `notes` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `commissions_bookingId_key` (`bookingId`),
  KEY `commissions_leaderId_idx` (`leaderId`),
  KEY `commissions_paymentStatus_idx` (`paymentStatus`),
  CONSTRAINT `commissions_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `commissions_leaderId_fkey` FOREIGN KEY (`leaderId`) REFERENCES `leaders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commissions`
--

LOCK TABLES `commissions` WRITE;
/*!40000 ALTER TABLE `commissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `commissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `leaderId` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `nic` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `customers_leaderId_fkey` (`leaderId`),
  CONSTRAINT `customers_leaderId_fkey` FOREIGN KEY (`leaderId`) REFERENCES `leaders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES
(36,9,'Test','test@gmail.com','0760687349','200079500549','2026-01-21 06:39:42.438','2026-01-21 06:39:42.438',NULL),
(37,9,'Sithara test','test@gmail.com','0760687349','200079500549','2026-01-21 07:42:45.755','2026-01-21 07:42:45.755',NULL),
(38,9,'Sithara test','test@gmail.com','0760687349','200079500549','2026-01-21 07:48:38.897','2026-01-21 07:48:38.897',NULL),
(39,9,'Sithara test','test@gmail.com','0760687349','200079500549','2026-01-21 07:57:15.496','2026-01-21 07:57:15.496',NULL),
(40,10,'Pasindu Peiris','pasindu.peiris22@gmail.com','0714660660','893283291V','2026-01-21 09:50:08.855','2026-01-21 09:50:08.855',NULL),
(41,10,'Pasindu Peiris','pasindu.peiris22@gmail.com','0714660660','893283291V','2026-01-21 09:50:08.878','2026-01-21 09:50:08.878',NULL),
(42,10,'Pasindu Peiris','pasindu.peiris22@gmail.com','0714660660','893283291V','2026-01-21 09:50:08.890','2026-01-21 09:50:08.890',NULL),
(43,9,'Test','test@gmail.com','0372828','727388','2026-01-21 14:58:12.591','2026-01-21 14:58:12.591',NULL),
(44,9,'Test','test@gmail.com','0372828','727388','2026-01-21 14:58:12.598','2026-01-21 14:58:12.598',NULL),
(45,9,'Test','test@gmail.com','0372828','727388','2026-01-21 14:58:12.603','2026-01-21 14:58:12.603',NULL),
(46,9,'Test','test@gmail.com','0372828','727388','2026-01-21 14:58:12.607','2026-01-21 14:58:12.607',NULL),
(47,10,'Pasindu Peiris','pasindu.peiris22@gmail.com','0714660660','893543827V','2026-01-21 15:39:24.638','2026-01-21 15:39:24.638',NULL),
(48,10,'Peiris Pasindu','pasindu22@hotmail.com','0714650650','834859283V','2026-01-21 15:39:24.642','2026-01-21 15:39:24.642',NULL),
(49,10,'Pasindu Peiris','pasindu.peiris22@gmail.com','0714660660','893543827V','2026-01-21 15:39:24.645','2026-01-21 15:39:24.645',NULL),
(50,10,'Peiris Pasindu','pasindu22@hotmail.com','0714650650','834859283V','2026-01-21 15:39:24.648','2026-01-21 15:39:24.648',NULL),
(51,10,'Pasindu Peiris','pasindu.peiris22@gmail.com','0714660660','893543827V','2026-01-21 15:39:24.650','2026-01-21 15:39:24.650',NULL),
(52,10,'Peiris Pasindu','pasindu22@hotmail.com','0714650650','834859283V','2026-01-21 15:39:24.652','2026-01-21 15:39:24.652',NULL),
(53,13,'Sithara test','test1@gmail.com','0760687349','200079500549','2026-02-12 08:12:29.645','2026-02-12 08:12:29.645',NULL),
(54,15,'Test','test2@gmail.com','0711111111','200088888877','2026-02-20 08:21:34.694','2026-02-20 08:21:34.694',NULL);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discount_rules`
--

DROP TABLE IF EXISTS `discount_rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount_rules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `programId` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `sessionIds` varchar(191) NOT NULL,
  `discountType` enum('PERCENTAGE','FIXED_AMOUNT') NOT NULL DEFAULT 'PERCENTAGE',
  `discountValue` double NOT NULL,
  `priority` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `discount_rules_programId_idx` (`programId`),
  CONSTRAINT `discount_rules_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `programs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount_rules`
--

LOCK TABLES `discount_rules` WRITE;
/*!40000 ALTER TABLE `discount_rules` DISABLE KEYS */;
INSERT INTO `discount_rules` VALUES
(1,2,'All Combo',NULL,'[2,7,12]','FIXED_AMOUNT',26,0,1,'2026-01-12 12:48:13.815','2026-01-12 12:52:25.544',NULL),
(2,2,'Two Combo 1',NULL,'[7,12]','FIXED_AMOUNT',22,0,1,'2026-01-12 12:48:56.909','2026-01-12 13:38:44.599',NULL),
(3,3,'All Combo',NULL,'[3,8,13]','FIXED_AMOUNT',26,0,1,'2026-01-12 12:52:10.379','2026-01-12 12:52:10.379',NULL),
(4,3,'Two Combo 1',NULL,'[8,13]','FIXED_AMOUNT',22,0,1,'2026-01-12 12:53:27.999','2026-01-12 13:38:53.847',NULL),
(5,4,'All Combo',NULL,'[4,9,14]','FIXED_AMOUNT',26,0,1,'2026-01-12 12:53:57.508','2026-01-12 12:53:57.508',NULL),
(6,5,'All Combo',NULL,'[5,10,15]','FIXED_AMOUNT',26,0,1,'2026-01-12 12:54:16.528','2026-01-12 12:54:16.528',NULL),
(7,6,'All Combo',NULL,'[6,11,16]','FIXED_AMOUNT',26,0,1,'2026-01-12 12:54:45.485','2026-01-12 12:54:45.485',NULL),
(8,4,'Two Combo 1',NULL,'[9,14]','FIXED_AMOUNT',22,0,1,'2026-01-12 12:55:09.441','2026-01-12 13:39:03.665',NULL),
(9,5,'Two Combo 1',NULL,'[10,15]','FIXED_AMOUNT',22,0,1,'2026-01-12 12:55:54.914','2026-01-12 13:39:15.166',NULL),
(10,6,'Two Combo 1',NULL,'[11,16]','FIXED_AMOUNT',22,0,1,'2026-01-12 12:56:21.290','2026-01-12 13:39:29.739',NULL),
(11,3,'Two Combo 2',NULL,'[3,8]','FIXED_AMOUNT',20,0,1,'2026-01-12 13:40:31.249','2026-01-12 13:42:14.816','2026-01-12 13:42:14.815');
/*!40000 ALTER TABLE `discount_rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leaders`
--

DROP TABLE IF EXISTS `leaders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `leaders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `contact` varchar(191) DEFAULT NULL,
  `promoteCode` varchar(191) DEFAULT NULL,
  `role` enum('USER','LEADER') NOT NULL DEFAULT 'USER',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `status` enum('ACTIVE','DEACTIVATED') NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`id`),
  UNIQUE KEY `leaders_email_key` (`email`),
  UNIQUE KEY `leaders_promoteCode_key` (`promoteCode`),
  KEY `leaders_promoteCode_idx` (`promoteCode`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leaders`
--

LOCK TABLES `leaders` WRITE;
/*!40000 ALTER TABLE `leaders` DISABLE KEYS */;
INSERT INTO `leaders` VALUES
(9,'Test','test@gmail.com','0760687349',NULL,'USER','2026-01-21 06:39:42.026','2026-01-21 15:33:48.860','2026-01-21 15:33:48.858','ACTIVE'),
(10,'Pasindu Peiris','pasindu.peiris22@gmail.com','0714660660',NULL,'USER','2026-01-21 09:50:08.447','2026-01-21 09:50:08.447',NULL,'ACTIVE'),
(11,'Harenda De Silva','info@theceylonteaexperience.com','0714660660','HAR1718','LEADER','2026-01-21 15:35:41.619','2026-01-21 15:35:41.619',NULL,'ACTIVE'),
(13,'Sithara test','test1@gmail.com','0760687349',NULL,'USER','2026-02-12 08:12:29.343','2026-02-12 08:12:29.343',NULL,'ACTIVE'),
(15,'Test','test2@gmail.com','0711111111',NULL,'USER','2026-02-20 08:21:34.101','2026-02-20 08:21:34.101',NULL,'ACTIVE');
/*!40000 ALTER TABLE `leaders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `address` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES
(2,'Galle','146A Sea Street, Galle','2026-01-12 12:02:10.344','2026-01-12 12:02:10.344',NULL),
(3,'Kandy','Kany Town','2026-01-12 12:02:22.018','2026-01-12 12:02:22.018',NULL);
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amount` double NOT NULL,
  `method` varchar(191) DEFAULT NULL,
  `transactionId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `currency` varchar(191) NOT NULL DEFAULT 'LKR',
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `orderId` varchar(191) DEFAULT NULL,
  `payhereMd5Sig` varchar(191) DEFAULT NULL,
  `payherePaymentId` varchar(191) DEFAULT NULL,
  `payhereStatusCode` int(11) DEFAULT NULL,
  `payhereStatusMsg` varchar(191) DEFAULT NULL,
  `provider` enum('MANUAL','PAYHERE') NOT NULL DEFAULT 'MANUAL',
  `status` enum('PENDING','SUCCESS','FAILED','CANCELED') NOT NULL DEFAULT 'PENDING',
  PRIMARY KEY (`id`),
  UNIQUE KEY `payments_transactionId_key` (`transactionId`),
  UNIQUE KEY `payments_orderId_key` (`orderId`),
  UNIQUE KEY `payments_payherePaymentId_key` (`payherePaymentId`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES
(22,10,'PayHere Checkout',NULL,'2026-01-21 06:39:42.412','2026-01-21 06:39:42.483',NULL,'USD','{\"checkout\":{\"generatedAt\":\"2026-01-21T06:39:42.482Z\",\"items\":\"Tea Experience Booking\"}}','RV-9-MKNNKU8W-4XHV','9A8F8606E28E8D0B78C9C9D43943D59E',NULL,NULL,NULL,'PAYHERE','PENDING'),
(23,0,'Pay Later',NULL,'2026-01-21 07:42:45.736','2026-01-21 07:42:45.736',NULL,'USD',NULL,'RV-9-MKNPTXHT-7S4Z',NULL,NULL,NULL,NULL,'MANUAL','PENDING'),
(24,15,'POS Payment','POS-TXN-1768981431322','2026-01-21 07:43:51.323','2026-01-21 07:43:51.323',NULL,'USD',NULL,'POS-RV-9-MKNPTXHT-7S4Z-MKNPVC3N',NULL,NULL,NULL,NULL,'MANUAL','SUCCESS'),
(25,0,'Pay Later',NULL,'2026-01-21 07:48:38.875','2026-01-21 07:48:38.875',NULL,'USD',NULL,'RV-9-MKNQ1HZ1-7DXN',NULL,NULL,NULL,NULL,'MANUAL','PENDING'),
(26,15,'POS Payment','POS-TXN-1768981751181','2026-01-21 07:49:11.183','2026-01-21 07:49:11.183',NULL,'USD',NULL,'POS-RV-9-MKNQ1HZ1-7DXN-MKNQ26WV',NULL,NULL,NULL,NULL,'MANUAL','SUCCESS'),
(27,0,'Pay Later',NULL,'2026-01-21 07:57:15.469','2026-01-21 07:57:15.469',NULL,'USD',NULL,'RV-9-MKNQCKL5-ZAX',NULL,NULL,NULL,NULL,'MANUAL','PENDING'),
(28,15,'POS Payment','POS-TXN-1768982267610','2026-01-21 07:57:47.613','2026-01-21 07:57:47.613',NULL,'USD',NULL,'POS-RV-9-MKNQCKL5-ZAX-MKNQD9DC',NULL,NULL,NULL,NULL,'MANUAL','SUCCESS'),
(29,2,'PayHere Checkout',NULL,'2026-01-21 09:50:08.831','2026-01-21 09:50:09.333',NULL,'USD','{\"checkout\":{\"generatedAt\":\"2026-01-21T09:50:09.332Z\",\"items\":\"Tea Experience Booking\"}}','RV-10-MKNUDQX0-CU1U','FD5C9016E812424C3A36FFF5B836F625',NULL,NULL,NULL,'PAYHERE','PENDING'),
(30,26,'PayHere Checkout',NULL,'2026-01-21 14:58:12.562','2026-01-21 14:58:27.355',NULL,'USD','{\"checkout\":{\"generatedAt\":\"2026-01-21T14:58:12.636Z\",\"items\":\"Tea Experience Booking\"}}','RV-9-MKO5DX2X-28SW','62C5232EF1FD8F83C66339A37A692B7B',NULL,NULL,NULL,'PAYHERE','CANCELED'),
(31,2,'VISA',NULL,'2026-01-21 15:39:24.624','2026-01-21 15:44:40.596',NULL,'USD','{\"checkout\":{\"generatedAt\":\"2026-01-21T15:39:24.686Z\",\"items\":\"Tea Experience Booking\"},\"notification\":{\"receivedAt\":\"2026-01-21T15:44:33.474Z\",\"payload\":{\"merchant_id\":\"251433\",\"order_id\":\"RV-10-MKO6UWJJ-7QTV\",\"payment_id\":\"320046592756\",\"captured_amount\":\"2.00\",\"payhere_amount\":\"2.00\",\"payhere_currency\":\"USD\",\"status_code\":\"2\",\"md5sig\":\"6C7C090A8F3897F234C93EBC0D888B54\",\"custom_1\":\"21\",\"custom_2\":\"10\",\"status_message\":\"Successfully received the VISA payment\",\"method\":\"VISA\",\"card_holder_name\":\"B H PASINDU M PEIRIS\",\"card_no\":\"************0388\",\"card_expiry\":\"0629\",\"recurring\":\"0\"}}}','RV-10-MKO6UWJJ-7QTV','6C7C090A8F3897F234C93EBC0D888B54','320046592756',2,'Successfully received the VISA payment','PAYHERE','SUCCESS'),
(32,0,'Pay Later',NULL,'2026-02-12 08:12:29.634','2026-02-12 08:12:29.634',NULL,'USD',NULL,'RV-13-MLJ6KWMK-3GN9',NULL,NULL,NULL,NULL,'MANUAL','PENDING'),
(33,15,'POS Payment','POS-TXN-1770884065634','2026-02-12 08:14:25.635','2026-02-12 08:14:25.635',NULL,'USD',NULL,'POS-RV-13-MLJ6KWMK-3GN9-MLJ6NE53',NULL,NULL,NULL,NULL,'MANUAL','SUCCESS'),
(34,0,'Pay Later',NULL,'2026-02-20 08:21:34.606','2026-02-20 08:21:34.606',NULL,'USD',NULL,'RV-15-MLUMFEBS-7XJR',NULL,NULL,NULL,NULL,'MANUAL','PENDING');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programs`
--

DROP TABLE IF EXISTS `programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `programs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `locationId` int(11) NOT NULL,
  `seats` int(11) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `programs_locationId_fkey` (`locationId`),
  CONSTRAINT `programs_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `locations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programs`
--

LOCK TABLES `programs` WRITE;
/*!40000 ALTER TABLE `programs` DISABLE KEYS */;
INSERT INTO `programs` VALUES
(2,'Session 01','','09:00:00','11:00:00',2,8,0,'2026-01-12 12:15:00.282','2026-01-12 13:08:37.942',NULL),
(3,'Session 02',NULL,'10:30:00','12:30:00',2,8,1,'2026-01-12 12:24:45.894','2026-01-12 12:24:45.894',NULL),
(4,'Session 03','','12:00:00','14:00:00',2,8,0,'2026-01-12 12:25:40.075','2026-01-12 13:09:12.244',NULL),
(5,'Session 04',NULL,'13:30:00','15:30:00',2,8,1,'2026-01-12 12:26:26.864','2026-01-12 12:26:26.864',NULL),
(6,'Session 05','','15:00:00','17:00:00',2,8,0,'2026-01-12 12:27:14.933','2026-01-12 13:09:18.459',NULL);
/*!40000 ALTER TABLE `programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` varchar(191) NOT NULL,
  `hashedToken` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `revoked` tinyint(1) NOT NULL DEFAULT 0,
  `expiresAt` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `refresh_tokens_hashedToken_key` (`hashedToken`),
  KEY `refresh_tokens_userId_idx` (`userId`),
  KEY `refresh_tokens_hashedToken_idx` (`hashedToken`),
  CONSTRAINT `refresh_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES
('0cf196a4-d683-4838-92f1-a229772a7086','$2a$10$aVF/Xgo9qPEmTIvj7/17/uk4jAPuMRW8ptwRdPEMtIJEAReUwkrUa','cmifuak9i0000ce8qppd13s0z',0,'2026-01-20 07:56:29.071','2026-01-13 07:56:29.072'),
('11f85a10-b58f-421e-8b43-4a19dee49053','$2a$10$YocBtUjY6RnFGvyY7RqGE.ebwcw1aEx/K9EtI2.oVyQsA64/oHXmy','cmifuak9i0000ce8qppd13s0z',0,'2026-01-20 15:45:01.839','2026-01-13 15:45:01.843'),
('1740a367-f200-4732-a2dc-4f9d90bb3b0a','$2a$10$hdKsVgnL72KHPAhok5.e1OEGDxJFYsXKUyfaVathxYLEu7ueJ4pzK','cmifuak9i0000ce8qppd13s0z',1,'2026-01-18 22:13:42.957','2026-01-11 22:13:42.959'),
('1a5593f7-85b9-41ce-b085-7956aa2f2ef3','$2a$10$WDBRyFq5OVAnQEbmR17plePECvok6rC4nmDp7FCPfbv/L1AJf02yq','cmifuak9i0000ce8qppd13s0z',0,'2026-02-11 10:56:32.947','2026-02-04 10:56:32.949'),
('264a6dc4-911e-4466-a655-c9c55ff81d03','$2a$10$NB445QcaZ59jeZGtsuCkI.dKd65XIOhNDToTvXos7lbp15eRIVJw2','cmifuak9i0000ce8qppd13s0z',0,'2026-01-21 04:26:13.990','2026-01-14 04:26:13.991'),
('2f1bbaee-50a6-4f97-8e1e-fe7e6ff70e9a','$2a$10$UjkgJMNwW.1f6CYqTPQAb.62pJq.8WS49kMcpvSxBlFbcqMjwAfUu','cmifuak9i0000ce8qppd13s0z',0,'2026-01-21 03:08:35.520','2026-01-14 03:08:35.521'),
('3508ac50-229a-41fc-9931-4e3b032f49a4','$2a$10$2XsuN1ruxO294xj2F7VhNeRBBFx/D.ZHicamI2WlUQzG84wUNfLY2','cmifuak9i0000ce8qppd13s0z',0,'2026-01-31 12:04:24.039','2026-01-24 12:04:24.041'),
('3e6290b6-727e-4bd1-9bce-e093171556d6','$2a$10$vOg0MVQCyap8X.d3sZob3.WIB1HVvK6wEykKGhEt7JignBNLAT6Em','cmifuak9i0000ce8qppd13s0z',0,'2026-02-27 06:58:08.210','2026-02-20 06:58:08.292'),
('3f7ad0dc-82e6-479e-8af9-2c3c3c3b8ad2','$2a$10$qSSWxAHz87OsZ8W1l5a.WOTFUsjY.NNghGI8ERKk3sa5chErIDtza','cmifuak9i0000ce8qppd13s0z',0,'2026-02-17 02:59:12.207','2026-02-10 02:59:12.212'),
('54b4919d-cda6-4d1d-b178-0e96aeda6322','$2a$10$/KxM65o./y2okmoNyFJgb.sERn/3VrkGpEYPz3RK2bBTXSh5BfKpy','cmifuak9i0000ce8qppd13s0z',0,'2026-01-20 08:57:08.251','2026-01-13 08:57:08.253'),
('7dd6cd08-00cf-42c7-b465-fc152d273a8c','$2a$10$r6Y5YqWiewIFNiQBI.1n4O9.3/X/A/mIcLkdTTKGnsSzMQT7EoDZK','cmifuak9i0000ce8qppd13s0z',0,'2026-03-10 14:21:52.651','2026-03-03 14:21:52.653'),
('814c7ae2-5dcd-498a-abad-91b2a33016ff','$2a$10$HD5gQhy8Q/lpZWhAASIzLOQQpJHy4MxmUH2ZPOimClUwa93k9eRCi','cmifuak9i0000ce8qppd13s0z',0,'2026-02-11 04:53:53.292','2026-02-04 04:53:53.294'),
('892a1b49-122c-4bf7-8dd7-0d9e4618c4f3','$2a$10$eftziQ3G689m229.GJMDU.dYLm5Dl8Cd2TN9rMfZvIKeTpF.oEdxG','cmifuak9i0000ce8qppd13s0z',0,'2026-01-19 14:34:19.414','2026-01-12 14:34:19.415'),
('8daf5d8c-991c-43cf-a6fb-f9c88c45ae65','$2a$10$dz1fpeSCCRsNReB4NfxnSevrVHmGcAL9Z7n0gkdV3vAa6gmbJ51L.','cmifuak9i0000ce8qppd13s0z',0,'2026-01-21 04:39:14.934','2026-01-14 04:39:14.935'),
('a01a7861-e0a9-4743-9349-7834afcdff5c','$2a$10$0ezyl1Ff4kxDKpmjJHjPVOAm9G00LEI2RvDU8ldQzIHPMhdzIECUS','cmifuak9i0000ce8qppd13s0z',0,'2026-02-03 08:46:04.184','2026-01-27 08:46:04.187'),
('b8129a48-0c20-4e7c-a1b7-0f95d877243b','$2a$10$6/gp5K1VhYhySPPLaKDAlOWOWSnHbtGKGeY9vE3gsONSV4N4yrdfm','cmifuak9i0000ce8qppd13s0z',0,'2026-02-11 04:54:20.972','2026-02-04 04:54:20.973'),
('b87c9d5a-b984-4fd0-9c68-99101d222a60','$2a$10$XExIVilb43QEEXLoHKeHMOg2MOwHesWW7RaKJgxqDuFIvB8Unu82S','cmifuak9i0000ce8qppd13s0z',1,'2026-01-21 01:51:05.886','2026-01-14 01:51:05.887'),
('c47f6b1a-dcf0-4f28-8210-52612e4965f3','$2a$10$K7OI3neJrq70D.vaKdOJhOmuV2zQNUXlLIkBo.hs8Uto4FbSZHZ1G','cmifuak9i0000ce8qppd13s0z',0,'2026-03-25 11:13:52.183','2026-03-18 11:13:52.185'),
('dd411742-cb18-4e62-a666-03338ff5d943','$2a$10$N91vO3I1t0vV1z45c2nMbOlRicaDRvAyLcFSUXavFBx2o2iteEMfe','cmifuak9i0000ce8qppd13s0z',1,'2026-01-20 03:26:03.384','2026-01-13 03:26:03.386'),
('ddeee6cf-8e76-487e-b040-478ed1055e47','$2a$10$G3PhtWF0iJu/uwbmwkDEg.0arlfgw1UcE6I8/T2fEkEjd.8iiswnK','cmifuak9i0000ce8qppd13s0z',0,'2025-12-03 10:31:37.904','2025-11-26 10:31:37.905'),
('dfd277ee-36f9-4561-974b-9b4e4364efa0','$2a$10$dqzHl3lb2HPigOBFMmRG3.hpWLNT5KF9HEH9RikDBhLBEtQpvXmQC','cmifuak9i0000ce8qppd13s0z',0,'2026-01-26 05:51:50.894','2026-01-19 05:51:50.896'),
('eab0e1f2-e2bb-4a7d-bc18-08963552bd47','$2a$10$cMxF9hW9Gz.vnF3O6EEKz.X6z87KkpB33UCrZVp5czfZkEs9lkImW','cmifuak9i0000ce8qppd13s0z',1,'2026-01-19 12:36:49.977','2026-01-12 12:36:49.979'),
('ebf2b241-cd93-401a-ad37-4fec7ef778f9','$2a$10$cEiH9FHj9Owfu/w86aQDDuaKYxzdHB0T6LJtVScCwz7dto5M2ePy6','cmifuak9i0000ce8qppd13s0z',0,'2026-03-03 09:30:26.872','2026-02-24 09:30:26.874'),
('fa4f6938-3a42-499c-a082-ab7d33ad989f','$2a$10$tvv1.R4P7Q15IrnTLb887OqyWxKPkO.qSI/023Mhhn2M3WgF/jg5a','cmifuak9i0000ce8qppd13s0z',0,'2026-01-19 12:00:42.258','2026-01-12 12:00:42.261');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refunds`
--

DROP TABLE IF EXISTS `refunds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `refunds` (
  `id` varchar(191) NOT NULL,
  `bookingId` int(11) NOT NULL,
  `amount` double NOT NULL,
  `reason` varchar(191) DEFAULT NULL,
  `status` enum('PENDING','PROCESSED','FAILED') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `refunds_bookingId_fkey` (`bookingId`),
  CONSTRAINT `refunds_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refunds`
--

LOCK TABLES `refunds` WRITE;
/*!40000 ALTER TABLE `refunds` DISABLE KEYS */;
/*!40000 ALTER TABLE `refunds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session_types`
--

DROP TABLE IF EXISTS `session_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `session_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sessionId` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `price` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `specialPrice` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `session_types_sessionId_fkey` (`sessionId`),
  CONSTRAINT `session_types_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session_types`
--

LOCK TABLES `session_types` WRITE;
/*!40000 ALTER TABLE `session_types` DISABLE KEYS */;
INSERT INTO `session_types` VALUES
(1,7,'Green Tea',0,'2026-01-12 12:41:48.794','2026-01-14 03:08:51.878',NULL,NULL),
(2,7,'Black Tea',0,'2026-01-12 12:42:23.323','2026-01-14 03:08:58.376',NULL,NULL),
(3,8,'Green Tea',0,'2026-01-12 12:43:15.518','2026-01-14 03:09:07.099',NULL,NULL),
(4,8,'Black Tea',0,'2026-01-12 12:44:00.206','2026-01-14 03:09:17.027',NULL,NULL),
(5,9,'Green Tea',0,'2026-01-12 12:44:17.450','2026-01-14 03:09:23.879',NULL,NULL),
(6,4,'Black Tea',0,'2026-01-12 12:44:41.985','2026-01-14 03:09:30.672',NULL,NULL),
(7,10,'Green Tea',0,'2026-01-12 12:44:58.425','2026-01-14 03:09:38.974',NULL,NULL),
(8,10,'Black Tea',0,'2026-01-12 12:45:16.959','2026-01-14 03:09:46.569',NULL,NULL),
(9,11,'Green Tea',0,'2026-01-12 12:45:42.067','2026-01-14 03:09:53.650',NULL,NULL),
(10,11,'Black Tea',0,'2026-01-12 12:46:09.274','2026-01-14 03:10:06.780',NULL,NULL),
(11,9,'Black Tea',0,'2026-01-12 12:46:57.126','2026-01-14 03:10:14.252',NULL,NULL);
/*!40000 ALTER TABLE `session_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `programId` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `price` double DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `specialPrice` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_programId_fkey` (`programId`),
  CONSTRAINT `sessions_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `programs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES
(2,2,'Plantation-Session 01','09:00:00','10:00:00',15,'2026-01-12 12:30:09.439','2026-01-12 12:59:27.200',NULL,NULL),
(3,3,'Plantation-Session 02','10:30:00','11:30:00',15,'2026-01-12 12:32:14.424','2026-01-12 12:59:46.902',NULL,NULL),
(4,4,'Plantation-Session 03','12:00:00','13:00:00',15,'2026-01-12 12:32:37.370','2026-01-12 13:00:10.829',NULL,NULL),
(5,5,'Plantation-Session 04','13:30:00','14:30:00',15,'2026-01-12 12:33:04.369','2026-01-12 13:00:34.812',NULL,NULL),
(6,6,'Plantation-Session 05','15:00:00','14:00:00',15,'2026-01-12 12:33:28.906','2026-01-12 13:00:57.981',NULL,NULL),
(7,2,'Hand Made Tea-Session 01','10:00:00','10:45:00',15,'2026-01-12 12:34:10.137','2026-01-12 12:59:36.235',NULL,NULL),
(8,3,'Hand Made Tea-Session 02','11:30:00','12:15:00',15,'2026-01-12 12:35:05.006','2026-01-12 13:00:02.722',NULL,NULL),
(9,4,'Hand Made Tea-Session 03','13:00:00','13:45:00',15,'2026-01-12 12:35:53.362','2026-01-12 13:00:28.061',NULL,NULL),
(10,5,'Hand Made Tea-Session 04','14:30:00','15:15:00',15,'2026-01-12 12:36:26.549','2026-01-12 13:00:48.296',NULL,NULL),
(11,6,'Hand Made Tea-Session 05','16:00:00','16:45:00',15,'2026-01-12 12:37:29.846','2026-01-12 13:01:15.733',NULL,NULL),
(12,2,'Tasting - Session 01','10:45:00','11:00:00',15,'2026-01-12 12:38:14.620','2026-01-12 12:59:55.709',NULL,NULL),
(13,3,'Tasting - Session 02','12:15:00','12:30:00',15,'2026-01-12 12:39:18.442','2026-01-12 13:00:22.509',NULL,NULL),
(14,4,'Tasting - Session 03','13:45:00','14:00:00',15,'2026-01-12 12:40:06.420','2026-01-12 13:00:43.593',NULL,NULL),
(15,5,'Tasting - Session 04','15:15:00','15:30:00',15,'2026-01-12 12:40:38.058','2026-01-12 13:01:09.167',NULL,NULL),
(16,6,'Tasting - Session 05','16:45:00','17:00:00',15,'2026-01-12 12:41:23.147','2026-01-12 13:01:22.598',NULL,NULL);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'user',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
('cmifuak9i0000ce8qppd13s0z','admin@example.com','$2a$10$S.LEAO09NgtbsfpOtaIVGuahTq2/ar/QFhn4dPwmZROpG4WMkIDf6','Admin User','admin','2025-11-26 10:06:06.102','2025-11-26 10:06:06.102'),
('cmifuakc00001ce8qipk2i60z','leader@example.com','$2a$10$QcQA6E4dvPb.LOtNvi4VCeNbvKLUY82Ckj79Ez57o6ZgLQ3dK8Hcq','Leader User','user','2025-11-26 10:06:06.192','2025-11-26 10:06:06.192'),
('cmifuakec0002ce8qamaplb13','user@example.com','$2a$10$7qNoEhy3PX.7v58ReHtRUuxkdWCAm757XgsYR/SYdUbDEuV0OwDim','Regular User','user','2025-11-26 10:06:06.276','2025-11-26 10:06:06.276');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-18 17:01:43
