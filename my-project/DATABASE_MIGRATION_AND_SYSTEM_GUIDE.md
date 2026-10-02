# AyurVeda Platform - Complete Database Architecture, Migration & System Guide

## Executive Summary

This document details the transformation of the **AyurVeda Health Platform** from static/dummy mock files into a **100% live, production-ready relational database architecture powered by MySQL 8.0+**. 

Every page, dashboard metric, patient record, doctor consultation, treatment booking, clinic chronicle, and symptom checker question is now backed by real SQL database tables and persistent API services.

---

## 1. Developer Onboarding: Running the Migration

> **Will another person get all the seeded data if they run the migration?**
>
> **YES!** The master migration file is self-contained. It creates the database, drops any previous tables safely, defines all 23 table schemas (with primary keys, indexes, and foreign keys), and seeds all authentic baseline production records.

### How to Run the Migration (Automated)

1. Open a terminal in `my-project/BACKEND`:
   ```bash
   cd BACKEND
   npm install
   ```
2. Verify or update your database credentials in `BACKEND/.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=ayurveda
   ```
3. Run the automated migration script:
   ```bash
   npm run migrate
   ```
   *The runner automatically executes `db_migration.sql` with full multi-statement transaction safety.*

### Alternative: Direct MySQL Import
You can also import the migration script directly using MySQL CLI or MySQL Workbench:
```sql
SOURCE /path/to/my-project/db_migration.sql;
```

---

## 2. Complete Database Architecture (23 MySQL Tables)

The platform is organized across 4 primary architectural domains comprising 23 relational tables:

```
                            ┌─────────────────────────────────────────┐
                            │            AYURVEDA DATABASE            │
                            └────────────────────┬────────────────────┘
                                                 │
      ┌──────────────────────┬───────────────────┴───────────────────┬──────────────────────┐
      │                      │                                       │                      │
┌─────▼──────┐        ┌──────▼──────┐                        ┌───────▼─────┐         ┌──────▼──────┐
│ Core Domain│        │Doctor Domain│                        │PatientDomain│         │  AI & Comms │
└─────┬──────┘        └──────┬──────┘                        └───────┬─────┘         └──────┬──────┘
      │                      │                                       │                      │
      ├─ stats               ├─ doctors                              ├─ patients            ├─ notifications
      ├─ testimonials        ├─ doctor_consultations                 ├─ patient_wellness    ├─ ai_chat_messages
      ├─ disease_categories  ├─ doctor_appointments                  ├─ patient_health_goals├─ symptom_checker_data
      ├─ diseases            ├─ doctor_reviews                       ├─ patient_medical_recs│
      ├─ treatment_categories├─ doctor_messages                      ├─ patient_diet_plans  │
      ├─ treatments          │                                       ├─ patient_recovery    │
      ├─ treatment_bookings  │                                       │                      │
      ├─ clinics             │                                       │                      │
      └─ clinic_stories      │                                       │                      │
```

### Domain 1: Core Platform & Content
1. **`stats`**: Live counter metrics for total patients treated, certified doctors, partnered sanctuaries, and authenticated panchakarma therapies.
2. **`testimonials`**: Verified patient quotes, ratings, and recovery summaries.
3. **`disease_categories`**: Hierarchical classifications (Digestive, Musculoskeletal, Metabolic, Skin, Respiratory, etc.).
4. **`diseases`**: Detailed disease profiles including classical Ayurvedic names, affected Doshas (Vata, Pitta, Kapha), symptoms, severity, and treatments.
5. **`treatment_categories`**: Therapy domains (Panchakarma, Rasayana, Kaya Chikitsa, Shirodhara).
6. **`treatments`**: Comprehensive therapy catalog including duration, benefits, contraindications, procedure steps, and pricing.
7. **`treatment_bookings`**: Patient reservations for specific treatments, scheduled sessions, and clinic assignments.
8. **`clinics`**: Partnered Ayurvedic clinics, panchakarma resorts, geo-coordinates (`latitude`, `longitude`), and verified facility packages.
9. **`clinic_stories`**: Patient chronicles detailing chronic condition recoveries at partnered clinical sanctuaries.

### Domain 2: Doctor Portal
10. **`doctors`**: Physician profiles, AYUSH credentials, Google OAuth integration, consultation fees, specializations, qualifications, and live ratings.
11. **`doctor_consultations`**: Patient consultation logs, diagnoses, prescribed medicines, and follow-up dates.
12. **`doctor_appointments`**: Real-time appointments with statuses (`Scheduled`, `Confirmed`, `Completed`, `Cancelled`), patient details, and timings.
13. **`doctor_reviews`**: Verified patient reviews and 5-star ratings linked to specific physicians.
14. **`doctor_messages`**: Live message threads between doctors and patients, supporting direct response persistence from the Physician Portal.

### Domain 3: Patient Portal
15. **`patients`**: Authenticated patient profiles, demographic data, primary Prakriti/Dosha, and registered phone/email.
16. **`patient_wellness`**: Daily/weekly wellness tracking (Diet Adherence %, Exercise Progress %, Sleep Quality %, Water Intake %).
17. **`patient_health_goals`**: Active patient milestones (e.g., "Digestive Fire Optimization", "Spine Flexibility Improvement").
18. **`patient_medical_records`**: Digital medical locker storing lab tests, prescriptions, doctor diagnostic reports, and file metadata.
19. **`patient_diet_plans`**: Personalized Ahara (dietary) regimens tailored to the patient's current Vikriti/Dosha balance.
20. **`patient_recovery_tracker`**: Clinical recovery progression tracking over time with weekly and monthly milestone metrics.

### Domain 4: AI & Communication
21. **`notifications`**: Targeted alerts for new bookings, schedule modifications, test results, and payment confirmations.
22. **`ai_chat_messages`**: Persistent Ayurvedic AI assistant conversation logs.
23. **`symptom_checker_data`**: Dynamic Ayurvedic symptom questionnaire engine, containing all multi-step assessment questions, remedies, Dosha balance matrix, and FAQs.

---

## 3. What Was Refactored & Replaced

| Area | Before | Now (100% Real SQL) |
| :--- | :--- | :--- |
| **Doctor Model** | Static `doctorModel.js` with mock arrays | **Deleted file**. All doctor queries execute SQL against the `doctors` table. |
| **Doctor Dashboard** | Static JS variables for analytics & messages | Live API `GET /api/doctor/dashboard/:id` and `GET/POST /api/doctor/messages`. |
| **Patient Dashboard** | Mock JSON returns & auth roadblocks | Real queries on `patients`, `patient_wellness`, and `patient_health_goals`. |
| **Medical Records** | Static JSON file in controllers | Parameterized SQL queries on `patient_medical_records` table with uploads & deletes. |
| **Recovery Tracker** | Static data in `recoveryController.js` | Direct SQL querying from `patient_recovery_tracker` table. |
| **Clinic Chronicles** | Hardcoded stories in React components | Live endpoint `GET /api/clinics/stories` querying MySQL `clinic_stories`. |
| **Symptom Checker** | Hardcoded TypeScript data constants | Dynamic API `GET /api/symptoms/data` querying MySQL `symptom_checker_data`. |

---

## 4. Verified API Endpoints

All endpoints have been tested and verified operational (**HTTP 200 OK**):

| Endpoint | Method | Source Table(s) | Description |
| :--- | :---: | :--- | :--- |
| `/api/stats` | GET | `stats` | Platform counters and aggregate metrics |
| `/api/doctors` | GET | `doctors` | Directory of verified doctors with filters |
| `/api/clinics` | GET | `clinics` | Directory of verified clinics and resorts |
| `/api/clinics/stories` | GET | `clinic_stories` | Patient recovery chronicles from sanctuaries |
| `/api/treatments` | GET | `treatments` | Ayurvedic therapies and package offerings |
| `/api/diseases` | GET | `diseases` | Disease encyclopedia and treatments |
| `/api/symptoms/data` | GET | `symptom_checker_data` | Dynamic questionnaire and Dosha matrix |
| `/api/patient/dashboard` | GET | `patients`, `patient_wellness`, etc. | Patient portal vitals and active goals |
| `/api/patient/records` | GET | `patient_medical_records` | Patient digital medical document repository |
| `/api/patient/recovery` | GET | `patient_recovery_tracker` | Treatment progress and recovery timeline |
| `/api/doctor/dashboard/:id` | GET | `doctors`, `doctor_appointments`, etc. | Physician portal metrics, schedule, reviews |
| `/api/doctor/messages/:id` | GET/POST | `doctor_messages` | Doctor-patient consultation messaging |

---

## 5. File Artifacts Created & Updated

- **`db_migration.sql`**: Master database DDL + complete baseline seed file at repository root (~256 KB).
- **`BACKEND/migrations/schema_migration.sql`**: Backend copy for automated CLI runner.
- **`BACKEND/scripts/generate_complete_migration.js`**: Reusable database introspection utility that can regenerate the complete SQL migration file at any time.
- **`BACKEND/migrations/migrate.js`**: Production migration runner invoked via `npm run migrate`.
- **`FRONTEND/src/pages/DoctorDashboardPage.tsx`**: Updated to fetch and persist live messages.
- **`FRONTEND/src/components/clinics/SuccessStoryCard.tsx`**: Updated to query live clinic recovery stories.
- **`FRONTEND/src/pages/SymptomChecker.tsx`**: Updated to dynamically render assessment steps and remedies.
