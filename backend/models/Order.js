const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users', // 'users' refers to table name
      key: 'id'
    }
  },
  orderItems: {
    type: DataTypes.JSONB, // Store as JSONB for PostgreSQL
    allowNull: false
  },
  shippingAddress: {
    type: DataTypes.JSONB, // Store as JSONB for PostgreSQL
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentResult: {
    type: DataTypes.JSONB // Store as JSONB for PostgreSQL
  },
  taxPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  shippingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  paidAt: {
    type: DataTypes.DATE
  },
  isDelivered: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  deliveredAt: {
    type: DataTypes.DATE
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'orders',
  timestamps: false // Since we're defining createdAt manually
});

module.exports = Order;