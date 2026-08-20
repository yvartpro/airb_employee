module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ActivityLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    action: {
      type: DataTypes.ENUM('creation', 'modification', 'suppression'),
      allowNull: false,
      comment: 'creation, modification, suppression'
    },
    entityType: {
      type: DataTypes.ENUM('employee', 'partner', 'assignment', 'salary_setting', 'commission_transaction'),
      allowNull: false,
      comment: 'employee, partner, assignment, etc.'
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    tableName: 'activity_logs',
    timestamps: true,
    underscored: true
  });
};
