import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const ResumeProfile = sequelize.define('ResumeProfile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  originalFileName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  parsedText: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  skills: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  atsScore: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  missingSkills: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

// Association
User.hasOne(ResumeProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
ResumeProfile.belongsTo(User, { foreignKey: 'userId' });

export default ResumeProfile;
