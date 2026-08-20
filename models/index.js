'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const db = {};

// Load Models
db.User = require('./User')(sequelize, DataTypes);
db.Partner = require('./Partner')(sequelize, DataTypes);
db.Employee = require('./Employee')(sequelize, DataTypes);
db.Assignment = require('./Assignment')(sequelize, DataTypes);
db.SalarySetting = require('./SalarySetting')(sequelize, DataTypes);
db.CommissionTransaction = require('./CommissionTransaction')(sequelize, DataTypes);
db.ActivityLog = require('./ActivityLog')(sequelize, DataTypes);

// --- Associations ---

// Employee belongs to User (createdBy)
db.Employee.belongsTo(db.User, { foreignKey: 'createdBy', as: 'creator' });
db.User.hasMany(db.Employee, { foreignKey: 'createdBy', as: 'employeesCreated' });

// Assignment associations
db.Assignment.belongsTo(db.Employee, { foreignKey: 'employeeId' });
db.Employee.hasMany(db.Assignment, { foreignKey: 'employeeId', as: 'assignments', onDelete: 'CASCADE' });

db.Assignment.belongsTo(db.Partner, { foreignKey: 'partnerId' });
db.Partner.hasMany(db.Assignment, { foreignKey: 'partnerId', as: 'assignments', onDelete: 'CASCADE' });

// SalarySetting associations
db.SalarySetting.belongsTo(db.Assignment, { foreignKey: 'assignmentId', as: 'assignment' });
db.Assignment.hasMany(db.SalarySetting, { foreignKey: 'assignmentId', as: 'salarySettings', onDelete: 'CASCADE' });

// CommissionTransaction associations
db.CommissionTransaction.belongsTo(db.SalarySetting, { foreignKey: 'salarySettingId', as: 'salarySetting' });
db.CommissionTransaction.belongsTo(db.Employee, { foreignKey: 'employeeId', as: 'employee' });
db.CommissionTransaction.belongsTo(db.Partner, { foreignKey: 'partnerId', as: 'partner' });

db.Employee.hasMany(db.CommissionTransaction, { foreignKey: 'employeeId', as: 'commissions', onDelete: 'CASCADE' });
db.Partner.hasMany(db.CommissionTransaction, { foreignKey: 'partnerId', as: 'commissions', onDelete: 'CASCADE' });

// ActivityLog associations
db.ActivityLog.belongsTo(db.User, { foreignKey: 'userId' });
db.User.hasMany(db.ActivityLog, { foreignKey: 'userId', as: 'activityLogs', onDelete: 'CASCADE' });

// Export database
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
