module.exports = (sequelize, DataTypes) => {
  return sequelize.define('CommissionTransaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    salarySetting_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'salary_settings',
        key: 'id'
      }
    },
    employeeId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'employees',
        key: 'id'
      }
    },
    partnerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'partners',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    period: {
      type: DataTypes.ENUM('jour', 'mois', 'trimestre', 'annee'),
      allowNull: true,
      comment: 'jour, mois, trimestre, annee'
    },
    transactionDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'commission_transactions',
    timestamps: true,
    underscored: true
  });
};
