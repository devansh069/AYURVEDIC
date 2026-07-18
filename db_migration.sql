-- AyurVeda Complete Database Migration & Architecture File
-- Recreates the full schema structure and baseline seeds for MySQL.

CREATE DATABASE IF NOT EXISTS `ayurveda`;
USE `ayurveda`;

-- --------------------------------------------------------
-- Table: stats
-- --------------------------------------------------------
DROP TABLE IF EXISTS `stats`;
CREATE TABLE `stats` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `patients` INT DEFAULT 0,
  `doctors` INT DEFAULT 0,
  `clinics` INT DEFAULT 0,
  `treatments` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed stats baseline
INSERT INTO `stats` (`patients`, `doctors`, `clinics`, `treatments`) VALUES
(1420, 24, 12, 18);

-- --------------------------------------------------------
-- Table: doctors
-- --------------------------------------------------------
DROP TABLE IF EXISTS `doctors`;
CREATE TABLE `doctors` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE,
  `password` VARCHAR(255) DEFAULT 'password',
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
  `availability` VARCHAR(255),
  `successRate` INT DEFAULT 90,
  `patientsTreated` INT DEFAULT 1000,
  `verified` BOOLEAN DEFAULT TRUE,
  `onlineConsultation` BOOLEAN DEFAULT FALSE,
  `offlineConsultation` BOOLEAN DEFAULT FALSE,
  `photo` VARCHAR(500),
  `scientificData` JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default doctor 'dr-1'
INSERT INTO `doctors` (
  `id`, `name`, `email`, `password`, `specialization`, `qualification`, `experience`, `rating`, `reviewCount`,
  `fee`, `consultationFee`, `onlineConsultationFee`, `languages`, `clinicName`, `city`, `state`, `about`,
  `education`, `awards`, `specialExpertise`, `availability`, `successRate`, `patientsTreated`, `verified`,
  `onlineConsultation`, `offlineConsultation`, `photo`
) VALUES (
  'dr-1', 'Dr. Arun Sharma', 'dr.arun@ayurvedaconnect.com', 'password', 'Panchakarma & Internal Medicine', 'BAMS, MD (Ayurveda)', 15, 4.9, 120,
  1200, 1200, 1000, '["Hindi", "English"]', 'AyurVeda Wellness Center', 'Jaipur', 'Rajasthan',
  'Senior Ayurvedic physician specializing in Panchakarma therapies and metabolic balance.',
  '["BAMS (Jaipur University)", "MD (Ayurveda) (BHU)"]', '["Ayurveda Shiromani Award 2024"]',
  '["Panchakarma", "PCOS Management", "Metabolic Disorders"]', 'Mon-Sat (9:00 AM - 5:00 PM)', 96, 1847, 1,
  1, 1, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=256&q=80'
);

-- --------------------------------------------------------
-- Table: clinics
-- --------------------------------------------------------
DROP TABLE IF EXISTS `clinics`;
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
-- Table: testimonials
-- --------------------------------------------------------
DROP TABLE IF EXISTS `testimonials`;
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
-- Table: disease_categories
-- --------------------------------------------------------
DROP TABLE IF EXISTS `disease_categories`;
CREATE TABLE `disease_categories` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `icon` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: diseases
-- --------------------------------------------------------
DROP TABLE IF EXISTS `diseases`;
CREATE TABLE `diseases` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255),
  `category` VARCHAR(255),
  `shortDescription` TEXT,
  `severity` VARCHAR(50),
  `image` VARCHAR(500),
  `symptoms` JSON,
  `causes` JSON,
  `ayurvedicPerspective` TEXT,
  `treatments` JSON,
  `recommendedHerbs` JSON,
  `dietRecommendations` JSON,
  `foodsToAvoid` JSON,
  `lifestyleRecommendations` JSON,
  `recoveryTimeline` JSON,
  `faq` JSON,
  `modernData` JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: treatment_categories
-- --------------------------------------------------------
DROP TABLE IF EXISTS `treatment_categories`;
CREATE TABLE `treatment_categories` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `icon` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: treatments
-- --------------------------------------------------------
DROP TABLE IF EXISTS `treatments`;
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
  `rating` DECIMAL(3, 2),
  `reviewCount` INT,
  `faq` JSON,
  `modernData` JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: treatment_bookings
-- --------------------------------------------------------
DROP TABLE IF EXISTS `treatment_bookings`;
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
-- Table: doctor_consultations
-- --------------------------------------------------------
DROP TABLE IF EXISTS `doctor_consultations`;
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
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: patients
-- --------------------------------------------------------
DROP TABLE IF EXISTS `patients`;
CREATE TABLE `patients` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `phone` VARCHAR(50),
  `age` INT,
  `gender` VARCHAR(50),
  `profilePhoto` VARCHAR(500),
  `city` VARCHAR(255),
  `doshaType` VARCHAR(255) DEFAULT 'Pitta-Kapha',
  `healthGoals` JSON,
  `password` VARCHAR(255) NOT NULL DEFAULT 'password',
  `joinedDate` DATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default patient 'pat-123'
INSERT INTO `patients` (`id`, `name`, `email`, `phone`, `age`, `gender`, `profilePhoto`, `city`, `doshaType`, `healthGoals`, `password`, `joinedDate`)
VALUES ('pat-123', 'Priyanshi Sharma', 'priyanshi@ayurvedaconnect.com', '+91 98765 43210', 28, 'Female',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80', 'New Delhi', 'Pitta-Kapha',
        '["PCOS Management", "Stress Reduction", "Improved Digestion"]', 'password', '2026-01-15');

-- --------------------------------------------------------
-- Table: patient_wellness
-- --------------------------------------------------------
DROP TABLE IF EXISTS `patient_wellness`;
CREATE TABLE `patient_wellness` (
  `patientId` VARCHAR(255) PRIMARY KEY,
  `dietAdherence` INT DEFAULT 85,
  `exerciseProgress` INT DEFAULT 90,
  `sleepQuality` INT DEFAULT 80,
  `waterIntake` INT DEFAULT 75,
  FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed patient wellness metrics
INSERT INTO `patient_wellness` (`patientId`, `dietAdherence`, `exerciseProgress`, `sleepQuality`, `waterIntake`)
VALUES ('pat-123', 85, 90, 80, 75);

-- --------------------------------------------------------
-- Table: patient_health_goals
-- --------------------------------------------------------
DROP TABLE IF EXISTS `patient_health_goals`;
CREATE TABLE `patient_health_goals` (
  `id` VARCHAR(255) PRIMARY KEY,
  `patientId` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255),
  `progress` INT DEFAULT 0,
  `target` VARCHAR(500),
  FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed patient health goals
INSERT INTO `patient_health_goals` (`id`, `patientId`, `title`, `progress`, `target`) VALUES
('goal-1', 'pat-123', 'Weight Management', 68, 'Reduce Kapha weight by 5kg'),
('goal-2', 'pat-123', 'PCOS Management', 75, 'Cycle regularity & hormonal balance'),
('goal-3', 'pat-123', 'Stress Reduction', 80, 'Increase mindfulness and sleep hours');

-- --------------------------------------------------------
-- Table: patient_medical_records
-- --------------------------------------------------------
DROP TABLE IF EXISTS `patient_medical_records`;
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

-- Seed patient medical records
INSERT INTO `patient_medical_records` (`id`, `patientId`, `title`, `type`, `date`, `doctorName`, `fileSize`, `fileUrl`) VALUES
('rec-doc-1', 'pat-123', 'Thyroid & Doshic Profile Blood Test', 'Report', '2026-05-18', 'Dr. Vikram Chauhan', '2.4 MB', '#'),
('rec-doc-2', 'pat-123', 'PCOS Hormone Analysis Summary', 'Report', '2026-04-12', 'Dr. Smita Naram', '1.8 MB', '#'),
('rec-doc-3', 'pat-123', 'Vata-Reducing Herbal Decoction Guide', 'Prescription', '2026-05-15', 'Dr. Vikram Chauhan', '840 KB', '#');

-- --------------------------------------------------------
-- Table: patient_diet_plans
-- --------------------------------------------------------
DROP TABLE IF EXISTS `patient_diet_plans`;
CREATE TABLE `patient_diet_plans` (
  `patientId` VARCHAR(255) PRIMARY KEY,
  `activePlan` JSON,
  FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: patient_recovery_tracker
-- --------------------------------------------------------
DROP TABLE IF EXISTS `patient_recovery_tracker`;
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

-- Seed patient recovery metrics
INSERT INTO `patient_recovery_tracker` (`patientId`, `conditionName`, `progress`, `startDate`, `expectedCompletion`, `weeklyMetrics`, `monthlyMetrics`)
VALUES (
  'pat-123',
  'PCOS & Metabolic Imbalance',
  72,
  '2026-04-10',
  '2026-08-10',
  '[{"name": "Wk 1", "progress": 10, "target": 15}, {"name": "Wk 2", "progress": 25, "target": 30}, {"name": "Wk 3", "progress": 42, "target": 45}, {"name": "Wk 4", "progress": 55, "target": 60}, {"name": "Wk 5", "progress": 62, "target": 70}, {"name": "Wk 6", "progress": 72, "target": 80}]',
  '[{"name": "Apr", "progress": 30, "target": 40}, {"name": "May", "progress": 60, "target": 70}, {"name": "Jun", "progress": 72, "target": 80}]'
);

-- --------------------------------------------------------
-- Table: notifications
-- --------------------------------------------------------
DROP TABLE IF EXISTS `notifications`;
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

-- Seed notifications
INSERT INTO `notifications` (`id`, `userId`, `role`, `title`, `message`, `date`, `type`, `readStatus`) VALUES
('notif-1', 'pat-123', 'patient', 'Upcoming Consultation Alert', 'Your appointment with Dr. Vikram Chauhan is in 3 days. Prepare your diet logs.', '2026-06-12', 'Appointment', 0),
('notif-2', 'pat-123', 'patient', 'Morning Kashayam Reminder', 'Time to consume your Dashamula decoction (empty stomach) for optimal metabolic fire.', '2026-06-12', 'Reminder', 0),
('notif-3', 'pat-123', 'patient', 'Daily Health Tip', 'Avoid drinking ice-cold water during or immediately after meals as it dampens Agni (digestive fire).', '2026-06-11', 'Tip', 0);

-- --------------------------------------------------------
-- Table: ai_chat_messages
-- --------------------------------------------------------
DROP TABLE IF EXISTS `ai_chat_messages`;
CREATE TABLE `ai_chat_messages` (
  `id` VARCHAR(255) PRIMARY KEY,
  `patientId` VARCHAR(255) NOT NULL,
  `sender` VARCHAR(50) NOT NULL,
  `text` TEXT,
  `time` VARCHAR(50),
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed welcome chat message
INSERT INTO `ai_chat_messages` (`id`, `patientId`, `sender`, `text`, `time`) VALUES
('chat-msg-1', 'pat-123', 'ai', 'Namaste Priyanshi. I am your Vaidya AI Assistant. I see we are balancing a Pitta-Kapha dosha today. How can I assist you with your PCOS management, diet plans, or herbal decoctions?', '02:52 PM');
