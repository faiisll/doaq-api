'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Doa.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
      });

      Doa.hasMany(models.Detail, {
        as: 'detail',
        foreignKey: 'doa_id'
      });
    }
  };
  Doa.init({
    category_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    prev: DataTypes.INTEGER,
    next: DataTypes.INTEGER,
    source: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Doa',
    // tableName: 'Doas',
    // freezeTableName: true
  });
  return Doa;
};