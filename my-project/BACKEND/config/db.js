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

    // Seed patients
    const [patientRows] = await conn.query("SELECT COUNT(*) as count FROM patients");
    if (patientRows[0].count === 0) {
      console.log("🌱 Seeding Baseline Patient into MySQL...");
      await conn.query(`
        INSERT INTO patients (
          id, name, email, phone, age, gender, profilePhoto, city, doshaType, healthGoals, password, joinedDate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'pat-1', 'Priyanshi Sharma', 'priyanshi@ayurvedaconnect.com', '+91 98765 43210', 28, 'Female',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80', 'New Delhi', 'Pitta-Kapha',
        JSON.stringify(['PCOS Management', 'Stress Reduction', 'Improved Digestion']),
        'Gandhi@2005', '2026-01-15'
      ]);

      await conn.query(`
        INSERT INTO patient_wellness (patientId, dietAdherence, exerciseProgress, sleepQuality, waterIntake)
        VALUES (?, ?, ?, ?, ?)
      `, ['pat-1', 85, 90, 80, 75]);

      await conn.query(`
        INSERT INTO patient_health_goals (id, patientId, title, progress, target) VALUES
        ('goal-1', 'pat-1', 'Daily Herbal Decoction (Kadha)', 80, 'Every morning before breakfast'),
        ('goal-2', 'pat-1', 'Pranayama & Meditation', 65, '20 mins daily (Sheetali & Anulom Vilom)'),
        ('goal-3', 'pat-1', 'Diet Adherence (Pathya)', 90, 'No cold dairy, refined sugar or fried foods')
      `);

      await conn.query(`
        INSERT INTO patient_medical_records (id, patientId, title, type, date, doctorName, fileSize, fileUrl) VALUES
        ('rec-1', 'pat-1', 'Panchakarma Detox Protocol Summary', 'Clinical Report', '2026-05-10', 'Dr. Aditya Vardhan Sharma', '2.4 MB', '#'),
        ('rec-2', 'pat-1', 'Nadi Pariksha & Dosha Balance Assessment', 'Diagnostic', '2026-04-18', 'Dr. Sandeep Kulkarni', '1.8 MB', '#'),
        ('rec-3', 'pat-1', 'Complete Hormone & Thyroid Panel', 'Lab Test', '2026-03-25', 'Dr. Lakshmi S. Nair', '3.1 MB', '#')
      `);

      await conn.query(`
        INSERT INTO patient_recovery_tracker (patientId, conditionName, progress, startDate, expectedCompletion, weeklyMetrics, monthlyMetrics)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        'pat-1', 'PCOS & Metabolic Restoration', 74, '2026-03-01', '2026-07-01',
        JSON.stringify([
          { name: 'Wk 1', progress: 15, target: 20 },
          { name: 'Wk 2', progress: 30, target: 35 },
          { name: 'Wk 3', progress: 48, target: 50 },
          { name: 'Wk 4', progress: 60, target: 65 },
          { name: 'Wk 5', progress: 68, target: 75 },
          { name: 'Wk 6', progress: 74, target: 80 }
        ]),
        JSON.stringify([
          { name: 'Mar', progress: 30, target: 40 },
          { name: 'Apr', progress: 55, target: 60 },
          { name: 'May', progress: 74, target: 80 }
        ])
      ]);

      console.log("✅ Baseline Patient and records seeded into MySQL.");
    }

    // Seed doctor_consultations and appointments
    const [consultationRows] = await conn.query("SELECT COUNT(*) as count FROM doctor_consultations");
    if (consultationRows[0].count === 0) {
      console.log("🌱 Seeding Consultations into MySQL...");
      await conn.query(`
        INSERT INTO doctor_consultations (
          id, doctorId, doctorName, patientName, patientEmail, patientPhone,
          appointmentDate, appointmentTime, consultationType, consultationFee,
          paymentMethod, paymentStatus, paymentTxnId, doctorRevenue, platformRevenue
        ) VALUES 
        ('ap-101', 'doc-dir-1', 'Dr. Aditya Vardhan Sharma', 'Priyanshi Sharma', 'priyanshi@ayurvedaconnect.com', '+91 98765 43210', '2026-10-05', '09:00 AM', 'Online Video', 800, 'Paytm', 'Paid', 'TXN-PAYTM-101', 680.00, 120.00),
        ('ap-102', 'doc-dir-1', 'Dr. Aditya Vardhan Sharma', 'Rahul Verma', 'rahul.verma@gmail.com', '+91 87654 32109', '2026-10-06', '10:30 AM', 'In-Clinic', 800, 'Paytm', 'Paid', 'TXN-PAYTM-102', 680.00, 120.00),
        ('ap-103', 'doc-dir-1', 'Dr. Aditya Vardhan Sharma', 'Sunita Reddy', 'sunita.reddy@gmail.com', '+91 76543 21098', '2026-10-07', '12:00 PM', 'In-Clinic', 800, 'Paytm', 'Pending', 'TXN-PAYTM-103', 680.00, 120.00),
        ('ap-104', 'doc-dir-1', 'Dr. Aditya Vardhan Sharma', 'Amit Joshi', 'amit.joshi@gmail.com', '+91 65432 10987', '2026-10-08', '02:00 PM', 'Online Video', 800, 'Paytm', 'Paid', 'TXN-PAYTM-104', 680.00, 120.00),
        ('ap-105', 'doc-dir-1', 'Dr. Aditya Vardhan Sharma', 'Meera Pillai', 'meera.pillai@gmail.com', '+91 54321 09876', '2026-10-09', '09:30 AM', 'In-Clinic', 800, 'Paytm', 'Pending', 'TXN-PAYTM-105', 680.00, 120.00),
        ('ap-106', 'doc-dir-1', 'Dr. Aditya Vardhan Sharma', 'Deepak Singh', 'deepak.singh@gmail.com', '+91 43210 98765', '2026-10-10', '11:00 AM', 'Online Video', 800, 'Paytm', 'Completed', 'TXN-PAYTM-106', 680.00, 120.00)
      `);

      await conn.query(`
        INSERT INTO doctor_appointments (
          id, doctorId, patientName, patientEmail, patientPhone, appointmentDate, appointmentTime, consultationType, status, consultationFee
        ) VALUES
        ('apt-101', 'doc-dir-1', 'Priyanshi Sharma', 'priyanshi@ayurvedaconnect.com', '+91 98765 43210', '2026-10-05', '09:00 AM', 'Online Video', 'Confirmed', 800),
        ('apt-102', 'doc-dir-1', 'Rahul Verma', 'rahul.verma@gmail.com', '+91 87654 32109', '2026-10-06', '10:30 AM', 'In-Clinic', 'Confirmed', 800),
        ('apt-103', 'doc-dir-1', 'Sunita Reddy', 'sunita.reddy@gmail.com', '+91 76543 21098', '2026-10-07', '12:00 PM', 'In-Clinic', 'Pending', 800),
        ('apt-104', 'doc-dir-1', 'Amit Joshi', 'amit.joshi@gmail.com', '+91 65432 10987', '2026-10-08', '02:00 PM', 'Online Video', 'Confirmed', 800),
        ('apt-105', 'doc-dir-1', 'Meera Pillai', 'meera.pillai@gmail.com', '+91 54321 09876', '2026-10-09', '09:30 AM', 'In-Clinic', 'Pending', 800),
        ('apt-106', 'doc-dir-1', 'Deepak Singh', 'deepak.singh@gmail.com', '+91 43210 98765', '2026-10-10', '11:00 AM', 'Online Video', 'Completed', 800)
      `);
      console.log("✅ Consultations & Appointments seeded into MySQL.");
    }
  } catch (error) {
    console.error("❌ MySQL Seeding Error:", error);
  } finally {
    conn.release();
  }
};

const getPool = () => pool;

module.exports = connectDB;
module.exports.getPool = getPool;
