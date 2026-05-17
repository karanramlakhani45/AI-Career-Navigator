import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Roadmap = sequelize.define('Roadmap', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  targetRole: {
    type: DataTypes.STRING,
    allowNull: false
  },
  weeks: {
    type: DataTypes.JSON,
    allowNull: false
  }
}, {
  timestamps: true
});

// Association
User.hasOne(Roadmap, { foreignKey: 'userId', onDelete: 'CASCADE' });
Roadmap.belongsTo(User, { foreignKey: 'userId' });

export default Roadmap;
