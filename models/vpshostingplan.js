'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VpsHostingPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  VpsHostingPlan.init({
    hosting_type: DataTypes.STRING,
    product_name: DataTypes.STRING,
    my_custom_product_name: DataTypes.STRING,
    final_cost: DataTypes.STRING,
    cores: DataTypes.STRING,
    ram: DataTypes.STRING,
    diskspace: DataTypes.STRING,
    bandwidth: DataTypes.STRING,
    dedicated_ip: DataTypes.STRING,
    mbit: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'VpsHostingPlan',
  });
  return VpsHostingPlan;
};