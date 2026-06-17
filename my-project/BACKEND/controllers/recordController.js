// BACKEND/controllers/recordController.js
const { 
  MOCK_DOCUMENTS, 
  MOCK_PRESCRIPTIONS, 
  MOCK_LAB_REPORTS, 
  MOCK_TREATMENT_HISTORY, 
  MOCK_ACTIVITIES, 
  MOCK_INSIGHTS 
} = require('../models/recordModel');

exports.getRecords = (req, res, next) => {
  try {
    res.json(MOCK_DOCUMENTS);
  } catch (err) {
    next(err);
  }
};

exports.getRecordById = (req, res, next) => {
  try {
    const doc = MOCK_DOCUMENTS.find(d => d.id === req.params.id);
    if (doc) {
      res.json(doc);
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getPrescriptions = (req, res, next) => {
  try {
    res.json(MOCK_PRESCRIPTIONS);
  } catch (err) {
    next(err);
  }
};

exports.getReports = (req, res, next) => {
  try {
    res.json(MOCK_LAB_REPORTS);
  } catch (err) {
    next(err);
  }
};

exports.getLabTests = (req, res, next) => {
  try {
    res.json(MOCK_LAB_REPORTS);
  } catch (err) {
    next(err);
  }
};

exports.getTreatmentHistory = (req, res, next) => {
  try {
    res.json(MOCK_TREATMENT_HISTORY);
  } catch (err) {
    next(err);
  }
};

exports.getActivities = (req, res, next) => {
  try {
    res.json(MOCK_ACTIVITIES);
  } catch (err) {
    next(err);
  }
};

exports.getInsights = (req, res, next) => {
  try {
    res.json(MOCK_INSIGHTS);
  } catch (err) {
    next(err);
  }
};

exports.uploadRecord = (req, res, next) => {
  try {
    const { title, category, doctorName, clinicName, date, description, fileType, fileSize } = req.body;
    const newRecord = {
      id: `rec-${Date.now()}`,
      title: title || "New Ayurvedic Document",
      category: category || "Report",
      type: category === "Prescription" ? "Prescription" : category === "Report" ? "Report" : "Document",
      date: date || new Date().toISOString().split('T')[0],
      doctorName: doctorName || "Consulting Vaidya",
      clinicName: clinicName || "AyurVeda Clinic Center",
      fileType: fileType || "PDF",
      fileSize: fileSize || "1.5 MB",
      description: description || "No description provided.",
      status: "Completed",
      fileUrl: "#"
    };
    MOCK_DOCUMENTS.unshift(newRecord);
    
    // Log activity
    const newActivity = {
      id: `act-${Date.now()}`,
      title: "Document Uploaded",
      type: "Upload",
      timestamp: "Just Now",
      details: `Uploaded ${newRecord.title} (${newRecord.fileType}).`
    };
    MOCK_ACTIVITIES.unshift(newActivity);

    res.status(201).json({ success: true, data: newRecord });
  } catch (err) {
    next(err);
  }
};

exports.deleteRecord = (req, res, next) => {
  try {
    const { id } = req.params;
    const idx = MOCK_DOCUMENTS.findIndex(d => d.id === id);
    if (idx !== -1) {
      const deleted = MOCK_DOCUMENTS.splice(idx, 1)[0];
      
      // Log activity
      const newActivity = {
        id: `act-${Date.now()}`,
        title: "Document Deleted",
        type: "Download",
        timestamp: "Just Now",
        details: `Deleted document: ${deleted.title}.`
      };
      MOCK_ACTIVITIES.unshift(newActivity);

      res.json({ success: true, data: deleted });
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  } catch (err) {
    next(err);
  }
};
