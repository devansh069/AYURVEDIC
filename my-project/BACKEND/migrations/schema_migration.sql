-- ============================================================================
-- AyurVeda Platform - Complete Database Architecture & Migration Script
-- Target RDBMS: MySQL 8.0+
-- Database: ayurveda
-- Features: Full schema DDL, foreign keys, JSON attributes, Google OAuth support,
--           dynamic clinical attributes (about, education, awards, expertise),
--           and baseline production seed data.
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `ayurveda` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ayurveda`;

SET FOREIGN_KEY_CHECKS = 0;

-- Drop all child & dependent tables first
DROP TABLE IF EXISTS `doctor_appointments`;
DROP TABLE IF EXISTS `doctor_reviews`;
DROP TABLE IF EXISTS `patient_wellness`;
DROP TABLE IF EXISTS `patient_health_goals`;
DROP TABLE IF EXISTS `patient_medical_records`;
DROP TABLE IF EXISTS `patient_diet_plans`;
DROP TABLE IF EXISTS `patient_recovery_tracker`;
DROP TABLE IF EXISTS `ai_chat_messages`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `treatment_bookings`;
DROP TABLE IF EXISTS `doctor_consultations`;
DROP TABLE IF EXISTS `treatments`;
DROP TABLE IF EXISTS `treatment_categories`;
DROP TABLE IF EXISTS `diseases`;
DROP TABLE IF EXISTS `disease_categories`;
DROP TABLE IF EXISTS `testimonials`;
DROP TABLE IF EXISTS `clinics`;
DROP TABLE IF EXISTS `patients`;
DROP TABLE IF EXISTS `doctors`;
DROP TABLE IF EXISTS `stats`;

-- --------------------------------------------------------
-- 1. Table: stats
-- --------------------------------------------------------
CREATE TABLE `stats` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `patients` INT DEFAULT 0,
  `doctors` INT DEFAULT 0,
  `clinics` INT DEFAULT 0,
  `treatments` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `stats` (`patients`, `doctors`, `clinics`, `treatments`) VALUES
(1420, 24, 12, 18);

-- --------------------------------------------------------
-- 2. Table: doctors
-- --------------------------------------------------------
CREATE TABLE `doctors` (
  `id` VARCHAR(255) PRIMARY KEY,
  `googleId` VARCHAR(255) UNIQUE NULL,
  `loginProvider` VARCHAR(50) DEFAULT 'local',
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NULL,
  `specialization` VARCHAR(255),
  `qualification` VARCHAR(255),
  `experience` INT DEFAULT 0,
  `rating` DECIMAL(3, 2) DEFAULT 5.0,
  `reviewCount` INT DEFAULT 0,
  `fee` INT DEFAULT 0,
  `consultationFee` INT DEFAULT 0,
  `onlineConsultationFee` INT DEFAULT 0,
  `languages` JSON,
  `clinicName` VARCHAR(255),
  `city` VARCHAR(255),
  `state` VARCHAR(255),
  `about` TEXT,
  `education` JSON,
  `awards` JSON,
  `specialExpertise` JSON,
  `availability` VARCHAR(255) DEFAULT 'Mon-Fri (10:00 AM - 4:00 PM)',
  `successRate` INT DEFAULT 90,
  `patientsTreated` INT DEFAULT 1000,
  `verified` BOOLEAN DEFAULT TRUE,
  `onlineConsultation` BOOLEAN DEFAULT FALSE,
  `offlineConsultation` BOOLEAN DEFAULT FALSE,
  `photo` VARCHAR(500),
  `scientificData` JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. Table: clinics
-- --------------------------------------------------------
CREATE TABLE `clinics` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `logo` VARCHAR(500),
  `bannerImage` VARCHAR(500),
  `type` VARCHAR(255),
  `description` TEXT,
  `address` VARCHAR(500),
  `city` VARCHAR(255),
  `state` VARCHAR(255),
  `country` VARCHAR(255),
  `phone` VARCHAR(255),
  `email` VARCHAR(255),
  `website` VARCHAR(255),
  `rating` DECIMAL(3, 2) DEFAULT 5.0,
  `reviewCount` INT DEFAULT 0,
  `yearsEstablished` INT DEFAULT 0,
  `doctorsCount` INT DEFAULT 0,
  `services` JSON,
  `facilities` JSON,
  `openingHours` VARCHAR(255),
  `images` JSON,
  `latitude` DECIMAL(10, 8) DEFAULT 0.0,
  `longitude` DECIMAL(11, 8) DEFAULT 0.0,
  `mission` TEXT,
  `history` TEXT,
  `gallery` JSON,
  `packages` JSON,
  `openingHoursList` JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. Table: testimonials
-- --------------------------------------------------------
CREATE TABLE `testimonials` (
  `id` VARCHAR(255) PRIMARY KEY,
  `patientName` VARCHAR(255) NOT NULL,
  `disease` VARCHAR(255),
  `treatment` VARCHAR(255),
  `recoveryTime` VARCHAR(255),
  `text` TEXT,
  `rating` INT DEFAULT 5,
  `avatar` VARCHAR(500)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. Table: disease_categories
-- --------------------------------------------------------
CREATE TABLE `disease_categories` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `icon` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. Table: diseases
-- --------------------------------------------------------
CREATE TABLE `diseases` (
  `id` VARCHAR(255) PRIMARY KEY,
  `diseaseName` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `scientificName` VARCHAR(255),
  `alternativeNames` JSON,
  `category` VARCHAR(255),
  `subCategory` VARCHAR(255),
  `overview` TEXT,
  `description` TEXT,
  `causes` JSON,
  `symptoms` JSON,
  `earlySymptoms` JSON,
  `advancedSymptoms` JSON,
  `riskFactors` JSON,
  `complications` JSON,
  `prevention` JSON,
  `homeRemedies` JSON,
  `ayurvedicTreatment` TEXT,
  `modernTreatment` TEXT,
  `recommendedHerbs` JSON,
  `recommendedMedicines` JSON,
  `recommendedFoods` JSON,
  `foodsToAvoid` JSON,
  `recommendedYoga` JSON,
  `recommendedExercises` JSON,
  `dailyRoutine` TEXT,
  `sleepRecommendation` TEXT,
  `stressManagement` TEXT,
  `doshaAffected` JSON,
  `bodyPartsAffected` JSON,
  `ageGroup` VARCHAR(255),
  `gender` VARCHAR(255),
  `pregnancySafe` BOOLEAN DEFAULT FALSE,
  `contagious` BOOLEAN DEFAULT FALSE,
  `severity` VARCHAR(50),
  `recoveryTime` VARCHAR(255),
  `consultDoctorWhen` TEXT,
  `emergencyWarning` TEXT,
  `successRate` INT DEFAULT 85,
  `FAQs` JSON,
  `references` JSON,
  `doctorSpecialization` VARCHAR(255),
  `relatedDiseases` JSON,
  `featuredImage` VARCHAR(500),
  `galleryImages` JSON,
  `videoLinks` JSON,
  `rating` DECIMAL(3, 2) DEFAULT 4.8,
  `views` INT DEFAULT 120,
  `bookmarks` INT DEFAULT 30,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 7. Table: treatment_categories
-- --------------------------------------------------------
CREATE TABLE `treatment_categories` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `icon` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 8. Table: treatments
-- --------------------------------------------------------
CREATE TABLE `treatments` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255),
  `category` VARCHAR(255),
  `description` TEXT,
  `overview` TEXT,
  `benefits` JSON,
  `procedure` TEXT,
  `duration` VARCHAR(100),
  `recoveryTime` VARCHAR(100),
  `costEstimate` INT,
  `suitableFor` JSON,
  `contraindications` JSON,
  `precautions` JSON,
  `steps` JSON,
  `image` VARCHAR(500),
  `rating` DECIMAL(3,2) DEFAULT 5.0,
  `reviewCount` INT DEFAULT 0,
  `faq` JSON,
  `modernData` JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 9. Table: treatment_bookings
-- --------------------------------------------------------
CREATE TABLE `treatment_bookings` (
  `id` VARCHAR(255) PRIMARY KEY,
  `treatmentId` VARCHAR(255),
  `treatmentName` VARCHAR(255),
  `patientName` VARCHAR(255) NOT NULL,
  `patientEmail` VARCHAR(255) NOT NULL,
  `patientPhone` VARCHAR(255),
  `preferredDate` DATE NOT NULL,
  `preferredTime` VARCHAR(100),
  `status` VARCHAR(50) DEFAULT 'Pending',
  `notes` TEXT,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 10. Table: doctor_consultations
-- --------------------------------------------------------
CREATE TABLE `doctor_consultations` (
  `id` VARCHAR(255) PRIMARY KEY,
  `doctorId` VARCHAR(255) NOT NULL,
  `doctorName` VARCHAR(255),
  `patientName` VARCHAR(255) NOT NULL,
  `patientEmail` VARCHAR(255) NOT NULL,
  `patientPhone` VARCHAR(255),
  `appointmentDate` DATE NOT NULL,
  `appointmentTime` VARCHAR(100),
  `consultationType` VARCHAR(50),
  `consultationFee` INT DEFAULT 0,
  `paymentMethod` VARCHAR(50) DEFAULT 'Paytm',
  `paymentStatus` VARCHAR(50) DEFAULT 'Paid',
  `paymentTxnId` VARCHAR(255),
  `doctorRevenue` DECIMAL(10, 2) DEFAULT 0.0,
  `platformRevenue` DECIMAL(10, 2) DEFAULT 0.0,
  `notes` TEXT,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 11. Table: patients
-- --------------------------------------------------------
CREATE TABLE `patients` (
  `id` VARCHAR(255) PRIMARY KEY,
  `googleId` VARCHAR(255) UNIQUE NULL,
  `loginProvider` VARCHAR(50) DEFAULT 'local',
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `phone` VARCHAR(50),
  `age` INT,
  `gender` VARCHAR(50),
  `profilePhoto` VARCHAR(500),
  `city` VARCHAR(255),
  `doshaType` VARCHAR(255) DEFAULT 'Pitta-Kapha',
  `healthGoals` JSON,
  `password` VARCHAR(255) NULL,
  `joinedDate` DATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 12. Table: patient_wellness
-- --------------------------------------------------------
CREATE TABLE `patient_wellness` (
  `patientId` VARCHAR(255) PRIMARY KEY,
  `dietAdherence` INT DEFAULT 85,
  `exerciseProgress` INT DEFAULT 90,
  `sleepQuality` INT DEFAULT 80,
  `waterIntake` INT DEFAULT 75,
  FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 13. Table: patient_health_goals
-- --------------------------------------------------------
CREATE TABLE `patient_health_goals` (
  `id` VARCHAR(255) PRIMARY KEY,
  `patientId` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255),
  `progress` INT DEFAULT 0,
  `target` VARCHAR(500),
  FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 14. Table: patient_medical_records
-- --------------------------------------------------------
CREATE TABLE `patient_medical_records` (
  `id` VARCHAR(255) PRIMARY KEY,
  `patientId` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  `date` DATE NOT NULL,
  `doctorName` VARCHAR(255),
  `fileSize` VARCHAR(50),
  `fileUrl` VARCHAR(500),
  FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 15. Table: patient_diet_plans
-- --------------------------------------------------------
CREATE TABLE `patient_diet_plans` (
  `patientId` VARCHAR(255) PRIMARY KEY,
  `activePlan` JSON,
  FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 16. Table: patient_recovery_tracker
-- --------------------------------------------------------
CREATE TABLE `patient_recovery_tracker` (
  `patientId` VARCHAR(255) PRIMARY KEY,
  `conditionName` VARCHAR(255),
  `progress` INT DEFAULT 72,
  `startDate` DATE,
  `expectedCompletion` DATE,
  `weeklyMetrics` JSON,
  `monthlyMetrics` JSON,
  FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 17. Table: notifications
-- --------------------------------------------------------
CREATE TABLE `notifications` (
  `id` VARCHAR(255) PRIMARY KEY,
  `userId` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT,
  `date` DATE,
  `type` VARCHAR(100),
  `readStatus` BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 18. Table: ai_chat_messages
-- --------------------------------------------------------
CREATE TABLE `ai_chat_messages` (
  `id` VARCHAR(255) PRIMARY KEY,
  `patientId` VARCHAR(255) NOT NULL,
  `sender` VARCHAR(50) NOT NULL,
  `text` TEXT,
  `time` VARCHAR(50),
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 19. Table: doctor_appointments
-- --------------------------------------------------------
CREATE TABLE `doctor_appointments` (
  `id` VARCHAR(255) PRIMARY KEY,
  `doctorId` VARCHAR(255) NOT NULL,
  `patientName` VARCHAR(255) NOT NULL,
  `patientEmail` VARCHAR(255) NOT NULL,
  `patientPhone` VARCHAR(255),
  `appointmentDate` DATE NOT NULL,
  `appointmentTime` VARCHAR(100) NOT NULL,
  `consultationType` VARCHAR(50) DEFAULT 'Online Video',
  `status` VARCHAR(50) DEFAULT 'Scheduled',
  `consultationFee` INT DEFAULT 0,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`doctorId`) REFERENCES `doctors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 20. Table: doctor_reviews
-- --------------------------------------------------------
CREATE TABLE `doctor_reviews` (
  `id` VARCHAR(255) PRIMARY KEY,
  `doctorId` VARCHAR(255) NOT NULL,
  `patientName` VARCHAR(255) NOT NULL,
  `rating` DECIMAL(3, 2) DEFAULT 5.0,
  `comment` TEXT,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`doctorId`) REFERENCES `doctors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
