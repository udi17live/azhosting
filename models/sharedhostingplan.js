'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SharedHostingPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  SharedHostingPlan.init({
    hosting_type: DataTypes.STRING,
    product_name: DataTypes.STRING,
    my_custom_product_name: DataTypes.STRING,
    final_cost: DataTypes.STRING,
    monthly_cost: DataTypes.DECIMAL(10.2),
    diskspace: DataTypes.STRING,
    bandwidth: DataTypes.STRING,
    dedicated_ip: DataTypes.STRING,
    backups: DataTypes.STRING,
    hosted_domains: DataTypes.STRING,
    sub_domains: DataTypes.STRING,
    email_accounts: DataTypes.STRING,
    email_per_hour: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SharedHostingPlan',
  });
  return SharedHostingPlan;
};