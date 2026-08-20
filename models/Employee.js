module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Employee', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Province d'origine"
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    availability: {
      type: DataTypes.ENUM('disponible', 'indisponible'),
      defaultValue: 'disponible'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'employees',
    timestamps: true,
    underscored: true
  });
};
