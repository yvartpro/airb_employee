module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Partner', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Association / Coopérative'
    },
    contactPhone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('actif', 'a_revoir', 'expire'),
      defaultValue: 'actif',
      comment: 'actif, a_revoir, expire'
    },
    defaultCommissionRate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      comment: '% appliqué par défaut aux employés affectés'
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'partners',
    timestamps: true,
    underscored: true
  });
};
