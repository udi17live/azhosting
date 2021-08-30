'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'SharedHostingPlans',
      'monthly_cost',
      Sequelize.DECIMAL(10, 2) 
    );
  }
};
