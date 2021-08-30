'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('VpsCloudHostingPlans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hosting_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      product_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      my_custom_product_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      final_cost: {
        type: Sequelize.STRING,
        allowNull: true
      },
      cores: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ram: {
        type: Sequelize.STRING,
        allowNull: true
      },
      diskspace: {
        type: Sequelize.STRING,
        allowNull: true
      },
      bandwidth: {
        type: Sequelize.STRING,
        allowNull: true
      },
      dedicated_ip: {
        type: Sequelize.STRING,
        allowNull: true
      },
      mbit: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('VpsCloudHostingPlans');
  }
};