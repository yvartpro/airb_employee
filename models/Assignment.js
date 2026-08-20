module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Assignment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    contractType: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'prestation_mensuelle, cdd, etc.'
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    durationMonths: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    renewable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('actif', 'termine', 'a_renouveler'),
      defaultValue: 'actif',
      comment: 'actif, termine, a_renouveler'
    }
  }, {
    tableName: 'assignments',
    timestamps: true,
    underscored: true
  });
};
