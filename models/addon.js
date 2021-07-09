'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Addon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Addon.init({
    addon_type: DataTypes.STRING,
    addon_code: DataTypes.STRING,
    cost: DataTypes.STRING,
    features: DataTypes.STRING,
    term: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Addon',
  });
  return Addon;
};