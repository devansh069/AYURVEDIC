const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const DiseaseCategory = sequelize.define('DiseaseCategory', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'disease_categories',
  timestamps: false
});

module.exports = DiseaseCategory;
