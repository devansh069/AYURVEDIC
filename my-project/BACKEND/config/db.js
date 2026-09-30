// BACKEND/config/db.js
// MySQL database connector using mysql2/promise with automatic schema & data seeding.
require("dotenv").config();
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const sequelize = require("./sequelize");

let pool = null;

const connectDB = async () => {
  const host = process.env.DB_HOST || "localhost";
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASSWORD || "Princy@1979";
  const database = process.env.DB_NAME || "ayurveda";
  const port = parseInt(process.env.DB_PORT || "3306", 10);

  try {
    // 1. Establish initial connection without database to ensure database exists
    const tempConnection = await mysql.createConnection({
      host,
      user,
      password,
      port
    });
    
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    await tempConnection.end();
    console.log(`🚀 Database "${database}" verified/created successfully.`);

    // 2. Initialize connection pool targeting database
    pool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // 3. Create tables if not exists
    await createTables();

    // 3b. Authenticate and sync Sequelize models
    await sequelize.authenticate();
    console.log("🚀 Sequelize Database Connection Authenticated.");
    await sequelize.sync({ alter: true });
    console.log("🚀 Sequelize Models Synced Successfully.");

    // 4. Auto seed if tables are empty
    await autoSeed();

    console.log("🚀 MySQL Pool Connected and Initialized Successfully.");
    return pool;
  } catch (err) {
    console.error(`❌ MySQL Connection/Initialization Error: ${err.message}`);
    pool = null;
    return null;
  }
};

const createTables = async () => {
  const conn = await pool.getConnection();
  try {
    // stats table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patients INT DEFAULT 0,
        doctors INT DEFAULT 0,
        clinics INT DEFAULT 0,
        treatments INT DEFAULT 0
      )
    `);

    // doctors table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255) DEFAULT 'password',
        specialization VARCHAR(255),
        qualification VARCHAR(255),
        experience INT DEFAULT 0,
        rating DECIMAL(3, 2) DEFAULT 5.0,
        reviewCount INT DEFAULT 0,
        fee INT DEFAULT 0,
        consultationFee INT DEFAULT 0,
        onlineConsultationFee INT DEFAULT 0,
        languages JSON,
        clinicName VARCHAR(255),
        city VARCHAR(255),
        state VARCHAR(255),
        about TEXT,
        education JSON,
        awards JSON,
        specialExpertise JSON,
        availability VARCHAR(255),
        successRate INT DEFAULT 90,
        patientsTreated INT DEFAULT 1000,
        verified BOOLEAN DEFAULT TRUE,
        onlineConsultation BOOLEAN DEFAULT FALSE,
        offlineConsultation BOOLEAN DEFAULT FALSE,
        photo VARCHAR(500),
        scientificData JSON
      )
    `);

    try {
      await conn.query("ALTER TABLE doctors ADD COLUMN googleId VARCHAR(255) UNIQUE");
    } catch (e) {
      // Column already exists, ignore
    }
    try {
      await conn.query("ALTER TABLE doctors ADD COLUMN loginProvider VARCHAR(50) DEFAULT 'local'");
    } catch (e) {
      // Column already exists, ignore
    }
    try {
      await conn.query("ALTER TABLE doctors MODIFY COLUMN password VARCHAR(255) NULL");
    } catch (e) {
      // Ignore
    }

    // clinics table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS clinics (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo VARCHAR(500),
        bannerImage VARCHAR(500),
        type VARCHAR(255),
        description TEXT,
        address VARCHAR(500),
        city VARCHAR(255),
        state VARCHAR(255),
        country VARCHAR(255),
        phone VARCHAR(255),
        email VARCHAR(255),
        website VARCHAR(255),
        rating DECIMAL(3, 2) DEFAULT 5.0,
        reviewCount INT DEFAULT 0,
        yearsEstablished INT DEFAULT 0,
        doctorsCount INT DEFAULT 0,
        services JSON,
        facilities JSON,
        openingHours VARCHAR(255),
        images JSON,
        latitude DECIMAL(10, 8) DEFAULT 0.0,
        longitude DECIMAL(11, 8) DEFAULT 0.0,
        mission TEXT,
        history TEXT,
        gallery JSON,
        packages JSON,
        openingHoursList JSON
      )
    `);

    // testimonials table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id VARCHAR(255) PRIMARY KEY,
        patientName VARCHAR(255) NOT NULL,
        disease VARCHAR(255),
        treatment VARCHAR(255),
        recoveryTime VARCHAR(255),
        text TEXT,
        rating INT DEFAULT 5,
        avatar VARCHAR(500)
      )
    `);

    // disease_categories table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS disease_categories (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(255)
      )
    `);

    // diseases table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS diseases (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255),
        category VARCHAR(255),
        shortDescription TEXT,
        severity VARCHAR(50),
        image VARCHAR(500),
        symptoms JSON,
        causes JSON,
        ayurvedicPerspective TEXT,
        treatments JSON,
        recommendedHerbs JSON,
        dietRecommendations JSON,
        foodsToAvoid JSON,
        lifestyleRecommendations JSON,
        recoveryTimeline JSON,
        faq JSON,
        modernData JSON
      )
    `);

    try {
      await conn.query("ALTER TABLE diseases ADD COLUMN modernData JSON");
    } catch (e) {
      // Column already exists, ignore
    }

    // treatment_categories table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS treatment_categories (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(255)
      )
    `);

    // treatments table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS treatments (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255),
        category VARCHAR(255),
        description TEXT,
        overview TEXT,
        benefits JSON,
        \`procedure\` TEXT,
        duration VARCHAR(100),
        recoveryTime VARCHAR(100),
        costEstimate INT,
        suitableFor JSON,
        contraindications JSON,
        precautions JSON,
        steps JSON,
        image VARCHAR(500),
        rating DECIMAL(3,2),
        reviewCount INT,
        faq JSON,
        modernData JSON
      )
    `);

    // treatment_bookings table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS treatment_bookings (
        id VARCHAR(255) PRIMARY KEY,
        treatmentId VARCHAR(255),
        treatmentName VARCHAR(255),
        patientName VARCHAR(255) NOT NULL,
        patientEmail VARCHAR(255) NOT NULL,
        patientPhone VARCHAR(255),
        preferredDate DATE NOT NULL,
        preferredTime VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Pending',
        notes TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // doctor_consultations table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS doctor_consultations (
        id VARCHAR(255) PRIMARY KEY,
        doctorId VARCHAR(255) NOT NULL,
        doctorName VARCHAR(255),
        patientName VARCHAR(255) NOT NULL,
        patientEmail VARCHAR(255) NOT NULL,
        patientPhone VARCHAR(255),
        appointmentDate DATE NOT NULL,
        appointmentTime VARCHAR(100),
        consultationType VARCHAR(50),
        consultationFee INT DEFAULT 0,
        paymentMethod VARCHAR(50) DEFAULT 'Paytm',
        paymentStatus VARCHAR(50) DEFAULT 'Paid',
        paymentTxnId VARCHAR(255),
        doctorRevenue DECIMAL(10, 2) DEFAULT 0.0,
        platformRevenue DECIMAL(10, 2) DEFAULT 0.0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // patients table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id VARCHAR(255) PRIMARY KEY,
        googleId VARCHAR(255) UNIQUE,
        loginProvider VARCHAR(50) DEFAULT 'local',
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        age INT,
        gender VARCHAR(50),
        profilePhoto VARCHAR(500),
        city VARCHAR(255),
        doshaType VARCHAR(255) DEFAULT 'Pitta-Kapha',
        healthGoals JSON,
        password VARCHAR(255) NULL,
        joinedDate DATE
      )
    `);

    // patient_wellness table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS patient_wellness (
        patientId VARCHAR(255) PRIMARY KEY,
        dietAdherence INT DEFAULT 85,
        exerciseProgress INT DEFAULT 90,
        sleepQuality INT DEFAULT 80,
        waterIntake INT DEFAULT 75
      )
    `);

    // patient_health_goals table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS patient_health_goals (
        id VARCHAR(255) PRIMARY KEY,
        patientId VARCHAR(255) NOT NULL,
        title VARCHAR(255),
        progress INT DEFAULT 0,
        target VARCHAR(500)
      )
    `);

    // patient_medical_records table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS patient_medical_records (
        id VARCHAR(255) PRIMARY KEY,
        patientId VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        doctorName VARCHAR(255),
        fileSize VARCHAR(50),
        fileUrl VARCHAR(500)
      )
    `);

    // patient_diet_plans table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS patient_diet_plans (
        patientId VARCHAR(255) PRIMARY KEY,
        activePlan JSON
      )
    `);

    // patient_recovery_tracker table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS patient_recovery_tracker (
        patientId VARCHAR(255) PRIMARY KEY,
        conditionName VARCHAR(255),
        progress INT DEFAULT 72,
        startDate DATE,
        expectedCompletion DATE,
        weeklyMetrics JSON,
        monthlyMetrics JSON
      )
    `);

    // notifications table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(255) PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT,
        date DATE,
        type VARCHAR(100),
        readStatus BOOLEAN DEFAULT FALSE
      )
    `);

    // ai_chat_messages table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS ai_chat_messages (
        id VARCHAR(255) PRIMARY KEY,
        patientId VARCHAR(255) NOT NULL,
        sender VARCHAR(50) NOT NULL,
        text TEXT,
        time VARCHAR(50),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);


    // doctor_appointments table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS doctor_appointments (
        id VARCHAR(255) PRIMARY KEY,
        doctorId VARCHAR(255) NOT NULL,
        patientName VARCHAR(255) NOT NULL,
        patientEmail VARCHAR(255) NOT NULL,
        patientPhone VARCHAR(255),
        appointmentDate DATE NOT NULL,
        appointmentTime VARCHAR(100) NOT NULL,
        consultationType VARCHAR(50) DEFAULT 'Online Video',
        status VARCHAR(50) DEFAULT 'Scheduled',
        consultationFee INT DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (doctorId) REFERENCES doctors(id) ON DELETE CASCADE
      )
    `);

    // doctor_reviews table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS doctor_reviews (
        id VARCHAR(255) PRIMARY KEY,
        doctorId VARCHAR(255) NOT NULL,
        patientName VARCHAR(255) NOT NULL,
        rating DECIMAL(3, 2) DEFAULT 5.0,
        comment TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (doctorId) REFERENCES doctors(id) ON DELETE CASCADE
      )
    `);

    // Alter table schemas dynamically to add any missing columns in dev environment
    try {
      await conn.query("ALTER TABLE doctors ADD COLUMN email VARCHAR(255) UNIQUE");
    } catch (e) {}
    try {
      await conn.query("ALTER TABLE doctors ADD COLUMN password VARCHAR(255) DEFAULT 'password'");
    } catch (e) {}
    try {
      await conn.query("ALTER TABLE doctors ADD COLUMN onlineConsultationFee INT DEFAULT 0");
    } catch (e) {}
    try {
      await conn.query("ALTER TABLE doctors ADD COLUMN successRate INT DEFAULT 90");
    } catch (e) {}
    try {
      await conn.query("ALTER TABLE doctors ADD COLUMN patientsTreated INT DEFAULT 1000");
    } catch (e) {}
    try {
      await conn.query("ALTER TABLE doctors ADD COLUMN verified BOOLEAN DEFAULT TRUE");
    } catch (e) {}
    try {
      await conn.query("ALTER TABLE doctors ADD COLUMN scientificData JSON");
    } catch (e) {}
    // No dummy updates
    try {
      await conn.query("ALTER TABLE patients MODIFY COLUMN password VARCHAR(255) NULL");
    } catch (e) {}
    try {
      await conn.query("ALTER TABLE patients ADD COLUMN googleId VARCHAR(255) UNIQUE");
    } catch (e) {}
    try {
      await conn.query("ALTER TABLE patients ADD COLUMN loginProvider VARCHAR(50) DEFAULT 'local'");
    } catch (e) {}

    console.log("✅ MySQL Database Tables verified/created.");
  } finally {
    conn.release();
  }
};

const autoSeed = async () => {
  const conn = await pool.getConnection();
  try {
    // Seed stats
    const [statsRows] = await conn.query("SELECT COUNT(*) as count FROM stats");
    if (statsRows[0].count === 0) {
      const statsPath = path.join(__dirname, "..", "data", "stats.json");
      if (fs.existsSync(statsPath)) {
        console.log("🌱 Seeding Stats into MySQL...");
        const data = JSON.parse(fs.readFileSync(statsPath, "utf-8"));
        await conn.query(
          "INSERT INTO stats (patients, doctors, clinics, treatments) VALUES (?, ?, ?, ?)",
          [data.patients, data.doctors, data.clinics, data.treatments]
        );
        console.log("✅ Stats seeded into MySQL.");
      }
    }

    // Seed doctors
    const [doctorsRows] = await conn.query("SELECT COUNT(*) as count FROM doctors");
    if (doctorsRows[0].count < 24) {
      console.log("🧹 Clearing old/partial doctors registry in MySQL...");
      await conn.query("DELETE FROM doctors");
      const doctorsPath = path.join(__dirname, "..", "data", "doctors.json");
      if (fs.existsSync(doctorsPath)) {
        console.log("🌱 Seeding 24 Doctors into MySQL...");
        const doctorsList = JSON.parse(fs.readFileSync(doctorsPath, "utf-8"));
        for (const doc of doctorsList) {
          const emailSeed = doc.email || (doc.name.toLowerCase().replace(/[^a-z]/g, '') + "@ayurvedaconnect.com");
          const passwordSeed = doc.password || 'password';
          await conn.query(`
            INSERT INTO doctors (
              id, name, email, password, specialization, qualification, experience, rating, reviewCount,
              fee, consultationFee, onlineConsultationFee, languages, clinicName, city, state, about,
              education, awards, specialExpertise, availability, successRate, patientsTreated, verified,
              onlineConsultation, offlineConsultation, photo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            doc.id, doc.name, emailSeed, passwordSeed, doc.specialization, doc.qualification, doc.experience, parseFloat(doc.rating), parseInt(doc.reviewCount, 10),
            parseInt(doc.consultationFee, 10), parseInt(doc.consultationFee, 10), parseInt(doc.onlineConsultationFee || 0, 10),
            JSON.stringify(doc.languages), doc.clinicName, doc.city, doc.state, doc.about,
            JSON.stringify(doc.education || []), JSON.stringify(doc.awards || []), JSON.stringify(doc.specialExpertise || []),
            doc.availability, parseInt(doc.successRate || 90, 10), parseInt(doc.patientsTreated || 1000, 10),
            doc.verified ? 1 : 0, doc.onlineConsultationFee > 0 ? 1 : 0, doc.consultationFee > 0 ? 1 : 0, doc.photo
          ]);
        }
        console.log("✅ 24 Doctors seeded into MySQL.");
      }
    }

    // Seed clinics
    const [clinicsRows] = await conn.query("SELECT COUNT(*) as count FROM clinics");
    if (clinicsRows[0].count === 0) {
      const clinicsPath = path.join(__dirname, "..", "data", "clinics.json");
      if (fs.existsSync(clinicsPath)) {
        console.log("🌱 Seeding Clinics into MySQL...");
        const clinicsList = JSON.parse(fs.readFileSync(clinicsPath, "utf-8"));
        for (const cl of clinicsList) {
          await conn.query(`
            INSERT INTO clinics (
              id, name, logo, bannerImage, type, description, address, city, state, country,
              phone, email, website, rating, reviewCount, yearsEstablished, doctorsCount,
              services, facilities, openingHours, images, latitude, longitude, mission, history,
              gallery, packages, openingHoursList
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            cl.id, cl.name, cl.logo, cl.bannerImage, cl.type, cl.description, cl.address, cl.city, cl.state, cl.country,
            cl.phone, cl.email, cl.website, parseFloat(cl.rating), parseInt(cl.reviewCount, 10), parseInt(cl.yearsEstablished, 10), parseInt(cl.doctorsCount, 10),
            JSON.stringify(cl.services), JSON.stringify(cl.facilities), cl.openingHours, JSON.stringify(cl.images),
            parseFloat(cl.latitude), parseFloat(cl.longitude), cl.mission, cl.history,
            JSON.stringify(cl.gallery), JSON.stringify(cl.packages), JSON.stringify(cl.openingHoursList)
          ]);
        }
        console.log("✅ Clinics seeded into MySQL.");
      }
    }

    // Seed testimonials
    const [testimonialsRows] = await conn.query("SELECT COUNT(*) as count FROM testimonials");
    if (testimonialsRows[0].count === 0) {
      const testimonialsPath = path.join(__dirname, "..", "data", "testimonials.json");
      if (fs.existsSync(testimonialsPath)) {
        console.log("🌱 Seeding Testimonials into MySQL...");
        const testimonialsList = JSON.parse(fs.readFileSync(testimonialsPath, "utf-8"));
        for (const test of testimonialsList) {
          await conn.query(`
            INSERT INTO testimonials (id, patientName, disease, treatment, recoveryTime, text, rating, avatar)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            test.id, test.patientName, test.disease, test.treatment, test.recoveryTime, test.text, parseInt(test.rating, 10), test.avatar
          ]);
        }
        console.log("✅ Testimonials seeded into MySQL.");
      }
    }

    // Seed disease_categories
    const DiseaseCategory = require("../models/DiseaseCategory");
    const [diseaseCatRows] = await conn.query("SELECT COUNT(*) as count FROM disease_categories");
    if (diseaseCatRows[0].count === 0) {
      const diseaseCatPath = path.join(__dirname, "..", "data", "disease_categories.json");
      if (fs.existsSync(diseaseCatPath)) {
        console.log("🌱 Seeding Disease Categories into MySQL...");
        const categories = JSON.parse(fs.readFileSync(diseaseCatPath, "utf-8"));
        for (const cat of categories) {
          await DiseaseCategory.create(cat);
        }
        console.log("✅ Disease Categories seeded into MySQL.");
      }
    }

    // Seed diseases
    const Disease = require("../models/Disease");
    const [diseasesRows] = await conn.query("SELECT COUNT(*) as count FROM diseases");
    if (diseasesRows[0].count < 30) {
      console.log("🧹 Clearing old mock diseases registry in MySQL...");
      await conn.query("DELETE FROM diseases");
      console.log("🌱 Seeding 30 Real Diseases into MySQL...");
      const diseasesList = require("../seed/diseases");
      for (const dis of diseasesList) {
        await Disease.create(dis);
      }
      console.log("✅ 30 Diseases seeded into MySQL.");
    }

    // Seed treatment_categories
    const [treatmentCatRows] = await conn.query("SELECT COUNT(*) as count FROM treatment_categories");
    if (treatmentCatRows[0].count === 0) {
      const treatmentCatPath = path.join(__dirname, "..", "data", "treatment_categories.json");
      if (fs.existsSync(treatmentCatPath)) {
        console.log("🌱 Seeding Treatment Categories into MySQL...");
        const categories = JSON.parse(fs.readFileSync(treatmentCatPath, "utf-8"));
        for (const cat of categories) {
          await conn.query(`
            INSERT INTO treatment_categories (id, name, description, icon)
            VALUES (?, ?, ?, ?)
          `, [cat.id, cat.name, cat.description, cat.icon]);
        }
        console.log("✅ Treatment Categories seeded into MySQL.");
      }
    }

    // Seed treatments
    const [trtRows] = await conn.query("SELECT COUNT(*) as count FROM treatments");
    if (trtRows[0].count === 0) {
      const trtPath = path.join(__dirname, "..", "data", "treatments.json");
      if (fs.existsSync(trtPath)) {
        console.log("🌱 Seeding Treatments into MySQL...");
        const treatmentsList = JSON.parse(fs.readFileSync(trtPath, "utf-8"));
        for (const trt of treatmentsList) {
          await conn.query(`
            INSERT INTO treatments (
              id, name, slug, category, description, overview, benefits,
              \`procedure\`, duration, recoveryTime, costEstimate, suitableFor,
              contraindications, precautions, steps, image, rating, reviewCount, faq, modernData
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            trt.id, trt.name, trt.slug, trt.category, trt.description, trt.overview,
            JSON.stringify(trt.benefits), trt.procedure, trt.duration, trt.recoveryTime,
            parseInt(trt.costEstimate, 10), JSON.stringify(trt.suitableFor),
            JSON.stringify(trt.contraindications), JSON.stringify(trt.precautions),
            JSON.stringify(trt.steps), trt.image, parseFloat(trt.rating),
            parseInt(trt.reviewCount, 10), JSON.stringify(trt.faq), null
          ]);
        }
        console.log("✅ Treatments seeded into MySQL.");
      }
    }

    // Dummy patient and doctor auto-seeding removed. Real accounts register dynamically.


  } catch (error) {
    console.error("❌ MySQL Seeding Error:", error);
  } finally {
    conn.release();
  }
};

const getPool = () => pool;

module.exports = connectDB;
module.exports.getPool = getPool;
