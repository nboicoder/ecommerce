const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 50]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, undefined]
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  resetPasswordToken: {
    type: DataTypes.STRING
  },
  resetPasswordExpire: {
    type: DataTypes.DATE
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: false // Since we're defining createdAt manually
});

module.exports = User;