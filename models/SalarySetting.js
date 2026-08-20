module.exports = (sequelize, DataTypes) => {
  return sequelize.define('SalarySetting', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    assignmentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'assignments',
        key: 'id'
      }
    },
    grossSalary: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      comment: 'Salaire brut'
    },
    commissionRate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      comment: '% prélevé sur le brut'
    },
    commissionAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      comment: 'Calculé: gross_salary * commission_rate'
    },
    netSalary: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      comment: 'Calculé: gross_salary - commission_amount'
    },
    effectiveMonth: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Mois d\'application, ex: 2026-08-01'
    }
  }, {
    tableName: 'salary_settings',
    timestamps: true,
    underscored: true
  });
};
