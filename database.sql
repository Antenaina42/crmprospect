-- ========================================================
-- Prospect Mada CRM - Base de Données Hostinger
-- Nom Base de données : u697568943_prospect
-- Nom Utilisateur : u697568943_prospect
-- Mot de passe : Prospect2026
-- Encoder : UTF-8 / utf8mb4_unicode_ci
-- ========================================================

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- Structure de la table `User`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordHash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'COMMERCIAL',
  `avatar` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Structure de la table `Prospect`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `Prospect`;
CREATE TABLE `Prospect` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `googlePlaceId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phoneSecondary` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `region` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `website` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `decisionMaker` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facebook` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkedin` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Nouveau',
  `priority` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Moyenne',
  `rating` double DEFAULT NULL,
  `userRatingsTotal` int DEFAULT NULL,
  `lat` double DEFAULT NULL,
  `lng` double DEFAULT NULL,
  `isClient` tinyint(1) NOT NULL DEFAULT 0,
  `assignedToId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdById` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `importedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `firstContactAt` datetime(3) DEFAULT NULL,
  `convertedAt` datetime(3) DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Prospect_googlePlaceId_key` (`googlePlaceId`),
  KEY `Prospect_assignedToId_fkey` (`assignedToId`),
  KEY `Prospect_createdById_fkey` (`createdById`),
  CONSTRAINT `Prospect_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Prospect_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Structure de la table `CallLog`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `CallLog`;
CREATE TABLE `CallLog` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prospectId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `callDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `duration` int NOT NULL DEFAULT 0,
  `result` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `CallLog_prospectId_fkey` (`prospectId`),
  KEY `CallLog_userId_fkey` (`userId`),
  CONSTRAINT `CallLog_prospectId_fkey` FOREIGN KEY (`prospectId`) REFERENCES `Prospect` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CallLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Structure de la table `Appointment`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `Appointment`;
CREATE TABLE `Appointment` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prospectId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startTime` datetime(3) NOT NULL,
  `endTime` datetime(3) NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Rendez-vous',
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Programme',
  `reminderMinutes` int NOT NULL DEFAULT 15,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Appointment_prospectId_fkey` (`prospectId`),
  KEY `Appointment_userId_fkey` (`userId`),
  CONSTRAINT `Appointment_prospectId_fkey` FOREIGN KEY (`prospectId`) REFERENCES `Prospect` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Appointment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Structure de la table `Quote`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `Quote`;
CREATE TABLE `Quote` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quoteNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prospectId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdById` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `totalAmount` double NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Brouillon',
  `validUntil` datetime(3) NOT NULL,
  `itemsJson` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Quote_quoteNumber_key` (`quoteNumber`),
  KEY `Quote_prospectId_fkey` (`prospectId`),
  KEY `Quote_createdById_fkey` (`createdById`),
  CONSTRAINT `Quote_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Quote_prospectId_fkey` FOREIGN KEY (`prospectId`) REFERENCES `Prospect` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Structure de la table `AuditLog`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `AuditLog`;
CREATE TABLE `AuditLog` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `details` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ipAddress` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userAgent` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `AuditLog_userId_fkey` (`userId`),
  CONSTRAINT `AuditLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Structure de la table `Notification`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `Notification`;
CREATE TABLE `Notification` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `read` tinyint(1) NOT NULL DEFAULT 0,
  `link` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Notification_userId_fkey` (`userId`),
  CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Structure de la table `Category`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `Category`;
CREATE TABLE `Category` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Category_name_key` (`name`),
  UNIQUE KEY `Category_code_key` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Structure de la table `City`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `City`;
CREATE TABLE `City` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `region` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postalCode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `City_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Insertion des Utilisateurs (Mot de passe : admin123)
-- --------------------------------------------------------

INSERT INTO `User` (`id`, `name`, `email`, `passwordHash`, `role`, `avatar`, `active`, `createdAt`, `updatedAt`) VALUES
('usr_superadmin_01', 'Super Admin', 'superadmin@prospectmada.mg', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'SUPER_ADMIN', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('usr_admin_02', 'Andry Rabe (Chef Ventes)', 'admin@prospectmada.mg', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'ADMIN', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('usr_comm_03', 'Rakoto Jean', 'rakoto@prospectmada.mg', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'COMMERCIAL', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('usr_comm_04', 'Rasoa Marie', 'rasoa@prospectmada.mg', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'COMMERCIAL', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

-- --------------------------------------------------------
-- Insertion des Villes de Madagascar
-- --------------------------------------------------------

INSERT INTO `City` (`id`, `name`, `region`, `postalCode`) VALUES
('ct_1', 'Antananarivo', 'Analamanga', '101'),
('ct_2', 'Toamasina', 'Atsinanana', '501'),
('ct_3', 'Antsirabe', 'Vakinankaratra', '110'),
('ct_4', 'Mahajanga', 'Boeny', '401'),
('ct_5', 'Fianarantsoa', 'Haute Matsiatra', '301'),
('ct_6', 'Antsiranana (Diego)', 'Diana', '201'),
('ct_7', 'Toliara (Tuléar)', 'Atsimo-Andrefana', '601'),
('ct_8', 'Nosy Be', 'Diana', '207'),
('ct_9', 'Sambava', 'SAVA', '208'),
('ct_10', 'Taolagnaro (Fort-Dauphin)', 'Anosy', '614');

-- --------------------------------------------------------
-- Insertion des Catégories B2B
-- --------------------------------------------------------

INSERT INTO `Category` (`id`, `name`, `code`, `active`) VALUES
('cat_1', 'Entreprises BTP', 'BTP', 1),
('cat_2', 'Agences de voyage', 'TRAVEL', 1),
('cat_3', 'Vente de véhicules', 'AUTO_DEALER', 1),
('cat_4', 'Garages automobiles', 'AUTO_GARAGE', 1),
('cat_5', 'Hôtels', 'HOTEL', 1),
('cat_6', 'Restaurants', 'RESTAURANT', 1),
('cat_7', 'Pharmacies', 'PHARMACY', 1),
('cat_8', 'Cliniques', 'CLINIC', 1),
('cat_9', 'Avocats', 'LAWYER', 1),
('cat_10', 'Banques', 'BANK', 1),
('cat_11', 'Sociétés informatiques', 'IT', 1),
('cat_12', 'Immobilières', 'REAL_ESTATE', 1),
('cat_13', 'Supermarchés', 'SUPERMARKET', 1),
('cat_14', 'Transporteurs & Transitaires', 'LOGISTICS', 1),
('cat_15', 'Centres de formation & Écoles', 'EDUCATION', 1);

-- --------------------------------------------------------
-- Insertion des Prospects Madagascar
-- --------------------------------------------------------

INSERT INTO `Prospect` (`id`, `googlePlaceId`, `name`, `category`, `phone`, `phoneSecondary`, `email`, `address`, `city`, `region`, `website`, `decisionMaker`, `notes`, `status`, `priority`, `rating`, `userRatingsTotal`, `lat`, `lng`, `isClient`, `assignedToId`, `createdById`, `importedAt`) VALUES
('prsp_1', 'ChIJ_t123_Mada_01', 'Madagascar Construction BTP S.A.', 'Entreprises BTP', '+261 34 02 123 45', '+261 32 07 987 65', 'contact@madabtp.mg', 'Zone Industrielle Akorondrano, Rue Hydrocarbures', 'Antananarivo', 'Analamanga', 'https://madabtp.mg', 'M. Henri Randria (Directeur Technique)', 'Gros chantier à Tamatave prévu en Q4. Intéressé par offre logiciel M-IT Level Up à 1 500 000 Ar.', 'Intéressé', 'Haute', 4.6, 34, -18.8792, 47.5256, 0, 'usr_comm_03', 'usr_admin_02', CURRENT_TIMESTAMP(3)),
('prsp_2', 'ChIJ_t123_Mada_02', 'Hôtel Carlton Madagascar', 'Hôtels', '+261 20 22 260 60', NULL, 'reservation@carlton.mg', 'Rue Pierre Stibbe, Anosy', 'Antananarivo', 'Analamanga', 'https://carlton-madagascar.com', 'Mme Clarisse Razafy', 'Recherche solution CRM et réservation web M-IT Level Up.', 'Devis envoyé', 'Urgente', 4.5, 820, -18.9145, 47.5218, 0, 'usr_comm_04', 'usr_admin_02', CURRENT_TIMESTAMP(3)),
('prsp_3', 'ChIJ_t123_Mada_03', 'Vanilla Travel Madagascar', 'Agences de voyage', '+261 32 05 444 12', NULL, 'info@vanillatravel.mg', 'Avenue de l\'Indépendance, Analakely', 'Antananarivo', 'Analamanga', 'https://vanillatravel.mg', 'M. Thierry Andria', NULL, 'Contacté', 'Moyenne', 4.8, 65, -18.9101, 47.5249, 0, 'usr_comm_03', 'usr_admin_02', CURRENT_TIMESTAMP(3)),
('prsp_4', 'ChIJ_t123_Mada_04', 'SOCIETE MADA INFORMATIQUE', 'Sociétés informatiques', '+261 33 11 900 33', NULL, 'sales@madainfo.mg', 'Immeuble Pradon, Antanimena', 'Antananarivo', 'Analamanga', 'https://madainfo.mg', 'M. Luc Rakotomalala', NULL, 'Client', 'Haute', 4.9, 42, -18.8988, 47.5270, 1, 'usr_comm_04', 'usr_admin_02', CURRENT_TIMESTAMP(3)),
('prsp_5', 'ChIJ_t123_Mada_05', 'Garage Ocean Indien Auto', 'Garages automobiles', '+261 34 50 111 22', NULL, NULL, 'Boulevard Joffre', 'Toamasina', 'Atsinanana', NULL, NULL, 'Demande de démonstration rappel mardi 10h.', 'À rappeler', 'Moyenne', 4.2, 19, -18.1499, 49.4023, 0, 'usr_comm_03', 'usr_admin_02', CURRENT_TIMESTAMP(3));

-- --------------------------------------------------------
-- Insertion d'exemples d'Appels & Devis
-- --------------------------------------------------------

INSERT INTO `CallLog` (`id`, `prospectId`, `userId`, `duration`, `result`, `notes`, `createdAt`) VALUES
('call_1', 'prsp_1', 'usr_comm_03', 240, 'Interesse', 'Présentation des offres M-IT Level Up à 1 500 000 Ar. Client très réceptif.', CURRENT_TIMESTAMP(3));

INSERT INTO `Quote` (`id`, `quoteNumber`, `prospectId`, `createdById`, `totalAmount`, `status`, `validUntil`, `itemsJson`, `createdAt`) VALUES
('quote_1', 'DEV-2026-001', 'prsp_2', 'usr_comm_04', 1800000.0, 'Envoye', DATE_ADD(CURRENT_TIMESTAMP(3), INTERVAL 15 DAY), '[{"description":"Licence Prospect Mada CRM & Site Web M-IT Level Up","quantity":1,"unitPrice":1500000},{"description":"Formation équipe commerciale","quantity":1,"unitPrice":300000}]', CURRENT_TIMESTAMP(3));

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
