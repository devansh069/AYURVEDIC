// BACKEND/models/patientModel.js

const MOCK_PATIENT_PROFILE = {
  id: "pat-123",
  name: "Priyanshi Sharma",
  email: "priyanshi@ayurvedaconnect.com",
  phone: "+91 98765 43210",
  age: 28,
  gender: "Female",
  profilePhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80",
  city: "New Delhi",
  doshaType: "Pitta-Kapha",
  healthGoals: ["PCOS Management", "Stress Reduction", "Improved Digestion"],
  joinedDate: "2026-01-15"
};

const MOCK_PATIENT_APPOINTMENTS = [
  {
    id: "APT-78901",
    doctorName: "Dr. Vikram Chauhan",
    specialization: "Kayachikitsa (Internal Medicine)",
    clinic: "AyuCare SuperSpecialty Clinic, New Delhi",
    date: "2026-06-15",
    time: "10:30 AM",
    status: "Confirmed"
  },
  {
    id: "APT-45612",
    doctorName: "Dr. Smita Naram",
    specialization: "Panchakarma Specialist",
    clinic: "Ayushya Ayurvedic Wellness Center, Mumbai",
    date: "2026-07-02",
    time: "02:00 PM",
    status: "Pending"
  },
  {
    id: "APT-11223",
    doctorName: "Dr. Vikram Chauhan",
    specialization: "Kayachikitsa (Internal Medicine)",
    clinic: "AyuCare SuperSpecialty Clinic, New Delhi",
    date: "2026-05-15",
    time: "11:00 AM",
    status: "Completed"
  }
];

module.exports = {
  MOCK_PATIENT_PROFILE,
  MOCK_PATIENT_APPOINTMENTS
};
