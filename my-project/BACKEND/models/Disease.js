const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Disease = sequelize.define('Disease', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  diseaseName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  scientificName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  alternativeNames: {
    type: DataTypes.JSON,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subCategory: {
    type: DataTypes.STRING,
    allowNull: true
  },
  overview: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  causes: {
    type: DataTypes.JSON,
    allowNull: true
  },
  symptoms: {
    type: DataTypes.JSON,
    allowNull: true
  },
  earlySymptoms: {
    type: DataTypes.JSON,
    allowNull: true
  },
  advancedSymptoms: {
    type: DataTypes.JSON,
    allowNull: true
  },
  riskFactors: {
    type: DataTypes.JSON,
    allowNull: true
  },
  complications: {
    type: DataTypes.JSON,
    allowNull: true
  },
  prevention: {
    type: DataTypes.JSON,
    allowNull: true
  },
  homeRemedies: {
    type: DataTypes.JSON,
    allowNull: true
  },
  ayurvedicTreatment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  modernTreatment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  recommendedHerbs: {
    type: DataTypes.JSON,
    allowNull: true
  },
  recommendedMedicines: {
    type: DataTypes.JSON,
    allowNull: true
  },
  recommendedFoods: {
    type: DataTypes.JSON,
    allowNull: true
  },
  foodsToAvoid: {
    type: DataTypes.JSON,
    allowNull: true
  },
  recommendedYoga: {
    type: DataTypes.JSON,
    allowNull: true
  },
  recommendedExercises: {
    type: DataTypes.JSON,
    allowNull: true
  },
  dailyRoutine: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sleepRecommendation: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  stressManagement: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  doshaAffected: {
    type: DataTypes.JSON,
    allowNull: true
  },
  bodyPartsAffected: {
    type: DataTypes.JSON,
    allowNull: true
  },
  ageGroup: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pregnancySafe: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  contagious: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  severity: {
    type: DataTypes.STRING,
    allowNull: true
  },
  recoveryTime: {
    type: DataTypes.STRING,
    allowNull: true
  },
  consultDoctorWhen: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  emergencyWarning: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  successRate: {
    type: DataTypes.INTEGER,
    defaultValue: 85
  },
  FAQs: {
    type: DataTypes.JSON,
    allowNull: true
  },
  references: {
    type: DataTypes.JSON,
    allowNull: true
  },
  doctorSpecialization: {
    type: DataTypes.STRING,
    allowNull: true
  },
  relatedDiseases: {
    type: DataTypes.JSON,
    allowNull: true
  },
  featuredImage: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  galleryImages: {
    type: DataTypes.JSON,
    allowNull: true
  },
  videoLinks: {
    type: DataTypes.JSON,
    allowNull: true
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 4.8
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 120
  },
  bookmarks: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  }
}, {
  tableName: 'diseases',
  timestamps: true
});

module.exports = Disease;
