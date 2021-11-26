'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Detail.belongsTo(models.Doa, {
        as: 'doa',
        foreignKey: "doa_id"
      })

    }
  };
  Detail.init({
    doa_id: DataTypes.INTEGER,
    desc: DataTypes.STRING,
    arabic: DataTypes.STRING,
    latin: DataTypes.STRING,
    translate: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Detail',
  });
  return Detail;
};